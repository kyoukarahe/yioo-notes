import assert from "node:assert/strict";
import {postLanguage, translationSource, attachLanguageAlternates} from "../src/lib/languages.mjs";
import {renderMarkdownDocumentSafely} from "../src/lib/content-security.mjs";
import {renderRssFeed} from "../src/lib/feed.mjs";

assert.equal(postLanguage(undefined), "ko");
assert.equal(postLanguage("en"), "en");
assert.throws(() => postLanguage("english"));
assert.equal(translationSource("source-ko"), "source-ko");
assert.throws(() => translationSource("../private"));
const post = (slug, lang, translationOf) => ({slug, lang, translationOf, url:`/notes/${slug}/`, canonicalUrl:`https://yioo.link/notes/${slug}/`, title:slug, summary:slug, date:"2026-10-15", tags:[]});
const pair = attachLanguageAlternates([post("source", "ko"), post("translated", "en", "source")]);
for (const item of pair) {
  assert.deepEqual(item.alternates.map(peer => peer.lang), ["en", "ko"]);
  assert.ok(item.alternates.some(peer => peer.canonicalUrl === item.canonicalUrl));
}
assert.deepEqual(attachLanguageAlternates([post("standalone", "ko")])[0].alternates, []);
for (const invalid of [
  [post("orphan", "en", "missing")],
  [post("self", "en", "self")],
  [post("source", "ko"), post("same", "ko", "source")],
  [post("source", "ko"), post("one", "en", "source"), post("two", "en", "source")],
  [post("source", "ko"), post("one", "en", "source"), post("two", "ko", "one")],
]) assert.throws(() => attachLanguageAlternates(invalid));

const image = name => `[![${name}](/notes/${name}.png "crop=0,0,20,20,40,40")](/notes/${name}.png)`;
const comparison = `> [!image-compare]\n>\n> ${image("before")}\n>\n> ${image("after")}\n`;
const relief = `> [!relief-compare]\n>\n> ${image("normal")}\n>\n> ${image("emboss")}\n>\n> ${image("deboss")}\n`;
const en = renderMarkdownDocumentSafely(comparison + "\n" + relief, {lang:"en"}).html;
for (const text of ["Close-up comparison", "Before", "After", "No relief", "Emboss", "Deboss"]) assert.ok(en.includes(text), text);
assert.ok(renderMarkdownDocumentSafely(comparison).html.includes("확대 이미지 비교"));
const site = {baseUrl:"https://yioo.link", title:"Yioo Notes", description:"Notes"};
const mixed = renderRssFeed(pair, site);
assert.ok(!mixed.includes("<language>"));
for (const lang of ["en", "ko"]) assert.ok(mixed.includes(`<item xml:lang="${lang}">`));
assert.ok(renderRssFeed([pair[0]], site).includes("<language>ko</language>"));
console.log("[languages] reciprocal published pairs, invalid references, localized controls and mixed-language RSS passed");
