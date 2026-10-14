import assert from 'node:assert/strict';
import { renderMarkdownDocumentSafely, renderMarkdownSafely } from '../src/lib/content-security.mjs';

const step = (image, copy = '설명 **강조**\n>\n> 1. 선택\n> 2. 확인') => `> [!guide-step]\n>\n> ${image}\n>\n> ${copy}\n`;
const linked = '[![메뉴](/notes/menu.png "focus=2,3,90,12")](/notes/menu.png)';
const rendered = renderMarkdownSafely(step(linked));
assert.match(rendered, /class="guide-step"/);
assert.match(rendered, /<a href="\/notes\/menu.png"><img src="\/notes\/menu.png" alt="메뉴">/);
assert.match(rendered, /aria-hidden="true" style="left:2%;top:3%;width:90%;height:12%"/);
assert.match(rendered, /<strong>강조<\/strong>/);
assert.match(rendered, /<ol>/);
assert.doesNotMatch(rendered, /\[!guide-step\]|title="focus=/);
assert.equal(renderMarkdownSafely('> 일반 인용\n'), '<blockquote>\n<p>일반 인용</p>\n</blockquote>\n');
assert.match(renderMarkdownSafely('> [!guide-step]\n>\n> 이미지를 빼먹음'), /^<blockquote>/);
assert.match(renderMarkdownSafely(step('![메뉴](/menu.png) 추가 문구')), /^<blockquote>/);
assert.match(renderMarkdownSafely(step('![메뉴](/menu.png)')), /guide-step__image/);
for (const title of ['focus=0,0,101,10','focus=99,0,5,10','focus=1,1,0,10','focus=-1,0,20,20','focus=1,2,3,4;position:fixed','focus=NaN,1,2,3','focus=1e9,1,2,3']) {
  assert.doesNotMatch(renderMarkdownSafely(step(`![메뉴](/menu.png "${title}")`)), /style=|guide-step__focus/);
}
for (const url of ['javascript:alert%281%29','%6a%61vascript:alert%281%29','data:text/html,boom','javascript&#58;alert%281%29']) {
  const imageAttack = renderMarkdownSafely(step(`![메뉴](${url})`));
  const linkAttack = renderMarkdownSafely(step(`[![메뉴](/menu.png)](${url})`));
  assert.doesNotMatch(imageAttack, /<img|guide-step__visual/);
  assert.doesNotMatch(linkAttack, /<a |guide-step__visual/);
}
assert.doesNotMatch(renderMarkdownSafely(step(linked, '<script>alert(1)</script>')), /<script>/);
assert.match(renderMarkdownSafely(step('![&quot; onerror=boom](/menu.png)')), /alt="&amp;quot; onerror=boom"/);
const headings = renderMarkdownDocumentSafely(step(linked, '## 안내')).headings;
assert.equal(headings[0].id, '안내');
console.log('[guide-steps] layout structure, readable fallback, safe annotations/URLs/HTML, and headings passed');
