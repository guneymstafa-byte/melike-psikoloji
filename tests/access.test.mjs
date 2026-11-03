import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

// Isolated PostgreSQL with synthetic records; never connects to production.
test('access repair isolates clients while preserving therapist workflows', async () => {
  const db = new PGlite();
  const admin = '00000000-0000-0000-0000-000000000001';
  const a = '00000000-0000-0000-0000-000000000002';
  const b = '00000000-0000-0000-0000-000000000003';
  try {
    await db.exec(`
      set app.therapist_email = 'therapist@example.test';
      create role anon; create role authenticated;
      create schema auth;
      create table auth.users(id uuid primary key, email text, email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
      $$;
      grant usage on schema auth, public to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
      insert into auth.users values ('${admin}', 'therapist@example.test', now());
      create table appointments(id uuid default gen_random_uuid() primary key, client_id uuid, status text default 'pending', appointment_date date);
      create table portal_messages(id uuid default gen_random_uuid() primary key, client_id uuid, sender_id uuid, sender_role text, message text, created_at timestamptz default now());
      create table posts(id uuid default gen_random_uuid() primary key, title text, published boolean default true);
      create table profiles(id uuid primary key, full_name text, phone text, role text);
      create table client_tasks(id uuid default gen_random_uuid() primary key, client_id uuid, title text, is_completed boolean default false, created_at timestamptz default now());
      grant all on all tables in schema public to anon, authenticated;
      create policy "Herkes portal mesajlarını görebilir" on portal_messages for select using (true);
      create policy "Anyone can insert posts" on posts for insert with check (true);
      create policy "Anyone can delete posts" on posts for delete using (true);
      insert into appointments(client_id) values ('${a}'), ('${b}');
      insert into portal_messages(client_id,sender_id,sender_role,message) values ('${a}','${a}','client','A'),('${b}','${b}','client','B'),('${a}','${admin}','admin','Reply');
      insert into posts(title,published) values ('Published',true),('Draft',false);
      insert into profiles values ('${a}','A','5555555','client');
      insert into client_tasks(client_id,title) values ('${a}','A'),('${b}','B');
    `);
    await db.exec(await readFile(new URL('../ops/connection-access.sql', import.meta.url), 'utf8'));
    const as = async (id, role='authenticated') => {
      await db.exec('reset role');
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id ?? '']);
      await db.exec(`set role ${role}`);
    };
    const count = async table => Number((await db.query(`select count(*) from ${table}`)).rows[0].count);
    const denied = async sql => assert.rejects(db.exec(sql), /permission denied|row-level security/);
    await as(null,'anon');
    assert.equal(await count('posts'),1);
    for (const table of ['appointments','portal_messages','profiles','client_tasks']) await denied(`select * from ${table}`);
    await denied("insert into posts(title) values ('attack')");
    await denied('truncate posts');
    await as(a);
    assert.equal(await count('appointments'),1);
    assert.equal(await count('portal_messages'),2);
    assert.equal(await count('client_tasks'),1);
    assert.equal(await count('posts'),1);
    await denied(`insert into appointments(client_id,status) values ('${b}','pending')`);
    await denied(`insert into appointments(client_id,status) values ('${a}','confirmed')`);
    await db.exec(`insert into appointments(client_id,status) values ('${a}','pending')`);
    const apptUpdate = await db.query("update appointments set status='confirmed' returning id");
    assert.equal(apptUpdate.rows.length,0);
    await denied(`insert into portal_messages(client_id,sender_id,sender_role) values ('${b}','${a}','client')`);
    await denied(`insert into portal_messages(client_id,sender_id,sender_role) values ('${a}','${a}','admin')`);
    await db.exec(`insert into portal_messages(client_id,sender_id,sender_role) values ('${a}','${a}','client')`);
    await denied("insert into posts(title) values ('attack')");
    assert.equal((await db.query('delete from posts returning id')).rows.length,0);
    await denied("update profiles set role='admin'");
    await db.exec("update profiles set full_name='Updated A'");
    assert.equal((await db.query('update client_tasks set is_completed=true returning id')).rows.length,1);
    await denied(`update client_tasks set client_id='${b}'`);
    await as(b);
    assert.equal(await count('profiles'),0);
    await denied(`insert into profiles(id,role) values ('${b}','admin')`);
    await db.exec(`insert into profiles(id,role) values ('${b}','client') on conflict(id) do nothing`);
    assert.equal(await count('profiles'),1);
    assert.equal(await count('portal_messages'),1);
    await as(admin);
    assert.equal(await count('appointments'),3);
    assert.equal(await count('portal_messages'),4);
    assert.equal(await count('client_tasks'),2);
    assert.equal(await count('posts'),2);
    assert.equal((await db.query("update appointments set status='confirmed' returning id")).rows.length,3);
    await db.exec(`insert into portal_messages(client_id,sender_id,sender_role) values ('${b}','${admin}','admin')`);
    await db.exec(`insert into client_tasks(client_id,title) values ('${a}','Homework')`);
    await db.exec("insert into posts(title) values ('New'); update posts set title='Updated'; delete from posts;");
    assert.equal(await count('posts'),0);
    await denied('truncate appointments');
  } finally { await db.close(); }
});
