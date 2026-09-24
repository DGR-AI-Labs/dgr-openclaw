import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8').replace(/\r\n/g, '\n');
try {
  assert.ok(process.argv.slice(2).every(arg => arg === '--write'), 'Only --write is supported');
  const pkg = JSON.parse(read('package.json'));
  const lock = JSON.parse(read('package-lock.json'));
  const manifest = JSON.parse(read('openclaw.plugin.json'));
  const readme = read('README.md');
  const listing = read('docs/clawhub-listing.md');
  const icon = readFileSync(new URL('assets/icon.png', root));
  assert.ok(icon.length > 0 && icon.length <= 512 * 1024, 'Icon missing, empty or over 512 KiB');
  const packed = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: fileURLToPath(root), encoding: 'utf8' }))[0];
  assert.ok(packed.files.some(file => file.path === 'assets/icon.png' && file.size === icon.length), 'Icon absent from package or wrong size');
  const metadataPatterns = new Map([
    ['Family', /Family: `([^`]+)`/],
    ['Proposed discovery topics', /Proposed discovery topics: `([^`]+)`/],
    ['Release tag', /Release tag: `([^`]+)`/],
    ['Reviewed hook', /Reviewed hook: `([^`]+)`/],
    ['Reviewed description', /Reviewed description: `([^`]+)`/],
  ]);
  const value = label => {
    assert.ok(metadataPatterns.has(label), `Unknown metadata label ${label}`);
    const match = listing.match(metadataPatterns.get(label));
    assert.ok(match, `Listing missing ${label}`);
    return match[1];
  };
  const hook = readme.split('\n\n')[1];
  assert.equal(hook, value('Reviewed hook'), 'README hook differs from reviewed copy pairing');
  assert.equal(pkg.description, value('Reviewed description'), 'Description differs from reviewed README hook pairing');
  assert.ok(pkg.description.length < 220, 'Description must be under 220 characters');
  assert.ok(!readme.includes(pkg.description), 'Description duplicated verbatim in README');
  assert.ok(readme.trimEnd().split('\n').length <= 130, 'README exceeds 130 lines');
  assert.ok(pkg.description.endsWith('Two synthetic sandbox tools in this release.'), 'Description must retain reviewed scope clause');
  assert.ok(!/finance/i.test(pkg.description.split(':')[0]), 'Description lead must not use finance');
  assert.equal(pkg.version, manifest.version, 'Package/manifest version mismatch');
  for (const entry of [lock, lock.packages['']]) {
    assert.equal(entry.name, pkg.name, 'Lockfile name mismatch');
    assert.equal(entry.version, pkg.version, 'Lockfile version mismatch');
  }
  assert.ok(readme.startsWith('# ' + manifest.name + ' for OpenClaw\n'), 'Display name mismatch');
  assert.ok(readme.includes('clawhub:' + pkg.name + '@' + pkg.version), 'Pinned install mismatch');
  assert.ok(readme.includes('`' + manifest.id + '`'), 'Runtime ID missing');
  for (const tool of manifest.contracts.tools) assert.ok(readme.includes('`' + tool + '`'), `Missing tool ${tool}`);
  assert.ok(listing.includes('The exact manifest contracts are `' + JSON.stringify(manifest.contracts) + '`'), 'Manifest contracts drift');
  const topics = JSON.parse(value('Proposed discovery topics'));
  assert.ok(Array.isArray(topics) && topics.length <= 5, 'At most five topics');
  assert.ok(topics.every(t => typeof t === 'string' && t.length > 0 && t.length <= 48 && !/[\p{Cc}\p{Cf}]/u.test(t)), 'Topic length/characters invalid');
  assert.equal(new Set(topics).size, topics.length, 'Duplicate topics');
  assert.ok(readme.includes('![Version](https://img.shields.io/badge/version-' + pkg.version.replace(/-/g, '--') + '-blue)'), 'Version badge drift');
  assert.ok(readme.includes('![License](https://img.shields.io/badge/license-' + pkg.license.replace(/-/g, '--') + '-blue)'), 'License badge drift');
  const fields = [
    ['name', pkg.name, 'Install; package.json name'],
    ['displayName', manifest.name, 'Title; openclaw.plugin.json name'],
    ['summary', pkg.description, 'Reviewed hook plus What it does and limitations; package.json description'],
    ['readme', 'README.md; sha256:' + createHash('sha256').update(readme).digest('hex'), 'Entire README, including opening hook, limits and scan qualifier'],
    ['family', value('Family'), 'Listing release input; plugin implementation described in README'],
    ['version', pkg.version, 'Version badge and Install; both manifests and lockfile'],
    ['license (README only)', pkg.license, 'License badge; package.json license; no dedicated registry field established'],
    ['categories', manifest.categories, 'openclaw.plugin.json categories; listing metadata, no separate README block'],
    ['topics', topics, 'Founder-approved labels for What it does and Results and reasons; listing release input'],
    ['distTags', [value('Release tag')], 'Install latest-release qualifier; listing release input'],
    ['icon', 'assets/icon.png; sha256:' + createHash('sha256').update(icon).digest('hex') + '; bytes:' + icon.length, 'Bundled asset; generated by scripts/build-icon.mjs; not additional scope copy'],
    ['sourceRepo', pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, ''), 'README repository links; package.json repository'],
  ];
  const generated = '| Field | Exact copy/value | README / defining source |\n| --- | --- | --- |\n' + fields.map(([k,v,s]) => '| ' + k + ' | `' + JSON.stringify(v) + '` | ' + s + ' |').join('\n');
  const pattern = new RegExp('<!-- fields:start -->\\n[\\s\\S]*?\\n<!-- fields:end -->');
  assert.ok(pattern.test(listing), 'Missing listing markers');
  const expected = '<!-- fields:start -->\n' + generated + '\n<!-- fields:end -->';
  if (process.argv.includes('--write')) {
    writeFileSync(fileURLToPath(new URL('docs/clawhub-listing.md', root)), listing.replace(pattern, () => expected));
    console.log('Updated listing table from README, manifests and reviewed release inputs.');
  } else assert.equal(listing.match(pattern)[0], expected, 'Listing drift: review sources and run npm run check:listing -- --write');
  console.log('PASS: summary, version, license, category, topics, badges, identity, contracts, lockfile, packed icon and full README digest agree.');
} catch (error) { console.error('FAIL: ' + error.message); process.exitCode = 1; }
