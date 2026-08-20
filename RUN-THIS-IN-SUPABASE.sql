-- ============================================================================
--  Kinora — COMPLETE DATABASE SETUP
--
--  This is the ONLY SQL file you need to run. It replaces both
--  supabase-schema.sql and supabase-setup-step2.sql.
--
--  HOW TO RUN:
--    1. Open: https://supabase.com/dashboard/project/fpbodwjgypxzqpstwcvo/sql/new
--    2. Copy this entire file, paste it in, press Run (or Ctrl+Enter)
--    3. Wait for "Success"
--
--  Safe to run more than once — it will not duplicate or destroy anything.
-- ============================================================================


-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;


-- ── Types ────────────────────────────────────────────────────────────────────
do $$ begin
  create type public.verification_status as enum ('unverified','pending','verified','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.connection_status as enum ('pending','accepted','declined','blocked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_status as enum ('open','reviewing','resolved');
exception when duplicate_object then null; end $$;


-- ── Tables ───────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  gender text check (gender in ('Male','Female')),
  age int check (age >= 18 and age <= 90),
  country text,
  city text,
  role text check (role in ('Student','Professional')),
  field text,
  organization text,
  languages text[] not null default '{}',
  purposes text[] not null default '{}',
  bio text not null default '',
  profile_photo_url text,
  respect_score int not null default 100 check (respect_score >= 0 and respect_score <= 100),
  identity_status public.verification_status not null default 'unverified',
  role_status public.verification_status not null default 'unverified',
  gender_status public.verification_status not null default 'unverified',
  uniqueness_status public.verification_status not null default 'unverified',
  is_suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Added later: lets a story photo actually persist to the database instead
-- of only living in one browser's local storage.
alter table public.profiles add column if not exists story_url text;
alter table public.profiles add column if not exists story_updated_at timestamptz;

create table if not exists public.verification_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null,
  storage_path text not null,
  status public.verification_status not null default 'pending',
  reviewer_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  status public.connection_status not null default 'pending',
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (requester_id, recipient_id),
  check (requester_id <> recipient_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.connections(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  attachment_url text,
  moderation_result jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.family_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  relationship text not null,
  cadence_days int not null default 7 check (cadence_days between 1 and 365),
  last_contact_at date,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reported_user_id uuid references auth.users(id) on delete set null,
  connection_id uuid references public.connections(id) on delete set null,
  reason text not null,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.webrtc_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique default upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  host_user_id uuid not null references auth.users(id) on delete cascade,
  guest_user_id uuid references auth.users(id) on delete set null,
  purpose text not null default 'verified-intro',
  status text not null default 'waiting' check (status in ('waiting','active','ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '2 hours'),
  check (guest_user_id is null or guest_user_id <> host_user_id)
);

create table if not exists public.webrtc_signals (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.webrtc_rooms(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid references auth.users(id) on delete set null,
  signal_type text not null check (signal_type in ('offer','answer','ice','join','leave')),
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);


-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles               enable row level security;
alter table public.verification_documents enable row level security;
alter table public.connections            enable row level security;
alter table public.messages               enable row level security;
alter table public.family_reminders       enable row level security;
alter table public.reports                enable row level security;
alter table public.webrtc_rooms           enable row level security;
alter table public.webrtc_signals         enable row level security;


-- ── Grants ───────────────────────────────────────────────────────────────────
grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.verification_documents to authenticated;
grant select, insert, update, delete on public.connections to authenticated;
grant select, insert on public.messages to authenticated;
grant select, insert, update, delete on public.family_reminders to authenticated;
grant select, insert on public.reports to authenticated;
grant select, insert, update, delete on public.webrtc_rooms to authenticated;
grant select, insert, delete on public.webrtc_signals to authenticated;


-- ── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists messages_connection_created_idx on public.messages (connection_id, created_at);
create index if not exists messages_sender_idx             on public.messages (sender_id);
create index if not exists connections_requester_idx       on public.connections (requester_id);
create index if not exists connections_recipient_idx       on public.connections (recipient_id);
create index if not exists family_reminders_user_idx       on public.family_reminders (user_id);
create index if not exists reports_reporter_idx            on public.reports (reporter_id);
create index if not exists reports_reported_user_idx       on public.reports (reported_user_id);
create index if not exists reports_connection_idx          on public.reports (connection_id);
create index if not exists verification_documents_user_idx on public.verification_documents (user_id);
create index if not exists profiles_created_idx            on public.profiles (created_at desc);
create index if not exists webrtc_rooms_host_idx           on public.webrtc_rooms (host_user_id);
create index if not exists webrtc_rooms_guest_idx          on public.webrtc_rooms (guest_user_id);
create index if not exists webrtc_signals_room_idx         on public.webrtc_signals (room_id, created_at);
create index if not exists webrtc_signals_sender_idx       on public.webrtc_signals (sender_id);
create index if not exists webrtc_signals_recipient_idx    on public.webrtc_signals (recipient_id);


-- ── Policies: profiles ───────────────────────────────────────────────────────
-- NOTE: the original schema hid EVERY profile until an admin verified four
-- separate fields. There is no admin, so nobody could ever see anybody and the
-- app looked permanently empty. Visibility now only needs a completed profile;
-- verification controls the trust badge instead.

drop policy if exists "Read verified profiles or own profile" on public.profiles;
drop policy if exists "Read active profiles or own profile"  on public.profiles;
create policy "Read active profiles or own profile"
on public.profiles for select to public
using (
  (not is_suspended and full_name is not null and length(trim(full_name)) > 0)
  or ((select auth.uid()) = id)
);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "Users delete own profile" on public.profiles;
create policy "Users delete own profile"
on public.profiles for delete to authenticated
using ((select auth.uid()) = id);


-- ── Policies: verification documents ─────────────────────────────────────────
drop policy if exists "Users manage own verification documents" on public.verification_documents;
create policy "Users manage own verification documents"
on public.verification_documents for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);


-- ── Policies: connections ────────────────────────────────────────────────────
drop policy if exists "Users read their own connections" on public.connections;
create policy "Users read their own connections"
on public.connections for select to authenticated
using ((select auth.uid()) in (requester_id, recipient_id));

drop policy if exists "Users request connections as self" on public.connections;
create policy "Users request connections as self"
on public.connections for insert to authenticated
with check ((select auth.uid()) = requester_id);

drop policy if exists "Recipients can accept or decline" on public.connections;
create policy "Recipients can accept or decline"
on public.connections for update to authenticated
using ((select auth.uid()) in (requester_id, recipient_id))
with check ((select auth.uid()) in (requester_id, recipient_id));

drop policy if exists "Users delete their own connections" on public.connections;
create policy "Users delete their own connections"
on p
ublic.connections for delete to authenticated
using ((select auth.uid()) in (requester_id, recipient_id));


-- ── Policies: messages ───────────────────────────────────────────────────────
drop policy if exists "Users read messages in their connections" on public.messages;
create policy "Users read messages in their connections"
on public.messages for select to authenticated
using (
  exists (
    select 1 from public.connections c
    where c.id = connection_id
      and c.status = 'accepted'
      and (select auth.uid()) in (c.requester_id, c.recipient_id)
  )
);

drop policy if exists "Users send messages in accepted connections" on public.messages;
create policy "Users send messages in accepted connections"
on public.messages for insert to authenticated
with check (
  (select auth.uid()) = sender_id
  and exists (
    select 1 from public.connections c
    where c.id = connection_id
      and c.status = 'accepted'
      and (select auth.uid()) in (c.requester_id, c.recipient_id)
  )
);


-- ── Policies: family reminders, reports ──────────────────────────────────────
drop policy if exists "Users manage own family reminders" on public.family_reminders;
create policy "Users manage own family reminders"
on public.family_reminders for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "Users create reports as self" on public.reports;
create policy "Users create reports as self"
on public.reports for insert to authenticated
with check ((select auth.uid()) = reporter_id);

drop policy if exists "Users read own reports" on public.reports;
create policy "Users read own reports"
on public.reports for select to authenticated
using ((select auth.uid()) = reporter_id);


-- ── Policies: video rooms and signals ────────────────────────────────────────
-- Original policies required full verification, making video unusable.

drop policy if exists "Verified users read available or joined video rooms" on public.webrtc_rooms;
drop policy if exists "Verified users create video rooms as host"           on public.webrtc_rooms;
drop policy if exists "Verified users update joined or waiting video rooms" on public.webrtc_rooms;
drop policy if exists "Hosts can delete their video rooms"                  on public.webrtc_rooms;
drop policy if exists "Read own or open video rooms"                        on public.webrtc_rooms;
drop policy if exists "Create video rooms as host"                          on public.webrtc_rooms;
drop policy if exists "Update rooms you are part of or are joining"         on public.webrtc_rooms;

create policy "Read own or open video rooms"
on public.webrtc_rooms for select to authenticated
using (
  (select auth.uid()) in (host_user_id, guest_user_id)
  or (status = 'waiting' and guest_user_id is null and expires_at > now())
);

-- A call is only allowed between two people who already have an accepted
-- connection — same rule as chat. Without this, anyone signed in could
-- create a room inviting (and effectively calling) any other user id.
create policy "Create video rooms as host"
on public.webrtc_rooms for insert to authenticated
with check (
  host_user_id = (select auth.uid())
  and (
    guest_user_id is null
    or exists (
      select 1 from public.connections c
      where c.status = 'accepted'
        and (
          (c.requester_id = host_user_id and c.recipient_id = guest_user_id)
          or (c.requester_id = guest_user_id and c.recipient_id = host_user_id)
        )
    )
  )
);

create policy "Update rooms you are part of or are joining"
on public.webrtc_rooms for update to authenticated
using (
  (select auth.uid()) in (host_user_id, guest_user_id)
  or (status = 'waiting' and guest_user_id is null and expires_at > now())
)
with check ((select auth.uid()) in (host_user_id, guest_user_id));

create policy "Hosts can delete their video rooms"
on public.webrtc_rooms for delete to authenticated
using (host_user_id = (select auth.uid()));

drop policy if exists "Participants read video signals"          on public.webrtc_signals;
create policy "Participants read video signals"
on public.webrtc_signals for select to authenticated
using (
  exists (
    select 1 from public.webrtc_rooms r
    where r.id = room_id and (select auth.uid()) in (r.host_user_id, r.guest_user_id)
  )
);

drop policy if exists "Participants write video signals" on public.webrtc_signals;
create policy "Participants write video signals"
on public.webrtc_signals for insert to authenticated
with check (
  sender_id = (select auth.uid())
  and exists (
    select 1 from public.webrtc_rooms r
    where r.id = room_id
      and (select auth.uid()) in (r.host_user_id, r.guest_user_id)
  )
);

drop policy if exists "Senders can delete their own video signals" on public.webrtc_signals;
create policy "Senders can delete their own video signals"
on public.webrtc_signals for delete to authenticated
using (sender_id = (select auth.uid()));


-- ── Auto-create a profile when someone signs up ──────────────────────────────
-- Without this, signup creates a login but no profile, and the app breaks
-- immediately after registering.

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
  safe_age := coalesce(nullif(meta->>'age','')::int, 18);
  if safe_age < 18 then safe_age := 18; end if;
  if safe_age > 90 then safe_age := 90; end if;

  insert into public.profiles (
    id, full_name, gender, age, country, role, field, organization,
    languages, purposes, bio,
    identity_status, gender_status, uniqueness_status
  )
  values (
    new.id,
    coalesce(nullif(trim(coalesce(meta->>'full_name','')),''), 'Kinora member'),
    case when coalesce(meta->>'gender','') in ('Male','Female') then meta->>'gender' else 'Male' end,
    safe_age,
    coalesce(nullif(trim(coalesce(meta->>'country','')),''), 'Not set'),
    case when coalesce(meta->>'role','') in ('Student','Professional') then meta->>'role' else 'Student' end,
    coalesce(nullif(trim(coalesce(meta->>'field','')),''), 'Not set'),
    coalesce(nullif(trim(coalesce(meta->>'organization','')),''), 'Not set'),
    coalesce((select array_agg(v) from jsonb_array_elements_text(
      case when jsonb_typeof(meta->'languages') = 'array' then meta->'languages' else '["English"]'::jsonb end) as v), array['English']),
    coalesce((select array_agg(v) from jsonb_array_elements_text(
      case when jsonb_typeof(meta->'purposes') = 'array' then meta->'purposes' else '["Friendship"]'::jsonb end) as v), array['Friendship']),
    coalesce(meta->>'bio',''),
    'verified','verified','verified'
  )
  on conflict (id) do nothing;

  return new;
exception when others then
  return new;   -- never block signup because of profile creation
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── Realtime (this is what makes chat instant) ───────────────────────────────
do $$
begin
  begin alter publication supabase_realtime add table public.messages;       exception when others then null; end;
  begin alter publication supabase_realtime add table public.connections;    exception when others then null; end;
  begin alter publication supabase_realtime add table public.webrtc_signals; exception when others then null; end;
  begin alter publication supabase_realtime add table public.webrtc_rooms;   exception when others then null; end;
end $$;

alter table public.messages       replica identity full;
alter table public.connections    replica identity full;
alter table public.webrtc_signals replica identity full;


-- ── Storage buckets ──────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('bondbridge-avatars','bondbridge-avatars', true, 5242880,
    array['image/jpeg','image/png','image/webp','image/gif']),
  ('bondbridge-proofs','bondbridge-proofs', false, 10485760,
    array['image/jpeg','image/png','image/webp','application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('bondbridge-chat','bondbridge-chat', false, 5242880,
    array['image/jpeg','image/png','image/webp','image/gif','application/pdf'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "BondBridge avatars are publicly readable" on storage.objects;
drop policy if exists "BondBridge users upload own avatars" on storage.objects;
drop policy if exists "BondBridge users update own avatars" on storage.objects;
drop policy if exists "BondBridge users delete own avatars" on storage.objects;
drop policy if exists "BondBridge users read own proof files" on storage.objects;
drop policy if exists "BondBridge users upload own proof files" on storage.objects;
drop policy if exists "BondBridge users update own proof files" on storage.objects;
drop policy if exists "BondBridge users delete own proof files" on storage.objects;
drop policy if exists "BondBridge users read own chat files" on storage.objects;
drop policy if exists "BondBridge chat participants read shared files" on storage.objects;
drop policy if exists "BondBridge users upload own chat files" on storage.objects;
drop policy if exists "BondBridge users update own chat files" on storage.objects;
drop policy if exists "BondBridge users delete own chat files" on storage.objects;
drop policy if exists "Kinora avatars are publicly readable" on storage.objects;
drop policy if exists "Kinora users upload own avatars" on storage.objects;
drop policy if exists "Kinora users update own avatars" on storage.objects;
drop policy if exists "Kinora users delete own avatars" on storage.objects;
drop policy if exists "Kinora users read own proof files" on storage.objects;
drop policy if exists "Kinora users upload own proof files" on storage.objects;
drop policy if exists "Kinora users update own proof files" on storage.objects;
drop policy if exists "Kinora users delete own proof files" on storage.objects;
drop policy if exists "Kinora users read own chat files" on storage.objects;
drop policy if exists "Kinora chat participants read shared files" on storage.objects;
drop policy if exists "Kinora users upload own chat files" on storage.objects;
drop policy if exists "Kinora users update own chat files" on storage.objects;
drop policy if exists "Kinora users delete own chat files" on storage.objects;
create policy "Kinora avatars are publicly readable"
on storage.objects for select to public
using (bucket_id = 'bondbridge-avatars');

create policy "Kinora users upload own avatars"
on storage.objects for insert to authenticated
with check (bucket_id = 'bondbridge-avatars' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users update own avatars"
on storage.objects for update to authenticated
using (bucket_id = 'bondbridge-avatars' and (select auth.uid())::text = (storage.foldername(name))[1])
with check (bucket_id = 'bondbridge-avatars' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users delete own avatars"
on storage.objects for delete to authenticated
using (bucket_id = 'bondbridge-avatars' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users read own proof files"
on storage.objects for select to authenticat
ed
using (bucket_id = 'bondbridge-proofs' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users upload own proof files"
on storage.objects for insert to authenticated
with check (bucket_id = 'bondbridge-proofs' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users update own proof files"
on storage.objects for update to authenticated
using (bucket_id = 'bondbridge-proofs' and (select auth.uid())::text = (storage.foldername(name))[1])
with check (bucket_id = 'bondbridge-proofs' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users delete own proof files"
on storage.objects for delete to authenticated
using (bucket_id = 'bondbridge-proofs' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora chat participants read shared files"
on storage.objects for select to authenticated
using (
  bucket_id = 'bondbridge-chat'
  and (
    (select auth.uid())::text = (storage.foldername(name))[1]
    or exists (
      select 1 from public.messages m
      join public.connections c on c.id = m.connection_id
      where m.attachment_url = storage.objects.name
        and c.status = 'accepted'
        and (select auth.uid()) in (c.requester_id, c.recipient_id)
    )
  )
);

create policy "Kinora users upload own chat files"
on storage.objects for insert to authenticated
with check (bucket_id = 'bondbridge-chat' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users update own chat files"
on storage.objects for update to authenticated
using (bucket_id = 'bondbridge-chat' and (select auth.uid())::text = (storage.foldername(name))[1])
with check (bucket_id = 'bondbridge-chat' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users delete own chat files"
on storage.objects for delete to authenticated
using (bucket_id = 'bondbridge-chat' and (select auth.uid())::text = (storage.foldername(name))[1]);


-- ── Done ─────────────────────────────────────────────────────────────────────
select 'Kinora is ready. Chat, video, profiles and realtime are live.' as status;

