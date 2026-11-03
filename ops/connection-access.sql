-- Access repair for the existing Melike project; no client records are changed.
-- Admin identity is resolved from an existing, verified auth account.
-- The operator must supply app.therapist_email in this transaction before applying.
-- Keep the real account identifier out of this public repository.
set lock_timeout = '5s';
set statement_timeout = '30s';
do $$
declare admin_id uuid; admin_pred text;
begin
  select id into strict admin_id from auth.users
    where lower(email) = lower(current_setting('app.therapist_email')) and email_confirmed_at is not null;
  admin_pred := format('(select auth.uid()) = %L::uuid', admin_id);

  drop policy if exists "Herkes randevuları okuyabilir veya kendi randevusunu görebili" on public.appointments;
  drop policy if exists "Kullanıcı randevu oluşturabilir" on public.appointments;
  drop policy if exists "Kullanıcı veya admin randevuyu güncelleyebilir" on public.appointments;
  drop policy if exists "Herkes portal mesajlarını görebilir" on public.portal_messages;
  drop policy if exists "Herkes portal mesajı yazabilir" on public.portal_messages;
  drop policy if exists "Admin posts guncelleyebilir" on public.posts;
  drop policy if exists "Admin posts silebilir" on public.posts;
  drop policy if exists "Anyone can delete posts" on public.posts;
  drop policy if exists "Anyone can insert posts" on public.posts;
  drop policy if exists "Public can read posts" on public.posts;
  drop policy if exists "Kullanıcılar kendi profillerini görebilir" on public.profiles;
  drop policy if exists "Kullanıcılar kendi profillerini güncelleyebilir" on public.profiles;
  drop policy if exists "Admin ekleyebilir" on public.client_tasks;
  drop policy if exists "Admin silebilir" on public.client_tasks;
  drop policy if exists "Danisan ve Admin guncelleyebilir" on public.client_tasks;
  drop policy if exists "Danisanlar ve Admin gorebilir" on public.client_tasks;

  execute format('create policy appointments_read on public.appointments for select to authenticated using (client_id = (select auth.uid()) or %s)', admin_pred);
  create policy appointments_request on public.appointments for insert to authenticated
    with check (client_id = (select auth.uid()) and status = 'pending');
  execute format('create policy appointments_manage on public.appointments for update to authenticated using (%s) with check (%s)', admin_pred, admin_pred);

  execute format('create policy messages_read on public.portal_messages for select to authenticated using (client_id = (select auth.uid()) or (sender_id = (select auth.uid()) and sender_role = ''client'') or %s)', admin_pred);
  execute format('create policy messages_send on public.portal_messages for insert to authenticated with check (sender_id = (select auth.uid()) and ((sender_role = ''client'' and client_id = (select auth.uid())) or (sender_role = ''admin'' and client_id is not null and %s)))', admin_pred);

  create policy posts_public_read on public.posts for select to anon using (published = true);
  execute format('create policy posts_read on public.posts for select to authenticated using (published = true or %s)', admin_pred);
  execute format('create policy posts_insert on public.posts for insert to authenticated with check (%s)', admin_pred);
  execute format('create policy posts_update on public.posts for update to authenticated using (%s) with check (%s)', admin_pred, admin_pred);
  execute format('create policy posts_delete on public.posts for delete to authenticated using (%s)', admin_pred);

  create policy profiles_read on public.profiles for select to authenticated using (id = (select auth.uid()));
  create policy profiles_insert on public.profiles for insert to authenticated with check (id = (select auth.uid()) and role = 'client');
  create policy profiles_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

  execute format('create policy tasks_read on public.client_tasks for select to authenticated using (client_id = (select auth.uid()) or %s)', admin_pred);
  execute format('create policy tasks_insert on public.client_tasks for insert to authenticated with check (%s)', admin_pred);
  execute format('create policy tasks_update on public.client_tasks for update to authenticated using (client_id = (select auth.uid()) or %s) with check (client_id = (select auth.uid()) or %s)', admin_pred, admin_pred);
  execute format('create policy tasks_delete on public.client_tasks for delete to authenticated using (%s)', admin_pred);
end $$;

alter table public.appointments enable row level security;
alter table public.portal_messages enable row level security;
alter table public.client_tasks enable row level security;
alter table public.profiles enable row level security;
alter table public.posts enable row level security;

revoke all on public.appointments, public.portal_messages, public.client_tasks, public.profiles, public.posts from anon, authenticated, public;
grant select on public.posts to anon;
grant select, insert, update, delete on public.posts to authenticated;
grant select, insert on public.appointments, public.portal_messages, public.profiles to authenticated;
grant update (status) on public.appointments to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
grant select, insert, delete on public.client_tasks to authenticated;
grant update (is_completed) on public.client_tasks to authenticated;

create index if not exists appointments_client_date_idx on public.appointments (client_id, appointment_date);
create index if not exists messages_client_created_idx on public.portal_messages (client_id, created_at);
create index if not exists messages_sender_created_idx on public.portal_messages (sender_id, created_at);
create index if not exists tasks_client_created_idx on public.client_tasks (client_id, created_at);
