import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8').replaceAll('\r\n', '\n');
try {
  assert.ok(process.argv.slice(2).every(arg => arg === '--write'), 'Only --write is supported');
  const pkg = JSON.parse(read('package.json'));
  const manifest = JSON.parse(read('openclaw.plugin.json'));
  const readme = read('README.md');
  const hook = readme.split('\n')[2];
  const value = label => {
    const match = readme.match(new RegExp(label + ': `([^`]+)`'));
    assert.ok(match, `README missing ${label}`);
    return match[1];
  };
  assert.equal(hook, pkg.description, 'README hook/package description mismatch');
  assert.equal(value('Version'), pkg.version, 'README/package version mismatch');
  assert.equal(value('Version'), manifest.version, 'README/manifest version mismatch');
  assert.equal(value('License'), pkg.license, 'README/package license mismatch');
  assert.deepEqual([value('Category')], manifest.categories, 'README/manifest category mismatch');
  assert.equal(value('Display name'), manifest.name, 'Display name mismatch');
  assert.equal('git+' + value('Repository') + '.git', pkg.repository.url, 'Repository mismatch');
  for (const tool of manifest.contracts.tools) assert.ok(readme.includes('`' + tool + '`'), `Missing tool ${tool}`);
  const topics = JSON.parse(value('Proposed discovery topics'));
  assert.ok(Array.isArray(topics) && topics.length <= 5, 'At most five topics');
  assert.ok(topics.every(t => typeof t === 'string' && t.length > 0 && t.length <= 48 && !/[\p{Cc}\p{Cf}]/u.test(t)), 'Topic length/characters invalid');
  assert.equal(new Set(topics).size, topics.length, 'Duplicate topics');
  assert.ok(readme.includes('![Version](https://img.shields.io/badge/version-' + pkg.version.replaceAll('-', '--') + '-blue)'), 'Version badge drift');
  assert.ok(readme.includes('![License](https://img.shields.io/badge/license-' + pkg.license.replaceAll('-', '--') + '-blue)'), 'License badge drift');
  const fields = [
    ['name', pkg.name, 'Install (literal scoped package name)'],
    ['displayName', value('Display name'), 'Package metadata and authorship'],
    ['summary', hook, 'Opening hook; package.json description'],
    ['readme', 'README.md; sha256:' + createHash('sha256').update(readme).digest('hex'), 'Entire README, including limits and scan qualifier'],
    ['family', value('Family'), 'Package metadata and authorship'],
    ['version', value('Version'), 'Package metadata and authorship'],
    ['license (README only)', value('License'), 'Package metadata and authorship; not a dedicated registry field'],
    ['categories', [value('Category')], 'Package metadata and authorship'],
    ['topics', topics, 'Package metadata and authorship; proposed, not asserted remote state'],
    ['distTags', [value('Release tag')], 'Package metadata and authorship'],
    ['sourceRepo', value('Repository'), 'Package metadata and authorship'],
  ];
  const generated = '| Field | Exact copy/value | README source |\n| --- | --- | --- |\n' + fields.map(([k,v,s]) => `| ${k} | \`${JSON.stringify(v)}\` | ${s} |`).join('\n');
  const pattern = /<!-- fields:start -->\n[\s\S]*?\n<!-- fields:end -->/;
  const listing = read('docs/clawhub-listing.md');
  assert.ok(pattern.test(listing), 'Missing listing markers');
  const expected = '<!-- fields:start -->\n' + generated + '\n<!-- fields:end -->';
  if (process.argv.includes('--write')) {
    writeFileSync(fileURLToPath(new URL('docs/clawhub-listing.md', root)), listing.replace(pattern, () => expected));
    console.log('Updated listing table from checked README metadata.');
  } else assert.equal(listing.match(pattern)[0], expected, 'Listing drift: review README and run npm run check:listing -- --write');
  console.log('PASS: tagline, version, license, category, topics, badges, identity, and full README digest agree.');
} catch (error) { console.error('FAIL: ' + error.message); process.exitCode = 1; }
