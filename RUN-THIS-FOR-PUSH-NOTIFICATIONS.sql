-- ============================================================================
--  BondBridge — Background Push Notifications setup
--
--  This is what makes a new message "ping" and an incoming call "ring" even
--  when BondBridge is fully closed (tab closed, browser closed) — the same
--  behavior WhatsApp/Instagram give you, built with pg_net (lets Postgres
--  make an outbound HTTP call the instant a row is written, independent of
--  whether anyone's browser tab is open) + Web Push + a service worker.
--
--  This file has ALREADY been run against the live database. It's kept here
--  purely as documentation, so the setup is visible/reproducible from the
--  repo. If you ever need to re-run it (e.g. a fresh Supabase project):
--
--    1. Replace PUSH_SECRET_PLACEHOLDER below with a real random secret —
--       generate one with:  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
--       Never commit the real secret to git.
--    2. Open: https://supabase.com/dashboard/project/fpbodwjgypxzqpstwcvo/sql/new
--    3. Paste this whole file, press Run (Ctrl+Enter)
--    4. Deploy the push-send Edge Function (supabase/functions/push-send) and
--       set its PUSH_FUNCTION_SECRET secret to the SAME value used below, plus
--       VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY (generate with the `web-push`
--       npm package's generateVAPIDKeys()). Turn OFF "Enforce JWT
--       Verification" for that function — the database trigger below can't
--       supply a normal user login token, so the function protects itself
--       with the shared secret instead.
--
--  Safe to run more than once — it will not duplicate or destroy anything.
-- ============================================================================

-- Push notifications: subscriptions table + RLS
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "Users manage their own push subscriptions" on public.push_subscriptions;
create policy "Users manage their own push subscriptions"
on public.push_subscriptions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions(user_id);

-- pg_net lets Postgres make outbound HTTP calls directly from a trigger, so a
-- push notification fires the instant a row is written — independent of
-- whether the sender's browser tab is still open afterward.
create extension if not exists pg_net with schema extensions;

-- New chat message -> push the recipient
create or replace function public.notify_new_message() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_recipient uuid;
  v_sender_name text;
begin
  select case when c.requester_id = new.sender_id then c.recipient_id else c.requester_id end
    into v_recipient
  from public.connections c where c.id = new.connection_id;

  if v_recipient is null then return new; end if;

  select full_name into v_sender_name from public.profiles where id = new.sender_id;

  perform net.http_post(
    url := 'https://fpbodwjgypxzqpstwcvo.supabase.co/functions/v1/push-send',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-notify-secret', 'PUSH_SECRET_PLACEHOLDER'),
    body := jsonb_build_object(
      'user_id', v_recipient,
      'title', coalesce(v_sender_name, 'New message'),
      'body', left(coalesce(new.body, ''), 120),
      'tag', 'msg-' || new.connection_id::text,
      'data', jsonb_build_object('type', 'message', 'peer_id', new.sender_id)
    )
  );
  return new;
end;
$$;

drop trigger if exists trg_notify_new_message on public.messages;
create trigger trg_notify_new_message
after insert on public.messages
for each row execute function public.notify_new_message();

-- New incoming call room -> push the person being called, so it can ring
-- even if their tab/app isn't open.
create or replace function public.notify_incoming_call() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_caller_name text;
begin
  if new.status <> 'waiting' or new.guest_user_id is null then return new; end if;

  select full_name into v_caller_name from public.profiles where id = new.host_user_id;

  perform net.http_post(
    url := 'https://fpbodwjgypxzqpstwcvo.supabase.co/functions/v1/push-send',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-notify-secret', 'PUSH_SECRET_PLACEHOLDER'),
    body := jsonb_build_object(
      'user_id', new.guest_user_id,
      'title', coalesce(v_caller_name, 'Someone') || ' is calling you',
      'body', 'Tap to answer the video call.',
      'tag', 'call-' || new.id::text,
      'requireInteraction', true,
      'data', jsonb_build_object('type', 'call', 'room_id', new.id, 'peer_id', new.host_user_id)
    )
  );
  return new;
end;
$$;

drop trigger if exists trg_notify_incoming_call on public.webrtc_rooms;
create trigger trg_notify_incoming_call
after insert on public.webrtc_rooms
for each row execute function public.notify_incoming_call();

select 'Push notification triggers installed.' as status;
