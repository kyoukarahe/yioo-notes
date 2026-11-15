import assert from 'node:assert/strict';
import fs from 'node:fs';
import { walk } from './lib.mjs';

// Copy only explicit public report products; never upload the checkout or raw logs.
const allowed = ['release.json', 'browser.json', 'docker.json'];
fs.mkdirSync('output/artifacts', { recursive: true });
for (const name of allowed) if (fs.existsSync(`output/ci/${name}`)) fs.copyFileSync(`output/ci/${name}`, `output/artifacts/${name}`);
if (fs.existsSync('output/ci/screens')) {
  fs.mkdirSync('output/artifacts/screens', { recursive: true });
  for (const name of walk('output/ci/screens')) {
    assert.match(name, /^(1440|390)-(index|guide|guide-en|materials|relief)\.png$/);
    fs.copyFileSync(`output/ci/screens/${name}`, `output/artifacts/screens/${name}`);
  }
}
const files = walk('output/artifacts');
for (const name of files) assert.ok(allowed.includes(name) || /^screens\/(1440|390)-(index|guide|guide-en|materials|relief)\.png$/.test(name));
const bytes = files.reduce((sum, name) => sum + fs.statSync(`output/artifacts/${name}`).size, 0);
assert.ok(bytes <= 20 * 1024 * 1024, `Report limit exceeded: ${bytes}`);
console.log(`Artifact boundary passed: ${files.length} files, ${bytes} bytes (20 MiB/job limit).`);
