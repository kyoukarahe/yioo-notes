// Run before Docker: only tracked, explicitly published source enters a release.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';
import { walk, fileHash, json } from './lib.mjs';

const inputs = ['package.json', 'package-lock.json', 'astro.config.mjs', 'tsconfig.json',
  ...['src', 'scripts', 'content/posts', 'public/notes'].flatMap(dir => walk(dir).map(file => `${dir}/${file}`))];
const tracked = new Set(execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0'));
for (const file of inputs.filter(file => file.startsWith('content/') || file.startsWith('public/'))) {
  assert.ok(tracked.has(file), `Untracked public release input: ${file}`);
}
const posts = [];
for (const file of inputs.filter(file => file.startsWith('content/posts/') && file.endsWith('.md'))) {
  const { data } = matter(fs.readFileSync(file, 'utf8'));
  assert.equal(data.status, 'published', `Explicit published status required: ${file}`);
  assert.match(data.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(!posts.includes(data.slug), `Duplicate slug: ${data.slug}`);
  posts.push(data.slug);
}
assert.ok(posts.length > 0);
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const dirty = execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], { encoding: 'utf8' }).trim().length > 0;
if (process.env.CI) assert.equal(dirty, false, 'Hosted CI must start with a clean checkout');
json('output/ci/source.json', { commit, dirty, posts: posts.sort(), files: Object.fromEntries(inputs.map(file => [file, fileHash(file)])) });
console.log(`Source boundary passed: ${posts.length} published posts, ${inputs.length} input files, ${commit}, dirty=${dirty}`);
