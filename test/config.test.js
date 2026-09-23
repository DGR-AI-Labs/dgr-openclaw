import test from 'node:test';
import assert from 'node:assert/strict';
import { parseConfig } from '../src/config.js';

test('default sandbox policy is immutable and canonical', () => {
  const input = { allowedDestinations: ['b', 'a'] };
  const policy = parseConfig(input);
  input.allowedDestinations.push('evil');
  assert.deepEqual(policy.allowedDestinations, ['a', 'b']);
  assert.equal(policy.hash, parseConfig({ allowedDestinations: ['a', 'b'] }).hash);
  assert.throws(() => { policy.maxPaymentMinor = 999999; });
});
for (const input of [null, [], { unknown: true }, { maxPaymentMinor: null }, { maxPaymentMinor: 0 },
  { maxPaymentMinor: 1.1 }, { maxPaymentMinor: '1000' }, { maxPaymentMinor: Infinity },
  { allowedDestinations: [] }, { allowedDestinations: ['x', 'x'] }, { allowedDestinations: ['../x'] },
  { maxAttachmentBytes: -1 }, { maxAttachmentBytes: 262145 }]) {
  test(`invalid configuration rejects: ${JSON.stringify(input)}`, () => assert.throws(() => parseConfig(input)));
}
test('each policy dimension changes its commitment', () => {
  const base = parseConfig().hash;
  for (const change of [{ maxPaymentMinor: 999 }, { maxAttachmentBytes: 4095 }, { allowedDestinations: ['other'] }]) {
    assert.notEqual(base, parseConfig(change).hash);
  }
});
