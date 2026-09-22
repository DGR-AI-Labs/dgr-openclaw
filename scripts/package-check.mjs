import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { configSchema } from '../src/config.js';
const manifest = JSON.parse(readFileSync('openclaw.plugin.json'));
assert.deepEqual(manifest.configSchema, configSchema);
assert.deepEqual(manifest.contracts.tools, ['dgr_sandbox_payment', 'dgr_invoice_attachment']);
const packed = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json'], { encoding: 'utf8' }))[0];
const exact = new Set(['package.json', 'openclaw.plugin.json', 'README.md', 'LICENSE', 'SECURITY.md',
  'src/index.js', 'src/config.js', 'src/actions.js', 'src/gate.js', 'src/records.js',
  'src/modules/payment.js', 'src/modules/invoice.js']);
for (const file of packed.files) assert.ok(exact.delete(file.path), `Unexpected archive file: ${file.path}`);
assert.equal(exact.size, 0, `Missing files: ${[...exact].join(', ')}`);
console.log(JSON.stringify({ status: 'PASS', files: packed.files.map(f => f.path), bytes: packed.size }));
