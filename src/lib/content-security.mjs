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

export function renderMarkdownDocumentSafely(markdown) {
  const renderer = new Renderer();
  const headings = [];
  const headingCounts = new Map();

  renderer.html = ({ text }) => escapeHtml(text);
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
