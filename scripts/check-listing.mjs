import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8').replace(/\r\n/g, '\n');
const retiredNames = /decision gate|evidence-gated|admission rule|deterministic gate/i;
const semver = '(\\d+\\.\\d+\\.\\d+(?:-[0-9A-Za-z.-]+)?(?:\\+[0-9A-Za-z.-]+)?)';
function markdownFiles(directory) {
  return readdirSync(new URL(directory + '/', root), { withFileTypes: true }).flatMap(entry => {
    const name = directory + '/' + entry.name;
    return entry.isDirectory() ? markdownFiles(name) : entry.isFile() && name.endsWith('.md') ? [name] : [];
  });
}
function commandLines(text) {
  const commands = [];
  let fence;
  let shell = false;
  let continued = '';
  let startLine;
  for (const [index, line] of text.split('\n').entries()) {
    const marker = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
    if (marker && !fence) {
      fence = marker[1];
      shell = /^(?:sh|bash|shell|zsh|console|powershell|ps1|cmd|bat)?$/i.test(marker[2].trim());
      continue;
    }
    if (marker && marker[1][0] === fence?.[0] && marker[1].length >= fence.length && !marker[2].trim()) {
      if (continued) commands.push([startLine, continued]);
      fence = undefined; shell = false; continued = ''; continue;
    }
    if (fence) {
      if (!shell) continue;
      if (!continued) startLine = index + 1;
      continued += line.replace(/\\\s*$/, ' ') + ' ';
      if (/\\\s*$/.test(line)) continue;
      commands.push([startLine, continued]); continued = '';
    } else {
      for (const match of line.matchAll(/`([^`\n]+)`/g)) {
        if (/^(?:\$\s*)?(?:openclaw|clawhub|npm|pnpm|yarn|git)\s/.test(match[1])) {
          commands.push([index + 1, match[1]]);
        }
      }
    }
  }
  return commands;
}
function checkCommandPins(name, text, pkg) {
  const packagePin = new RegExp('^' + semver);
  const archivePin = new RegExp('^' + semver + '\\.tgz');
  const archivePrefix = pkg.name.replace(/^@/, '').replace('/', '-') + '-';
  for (const [line, command] of commandLines(text)) {
    const pins = [];
    for (const [prefix, pattern] of [[pkg.name + '@', packagePin], [archivePrefix, archivePin]]) {
      for (const fragment of command.split(prefix).slice(1)) {
        const match = fragment.match(pattern);
        if (match) pins.push(match[1]);
      }
    }
    if (command.includes(pkg.name)) {
      pins.push(...[...command.matchAll(new RegExp('--version(?:=|\\s+)["\x27]?' + semver, 'g'))].map(match => match[1]));
    }
    // Git release tags in these documents refer to this repository, not the host version.
    if (/\bgit\s+(?:checkout|switch|show|rev-parse)\b/.test(command)) {
      pins.push(...[...command.matchAll(new RegExp('(?:^|\\s)v' + semver, 'g'))].map(match => match[1]));
    }
    for (const version of pins) assert.equal(version, pkg.version, `${name}:${line}: command version ${version} differs from package.json ${pkg.version}`);
  }
}
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
  assert.ok(pkg.description.endsWith('This release gates two demo tools, not your real ones.'), 'Description must retain reviewed own-tools scope');
  assert.ok(!retiredNames.test(pkg.description), 'Retired mechanism name in summary');
  const docs = ['README.md', 'GITHUB_ABOUT.md', ...markdownFiles('docs')];
  for (const name of docs) {
    const content = read(name);
    const lines = content.split('\n');
    for (const [index, line] of lines.entries()) {
      const heading = /^\s*#{1,6}\s/.test(line) || (line.trim() && /^ {0,3}(?:=+|-+)\s*$/.test(lines[index + 1] ?? ''));
      if (heading) assert.ok(!retiredNames.test(line), `${name}: retired mechanism name in heading`);
    }
    checkCommandPins(name, content, pkg);
  }
  assert.ok(!/finance/i.test(pkg.description.split(':')[0]), 'Description lead must not use finance');
  assert.equal(pkg.version, manifest.version, 'Package/manifest version mismatch');
  for (const entry of [lock, lock.packages['']]) {
    assert.equal(entry.name, pkg.name, 'Lockfile name mismatch');
    assert.equal(entry.version, pkg.version, 'Lockfile version mismatch');
  }
  assert.ok(readme.startsWith('# ' + manifest.name + ' — a pre-execution gate for OpenClaw tool calls\n'), 'Display name/mechanism title mismatch');
  assert.ok(readme.includes('openclaw plugins install clawhub:' + pkg.name), 'Registry installation command missing');
  assert.ok(readme.includes('`' + manifest.id + '`'), 'Runtime ID missing');
  for (const tool of manifest.contracts.tools) assert.ok(readme.includes('`' + tool + '`'), `Missing tool ${tool}`);
  assert.ok(listing.includes('The exact manifest contracts are `' + JSON.stringify(manifest.contracts) + '`'), 'Manifest contracts drift');
  const topics = JSON.parse(value('Proposed discovery topics'));
  assert.ok(Array.isArray(topics) && topics.length <= 5, 'At most five topics');
  assert.ok(topics.every(t => typeof t === 'string' && t.length > 0 && t.length <= 48 && !/[\p{Cc}\p{Cf}]/u.test(t)), 'Topic length/characters invalid');
  assert.equal(new Set(topics).size, topics.length, 'Duplicate topics');
  const about = read('GITHUB_ABOUT.md');
  const aboutTopics = about.match(/Topics: `([^`]+)`/);
  assert.ok(aboutTopics, 'GitHub About topics missing');
  assert.deepEqual(JSON.parse(aboutTopics[1]), topics, 'GitHub/ClawHub topics drift');
  assert.ok(about.split('\n\n')[1].includes('pre-execution gate'), 'GitHub About mechanism missing');
  assert.ok(readme.includes('![Version](https://img.shields.io/badge/version-' + pkg.version.replace(/-/g, '--') + '-blue)'), 'Version badge drift');
  assert.ok(readme.includes('![License](https://img.shields.io/badge/license-' + pkg.license.replace(/-/g, '--') + '-blue)'), 'License badge drift');
  const fields = [
    ['name', pkg.name, 'Install; package.json name'],
    ['displayName', manifest.name, 'Title; openclaw.plugin.json name'],
    ['summary', pkg.description, 'Reviewed hook plus What it does and limitations; package.json description'],
    ['readme', 'README.md; sha256:' + createHash('sha256').update(readme).digest('hex'), 'Entire README, including opening hook, scope and record limitations'],
    ['family', value('Family'), 'Listing release input; plugin implementation described in README'],
    ['version', pkg.version, 'Version badge and Install; both manifests and lockfile'],
    ['license (README only)', pkg.license, 'License badge; package.json license; no dedicated registry field established'],
    ['categories', manifest.categories, 'openclaw.plugin.json categories; listing metadata, no separate README block'],
    ['topics', topics, 'Founder-approved labels for What it does and Results and reasons; listing release input'],
    ['distTags', [value('Release tag')], 'Listing release input; not a statement of registry state'],
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
  console.log('PASS: reviewed copy, terminology, command pins, topic limits/alignment, version, license, category, badges, identity, contracts, lockfile, packed icon and full README digest agree.');
} catch (error) { console.error('FAIL: ' + error.message); process.exitCode = 1; }
