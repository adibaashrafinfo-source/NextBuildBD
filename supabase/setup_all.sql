-- NextBuildBD: full database setup in one paste (Supabase → SQL Editor → New query → paste → Run).
-- Generated from supabase/migrations/*.sql in order; run it once on a fresh project.
-- Regenerate after changing a migration: npm run db:bundle

-- ===== 20261013000000_phase2_dashboard.sql =====
-- NextBuildBD Phase 2: enrollments, admin verification, student dashboard content.
--
-- Access model
--   * Anyone (anon) can submit an enrollment from the landing page. They cannot read it back.
--   * A signed-in student can read the enrollments made with their own *confirmed* email.
--   * A student "has access" once an admin marks one of those enrollments `verified`.
--   * Classes and course settings (Meet link, WhatsApp group link) are readable only by
--     students with access and by admins.
--   * Admins are listed in public.admins (added by hand, see README) and can review
--     enrollments and manage classes/settings.

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type public.payment_method as enum ('bkash', 'nagad', 'rocket');
create type public.enrollment_status as enum ('pending', 'verified', 'rejected');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  phone text not null check (phone ~ '^01[3-9][0-9]{8}$'),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  payment_method public.payment_method not null,
  -- Rocket wallets are the 11-digit mobile number plus one check digit.
  sender_number text not null check (sender_number ~ '^01[3-9][0-9]{8}[0-9]?$'),
  trx_id text not null check (trx_id ~ '^[A-Z0-9]{6,20}$'),
  amount integer not null check (amount > 0 and amount <= 100000),
  status public.enrollment_status not null default 'pending',
  admin_note text check (char_length(admin_note) <= 500),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null
);

-- A transaction ID can only be claimed once per payment provider.
create unique index enrollments_method_trx_key on public.enrollments (payment_method, trx_id);
create index enrollments_email_idx on public.enrollments (lower(email));
create index enrollments_status_idx on public.enrollments (status, submitted_at desc);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  description text check (char_length(description) <= 2000),
  starts_at timestamptz,
  duration_minutes integer not null default 90 check (duration_minutes between 5 and 600),
  meet_url text check (meet_url ~ '^https://'),
  recording_url text check (recording_url ~ '^https://'),
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index classes_order_idx on public.classes (position, starts_at);

-- Single-row table (id is always true).
create table public.course_settings (
  id boolean primary key default true check (id),
  whatsapp_group_link text check (whatsapp_group_link ~ '^https://'),
  meet_link text check (meet_link ~ '^https://'),
  updated_at timestamptz not null default now()
);
insert into public.course_settings default values;

-- ---------------------------------------------------------------------------
-- Helper functions (security definer so policies can consult admins / auth.users
-- without granting clients direct access to them)
-- ---------------------------------------------------------------------------
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;

-- The signed-in user's email, but only once it is confirmed. Prevents someone from
-- signing up with another person's address to claim their verified enrollment.
create function public.current_confirmed_email()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select lower(u.email)
  from auth.users u
  where u.id = (select auth.uid()) and u.email_confirmed_at is not null;
$$;

create function public.has_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enrollments e
    where e.status = 'verified'
      and lower(e.email) = public.current_confirmed_email()
  );
$$;

revoke execute on function public.is_admin(), public.current_confirmed_email(), public.has_access() from public, anon;
grant execute on function public.is_admin(), public.current_confirmed_email(), public.has_access() to authenticated;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
-- Stamp who reviewed an enrollment and when; clients cannot set these columns.
create function public.enrollments_stamp_review()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    new.reviewed_at := case when new.status = 'pending' then null else now() end;
    new.reviewed_by := case when new.status = 'pending' then null else (select auth.uid()) end;
  end if;
  return new;
end;
$$;
create trigger enrollments_stamp_review
before update on public.enrollments
for each row execute function public.enrollments_stamp_review();

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger classes_touch before update on public.classes
for each row execute function public.touch_updated_at();
create trigger course_settings_touch before update on public.course_settings
for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Privileges. Supabase grants ALL on new public tables to anon/authenticated by
-- default, so start from nothing and add back exactly what each role needs.
-- ---------------------------------------------------------------------------
revoke all on public.admins, public.enrollments, public.classes, public.course_settings from anon, authenticated;

-- Landing-page form: insert only, and only the applicant's own fields.
grant insert (full_name, phone, email, payment_method, sender_number, trx_id, amount)
  on public.enrollments to anon, authenticated;
grant select on public.enrollments to authenticated;
grant update (status, admin_note) on public.enrollments to authenticated;

grant select, insert, update, delete on public.classes to authenticated;
grant select on public.course_settings to authenticated;
grant update (whatsapp_group_link, meet_link) on public.course_settings to authenticated;
-- public.admins: no client access at all (managed with SQL).

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.enrollments enable row level security;
alter table public.classes enable row level security;
alter table public.course_settings enable row level security;

create policy "Anyone can submit a pending enrollment"
  on public.enrollments for insert
  to anon, authenticated
  with check (status = 'pending' and reviewed_at is null and reviewed_by is null);

create policy "Students read their own enrollments; admins read all"
  on public.enrollments for select
  to authenticated
  using (lower(email) = (select public.current_confirmed_email()) or (select public.is_admin()));

create policy "Admins review enrollments"
  on public.enrollments for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Students with access read published classes; admins read all"
  on public.classes for select
  to authenticated
  using ((published and (select public.has_access())) or (select public.is_admin()));

create policy "Admins add classes"
  on public.classes for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit classes"
  on public.classes for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins delete classes"
  on public.classes for delete to authenticated using ((select public.is_admin()));

create policy "Students with access and admins read settings"
  on public.course_settings for select
  to authenticated
  using ((select public.has_access()) or (select public.is_admin()));

create policy "Admins edit settings"
  on public.course_settings for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ===== 20261014000000_admin_by_email.sql =====
-- Admins can also be granted by email, so an owner is admin from their very first login
-- (public.admins needs the auth user to exist first). Access still requires the email to be
-- confirmed — see public.current_confirmed_email().

create table public.admin_emails (
  email text primary key check (email = lower(email) and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  created_at timestamptz not null default now()
);

-- No client access at all; managed with SQL like public.admins.
revoke all on public.admin_emails from anon, authenticated;
alter table public.admin_emails enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
      or exists (select 1 from public.admin_emails ae where ae.email = public.current_confirmed_email());
$$;

-- Course owner (asked for on 2026-10-14). Add more with:
--   insert into public.admin_emails (email) values ('someone@example.com');
insert into public.admin_emails (email) values ('asrafulislam2000@gmail.com')
on conflict do nothing;

-- ===== 20261015000000_password_login.sql =====
-- Password sign-in (no magic link, no emailed code).
--
-- With Auth → Providers → Email → "Confirm email" turned OFF, anyone can create an account for any
-- address, and public.admin_emails grants admin rights by address — so an open sign-up would let a
-- stranger register the owner's address and take over /admin. This trigger reserves every address in
-- public.admin_emails: admin accounts are created by hand, never through the sign-up form.
--
-- Order matters: create the admin account FIRST (sign up once on /login), then run this. To add an
-- admin later, drop the trigger, create the account, and recreate it:
--   drop trigger block_admin_signup on auth.users;

create or replace function public.block_admin_signup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (select 1 from public.admin_emails ae where ae.email = lower(new.email)) then
    raise exception 'This address is reserved' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists block_admin_signup on auth.users;
create trigger block_admin_signup
before insert on auth.users
for each row execute function public.block_admin_signup();

