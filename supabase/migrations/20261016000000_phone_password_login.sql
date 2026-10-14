-- Students create their account while enrolling (mobile number + password) and sign in with
-- either their mobile number or their email.
--
-- Email is optional from here on, so access can no longer hang on matching it. An enrollment now
-- records the account that submitted it, and that is what unlocks the dashboard.
--
-- Safe to re-run, so a partly applied copy can simply be run again.

create extension if not exists pgcrypto with schema extensions;

alter table public.enrollments
  add column if not exists user_id uuid references auth.users (id) on delete set null;
create index if not exists enrollments_user_idx on public.enrollments (user_id);
create index if not exists enrollments_phone_idx on public.enrollments (phone);

-- Email becomes optional; the mobile number is the identifier that is always present.
alter table public.enrollments alter column email drop not null;
alter table public.enrollments drop constraint if exists enrollments_email_check;
alter table public.enrollments add constraint enrollments_email_check
  check (email is null or (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'));

-- Access follows the account that enrolled. The email branch keeps rows submitted before
-- sign-up-on-enroll (which have no user_id) working.
create or replace function public.has_access()
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
      and (e.user_id = (select auth.uid())
           or (e.email is not null and lower(e.email) = public.current_confirmed_email()))
  );
$$;

-- Resolve a sign-in. Takes the mobile number or the email together with the password and returns
-- the address to sign in with. It answers only when the password is correct, so it cannot be used
-- to discover who has enrolled or to turn a phone number into an email address.
create or replace function public.login_email(identifier text, password text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select u.email
  from auth.users u
  where u.encrypted_password is not null
    and u.encrypted_password = extensions.crypt(password, u.encrypted_password)
    and (
      lower(u.email) = lower(btrim(identifier))
      or exists (
        select 1
        from public.enrollments e
        where e.user_id = u.id and e.phone = btrim(identifier)
      )
    )
  limit 1;
$$;
grant execute on function public.login_email(text, text) to anon, authenticated;

-- An applicant may stamp their own account on the row they submit, and nobody else's.
grant insert (user_id) on public.enrollments to anon, authenticated;

drop policy if exists "Anyone can submit a pending enrollment" on public.enrollments;
create policy "Anyone can submit a pending enrollment"
  on public.enrollments for insert
  to anon, authenticated
  with check (
    status = 'pending' and reviewed_at is null and reviewed_by is null
    and (user_id is null or user_id = (select auth.uid()))
  );

drop policy if exists "Students read their own enrollments; admins read all" on public.enrollments;
create policy "Students read their own enrollments; admins read all"
  on public.enrollments for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or (email is not null and lower(email) = (select public.current_confirmed_email()))
    or (select public.is_admin())
  );
