import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { performance } from 'node:perf_hooks';
import { digest, parseConfig } from './config.js';
import { parseAction } from './actions.js';

const ZERO = '0'.repeat(64);
const DEADLINE_MS = 1000;
export const STATUS = Object.freeze({
  SIMULATED: 'simulated',
  DENIED: 'denied',
  UNAVAILABLE: 'unavailable',
  UNCERTAIN: 'uncertain',
});
export const REASONS = Object.freeze({
  ALLOWED: 'ALLOWED',
  STORE_UNAVAILABLE: 'STORE_UNAVAILABLE',
  MISSING_CALL_ID: 'MISSING_CALL_ID',
  DUPLICATE_ATTEMPT: 'DUPLICATE_ATTEMPT',
  INVALID_ACTION: 'INVALID_ACTION',
  AMOUNT_LIMIT: 'AMOUNT_LIMIT',
  DESTINATION_NOT_ALLOWED: 'DESTINATION_NOT_ALLOWED',
  INVOICE_REQUIRED: 'INVOICE_REQUIRED',
  INVOICE_ALREADY_PAID: 'INVOICE_ALREADY_PAID',
  ATTACHMENT_LIMIT: 'ATTACHMENT_LIMIT',
  INVOICE_ALREADY_ATTACHED: 'INVOICE_ALREADY_ATTACHED',
  DEADLINE_EXCEEDED: 'DEADLINE_EXCEEDED',
  STORE_FAILURE: 'STORE_FAILURE',
});
export class SandboxGate {
  #db; #policy; #unavailable = false;
  constructor(path, config = {}) {
    this.#policy = parseConfig(config);
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    this.#db = new DatabaseSync(path);
    try {
      this.#db.exec('PRAGMA busy_timeout=500; PRAGMA journal_mode=DELETE; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON;');
      const version = this.#db.prepare('PRAGMA user_version').get().user_version;
      if (version !== 0 && version !== 1) throw new Error('Unsupported sandbox database version.');
      this.#db.exec(`BEGIN IMMEDIATE;
        CREATE TABLE IF NOT EXISTS attempts (id TEXT PRIMARY KEY, action_hash TEXT NOT NULL, policy_hash TEXT NOT NULL, result TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS invoices (id TEXT PRIMARY KEY, content TEXT NOT NULL, content_hash TEXT NOT NULL, byte_length INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS payments (invoice_id TEXT PRIMARY KEY REFERENCES invoices(id), destination TEXT NOT NULL, amount_minor INTEGER NOT NULL, currency TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS ledger (seq INTEGER PRIMARY KEY, previous TEXT NOT NULL, hash TEXT NOT NULL, payload TEXT NOT NULL);
        PRAGMA user_version=1; COMMIT;`);
    } catch (error) {
      this.#db.close(); throw error;
    }
  }
  execute(kind, callId, input) {
    if (this.#unavailable) return { status: STATUS.UNAVAILABLE, reason: REASONS.STORE_UNAVAILABLE, sandbox: true };
    const start = performance.now();
    if (typeof callId !== 'string' || callId.length < 1 || callId.length > 1024) {
      return { status: STATUS.DENIED, reason: REASONS.MISSING_CALL_ID, sandbox: true, recorded: false };
    }
    const attempt = digest(JSON.stringify(['dgr-attempt/1', callId]));
    let action;
    try { action = parseAction(kind, input); } catch { /* Invalid inputs are recorded without raw payloads. */ }
    let transaction = false;
    let commitStarted = false;
    try {
      this.#db.exec('BEGIN IMMEDIATE'); transaction = true;
      let reason = REASONS.ALLOWED;
      const existing = this.#db.prepare('SELECT id FROM attempts WHERE id=?').get(attempt);
      if (existing) reason = REASONS.DUPLICATE_ATTEMPT;
      else if (!action) reason = REASONS.INVALID_ACTION;
      else if (action.kind === 'payment') {
        if (action.amountMinor > this.#policy.maxPaymentMinor) reason = REASONS.AMOUNT_LIMIT;
        else if (!this.#policy.allowedDestinations.includes(action.destination)) reason = REASONS.DESTINATION_NOT_ALLOWED;
        else if (!this.#db.prepare('SELECT id FROM invoices WHERE id=?').get(action.invoiceId)) reason = REASONS.INVOICE_REQUIRED;
        else if (this.#db.prepare('SELECT invoice_id FROM payments WHERE invoice_id=?').get(action.invoiceId)) reason = REASONS.INVOICE_ALREADY_PAID;
      } else if (action.byteLength > this.#policy.maxAttachmentBytes) reason = REASONS.ATTACHMENT_LIMIT;
      else if (this.#db.prepare('SELECT id FROM invoices WHERE id=?').get(action.invoiceId)) reason = REASONS.INVOICE_ALREADY_ATTACHED;
      if (reason === REASONS.ALLOWED && performance.now() - start >= DEADLINE_MS) reason = REASONS.DEADLINE_EXCEEDED;
      if (!existing) this.#db.prepare('INSERT INTO attempts VALUES (?,?,?,?)').run(attempt, action?.hash ?? ZERO, this.#policy.hash, reason);
      // Effect and record share this transaction. There is no external effect or authority-returning API.
      if (reason === 'ALLOWED') {
        if (action.kind === 'invoice') {
          this.#db.prepare('INSERT INTO invoices VALUES (?,?,?,?)').run(action.invoiceId, action.content, action.contentHash, action.byteLength);
        } else {
          this.#db.prepare('INSERT INTO payments VALUES (?,?,?,?)').run(action.invoiceId, action.destination, action.amountMinor, action.currency);
        }
      }
      const previous = this.#db.prepare('SELECT seq,hash FROM ledger ORDER BY seq DESC LIMIT 1').get();
      const seq = (previous?.seq ?? 0) + 1;
      const prior = previous?.hash ?? ZERO;
      const payload = JSON.stringify({ format: 'dgr-sandbox/1', sequence: seq, attempt,
        action: action?.hash ?? ZERO, policy: this.#policy.hash, reason,
        status: reason === REASONS.ALLOWED ? STATUS.SIMULATED : STATUS.DENIED, sandbox: true });
      const hash = digest(JSON.stringify(['dgr-ledger/1', prior, payload]));
      this.#db.prepare('INSERT INTO ledger VALUES (?,?,?,?)').run(seq, prior, hash, payload);
      // Slow database work cannot publish an allowed effect after the admission budget expires.
      if (reason === REASONS.ALLOWED && performance.now() - start >= DEADLINE_MS) {
        this.#db.exec('ROLLBACK'); transaction = false;
        this.#unavailable = true;
        return { status: STATUS.UNAVAILABLE, reason: REASONS.DEADLINE_EXCEEDED, sandbox: true, recorded: false };
      }
      commitStarted = true;
      this.#db.exec('COMMIT'); transaction = false;
      return { status: reason === REASONS.ALLOWED ? STATUS.SIMULATED : STATUS.DENIED, reason, sandbox: true,
        recorded: true, receipt: { sequence: seq, hash }, invoiceId: action?.invoiceId ?? null };
    } catch {
      if (transaction) { try { this.#db.exec('ROLLBACK'); } catch { /* Preserve unavailable state. */ } }
      this.#unavailable = true;
      // A commit failure may have an ambiguous durable outcome. Never automatically retry.
      return { status: commitStarted ? STATUS.UNCERTAIN : STATUS.UNAVAILABLE, reason: REASONS.STORE_FAILURE, sandbox: true, recorded: false };
    }
  }
  close() { this.#unavailable = true; this.#db.close(); }
}
