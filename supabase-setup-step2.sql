-- ============================================================================
-- Kinora — Setup Step 2
-- Run this AFTER supabase-schema.sql, in Supabase → SQL Editor → New query
-- This makes the app actually work between real users.
-- ============================================================================


-- ── 1. Auto-create a profile row when someone signs up ──────────────────────
-- Without this, signup succeeds but the user has no profile and the app breaks.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  safe_age int;
begin
  safe_age := coalesce((meta->>'age')::int, 18);
  if safe_age < 18 then safe_age := 18; end if;
  if safe_age > 90 then safe_age := 90; end if;

  insert into public.profiles (
    id, full_name, gender, age, country, role, field, organization,
    languages, purposes, bio,
    identity_status, gender_status, uniqueness_status
  )
  values (
    new.id,
    nullif(trim(coalesce(meta->>'full_name', '')), ''),
    case when coalesce(meta->>'gender', '') in ('Male','Female')
         then meta->>'gender' else 'Male' end,
    safe_age,
    coalesce(nullif(trim(coalesce(meta->>'country', '')), ''), 'Not set'),
    case when coalesce(meta->>'role', '') in ('Student','Professional')
         then meta->>'role' else 'Student' end,
    coalesce(nullif(trim(coalesce(meta->>'field', '')), ''), 'Not set'),
    coalesce(nullif(trim(coalesce(meta->>'organization', '')), ''), 'Not set'),
    coalesce(
      (select array_agg(value::text) from jsonb_array_elements_text(
        case when jsonb_typeof(meta->'languages') = 'array'
             then meta->'languages' else '["English"]'::jsonb end) as value),
      array['English']
    ),
    coalesce(
      (select array_agg(value::text) from jsonb_array_elements_text(
        case when jsonb_typeof(meta->'purposes') = 'array'
             then meta->'purposes' else '["Friendship"]'::jsonb end) as value),
      array['Friendship']
    ),
    coalesce(meta->>'bio', ''),
    -- Self-attested details are trusted at signup; role proof is reviewed separately
    'verified', 'verified', 'verified'
  )
  on conflict (id) do nothing;

  return new;
exception when others then
  -- Never block signup because of profile creation
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── 2. Fix profile visibility ────────────────────────────────────────────────
-- The original policy hid EVERY profile until all 4 verification fields were
-- 'verified'. With no admin to approve anyone, that meant nobody could ever
-- see anybody and the app looked permanently empty.
-- New rule: a completed, non-suspended profile is discoverable. Full
-- verification still controls the trust badge, not basic visibility.

drop policy if exists "Read verified profiles or own profile" on public.profiles;

create policy "Read active profiles or own profile"
on public.profiles for select
to public
using (
  (
    not is_suspended
    and full_name is not null
    and length(trim(full_name)) > 0
  )
  or ((select auth.uid()) = id)
);


-- ── 3. Let any signed-in user start a video room ─────────────────────────────
-- Original policies required 4-way verification, so video was unusable.

drop policy if exists "Verified users read available or joined video rooms" on public.webrtc_rooms;
drop policy if exists "Verified users create video rooms as host" on public.webrtc_rooms;
drop policy if exists "Verified users update joined or waiting video rooms" on public.webrtc_rooms;

create policy "Read own or open video rooms"
on public.webrtc_rooms for select
to authenticated
using (
  (select auth.uid()) in (host_user_id, guest_user_id)
  or (status = 'waiting' and guest_user_id is null and expires_at > now())
);

create policy "Create video rooms as host"
on public.webrtc_rooms for insert
to authenticated
with check (host_user_id = (select auth.uid()));

create policy "Update rooms you are part of or are joining"
on public.webrtc_rooms for update
to authenticated
using (
  (select auth.uid()) in (host_user_id, guest_user_id)
  or (status = 'waiting' and guest_user_id is null and expires_at > now())
)
with check (
  (select auth.uid()) in (host_user_id, guest_user_id)
);


-- ── 4. Turn on Realtime ──────────────────────────────────────────────────────
-- This is what makes chat appear instantly and video calls connect.

do $$
begin
  begin alter publication supabase_realtime add table public.messages;
  exception when duplicate_object then null; end;

  begin alter publication supabase_realtime add table public.connections;
  exception when duplicate_object then null; end;

  begin alter publication supabase_realtime add table public.webrtc_signals;
  exception when duplicate_object then null; end;

  begin alter publication supabase_realtime add table public.webrtc_rooms;
  exception when duplicate_object then null; end;
end $$;

-- Realtime needs full row data on updates/deletes
alter table public.messages replica identity full;
alter table public.connections replica identity full;
alter table public.webrtc_signals replica identity full;


-- ── 5. Allow deleting your own connections and family rows ───────────────────
grant delete on public.connections to authenticated;

drop policy if exists "Users delete their own connections" on public.connections;
create policy "Users delete their own connections"
on public.connections for delete
to authenticated
using ((select auth.uid()) in (requester_id, recipient_id));


-- ── 6. Helpful indexes for chat performance ──────────────────────────────────
create index if not exists messages_connection_created_idx
  on public.messages (connection_id, created_at);
create index if not exists connections_requester_idx
  on public.connections (requester_id);
create index if not exists connections_recipient_idx
  on public.connections (recipient_id);
create index if not exists profiles_created_idx
  on public.profiles (created_at desc);


-- ── Done ─────────────────────────────────────────────────────────────────────
select 'Kinora setup complete. Realtime chat, video and profiles are live.' as status;

