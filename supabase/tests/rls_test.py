"""Exercise the Phase 2 migration's grants + RLS as anon / students / admin.

Needs a throwaway local Postgres (14+) superuser; creates and drops the database `nbbd_test`.
    PGHOST=/path/to/socket PGPORT=5432 python3 supabase/tests/rls_test.py
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
HOST, PORT = os.environ.get("PGHOST", "localhost"), os.environ.get("PGPORT", "5432")
DB = "nbbd_test"
MIGRATION = os.path.join(HERE, "..", "migrations", "20261013000000_phase2_dashboard.sql")
STUB = os.path.join(HERE, "supabase_stub.sql")

ADMIN = "aaaaaaaa-0000-0000-0000-000000000001"
STUDENT = "aaaaaaaa-0000-0000-0000-000000000002"  # verified enrollment
PENDING = "aaaaaaaa-0000-0000-0000-000000000003"  # pending enrollment
UNCONF = "aaaaaaaa-0000-0000-0000-000000000004"  # verified enrollment but email not confirmed


def psql(sql, db=DB):
    r = subprocess.run(
        ["psql", "-h", HOST, "-p", PORT, "-U", "postgres", "-d", db, "-X", "-q", "-At", "-v", "ON_ERROR_STOP=1", "-c", sql],
        capture_output=True,
        text=True,
    )
    return r.returncode, (r.stdout.strip() if r.returncode == 0 else r.stderr.strip())


def as_role(role, uid, sql, email=None):
    claims = json.dumps({"sub": uid, "role": role, "email": email}) if uid else ""
    wrapped = f"begin; set local role {role}; select set_config('request.jwt.claims', '{claims}', true); {sql}; commit;"
    code, out = psql(wrapped)
    # drop the set_config echo line
    lines = [l for l in out.splitlines() if l != claims and l != ""] if code == 0 else [out]
    return code, "\n".join(lines)


subprocess.run(["psql", "-h", HOST, "-p", PORT, "-U", "postgres", "-X", "-q", "-c", f"drop database if exists {DB}"], check=True)
subprocess.run(["psql", "-h", HOST, "-p", PORT, "-U", "postgres", "-X", "-q", "-c", f"create database {DB}"], check=True)
for f in (STUB, MIGRATION):
    r = subprocess.run(["psql", "-h", HOST, "-p", PORT, "-U", "postgres", "-d", DB, "-X", "-q", "-v", "ON_ERROR_STOP=1", "-f", f], capture_output=True, text=True)
    if r.returncode:
        print(f"FAILED applying {f}:\n{r.stderr}")
        sys.exit(1)
    print(f"applied {f.split('/')[-1]}")

# fixtures (as superuser)
psql(f"""
insert into auth.users values
 ('{ADMIN}', 'admin@example.com', now()),
 ('{STUDENT}', 'Student@Example.com', now()),
 ('{PENDING}', 'p@example.com', now()),
 ('{UNCONF}', 'u@example.com', null);
insert into public.admins values ('{ADMIN}');
insert into public.enrollments (full_name, phone, email, payment_method, sender_number, trx_id, amount, status) values
 ('Student', '01712345678', 'student@example.com', 'bkash', '01712345678', 'TRXSTUDENT1', 1499, 'verified'),
 ('Pending', '01812345678', 'p@example.com', 'nagad', '01812345678', 'TRXPENDING1', 1499, 'pending'),
 ('Unconf', '01912345678', 'u@example.com', 'rocket', '019123456781', 'TRXUNCONF1', 1499, 'verified');
insert into public.classes (title, published, meet_url) values ('Class 1', true, 'https://meet.google.com/abc'), ('Draft', false, null);
update public.course_settings set whatsapp_group_link = 'https://chat.whatsapp.com/test';
""")

VALID = "('Anon User', '01612345678', 'anon@example.com', 'bkash', '01612345678', 'ANONTRX01', 1499)"
COLS = "(full_name, phone, email, payment_method, sender_number, trx_id, amount)"

cases = [
    # (name, role, uid, sql, expectation) ; expectation: "ok" | "err:<substr>" | "=<output>"
    ("anon can submit an enrollment", "anon", None, f"insert into public.enrollments {COLS} values {VALID}", "ok"),
    ("anon cannot set status", "anon", None,
     "insert into public.enrollments (full_name, phone, email, payment_method, sender_number, trx_id, amount, status) "
     "values ('X Y', '01612345679', 'x@example.com', 'bkash', '01612345679', 'ANONTRX02', 1499, 'verified')", "err:permission denied"),
    ("anon cannot read enrollments", "anon", None, "select count(*) from public.enrollments", "err:permission denied"),
    ("anon cannot read classes", "anon", None, "select count(*) from public.classes", "err:permission denied"),
    ("anon cannot read settings", "anon", None, "select count(*) from public.course_settings", "err:permission denied"),
    ("anon cannot call is_admin", "anon", None, "select public.is_admin()", "err:permission denied"),
    ("duplicate TrxID per method rejected", "anon", None, f"insert into public.enrollments {COLS} values {VALID}", "err:duplicate key"),
    ("same TrxID on another method allowed", "anon", None,
     f"insert into public.enrollments {COLS} values ('Anon User', '01612345678', 'anon@example.com', 'nagad', '01612345678', 'ANONTRX01', 1499)", "ok"),
    ("bad phone rejected by check", "anon", None,
     f"insert into public.enrollments {COLS} values ('A B', '12345', 'a@example.com', 'bkash', '01612345678', 'ANONTRX03', 1499)", "err:check constraint"),
    ("lowercase TrxID rejected by check", "anon", None,
     f"insert into public.enrollments {COLS} values ('A B', '01612345678', 'a@example.com', 'bkash', '01612345678', 'abc123', 1499)", "err:check constraint"),
    ("rocket 12-digit sender allowed", "anon", None,
     f"insert into public.enrollments {COLS} values ('A B', '01612345678', 'a@example.com', 'rocket', '016123456781', 'ROCKET0001', 1499)", "ok"),

    ("student sees only own enrollment (email case-insensitive)", "authenticated", STUDENT, "select string_agg(trx_id, ',') from public.enrollments", "=TRXSTUDENT1"),
    ("student has access", "authenticated", STUDENT, "select public.has_access()", "=t"),
    ("student sees only published classes", "authenticated", STUDENT, "select string_agg(title, ',') from public.classes", "=Class 1"),
    ("student reads settings", "authenticated", STUDENT, "select whatsapp_group_link from public.course_settings", "=https://chat.whatsapp.com/test"),
    ("student is not admin", "authenticated", STUDENT, "select public.is_admin()", "=f"),
    ("student cannot verify (0 rows)", "authenticated", STUDENT,
     "with u as (update public.enrollments set status = 'verified' where trx_id = 'TRXPENDING1' returning 1) select count(*) from u", "=0"),
    ("student cannot write reviewed_by", "authenticated", STUDENT, f"update public.enrollments set reviewed_by = '{STUDENT}'", "err:permission denied"),
    ("student cannot add classes", "authenticated", STUDENT, "insert into public.classes (title) values ('hack')", "err:row-level security"),
    ("student cannot edit settings (0 rows)", "authenticated", STUDENT,
     "with u as (update public.course_settings set meet_link = 'https://evil.example' returning 1) select count(*) from u", "=0"),
    ("nobody reads admins table", "authenticated", ADMIN, "select count(*) from public.admins", "err:permission denied"),

    ("pending student has no access", "authenticated", PENDING, "select public.has_access()", "=f"),
    ("pending student sees own pending row", "authenticated", PENDING, "select status from public.enrollments", "=pending"),
    ("pending student sees no classes", "authenticated", PENDING, "select count(*) from public.classes", "=0"),
    ("pending student sees no settings", "authenticated", PENDING, "select count(*) from public.course_settings", "=0"),
    ("pending student cannot self-verify", "authenticated", PENDING,
     "with u as (update public.enrollments set status = 'verified' returning 1) select count(*) from u", "=0"),

    ("unconfirmed email gets no access", "authenticated", UNCONF, "select public.has_access()", "=f"),
    ("unconfirmed email sees no enrollments", "authenticated", UNCONF, "select count(*) from public.enrollments", "=0"),

    ("admin is admin", "authenticated", ADMIN, "select public.is_admin()", "=t"),
    ("admin sees all enrollments", "authenticated", ADMIN, "select count(*) from public.enrollments", "=6"),
    ("admin sees draft classes", "authenticated", ADMIN, "select count(*) from public.classes", "=2"),
    ("admin verifies; trigger stamps reviewer", "authenticated", ADMIN,
     "with u as (update public.enrollments set status = 'verified', admin_note = 'ok' where trx_id = 'TRXPENDING1' "
     "returning reviewed_by, reviewed_at is not null as stamped) select reviewed_by || ',' || stamped from u", f"={ADMIN},true"),
    ("admin cannot change applicant fields", "authenticated", ADMIN, "update public.enrollments set amount = 1", "err:permission denied"),
    ("admin adds + deletes a class", "authenticated", ADMIN,
     "insert into public.classes (title) values ('New'); with d as (delete from public.classes where title = 'New' returning 1) select count(*) from d", "=1"),
    ("admin edits settings", "authenticated", ADMIN,
     "with u as (update public.course_settings set meet_link = 'https://meet.google.com/xyz' returning 1) select count(*) from u", "=1"),
    ("admin cannot insert a second settings row", "authenticated", ADMIN, "insert into public.course_settings (id) values (true)", "err:permission denied"),

    ("verified-now student gains access", "authenticated", PENDING, "select public.has_access()", "=t"),
    ("verified-now student sees classes", "authenticated", PENDING, "select count(*) from public.classes", "=1"),
]

passed = 0
for name, role, uid, sql, exp in cases:
    code, out = as_role(role, uid, sql)
    if exp == "ok":
        good = code == 0
    elif exp.startswith("err:"):
        good = code != 0 and exp[4:] in out
    else:
        good = code == 0 and out.splitlines()[-1:] == [exp[1:]]
    passed += good
    print(f"{'PASS' if good else 'FAIL'}  {name}" + ("" if good else f"\n      expected {exp!r}, got ({code}) {out!r}"))
print(f"\n{passed}/{len(cases)} passed")
sys.exit(0 if passed == len(cases) else 1)
