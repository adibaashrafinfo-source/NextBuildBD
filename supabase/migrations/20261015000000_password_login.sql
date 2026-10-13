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
