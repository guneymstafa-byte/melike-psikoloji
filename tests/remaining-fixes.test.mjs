import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gmailConfiguration, appointmentMailFailure } from '../src/lib/appointment-mail.ts';
import { appointmentErrorMessage } from '../src/lib/appointment.ts';
import { createReadCoalescer } from '../src/lib/network.ts';

test('Gmail application passwords pasted in groups authenticate with the compact value', () => {
  const config = gmailConfiguration({ EMAIL_USER: ' sender@example.com\n', EMAIL_PASS: 'abcd efgh ijkl mnop\n', RECEIVER_EMAIL: ' receiver@example.com ' });
  assert.deepEqual(config, { user: 'sender@example.com', pass: 'abcdefghijklmnop', to: 'receiver@example.com' });
  assert.equal(gmailConfiguration({ EMAIL_USER: 'sender@example.com', EMAIL_PASS: ' \n ' }), null);
  assert.equal(gmailConfiguration({ EMAIL_USER: 'bad\naddress@example.com', EMAIL_PASS: 'sample' }), null);
});

test('Rejected credentials are distinguished from uncertain delivery without exposing SMTP details', () => {
  const rejected = appointmentMailFailure({ code: 'EAUTH', message: 'private provider response' });
  assert.equal(rejected.status, 503);
  assert.match(appointmentErrorMessage(rejected.code), /talebiniz iletilemedi/i);
  const timeout = appointmentMailFailure({ code: 'ETIMEDOUT' });
  assert.equal(timeout.status, 500);
  assert.match(appointmentErrorMessage(timeout.code), /iletildiği doğrulanamadı/i);
  assert.doesNotMatch(JSON.stringify(rejected), /private/);
});

test('Focus and polling share an unfinished read so slow results are not continually superseded', async () => {
  const coalesce = createReadCoalescer();
  let complete;
  let loads = 0;
  const load = async () => { loads++; await new Promise(resolve => { complete = resolve; }); };
  const first = coalesce('client-a', load);
  await Promise.resolve();
  const focus = coalesce('client-a', load);
  const poll = coalesce('client-a', load);
  assert.equal(first, focus);
  assert.equal(first, poll);
  assert.equal(loads, 1);
  let otherAccountLoaded = false;
  await coalesce('client-b', async () => { otherAccountLoaded = true; });
  assert.equal(otherAccountLoaded, true);
  complete();
  await first;
  await coalesce('client-a', async () => { loads++; });
  assert.equal(loads, 2);
});

test('A failed read releases its slot for a later retry', async () => {
  const coalesce = createReadCoalescer();
  await assert.rejects(coalesce('client', async () => { throw new Error('offline'); }), /offline/);
  let recovered = false;
  await coalesce('client', async () => { recovered = true; });
  assert.equal(recovered, true);
});
