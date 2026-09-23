import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomBytes } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { once } from 'node:events';

// This test fails when the pinned installed host is unavailable; it never silently skips.
test('packed plugin installs and enforces through real OpenClaw HTTP tool dispatch', { timeout: 180000 }, async () => {
  const root = mkdtempSync(join(tmpdir(), 'dgr-installed-'));
  const state = join(root, 'state'); mkdirSync(state);
  const home = join(root, 'home'); mkdirSync(home);
  const env = { ...process.env, HOME: home, OPENCLAW_STATE_DIR: state,
    OPENCLAW_CONFIG_PATH: join(state, 'openclaw.json'), OPENCLAW_SKIP_CHANNELS: '1' };
  const run = (name, args, extra = {}) => execFileSync(name, args, { env, timeout: 90000, encoding: 'utf8', ...extra });
  let gateway; let output = '';
  const token = randomBytes(24).toString('hex');
  try {
    const version = run('openclaw', ['--version']);
    assert.match(version, /2026\.9\.5/);
    console.log('HOST', version.trim());
    const packed = JSON.parse(run('npm', ['pack', '--json', '--pack-destination', root]))[0];
    const archive = join(root, packed.filename);
    console.log('PACKAGE', packed.integrity);
    writeFileSync(env.OPENCLAW_CONFIG_PATH, JSON.stringify({
      gateway: { mode: 'local', bind: 'loopback', port: 18789, auth: { mode: 'token', token } },
      tools: { allow: ['dgr_sandbox_payment', 'dgr_invoice_attachment'] },
    }));
    console.log(run('openclaw', ['plugins', 'install', archive, '--force', '--accept-capabilities']));
    const config = JSON.parse(readFileSync(env.OPENCLAW_CONFIG_PATH));
    config.plugins ??= {}; config.plugins.allow = ['dgr-sandbox'];
    config.plugins.entries ??= {}; config.plugins.entries['dgr-sandbox'] = { enabled: true, config: {} };
    writeFileSync(env.OPENCLAW_CONFIG_PATH, JSON.stringify(config));
    const inspection = run('openclaw', ['plugins', 'inspect', 'dgr-sandbox', '--runtime', '--json']);
    console.log('RUNTIME_INSPECTION', inspection);
    assert.match(inspection, /dgr_sandbox_payment/);
    assert.match(inspection, /dgr_invoice_attachment/);
    gateway = spawn('openclaw', ['gateway', 'run', '--allow-unconfigured'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
    gateway.stdout.on('data', b => { output += b; });
    gateway.stderr.on('data', b => { output += b; });
    const url = 'http://127.0.0.1:18789';
    let ready = false;
    for (let i = 0; i < 180; i++) {
      if (gateway.exitCode !== null) throw new Error(`Gateway exited: ${output}`);
      try { const response = await fetch(url + '/health', { signal: AbortSignal.timeout(500) }); if (response.ok) { ready = true; break; } } catch { /* Retry readiness while the isolated host starts. */ }
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    assert.ok(ready, `Gateway did not start: ${output}`);
    async function invoke(tool, args, id) {
      const response = await fetch(url + '/tools/invoke', { method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, args, idempotencyKey: id }), signal: AbortSignal.timeout(15000) });
      const body = await response.json();
      assert.equal(response.status, 200, JSON.stringify(body));
      assert.equal(body.ok, true, JSON.stringify(body));
      // JSON.stringify above formats assertion messages; content[0] is a fixed array index, not a generated key.
      // nosemgrep: no-stringify-keys
      const result = body.result.details ?? JSON.parse(body.result.content[0].text);
      console.log('INVOKED', tool, id, result.status, result.reason);
      return result;
    }
    assert.equal((await invoke('dgr_invoice_attachment', { invoiceId: 'demo', content: 'Synthetic example' }, 'attach-demo')).status, 'simulated');
    const payment = { invoiceId: 'demo', destination: 'sandbox-vendor', currency: 'USD', amountMinor: 500 };
    assert.equal((await invoke('dgr_sandbox_payment', { ...payment, amountMinor: 2000 }, 'over-limit')).reason, 'AMOUNT_LIMIT');
    assert.equal((await invoke('dgr_sandbox_payment', payment, 'pay-demo')).status, 'simulated');
    assert.equal((await invoke('dgr_sandbox_payment', payment, 'pay-demo')).reason, 'DUPLICATE_ATTEMPT');
    assert.equal((await invoke('dgr_sandbox_payment', payment, 'pay-again')).reason, 'INVOICE_ALREADY_PAID');
    const db = new DatabaseSync(join(state, 'dgr-sandbox', 'sandbox.sqlite'));
    try {
      assert.equal(db.prepare('SELECT count(*) n FROM payments').get().n, 1);
      assert.equal(db.prepare('SELECT count(*) n FROM invoices').get().n, 1);
      assert.equal(db.prepare('SELECT count(*) n FROM ledger').get().n, 5);
      db.exec("CREATE TRIGGER fail_records BEFORE INSERT ON ledger BEGIN SELECT RAISE(FAIL, 'synthetic installed failure'); END;");
      assert.equal((await invoke('dgr_invoice_attachment', { invoiceId: 'fault', content: 'synthetic' }, 'fault-call')).status, 'unavailable');
      assert.equal(db.prepare('SELECT count(*) n FROM invoices').get().n, 1);
      db.exec('DROP TRIGGER fail_records');
      assert.equal((await invoke('dgr_invoice_attachment', { invoiceId: 'later', content: 'synthetic' }, 'latched-call')).status, 'unavailable');
      assert.equal(db.prepare('SELECT count(*) n FROM ledger').get().n, 5);
    } finally { db.close(); }
  } finally {
    if (gateway && gateway.exitCode === null) {
      const ended = once(gateway, 'exit'); gateway.kill('SIGTERM');
      const killTimer = setTimeout(() => gateway.kill('SIGKILL'), 10000);
      await ended; clearTimeout(killTimer);
    }
    console.log('GATEWAY_LOG', output.replaceAll(token, '[redacted test token]'));
    rmSync(root, { recursive: true, force: true });
  }
});
