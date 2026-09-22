import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { SandboxGate } from '../src/gate.js';
import { inspectRecords } from '../src/records.js';
const payment = { invoiceId: 'demo', destination: 'sandbox-vendor', amountMinor: 500, currency: 'USD' };
function fixture(t, config = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'dgr-test-'));
  const path = join(dir, 'state.sqlite');
  const gate = new SandboxGate(path, config);
  const db = new DatabaseSync(path);
  t.after(() => { db.close(); gate.close(); rmSync(dir, { recursive: true, force: true }); });
  return { gate, db, path };
}
function attach(gate, id = 'demo', callId = 'attach') {
  return gate.execute('invoice', callId, { invoiceId: id, content: 'Synthetic fixture' });
}
test('allowed actions create exact synthetic effects and consistent receipts', t => {
  const { gate, db, path } = fixture(t);
  assert.equal(attach(gate).status, 'simulated');
  const result = gate.execute('payment', 'pay', payment);
  assert.equal(result.status, 'simulated');
  assert.deepEqual({ ...db.prepare('SELECT * FROM payments').get() }, {
    invoice_id: 'demo', destination: 'sandbox-vendor', amount_minor: 500, currency: 'USD' });
  const records = inspectRecords(path);
  assert.equal(records.count, 2);
  assert.equal(records.head, result.receipt.hash);
  assert.equal(records.verification, 'self-consistency-only');
});
for (const [label, change, reason] of [
  ['over limit', { amountMinor: 1001 }, 'AMOUNT_LIMIT'],
  ['wrong destination', { destination: 'other' }, 'DESTINATION_NOT_ALLOWED'],
  ['agent evidence', { trustedEvidence: true }, 'INVALID_ACTION'],
]) test(`${label} records denial and creates no effect`, t => {
  const { gate, db } = fixture(t); attach(gate);
  const result = gate.execute('payment', 'pay', { ...payment, ...change });
  assert.equal(result.reason, reason);
  assert.equal(db.prepare('SELECT count(*) n FROM payments').get().n, 0);
  assert.equal(db.prepare('SELECT count(*) n FROM ledger').get().n, 2);
});
test('exact payment limit accepted; invoice evidence required', t => {
  const { gate } = fixture(t);
  assert.equal(gate.execute('payment', 'missing', payment).reason, 'INVOICE_REQUIRED');
  attach(gate);
  assert.equal(gate.execute('payment', 'edge', { ...payment, amountMinor: 1000 }).status, 'simulated');
});
test('same attempt, changed action, second connection and new attempt cannot replay a payment', t => {
  const { gate, db, path } = fixture(t); attach(gate);
  assert.equal(gate.execute('payment', 'pay', payment).status, 'simulated');
  const second = new SandboxGate(path);
  try {
    assert.equal(second.execute('payment', 'pay', { ...payment, amountMinor: 1 }).reason, 'DUPLICATE_ATTEMPT');
    assert.equal(second.execute('payment', 'new-id', payment).reason, 'INVOICE_ALREADY_PAID');
    assert.equal(db.prepare('SELECT count(*) n FROM payments').get().n, 1);
  } finally { second.close(); }
});
test('attachment is immutable and byte-bounded', t => {
  const { gate, db } = fixture(t, { maxAttachmentBytes: 2 });
  assert.equal(gate.execute('invoice', 'a', { invoiceId: 'a', content: 'é' }).status, 'simulated');
  assert.equal(gate.execute('invoice', 'b', { invoiceId: 'a', content: 'x' }).reason, 'INVOICE_ALREADY_ATTACHED');
  assert.equal(gate.execute('invoice', 'c', { invoiceId: 'b', content: '€' }).reason, 'ATTACHMENT_LIMIT');
  assert.equal(db.prepare('SELECT content FROM invoices WHERE id=?').get('a').content, 'é');
});
test('real record-write failure rolls back effect and latches unavailable', t => {
  const { gate, db } = fixture(t); attach(gate);
  db.exec("CREATE TRIGGER break_ledger BEFORE INSERT ON ledger BEGIN SELECT RAISE(FAIL, 'fixture failure'); END;");
  assert.equal(gate.execute('payment', 'pay', payment).status, 'unavailable');
  assert.equal(db.prepare('SELECT count(*) n FROM payments').get().n, 0);
  assert.equal(db.prepare('SELECT count(*) n FROM attempts').get().n, 1);
  db.exec('DROP TRIGGER break_ledger');
  assert.equal(gate.execute('payment', 'new', payment).status, 'unavailable');
});
test('real database lock produces no effect', t => {
  const { gate, db } = fixture(t);
  db.exec('BEGIN IMMEDIATE');
  try { assert.equal(attach(gate).status, 'unavailable'); }
  finally { db.exec('ROLLBACK'); }
  assert.equal(db.prepare('SELECT count(*) n FROM invoices').get().n, 0);
});
test('real commit failure returns uncertain and does not retry', t => {
  const { gate, db } = fixture(t);
  // An existing reader allows the write reservation but prevents DELETE-journal commit.
  db.exec('BEGIN'); db.prepare('SELECT * FROM invoices').all();
  try { assert.equal(attach(gate).status, 'uncertain'); }
  finally { db.exec('ROLLBACK'); }
  assert.equal(db.prepare('SELECT count(*) n FROM invoices').get().n, 0);
  assert.equal(attach(gate, 'another', 'next').status, 'unavailable');
});
test('unknown fields and absent call IDs cannot produce effects', t => {
  const { gate, db } = fixture(t);
  assert.equal(gate.execute('invoice', '', { invoiceId: 'a', content: 'x' }).reason, 'MISSING_CALL_ID');
  assert.equal(gate.execute('invoice', 'x', { invoiceId: 'a', content: 'x', path: '/etc/passwd' }).reason, 'INVALID_ACTION');
  assert.equal(db.prepare('SELECT count(*) n FROM invoices').get().n, 0);
});
test('record tampering fails self-consistency verification', t => {
  const { gate, db, path } = fixture(t); attach(gate);
  db.exec("UPDATE ledger SET payload='{}'");
  assert.throws(() => inspectRecords(path));
});
