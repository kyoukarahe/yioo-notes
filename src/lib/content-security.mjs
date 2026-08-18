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

export function renderMarkdownSafely(markdown) {
  const renderer = new Renderer();

  renderer.html = ({ text }) => escapeHtml(text);
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

  return marked.parse(markdown, { async: false, renderer });
}

export function serializeJsonForScript(value) {
  return JSON.stringify(value)
    .replaceAll("&", "\\u0026")
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e");
}
