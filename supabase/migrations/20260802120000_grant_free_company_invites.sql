-- Grant company invitations are membership-based. Replace the historical
-- billing-and-seat-capacity gate without altering any applied migration.
create or replace function public.accept_company_invite(
  p_invite_id uuid,
  p_user_id uuid
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  i public.creed_invites%rowtype;
begin
  select * into i from public.creed_invites where id = p_invite_id for update;
  if not found or i.status <> 'pending' or i.expires_at <= now() then return 'invalid'; end if;

  insert into public.creed_members (creed_id, user_id, role)
    values (i.creed_id, p_user_id, i.role)
    on conflict (creed_id, user_id) do nothing;
  update public.creed_invites set status = 'accepted', updated_at = now() where id = i.id;
  return 'accepted';
end;
$$;

revoke all on function public.accept_company_invite(uuid, uuid) from public, anon, authenticated;
grant execute on function public.accept_company_invite(uuid, uuid) to service_role;
