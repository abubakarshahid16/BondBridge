create extension if not exists pgcrypto;

create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type public.connection_status as enum ('pending', 'accepted', 'declined', 'blocked');
create type public.report_status as enum ('open', 'reviewing', 'resolved');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  gender text not null check (gender in ('Male', 'Female')),
  age int not null check (age >= 18 and age <= 90),
  country text not null,
  city text,
  role text not null check (role in ('Student', 'Professional')),
  field text not null,
  organization text not null,
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

create table public.verification_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null,
  storage_path text not null,
  status public.verification_status not null default 'pending',
  reviewer_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table public.connections (
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

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.connections(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  attachment_url text,
  moderation_result jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.family_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  relationship text not null,
  cadence_days int not null default 7 check (cadence_days between 1 and 365),
  last_contact_at date,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reported_user_id uuid references auth.users(id) on delete set null,
  connection_id uuid references public.connections(id) on delete set null,
  reason text not null,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  external_customer_id text,
  external_membership_id text,
  plan text not null default 'free',
  status text not null default 'inactive',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table public.webrtc_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  host_user_id uuid not null references auth.users(id) on delete cascade,
  guest_user_id uuid references auth.users(id) on delete set null,
  purpose text not null default 'verified-intro',
  status text not null default 'waiting' check (status in ('waiting', 'active', 'ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '2 hours'),
  check (guest_user_id is null or guest_user_id <> host_user_id)
);

create table public.webrtc_signals (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.webrtc_rooms(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid references auth.users(id) on delete set null,
  signal_type text not null check (signal_type in ('offer', 'answer', 'ice', 'join', 'leave')),
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.verification_documents enable row level security;
alter table public.connections enable row level security;
alter table public.messages enable row level security;
alter table public.family_reminders enable row level security;
alter table public.reports enable row level security;
alter table public.subscriptions enable row level security;
alter table public.webrtc_rooms enable row level security;
alter table public.webrtc_signals enable row level security;

grant usage on schema public to authenticated;
grant usage on schema public to anon;
grant select on public.profiles to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.verification_documents to authenticated;
grant select, insert, update, delete on public.connections to authenticated;
grant select, insert on public.messages to authenticated;
grant select, insert, update, delete on public.family_reminders to authenticated;
grant select, insert on public.reports to authenticated;
grant select on public.subscriptions to authenticated;
grant select, insert, update, delete on public.webrtc_rooms to authenticated;
grant select, insert, delete on public.webrtc_signals to authenticated;

create index webrtc_rooms_waiting_idx on public.webrtc_rooms (status, expires_at) where status = 'waiting';
create index webrtc_rooms_host_user_id_idx on public.webrtc_rooms (host_user_id);
create index webrtc_rooms_guest_user_id_idx on public.webrtc_rooms (guest_user_id);
create index webrtc_signals_room_id_created_at_idx on public.webrtc_signals (room_id, created_at);
create index webrtc_signals_sender_id_idx on public.webrtc_signals (sender_id);
create index webrtc_signals_recipient_id_idx on public.webrtc_signals (recipient_id);
create index verification_documents_user_id_idx on public.verification_documents (user_id);
create index messages_sender_id_idx on public.messages (sender_id);
create index family_reminders_user_id_idx on public.family_reminders (user_id);
create index reports_reporter_id_idx on public.reports (reporter_id);
create index reports_reported_user_id_idx on public.reports (reported_user_id);
create index reports_connection_id_idx on public.reports (connection_id);

create policy "Read verified profiles or own profile"
on public.profiles for select
to public
using (
  (
    not is_suspended
    and identity_status = 'verified'
    and role_status = 'verified'
    and gender_status = 'verified'
    and uniqueness_status = 'verified'
  )
  or ((select auth.uid()) = id)
);

create policy "Users insert own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users update own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users delete own profile"
on public.profiles for delete
to authenticated
using ((select auth.uid()) = id);

create policy "Users manage own verification documents"
on public.verification_documents for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users read their own connections"
on public.connections for select
to authenticated
using ((select auth.uid()) in (requester_id, recipient_id));

create policy "Users request connections as self"
on public.connections for insert
to authenticated
with check ((select auth.uid()) = requester_id);

create policy "Recipients can accept or decline"
on public.connections for update
to authenticated
using ((select auth.uid()) in (requester_id, recipient_id))
with check ((select auth.uid()) in (requester_id, recipient_id));

create policy "Users read messages in their connections"
on public.messages for select
to authenticated
using (
  exists (
    select 1 from public.connections c
    where c.id = connection_id
      and c.status = 'accepted'
      and (select auth.uid()) in (c.requester_id, c.recipient_id)
  )
);

create policy "Users send messages in accepted connections"
on public.messages for insert
to authenticated
with check (
  (select auth.uid()) = sender_id
  and exists (
    select 1 from public.connections c
    where c.id = connection_id
      and c.status = 'accepted'
      and (select auth.uid()) in (c.requester_id, c.recipient_id)
  )
);

create policy "Users manage own family reminders"
on public.family_reminders for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users create reports as self"
on public.reports for insert
to authenticated
with check ((select auth.uid()) = reporter_id);

create policy "Users read own reports"
on public.reports for select
to authenticated
using ((select auth.uid()) = reporter_id);

create policy "Users read own subscription"
on public.subscriptions for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Verified users read available or joined video rooms"
on public.webrtc_rooms for select
to authenticated
using (
  ((select auth.uid()) in (host_user_id, guest_user_id))
  or (
    status = 'waiting'
    and guest_user_id is null
    and expires_at > now()
    and host_user_id <> (select auth.uid())
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.identity_status = 'verified'
        and p.gender_status = 'verified'
        and p.role_status = 'verified'
        and p.uniqueness_status = 'verified'
        and p.is_suspended = false
    )
  )
);

create policy "Verified users create video rooms as host"
on public.webrtc_rooms for insert
to authenticated
with check (
  host_user_id = (select auth.uid())
  and guest_user_id is null
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.identity_status = 'verified'
      and p.gender_status = 'verified'
      and p.role_status = 'verified'
      and p.uniqueness_status = 'verified'
      and p.is_suspended = false
  )
);

create policy "Verified users update joined or waiting video rooms"
on public.webrtc_rooms for update
to authenticated
using (
  ((select auth.uid()) in (host_user_id, guest_user_id))
  or (
    status = 'waiting'
    and guest_user_id is null
    and expires_at > now()
    and host_user_id <> (select auth.uid())
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.identity_status = 'verified'
        and p.gender_status = 'verified'
        and p.role_status = 'verified'
        and p.uniqueness_status = 'verified'
        and p
.is_suspended = false
    )
  )
)
with check (
  ((select auth.uid()) in (host_user_id, guest_user_id))
  or (
    guest_user_id = (select auth.uid())
    and status in ('waiting', 'active')
    and host_user_id <> (select auth.uid())
  )
);

create policy "Hosts can delete their video rooms"
on public.webrtc_rooms for delete
to authenticated
using (host_user_id = (select auth.uid()));

create policy "Participants read video signals"
on public.webrtc_signals for select
to authenticated
using (
  exists (
    select 1
    from public.webrtc_rooms r
    where r.id = room_id
      and (select auth.uid()) in (r.host_user_id, r.guest_user_id)
  )
);

create policy "Participants write video signals"
on public.webrtc_signals for insert
to authenticated
with check (
  sender_id = (select auth.uid())
  and exists (
    select 1
    from public.webrtc_rooms r
    where r.id = room_id
      and (select auth.uid()) in (r.host_user_id, r.guest_user_id)
      and (
        recipient_id is null
        or recipient_id in (r.host_user_id, r.guest_user_id)
      )
  )
);

create policy "Senders can delete their own video signals"
on public.webrtc_signals for delete
to authenticated
using (sender_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('bondbridge-avatars', 'bondbridge-avatars', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif']),
  ('bondbridge-proofs', 'bondbridge-proofs', false, 10485760, array['image/jpeg','image/png','image/webp','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('bondbridge-chat', 'bondbridge-chat', false, 5242880, array['image/jpeg','image/png','image/webp','image/gif','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
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
on storage.objects for select
to public
using (bucket_id = 'bondbridge-avatars');

create policy "Kinora users upload own avatars"
on storage.objects for insert
to authenticated
with check (bucket_id = 'bondbridge-avatars' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users update own avatars"
on storage.objects for update
to authenticated
using (bucket_id = 'bondbridge-avatars' and (select auth.uid())::text = (storage.foldername(name))[1])
with check (bucket_id = 'bondbridge-avatars' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users delete own avatars"
on storage.objects for delete
to authenticated
using (bucket_id = 'bondbridge-avatars' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users read own proof files"
on storage.objects for select
to authenticated
using (bucket_id = 'bondbridge-proofs' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users upload own proof files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'bondbridge-proofs' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users update own proof files"
on storage.objects for update
to authenticated
using (bucket_id = 'bondbridge-proofs' and (select auth.uid())::text = (storage.foldername(name))[1])
with check (bucket_id = 'bondbridge-proofs' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users delete own proof files"
on storage.objects for delete
to authenticated
using (bucket_id = 'bondbridge-proofs' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora chat participants read shared files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'bondbridge-chat'
  and (
    (select auth.uid())::text = (storage.foldername(name))[1]
    or exists (
      select 1
      from public.messages m
      join public.connections c on c.id = m.connection_id
      where m.attachment_url = storage.objects.name
        and c.status = 'accepted'
        and (select auth.uid()) in (c.requester_id, c.recipient_id)
    )
  )
);

create policy "Kinora users upload own chat files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'bondbridge-chat' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users update own chat files"
on storage.objects for update
to authenticated
using (bucket_id = 'bondbridge-chat' and (select auth.uid())::text = (storage.foldername(name))[1])
with check (bucket_id = 'bondbridge-chat' and (select auth.uid())::text = (storage.foldername(name))[1]);

create policy "Kinora users delete own chat files"
on storage.objects for delete
to authenticated
using (bucket_id = 'bondbridge-chat' and (select auth.uid())::text = (storage.foldername(name))[1]);

