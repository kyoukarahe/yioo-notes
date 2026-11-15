import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

export const root = process.cwd();
export function walk(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    assert.ok(!entry.isSymbolicLink(), `Symlink not permitted: ${prefix}${entry.name}`);
    const name = `${prefix}${entry.name}`;
    return entry.isDirectory() ? walk(path.join(dir, entry.name), `${name}/`) : [name];
  }).sort();
}
export const hash = value => crypto.createHash('sha256').update(value).digest('hex');
export const fileHash = file => hash(fs.readFileSync(file));
export function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', shell: false });
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed: ${result.error ?? result.status}`);
}
export function node(script, ...args) { run(process.execPath, [script, ...args]); }
export function json(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}
export function rendererArg() {
  const value = process.argv[process.argv.indexOf('--renderer') + 1];
  assert.ok(['astro', 'manual'].includes(value), 'Use --renderer astro|manual');
  return value;
}
