import { DatabaseSync } from 'node:sqlite';
import { digest } from './config.js';
export function inspectRecords(path) {
  const db = new DatabaseSync(path, { readOnly: true });
  try {
    const rows = db.prepare('SELECT seq,previous,hash,payload FROM ledger ORDER BY seq').all();
    let previous = '0'.repeat(64);
    for (const [index, row] of rows.entries()) {
      const payload = JSON.parse(row.payload);
      if (row.seq !== index + 1 || row.previous !== previous || payload.sequence !== row.seq
        || payload.format !== 'dgr-sandbox/1' || payload.sandbox !== true
        || row.hash !== digest(JSON.stringify(['dgr-ledger/1', previous, row.payload]))) {
        throw new Error('Sandbox record chain is inconsistent.');
      }
      previous = row.hash;
    }
    return { format: 'dgr-sandbox-records/1', verification: 'self-consistency-only',
      completeness: 'not-established-without-trusted-external-anchor', count: rows.length, head: previous,
      records: rows.map(row => JSON.parse(row.payload)) };
  } finally { db.close(); }
}
