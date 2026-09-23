import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const mutants = [
  ['payment-limit', 'action.amountMinor > this.#policy.maxPaymentMinor', 'false'],
  ['destination', '!this.#policy.allowedDestinations.includes(action.destination)', 'false'],
  ['invoice-evidence', "!this.#db.prepare('SELECT id FROM invoices WHERE id=?').get(action.invoiceId)", 'false'],
  ['attachment-limit', 'action.byteLength > this.#policy.maxAttachmentBytes', 'false'],
  ['fault-latch', 'if (this.#unavailable) return', 'if (false) return'],
  ['invoice-replay-reason', 'reason = REASONS.INVOICE_ALREADY_PAID', 'reason = REASONS.ALLOWED'],
];
function run(root) {
  return spawnSync(process.execPath, ['--test', 'test/gate.test.js'], { cwd: root, encoding: 'utf8', timeout: 30000 });
}
const baseline = run(process.cwd());
assert.equal(baseline.status, 0, baseline.stdout + baseline.stderr);
let killed = 0;
for (const [name, before, after] of mutants) {
  const dir = mkdtempSync(join(tmpdir(), 'dgr-mutant-'));
  try {
    cpSync('src', join(dir, 'src'), { recursive: true });
    cpSync('test', join(dir, 'test'), { recursive: true });
    cpSync('package.json', join(dir, 'package.json'));
    const path = join(dir, 'src/gate.js'); const source = readFileSync(path, 'utf8');
    assert.equal(source.split(before).length - 1, 1, `Mutation ${name} must target exactly once.`);
    writeFileSync(path, source.replace(before, after));
    const result = run(dir);
    const syntax = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
    assert.equal(syntax.status, 0, syntax.stderr);
    assert.equal(result.signal, null, `Mutation ${name} must not be killed by timeout/signal.`);
    assert.notEqual(result.status, 0, `SURVIVED: ${name}`);
    assert.match(result.stdout + result.stderr, /AssertionError|ERR_ASSERTION/, `Not an assertion kill: ${name}`);
    console.log(`KILLED ${name}`); killed++;
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
console.log(`${killed}/${mutants.length} mutants killed; baseline passed.`);
