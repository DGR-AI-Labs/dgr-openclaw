import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import plugin from '../src/index.js';
// These are explicitly mock-host contract tests. Installed tests are separate.
function host(t) {
  const root = mkdtempSync(join(tmpdir(), 'dgr-plugin-')); const tools = []; const services = [];
  t.after(() => { services.forEach(s => s.stop()); rmSync(root, { recursive: true, force: true }); });
  plugin.register({ pluginConfig: {}, runtime: { state: { resolveStateDir: () => root } },
    registerTool: tool => tools.push(tool), registerService: service => services.push(service) });
  return { root, tools, services };
}
test('mock-host: exactly two tool registrations, real gate and lifecycle', async t => {
  const { tools, services } = host(t);
  assert.deepEqual(tools.map(t => t.name), ['dgr_sandbox_payment', 'dgr_invoice_attachment']);
  assert.equal((await tools[1].execute('a', { invoiceId: 'demo', content: 'synthetic' })).details.status, 'simulated');
  assert.equal((await tools[0].execute('b', { invoiceId: 'demo', destination: 'sandbox-vendor', currency: 'USD', amountMinor: 1001 })).details.reason, 'AMOUNT_LIMIT');
  services[0].stop();
  assert.equal((await tools[1].execute('c', { invoiceId: 'other', content: 'x' })).details.status, 'unavailable');
});
test('mock-host: unavailable storage fails closed', async t => {
  const { root, tools } = host(t);
  writeFileSync(join(root, 'dgr-sandbox'), 'not a directory');
  assert.equal((await tools[1].execute('a', { invoiceId: 'a', content: 'x' })).details.status, 'unavailable');
});
