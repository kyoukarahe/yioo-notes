import { Renderer, marked } from "marked";

const linkSchemes = new Set(["http:", "https:", "mailto:", "tel:"]);
const imageSchemes = new Set(["http:", "https:"]);
const schemePattern = /^[a-z][a-z0-9+.-]*:/i;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeUrlForPolicy(value) {
  let normalized = String(value)
    .trim()
    .replace(/&#(?:x0*3a|0*58);?|&colon;/gi, ":")
    .replace(/[\u0000-\u0020\u007f-\u009f]/g, "");

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const decoded = decodeURIComponent(normalized);
      if (decoded === normalized) {
        break;
      }
      normalized = decoded;
    } catch {
      break;
    }
  }

  return normalized;
}

function isAllowedUrl(value, allowedSchemes) {
  const normalized = normalizeUrlForPolicy(value);
  const match = normalized.match(schemePattern);
  return !match || allowedSchemes.has(match[0].toLowerCase());
}

function plainTextFromTokens(tokens) {
  return tokens
    .map((token) => {
      if (token.type === "html") {
        return "";
      }
      if (Array.isArray(token.tokens)) {
        return plainTextFromTokens(token.tokens);
      }
      if (typeof token.text === "string") {
        return token.text;
      }
      return "";
    })
    .join("");
}

function headingSlug(value) {
  return String(value)
    .normalize("NFKC")
    .toLocaleLowerCase("ko-KR")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Only numeric percentages can become annotation styles. Raw article HTML stays escaped.
function guideFocusStyle(title) {
  const number = "(?:\\d+(?:\\.\\d+)?)";
  const match = String(title ?? "").match(new RegExp(`^focus=(${number}),(${number}),(${number}),(${number})$`));
  if (!match) return "";
  const [left, top, width, height] = match.slice(1).map(Number);
  if (![left, top, width, height].every(Number.isFinite) || left < 0 || top < 0 || width <= 0 || height <= 0 || left + width > 100 || top + height > 100) return "";
  return `left:${left}%;top:${top}%;width:${width}%;height:${height}%`;
}

function comparisonImage(block) {
  const link = block?.type === "paragraph" && block.tokens?.length === 1 ? block.tokens[0] : null;
  const image = link?.type === "link" && link.tokens?.length === 1 && link.tokens[0].type === "image" ? link.tokens[0] : null;
  if (!image || !image.text.trim() || !isAllowedUrl(link.href, linkSchemes) || !isAllowedUrl(image.href, imageSchemes)) return null;
  return { link, image };
}

function comparisonCrop(title) {
  const match = String(title ?? "").match(/^crop=(\d{1,5}),(\d{1,5}),(\d{1,5}),(\d{1,5}),(\d{1,5}),(\d{1,5})$/);
  if (!match) return null;
  const [left, top, width, height, sourceWidth, sourceHeight] = match.slice(1).map(Number);
  if (width < 1 || height < 1 || sourceWidth < 1 || sourceHeight < 1 || left + width > sourceWidth || top + height > sourceHeight) return null;
  return { key: match.slice(1).map(Number).join(","), style: `aspect-ratio:${width}/${height};--compare-width:${sourceWidth / width * 100}%;--compare-left:${-left / width * 100}%;--compare-top:${-top / height * 100}%` };
}

export function renderMarkdownDocumentSafely(markdown) {
  const renderer = new Renderer();
  const headings = [];
  const headingCounts = new Map();
  let comparisonCount = 0;

  renderer.html = ({ text }) => escapeHtml(text);
  renderer.blockquote = function renderBlockquote(token) {
    const blocks = token.tokens.filter((item) => item.type !== "space");
    if (blocks[0]?.type === "paragraph" && ["[!image-compare]", "[!relief-compare]"].includes(blocks[0].text)) {
      const relief = blocks[0].text === "[!relief-compare]";
      const states = relief ? [["normal", "일반"], ["emboss", "양각"], ["deboss", "음각"]] : [["before", "원본"], ["after", "적용"]];
      const images = states.map((_, index) => comparisonImage(blocks[index + 1]));
      const crop = comparisonCrop(images[0]?.image.title);
      if (!crop || images.some(item => !item || comparisonCrop(item.image.title)?.key !== crop.key) || (relief && comparisonImage(blocks[4]))) return Renderer.prototype.blockquote.call(this, token);
      const id = `image-compare-${++comparisonCount}`;
      const panel = (item, state) => `<div class="image-compare__panel image-compare__panel--${state}"><div class="image-compare__crop" style="${crop.style}"><a href="${escapeHtml(item.link.href)}">${this.image({ ...item.image, title: null })}</a></div></div>`;
      const controls = states.map(([state, label], index) => `<input class="image-compare__radio image-compare__radio--${state}" type="radio" name="${id}" id="${id}-${state}"${index === 0 ? " checked" : ""}><label class="image-compare__label" for="${id}-${state}">${label}</label>`).join("");
      return `<fieldset class="image-compare${relief ? " image-compare--relief" : ""}"><legend>${relief ? "양각·음각 확대 비교" : "확대 이미지 비교"}</legend>${controls}<div class="image-compare__panels">${images.map((item, index) => panel(item, states[index][0])).join("")}</div><div class="image-compare__caption">${this.parser.parse(blocks.slice(states.length + 1))}</div></fieldset>\n`;
    }
    const [marker, visual, ...copy] = blocks;
    const inline = visual?.tokens?.length === 1 ? visual.tokens[0] : null;
    const image = inline?.type === "image" ? inline
      : inline?.type === "link" && inline.tokens?.length === 1 && inline.tokens[0].type === "image" ? inline.tokens[0] : null;
    if (marker?.type !== "paragraph" || marker.text !== "[!guide-step]" || visual?.type !== "paragraph" || !image || !copy.length || !isAllowedUrl(image.href, imageSchemes) || (inline.type === "link" && !isAllowedUrl(inline.href, linkSchemes))) {
      return Renderer.prototype.blockquote.call(this, token);
    }
    const focusStyle = guideFocusStyle(image.title);
    const focus = focusStyle ? `<span class="guide-step__focus" aria-hidden="true" style="${focusStyle}"></span>` : "";
    const imageHtml = this.image({ ...image, title: null });
    const visualHtml = inline.type === "link"
      ? `<a href="${escapeHtml(inline.href)}">${imageHtml}${focus}</a>`
      : `<span class="guide-step__image">${imageHtml}${focus}</span>`;
    return `<div class="guide-step"><figure class="guide-step__visual">${visualHtml}</figure><div class="guide-step__copy">${this.parser.parse(copy)}</div></div>\n`;
  };
  renderer.heading = function renderHeading({ tokens, depth }) {
    const text = plainTextFromTokens(tokens).trim();
    const baseId = headingSlug(text) || "section";
    const count = (headingCounts.get(baseId) ?? 0) + 1;
    headingCounts.set(baseId, count);
    const id = count === 1 ? baseId : `${baseId}-${count}`;
    const label = text || `제목 ${headings.length + 1}`;
    headings.push({ depth, id, text: label });
    return `<h${depth} id="${escapeHtml(id)}">${this.parser.parseInline(tokens)}</h${depth}>`;
  };
  renderer.link = function renderLink({ href, title, tokens }) {
    const label = this.parser.parseInline(tokens);
    if (!isAllowedUrl(href, linkSchemes)) {
      return label;
    }
    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
    return `<a href="${escapeHtml(href)}"${titleAttribute}>${label}</a>`;
  };
  renderer.image = function renderImage({ href, title, text }) {
    const alt = escapeHtml(text);
    if (!isAllowedUrl(href, imageSchemes)) {
      return alt;
    }
    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
    return `<img src="${escapeHtml(href)}" alt="${alt}"${titleAttribute}>`;
  };

  return {
    headings,
    html: marked.parse(markdown, { async: false, renderer }),
  };
}

export function renderMarkdownSafely(markdown) {
  return renderMarkdownDocumentSafely(markdown).html;
}

export function serializeJsonForScript(value) {
  return JSON.stringify(value)
    .replaceAll("&", "\\u0026")
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e");
}
