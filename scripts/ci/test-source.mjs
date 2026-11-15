import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Exercise the real entry point with real Git state; no credentials or network.
const entry = fileURLToPath(new URL('./source.mjs', import.meta.url));
const tempParent = fs.realpathSync(os.tmpdir());
const fixture = fs.mkdtempSync(path.join(tempParent, 'notes-ci-boundary-'));
function git(...args) {
  const result = spawnSync('git', args, { cwd: fixture, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}
function write(file, body) {
  const target = path.join(fixture, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body);
}
function check() {
  const env = { ...process.env };
  delete env.CI; // The observed gap was specifically the local entry point.
  return spawnSync(process.execPath, [entry], { cwd: fixture, env, encoding: 'utf8' });
}
try {
  write('.gitignore', 'output/\n');
  for (const file of ['package.json', 'package-lock.json']) write(file, '{}\n');
  for (const file of ['astro.config.mjs', 'tsconfig.json', 'src/app.mjs', 'scripts/build.mjs', 'public/notes/test.svg']) write(file, 'fixture\n');
  write('content/posts/published.md', '---\nslug: published\nstatus: published\n---\nPublic test post.\n');
  git('init', '-q');
  git('add', '.');
  git('-c', 'user.name=Notes CI test', '-c', 'user.email=ci@example.invalid', 'commit', '-qm', 'fixture');
  const clean = check();
  assert.equal(clean.status, 0, clean.stderr);

  write('scripts/local-only-helper.mjs', 'PRIVATE_FIXTURE_CANARY\n');
  const untracked = check();
  assert.notEqual(untracked.status, 0);
  assert.match(untracked.stderr, /Untracked release\/build input: scripts\/local-only-helper\.mjs/);
  assert.equal(fs.readFileSync(path.join(fixture, 'output/ci/source.json'), 'utf8').includes('local-only-helper'), false);
  fs.unlinkSync(path.join(fixture, 'scripts/local-only-helper.mjs'));

  write('src/app.mjs', 'uncommitted change\n');
  const dirty = check();
  assert.notEqual(dirty.status, 0);
  assert.match(dirty.stderr, /clean checkout, including locally/);
  write('src/app.mjs', 'fixture\n');
  assert.equal(check().status, 0);
  console.log('CI input regressions passed: clean source accepted; local untracked helper and dirty tracked source rejected.');
} finally {
  const resolved = fs.realpathSync(fixture);
  assert.equal(path.dirname(resolved), tempParent);
  assert.ok(path.basename(resolved).startsWith('notes-ci-boundary-'));
  fs.rmSync(resolved, { recursive: true, force: true });
}
