-- NextBuildBD: Full database setup for Supabase
-- Run this entire script in Supabase SQL Editor (New query → paste all → Run)

-- TABLES
create extension if not exists pgcrypto with schema extensions;

create table public.enrollments (
  id bigint primary key generated always as identity,
  full_name text not null,
  phone text not null check (phone ~ '^\d{11,13}$'),
  email text check (email is null or (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$')),
  payment_method text not null check (payment_method in ('bkash', 'nagad', 'rocket')),
  sender_number text not null check (sender_number ~ '^\d{11,13}$'),
  trx_id text not null,
  amount numeric not null,
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  admin_note text,
  submitted_at timestamp with time zone not null default now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  user_id uuid references auth.users (id) on delete set null,
  unique (payment_method, trx_id),
  unique (payment_method, sender_number, trx_id)
);

create index enrollments_email_idx on public.enrollments (lower(email)) where email is not null;
create index enrollments_user_idx on public.enrollments (user_id);
create index enrollments_phone_idx on public.enrollments (phone);

create table public.admins (
  uid uuid not null unique default (select auth.uid())
);

create table public.admin_emails (
  email text primary key
);

create table public.classes (
  id uuid not null primary key default gen_random_uuid(),
  position integer not null,
  title text not null,
  description text,
  published boolean not null default false,
  starts_at timestamp with time zone,
  duration_minutes integer,
  meet_url text,
  recording_url text,
  updated_at timestamp with time zone not null default now()
);

create table public.course_settings (
  id boolean not null primary key default true,
  meet_link text,
  whatsapp_group_link text,
  updated_at timestamp with time zone not null default now(),
  constraint only_one_row check (id = true)
);

insert into public.course_settings (id) values (true) on conflict do nothing;

-- FUNCTIONS
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admins
    where uid = (select auth.uid())
  ) or exists (
    select 1
    from public.admin_emails ae
    join auth.users u on lower(u.email) = lower(ae.email)
    where u.id = (select auth.uid()) and u.email_confirmed_at is not null
  );
$$;

create function public.current_confirmed_email()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select u.email
  from auth.users u
  where u.id = (select auth.uid()) and u.email_confirmed_at is not null
  limit 1;
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
      and (e.user_id = (select auth.uid())
           or (e.email is not null and lower(e.email) = public.current_confirmed_email()))
  );
$$;

grant execute on function public.is_admin(), public.current_confirmed_email(), public.has_access() to authenticated;

-- TRIGGERS
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

-- PRIVILEGES
revoke all on public.admins, public.enrollments, public.classes, public.course_settings from anon, authenticated;

grant insert (full_name, phone, email, payment_method, sender_number, trx_id, amount, user_id)
  on public.enrollments to anon, authenticated;
grant select on public.enrollments to authenticated;
grant update (status, admin_note) on public.enrollments to authenticated;

grant select, insert, update, delete on public.classes to authenticated;
grant select on public.course_settings to authenticated;
grant update (whatsapp_group_link, meet_link) on public.course_settings to authenticated;

-- ROW LEVEL SECURITY
alter table public.admins enable row level security;
alter table public.enrollments enable row level security;
alter table public.classes enable row level security;
alter table public.course_settings enable row level security;

create policy "Anyone can submit a pending enrollment"
  on public.enrollments for insert
  to anon, authenticated
  with check (
    status = 'pending' and reviewed_at is null and reviewed_by is null
    and (user_id is null or user_id = (select auth.uid()))
  );

create policy "Students read their own enrollments; admins read all"
  on public.enrollments for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or (email is not null and lower(email) = (select public.current_confirmed_email()))
    or (select public.is_admin())
  );

create policy "Admins review enrollments"
  on public.enrollments for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Students with access read published classes; admins read all"
  on public.classes for select
  to authenticated
  using ((select public.has_access()) or (select public.is_admin()));

create policy "Admins manage classes"
  on public.classes for insert, update, delete
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Students with access and admins read settings"
  on public.course_settings for select
  to authenticated
  using ((select public.has_access()) or (select public.is_admin()));

create policy "Admins edit settings; only one row"
  on public.course_settings for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()) and id = true);

create policy "Prevent non-admins from seeing admins table"
  on public.admins for select
  to authenticated
  using (false);

-- LOGIN SYSTEM
create function public.block_admin_signup()
returns trigger
language plpgsql
as $$
begin
  if exists (select 1 from public.admin_emails where lower(email) = lower(new.email)) then
    raise exception 'reserved';
  end if;
  return new;
end;
$$;

create trigger block_admin_signup
before insert on auth.users
for each row execute function public.block_admin_signup();

create function public.login_email(identifier text, password text)
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
