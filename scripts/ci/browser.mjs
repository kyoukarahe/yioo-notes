import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
import { serve } from './serve.mjs';
import { hash, json } from './lib.mjs';

const release = JSON.parse(fs.readFileSync('output/ci/release.json', 'utf8'));
const external = process.env.NOTES_BASE_URL;
const server = external ? null : await serve('dist', 0);
const base = external ?? `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const report = { commit: release.commit, renderer: release.renderer, base, footer: new URL(base).hostname === 'yioo.link' ? 'shared-runtime' : 'local-fallback', checks: [], passed: false };
const timeout = setTimeout(() => { console.error('Browser verification exceeded 5 minutes'); process.exit(1); }, 300_000);
const guide = '/notes/2026-09-23-ssr-card-maker-guide/';
const materials = '/notes/2026-09-23-ssr-card-maker-print-materials/';
try {
  // Read the actual preview responses, not a rebuilt copy or fixture server.
  for (const [file, digest] of Object.entries(release.files)) {
    const response = await fetch(`${base}/notes/${file}`, { signal: AbortSignal.timeout(20_000) });
    assert.equal(response.status, 200, file);
    assert.equal(hash(Buffer.from(await response.arrayBuffer())), digest, `Served release differs: ${file}`);
  }
  report.checks.push(`All ${Object.keys(release.files).length} served file hashes match the verified release`);
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    // Do not generate analytics/ad events during production verification.
    await context.route(/google-analytics\.com|googletagmanager\.com|doubleclick\.net|googlesyndication\.com/, route => route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(15_000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().startsWith(`${base}/notes/`) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    async function layout(label) {
      await page.evaluate(() => document.fonts.ready);
      if (report.footer === 'shared-runtime') {
        const footer = page.locator('footer[data-yioo-global-footer="central"]');
        await footer.waitFor({ state: 'visible' });
        assert.equal(await footer.locator('a').count(), 6);
        assert.equal(await page.locator('[data-yioo-global-footer-fallback]').count(), 0);
        assert.ok(await page.locator('link[data-yioo-global-footer-style]').evaluate(link => Boolean(link.sheet)));
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${label}: horizontal overflow at ${width}`);
      const clipped = await page.locator('h1, .article-content p, .article-content h2, .back-link, .article-languages').evaluateAll(elements => elements.filter(el => {
        const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
      }).map(el => el.textContent.slice(0, 80)));
      assert.deepEqual(clipped, [], `${label}: clipped content`);
      await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
      await page.screenshot({ path: `output/ci/screens/${width}-${label}.png` });
    }
    async function follow(locator, expected) {
      const href = await locator.getAttribute('href');
      await locator.click();
      await page.waitForURL(url => `${url.pathname}${url.hash}` === expected || url.pathname === expected);
      assert.ok(href, 'Navigable link required');
      await page.locator('h1').waitFor();
    }
    await page.goto(`${base}/notes/`, { waitUntil: 'networkidle' });
    if (report.footer === 'local-fallback') {
      assert.equal(await page.locator('[data-yioo-global-footer-fallback]').isVisible(), true);
      assert.equal(await page.locator('.footer-nav a').count(), 6);
    }
    await layout('index');
    await follow(page.locator(`.post-list-link[href="${guide}"]`), guide);
    assert.equal(await page.locator('html').getAttribute('lang'), 'ko');
    await layout('guide');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://yioo.link${guide}`);
    const toc = page.locator('.article-toc a').first();
    const anchor = await toc.getAttribute('href');
    await toc.click();
    assert.equal(decodeURIComponent(new URL(page.url()).hash), anchor);
    const heading = page.locator(`[id="${anchor.slice(1)}"]`);
    assert.equal(await heading.isVisible(), true);
    const english = page.locator('.article-languages a[hreflang="en"]');
    await follow(english, guide.replace(/\/$/, '-en/'));
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await layout('guide-en');
    await follow(page.locator('.article-languages a[hreflang="ko"]'), guide);
    const category = page.locator('.article-meta > a').first();
    await follow(category, await category.getAttribute('href'));
    assert.ok(await page.locator('.post-list-link').count() > 0);
    await page.goBack();
    const tag = page.locator('a.post-tag').first();
    await follow(tag, await tag.getAttribute('href'));
    assert.ok(await page.locator('.post-list-link').count() > 0);
    await page.goto(`${base}/notes/`);
    const essay = '/notes/2026-08-11-how-to-use-llm-wiki/';
    await follow(page.locator(`.post-list-link[href="${essay}"]`), essay);
    const related = page.locator('.related-posts a').first();
    await follow(related, await related.getAttribute('href'));
    assert.ok(await page.locator('.article-content').innerText());
    // Enter both comparison guides through the public index.
    for (const [url, relief] of [[materials, false], [materials.replace(/\/$/, '-en/'), true]]) {
      await page.goto(`${base}/notes/`);
      await follow(page.locator(`.post-list-link[href="${url}"]`), url);
      const comparison = page.locator(relief ? '.image-compare--relief' : '.image-compare').first();
      assert.equal(await comparison.count(), 1, `Missing comparison group: ${url}`);
      const labels = comparison.locator('label');
      const count = await labels.count();
      assert.equal(count, relief ? 3 : 2);
      for (let i = 0; i < count; i++) {
        await labels.nth(i).click();
        assert.equal(await comparison.locator('input').nth(i).isChecked(), true);
        assert.equal(await comparison.locator('.image-compare__panel').nth(i).isVisible(), true);
        assert.equal(await comparison.locator('.image-compare__panel:visible').count(), 1);
      }
      await layout(relief ? 'relief' : 'materials');
    }
    assert.deepEqual(errors, [], `Browser errors at ${width}`);
    report.checks.push(`${width}px: index, KO/EN, category/tag/related/TOC navigation, images and 2/3-state comparison controls`);
    await context.close();
  }
  report.passed = true;
} catch (error) {
  report.failure = error.message;
  throw error;
} finally {
  clearTimeout(timeout);
  json('output/ci/browser.json', report);
  await browser.close();
  if (server) {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
console.log(`Browser verification passed (${report.footer}).`);
