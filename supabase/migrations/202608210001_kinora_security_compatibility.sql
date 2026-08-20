-- Kinora security and compatibility migration.
--
-- Apply this after review on the existing Supabase project. It intentionally
-- keeps the production storage bucket identifiers as bondbridge-* so existing
-- uploaded avatars, proofs, chat attachments, and deployed clients continue to
-- work during the rebrand.

-- Newer Supabase projects require explicit Data API grants. Existing projects
-- may already have these through legacy defaults, but this keeps the intended
-- surface clear.
grant select, insert, update, delete on public.push_subscriptions to authenticated;

drop policy if exists "Users manage their own push subscriptions" on public.push_subscriptions;
create policy "Users manage their own push subscriptions"
on public.push_subscriptions for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Trigger functions are not public RPC endpoints. Keep SECURITY DEFINER where
-- it is needed for auth/pg_net triggers, but revoke direct execution through
-- the exposed public schema.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.notify_new_message() from public, anon, authenticated;
revoke execute on function public.notify_incoming_call() from public, anon, authenticated;

-- Cover foreign keys used by RLS checks, joins, realtime refreshes, and deletes.
create index if not exists verification_documents_user_idx on public.verification_documents (user_id);
create index if not exists messages_sender_idx on public.messages (sender_id);
create index if not exists family_reminders_user_idx on public.family_reminders (user_id);
create index if not exists reports_reporter_idx on public.reports (reporter_id);
create index if not exists reports_reported_user_idx on public.reports (reported_user_id);
create index if not exists reports_connection_idx on public.reports (connection_id);
create index if not exists webrtc_signals_sender_idx on public.webrtc_signals (sender_id);
create index if not exists webrtc_signals_recipient_idx on public.webrtc_signals (recipient_id);

-- Rebrand storage policy labels without changing buckets or object paths.
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

