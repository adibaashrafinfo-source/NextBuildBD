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
