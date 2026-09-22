import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAction } from '../src/actions.js';
const valid = { invoiceId: 'demo', destination: 'sandbox-vendor', amountMinor: 500, currency: 'USD' };
for (const input of [null, [], {}, { ...valid, extra: 1 }, { ...valid, trustedEvidence: true },
  { ...valid, amountMinor: 0 }, { ...valid, amountMinor: -1 }, { ...valid, amountMinor: 1.5 },
  { ...valid, amountMinor: '500' }, { ...valid, currency: 'EUR' }, { ...valid, destination: '../x' },
  { ...valid, invoiceId: 'x\ny' }]) {
  test(`malformed payment refuses: ${JSON.stringify(input)}`, () => assert.throws(() => parseAction('payment', input)));
}
test('canonical action ignores property order and binds each payment field', () => {
  const base = parseAction('payment', valid).hash;
  assert.equal(base, parseAction('payment', { currency: 'USD', amountMinor: 500, destination: 'sandbox-vendor', invoiceId: 'demo' }).hash);
  for (const change of [{ invoiceId: 'other' }, { destination: 'other' }, { amountMinor: 501 }]) {
    assert.notEqual(base, parseAction('payment', { ...valid, ...change }).hash);
  }
});
test('invoice uses UTF-8 byte length, rejects malformed Unicode and raw paths', () => {
  assert.equal(parseAction('invoice', { invoiceId: 'a', content: 'é' }).byteLength, 2);
  assert.throws(() => parseAction('invoice', { invoiceId: 'a', content: '\ud800' }));
  assert.throws(() => parseAction('invoice', { invoiceId: 'a', content: 'x', path: '/tmp/x' }));
  assert.throws(() => parseAction('invoice', { invoiceId: 'a', content: 'x'.repeat(262145) }));
});
test('unknown action refuses', () => assert.throws(() => parseAction('shell', valid)));
