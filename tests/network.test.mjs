import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createResilientFetch, connectionMessage, withDeadline } from '../src/lib/network.ts';
import { parseAppointment, escapeHtml } from '../src/lib/appointment.ts';

const url = 'https://example.test/data';
test('a transient failed read recovers with exactly one retry', async () => {
  let calls = 0;
  const request = createResilientFetch(async () => {
    if (++calls === 1) throw new TypeError('Failed to fetch');
    return new Response('ok');
  }, 100, 0);
  assert.equal(await (await request(url)).text(), 'ok');
  assert.equal(calls, 2);
});
test('transient gateway response retries, authorization failures do not', async () => {
  for (const status of [502, 503, 504, 401, 403]) {
    let calls = 0;
    const request = createResilientFetch(async () => { calls++; return new Response('', {status}); }, 100, 0);
    assert.equal((await request(url)).status, status);
    assert.equal(calls, status >= 500 ? 2 : 1);
  }
});
test('writes are never retried after an uncertain network failure', async () => {
  for (const method of ['POST', 'PATCH', 'DELETE']) {
    let calls = 0;
    const request = createResilientFetch(async () => { calls++; throw new TypeError('Failed to fetch'); }, 100, 0);
    await assert.rejects(request(url, {method}), /Failed to fetch/);
    assert.equal(calls, 1);
  }
});
test('a hanging request is aborted; read retry is bounded', async () => {
  let calls = 0;
  const request = createResilientFetch(async (_input, init) => {
    calls++;
    return new Promise((_, reject) => init.signal.addEventListener('abort', () => reject(init.signal.reason)));
  }, 5, 0);
  await assert.rejects(request(url), {name: 'TimeoutError'});
  assert.equal(calls, 2);
});
test('caller cancellation stops work without a retry', async () => {
  let calls = 0;
  const controller = new AbortController();
  const request = createResilientFetch(async (_input, init) => {
    calls++;
    return new Promise((_, reject) => {
      init.signal.addEventListener('abort', () => reject(init.signal.reason));
      controller.abort();
    });
  }, 100, 0);
  await assert.rejects(request(url, {signal: controller.signal}), {name:'AbortError'});
  assert.equal(calls, 1);
});
test('Request objects preserve their write method for retry decisions', async () => {
  let calls = 0;
  const request = createResilientFetch(async () => { calls++; return new Response('', {status: 503}); }, 100, 0);
  await request(new Request(url, {method:'POST', body:'test'}));
  assert.equal(calls, 1);
});
test('auth lock deadline finishes, and normal results are preserved', async () => {
  await assert.rejects(withDeadline(new Promise(() => {}), 5), /timed out/);
  assert.equal(await withDeadline(Promise.resolve('ready'), 5), 'ready');
});
test('network failures display a Turkish recovery message', () => {
  assert.match(connectionMessage(new TypeError('Failed to fetch')), /korunuyor/);
  assert.match(connectionMessage(new Error('JWT expired')), /yeniden giriş/);
  assert.doesNotMatch(connectionMessage(new Error('private database detail')), /private/);
});
test('appointment form field names and legacy aliases are accepted', () => {
  const base = {name:' Test User ', phone:'+90 555 555 55 55', email:'test@example.com'};
  const data = parseAppointment({...base, service:'Online', date:'2026-11-10'});
  assert.equal(data.service, 'Online');
  assert.equal(data.date, '2026-11-10');
  assert.equal(data.name, 'Test User');
  const legacy = parseAppointment({...base, type:'Office', datePreference:'Friday'});
  assert.equal(legacy.service, 'Office');
  assert.equal(legacy.date, 'Friday');
});
test('invalid forms are rejected and email markup is escaped', () => {
  assert.equal(parseAppointment(null), null);
  assert.equal(parseAppointment({name:'Test',email:'bad',phone:'1234567'}), null);
  assert.equal(parseAppointment({name:'Test',email:'a@b.test',phone:'<script>'}), null);
  assert.equal(escapeHtml('<b>"A&B"</b>'), '&lt;b&gt;&quot;A&amp;B&quot;&lt;/b&gt;');
});
