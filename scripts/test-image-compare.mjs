import assert from "node:assert/strict";
import { renderMarkdownSafely } from "../src/lib/content-security.mjs";

const crop = "crop=190,350,320,240,786,1065";
const image = (label, file, metadata = crop) => `[![${label}](/notes/${file}.webp "${metadata}")](/notes/${file}.webp)`;
const block = (before = image("원본", "before"), after = image("적용", "after"), caption = "같은 부분입니다.") => `> [!image-compare]\n>\n> ${before}\n>\n> ${after}\n>\n> ${caption}\n`;
const html = renderMarkdownSafely(block());
assert.match(html, /<fieldset class="image-compare"><legend>확대 이미지 비교<\/legend>/);
assert.match(html, /id="image-compare-1-before" checked/);
assert.match(html, /for="image-compare-1-after">적용<\/label>/);
assert.equal((html.match(/aspect-ratio:320\/240/g) ?? []).length, 2);
assert.ok(Math.abs(Number(html.match(/--compare-width:([\d.]+)%/)[1]) - 786 / 320 * 100) < 1e-8);
assert.ok(Math.abs(Number(html.match(/--compare-left:([-\d.]+)%/)[1]) - -190 / 320 * 100) < 1e-8);
assert.match(html, /<a href="\/notes\/before.webp"><img src="\/notes\/before.webp" alt="원본">/);
assert.doesNotMatch(html, /<script|onclick|\[!image-compare\]|title="crop=/);
const twice = renderMarkdownSafely(block() + "\n" + block());
const ids = [...twice.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, 4);
assert.equal(new Set(ids).size, 4);
assert.match(twice, /name="image-compare-2"/);
for (const metadata of ["crop=0,0,0,10,20,20", "crop=15,0,10,10,20,20", "crop=-1,0,10,10,20,20", "crop=1,2,3,4,5,6;position:fixed", "crop=1,2,3,4,0,0", "crop=1e3,2,3,4,5,6", ""]) {
  assert.doesNotMatch(renderMarkdownSafely(block(image("원본", "before", metadata), image("적용", "after", metadata))), /<fieldset|style=/);
}
assert.doesNotMatch(renderMarkdownSafely(block(image("원본", "before"), image("적용", "after", "crop=0,0,320,240,786,1065"))), /<fieldset/);
assert.doesNotMatch(renderMarkdownSafely(block("글만 있습니다.")), /<fieldset/);
for (const url of ["javascript:alert%281%29", "%6a%61vascript:alert%281%29", "data:text/html,boom"]) {
  assert.doesNotMatch(renderMarkdownSafely(block(`[![원본](${url} "${crop}")](/notes/before.webp)`)), /<fieldset|<img[^>]+src="(?:javascript|data|%6a)/i);
  assert.doesNotMatch(renderMarkdownSafely(block(`[![원본](/notes/before.webp "${crop}")](${url})`)), /<fieldset|href="(?:javascript|data|%6a)/i);
}
assert.doesNotMatch(renderMarkdownSafely(block(undefined, undefined, '<script>alert(1)</script>')), /<script>/);
assert.match(renderMarkdownSafely('> 보통 인용\n'), /^<blockquote>/);
console.log("[image-compare] two-state structure, independent groups, same-region validation, safe URLs/HTML and malformed fallback passed");

const relief = (third = image("음각", "deboss"), caption = "명암의 방향을 비교합니다.") => `> [!relief-compare]\n>\n> ${image("일반", "normal")}\n>\n> ${image("양각", "emboss")}\n>\n> ${third}\n>\n> ${caption}\n`;
const three = renderMarkdownSafely(relief());
assert.match(three, /class="image-compare image-compare--relief"/);
assert.match(three, /<legend>양각·음각 확대 비교<\/legend>/);
assert.equal((three.match(/type="radio"/g)||[]).length,3);
assert.equal((three.match(/ checked/g)||[]).length,1);
assert.match(three,/id="image-compare-1-normal" checked/);
assert.match(three,/for="image-compare-1-emboss">양각<\/label>/);
assert.match(three,/for="image-compare-1-deboss">음각<\/label>/);
assert.equal((three.match(/aspect-ratio:320\/240/g)||[]).length,3);
assert.doesNotMatch(three,/\[!relief-compare\]|title="crop=|<script/);
const mixed = renderMarkdownSafely(block() + '\n' + relief() + '\n' + relief());
const mixedIds = [...mixed.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(mixedIds.length,8);
assert.equal(new Set(mixedIds).size,8);
assert.match(mixed,/name="image-compare-3"/);
for (const third of ['음각 없음', '', image('음각','deboss','crop=1,0,320,240,786,1065'), image('음각','deboss','crop=0,0,0,1,786,1065')]) {
  assert.doesNotMatch(renderMarkdownSafely(relief(third)), /<fieldset/);
}
assert.doesNotMatch(renderMarkdownSafely(relief(undefined, image('넷째','extra'))), /<fieldset/);
for (const url of ['javascript:alert%281%29','%6a%61vascript:alert%281%29','data:text/html,boom']) {
  assert.doesNotMatch(renderMarkdownSafely(relief(`[![음각](${url} "${crop}")](/notes/deboss.webp)`)), /<fieldset|src="(?:javascript|data|%6a)/i);
  assert.doesNotMatch(renderMarkdownSafely(relief(`[![음각](/notes/deboss.webp "${crop}")](${url})`)), /<fieldset|href="(?:javascript|data|%6a)/i);
}
assert.doesNotMatch(renderMarkdownSafely(relief(undefined,'<script>alert(1)</script>')), /<script>/);
console.log('[image-compare] three-state relief controls, mixed groups, third-image validation and safe fallback passed');
