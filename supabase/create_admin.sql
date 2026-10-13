-- Create the admin account (or reset its password). Run this once in the Supabase SQL Editor,
-- after supabase/setup_all.sql.
--
-- Admins have no enrollment, so they cannot come in through the enroll form; this is how an admin
-- account comes to exist. Edit the two values below first, then run the whole file.
--
-- Pick a real password. This address is published in the README, so the password is the only thing
-- standing between a stranger and every student's payment details.

-- public.block_admin_signup reserves admin addresses, so step around it while creating the account.
do $$ begin
  alter table auth.users disable trigger block_admin_signup;
exception when undefined_object then null;
end $$;

do $$
declare
  admin_email  constant text := 'asrafulislam2000@gmail.com';
  admin_password constant text := 'CHANGE-ME-BEFORE-RUNNING';
  uid uuid;
begin
  if admin_password like 'CHANGE-ME%' or length(admin_password) < 8 then
    raise exception 'Set admin_password to a real password of at least 8 characters first';
  end if;

  select id into uid from auth.users where lower(email) = lower(admin_email);

  if uid is null then
    uid := gen_random_uuid();
    insert into auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data
    ) values (
      uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      lower(admin_email), extensions.crypt(admin_password, extensions.gen_salt('bf')),
      now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb
    );
    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), uid, uid::text,
      jsonb_build_object('sub', uid::text, 'email', lower(admin_email)),
      'email', now(), now(), now()
    );
  else
    update auth.users
    set encrypted_password = extensions.crypt(admin_password, extensions.gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now())
    where id = uid;
  end if;

  insert into public.admin_emails (email) values (lower(admin_email)) on conflict do nothing;
end $$;

do $$ begin
  alter table auth.users enable trigger block_admin_signup;
exception when undefined_object then null;
end $$;
