import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { node, json, walk, fileHash, rendererArg } from './lib.mjs';

const started = performance.now();
const renderer = rendererArg();
const source = JSON.parse(fs.readFileSync('output/ci/source.json', 'utf8'));
for (const [file, digest] of Object.entries(source.files)) assert.equal(fileHash(file), digest, `Input changed: ${file}`);
for (const excluded of ['content/drafts', 'content/private', '.env', '_workspace']) {
  if (process.env.NOTES_DOCKER_BUILD) assert.equal(fs.existsSync(excluded), false, `Excluded Docker input: ${excluded}`);
}
node('node_modules/@astrojs/check/bin/astro-check.js');
node('scripts/test-security.mjs', '--portable');
for (const name of ['guide-steps', 'image-compare', 'languages']) node(`scripts/test-${name}.mjs`);
if (renderer === 'astro') {
  node('scripts/sync-styles.mjs');
  node('scripts/astro-build.mjs');
  node('scripts/verify-build.mjs');
} else node('scripts/publish-posts.mjs');

const files = walk('dist/notes');
const forbidden = /(^|\/)(?:drafts|private|_workspace|node_modules|\.git|\.env(?:\..*)?)(\/|$)/i;
const extensions = new Set(['.html', '.xml', '.json', '.css', '.js', '.png', '.webp', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2', '.avif', '.gif']);
for (const file of files) {
  assert.ok(!forbidden.test(file), `Private artifact path: ${file}`);
  assert.ok(extensions.has(path.extname(file)), `Unexpected artifact type: ${file}`);
  if (file.endsWith('/index.html') && !file.startsWith('categories/') && !file.startsWith('tags/')) {
    assert.ok(source.posts.includes(file.slice(0, -'/index.html'.length)), `Unexpected post output: ${file}`);
  }
}
for (const slug of source.posts) assert.ok(files.includes(`${slug}/index.html`), `Missing post ${slug}`);
json('output/ci/release.json', {
  commit: source.commit, dirty: source.dirty, renderer, node: process.version, posts: source.posts,
  elapsedSeconds: Math.round((performance.now() - started) / 100) / 10,
  bytes: files.reduce((sum, file) => sum + fs.statSync(`dist/notes/${file}`).size, 0),
  files: Object.fromEntries(files.map(file => [file, fileHash(`dist/notes/${file}`)])),
});
console.log(`Verified ${renderer} release: ${files.length} files. No AWS operations executed.`);
