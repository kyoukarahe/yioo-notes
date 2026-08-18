import childProcess from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import { renderMarkdownSafely, serializeJsonForScript } from "../src/lib/content-security.mjs";
import { syncStyles } from "./sync-styles.mjs";

const root = process.cwd();
const siteConfig = JSON.parse(fs.readFileSync(path.join(root, "src", "config", "site.config.json"), "utf8"));
const categoriesConfigPath = path.join(root, "src", "config", "categories.json");
const postsDirectory = path.join(root, "content", "posts");
const publicNotesDirectory = path.join(root, "public", "notes");
const distNotesDirectory = path.join(root, "dist", "notes");
const categoryIdPattern = /^[a-z0-9][a-z0-9-]*$/;
const canonicalTarget = Object.freeze({
  bucket: "yioo-notes",
  distributionId: "EWYEJXEIKC81C",
  prefix: "notes",
  region: "ap-northeast-1",
});

function parseArgs(argv) {
  const options = {
    bucket: "yioo-notes",
    distributionId: "EWYEJXEIKC81C",
    dryRun: false,
    invalidate: true,
    prefix: "notes",
    allowTargetOverride: false,
    confirmFullRelease: false,
    requireSlug: undefined,
    upload: false,
    wait: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      index += 1;
      if (index >= argv.length) {
        throw new Error(`Missing value for ${arg}`);
      }
      return argv[index];
    };

    if (arg === "--bucket") {
      options.bucket = next();
    } else if (arg.startsWith("--bucket=")) {
      options.bucket = arg.slice("--bucket=".length);
    } else if (arg === "--distribution-id") {
      options.distributionId = next();
    } else if (arg.startsWith("--distribution-id=")) {
      options.distributionId = arg.slice("--distribution-id=".length);
    } else if (arg === "--prefix") {
      options.prefix = next();
    } else if (arg.startsWith("--prefix=")) {
      options.prefix = arg.slice("--prefix=".length);
    } else if (arg === "--require-slug") {
      options.requireSlug = next();
    } else if (arg.startsWith("--require-slug=")) {
      options.requireSlug = arg.slice("--require-slug=".length);
    } else if (arg === "--slug" || arg.startsWith("--slug=")) {
      throw new Error("--slug is no longer accepted because publishing is a full release. Use --require-slug to assert that a post is present.");
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--no-upload") {
      options.upload = false;
    } else if (arg === "--upload") {
      options.upload = true;
    } else if (arg === "--confirm-full-release") {
      options.confirmFullRelease = true;
    } else if (arg === "--allow-target-override") {
      options.allowTargetOverride = true;
    } else if (arg === "--no-invalidate") {
      options.invalidate = false;
    } else if (arg === "--no-wait") {
      options.wait = false;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (options.dryRun) {
    options.wait = false;
  }

  if (options.dryRun && options.upload) {
    throw new Error("--dry-run and --upload are mutually exclusive.");
  }
  if (options.upload && !options.confirmFullRelease) {
    throw new Error("--upload requires --confirm-full-release because this command replaces the complete notes release.");
  }
  if (options.confirmFullRelease && !options.upload) {
    throw new Error("--confirm-full-release is only valid with --upload.");
  }

  return options;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function absoluteUrl(pathname) {
  return new URL(pathname, siteConfig.baseUrl).toString();
}

function assertString(value, field, filePath) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${path.relative(root, filePath)} is missing required frontmatter field: ${field}`);
  }

  return value.trim();
}

function normalizeTags(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((tag) => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function readCategories() {
  const parsed = JSON.parse(fs.readFileSync(categoriesConfigPath, "utf8"));
  if (!Array.isArray(parsed.categories)) {
    throw new Error("src/config/categories.json must contain a categories array");
  }

  const seen = new Set();
  return parsed.categories
    .map((category, index) => {
      const id = assertString(category.id, "id", categoriesConfigPath);
      if (!categoryIdPattern.test(id)) {
        throw new Error(`src/config/categories.json category ${index} has an invalid id: ${id}`);
      }
      if (seen.has(id)) {
        throw new Error(`src/config/categories.json has a duplicate category id: ${id}`);
      }
      seen.add(id);

      const url = `/notes/categories/${id}/`;
      return {
        canonicalUrl: absoluteUrl(url),
        description: assertString(category.description, "description", categoriesConfigPath),
        id,
        label: assertString(category.label, "label", categoriesConfigPath),
        sort: typeof category.sort === "number" && Number.isFinite(category.sort) ? category.sort : 1000,
        status: category.status === "inactive" ? "inactive" : "active",
        url,
      };
    })
    .sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label) || a.id.localeCompare(b.id));
}

function activeCategories() {
  return readCategories().filter((category) => category.status === "active");
}

function assertActiveCategory(id, filePath) {
  if (!categoryIdPattern.test(id)) {
    throw new Error(`${path.relative(root, filePath)} has an invalid category id: ${id}`);
  }

  const category = readCategories().find((item) => item.id === id);
  if (!category) {
    throw new Error(`${path.relative(root, filePath)} references unknown category: ${id}`);
  }
  if (category.status !== "active") {
    throw new Error(`${path.relative(root, filePath)} references inactive category: ${id}`);
  }

  return category;
}

function markdownFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(directory, entry.name))
    .sort();
}

function readPost(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data;
  const slug = assertString(data.slug, "slug", filePath);

  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new Error(`${path.relative(root, filePath)} has an invalid slug: ${slug}`);
  }

  const status = data.status === "draft" ? "draft" : "published";
  const url = `/notes/${slug}/`;
  const canonicalPath = typeof data.canonical === "string" ? data.canonical : url;
  const cover = typeof data.cover === "string" ? data.cover : undefined;
  const updated = typeof data.updated === "string" ? data.updated : undefined;
  const categoryId = assertString(data.category, "category", filePath);

  return {
    body: parsed.content,
    canonical: canonicalPath,
    canonicalUrl: absoluteUrl(canonicalPath),
    category: assertActiveCategory(categoryId, filePath),
    cover,
    coverUrl: cover ? absoluteUrl(cover) : undefined,
    date: assertString(data.date, "date", filePath),
    html: renderMarkdownSafely(parsed.content),
    slug,
    sourcePath: filePath,
    status,
    summary: assertString(data.summary, "summary", filePath),
    tags: normalizeTags(data.tags),
    title: assertString(data.title, "title", filePath),
    updated,
    url,
  };
}

function getAllPosts() {
  return markdownFiles(postsDirectory)
    .map(readPost)
    .filter((post) => post.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));
}

function categoriesWithPosts(posts) {
  return activeCategories()
    .map((category) => ({
      ...category,
      posts: posts.filter((post) => post.category.id === category.id),
    }))
    .filter((category) => category.posts.length > 0);
}

function renderJsonLd(data) {
  return `<script type="application/ld+json">${serializeJsonForScript(data)}</script>`;
}

function isCurrentNavItem(href, currentPath) {
  return href === "/" ? currentPath === href : currentPath === href || currentPath.startsWith(href);
}

function renderNav(currentPath) {
  const links = siteConfig.nav
    .map((item) => {
      const active = isCurrentNavItem(item.href, currentPath);
      const classAttr = active ? ' class="is-active"' : "";
      const currentAttr = active ? ' aria-current="page"' : "";
      return `<a${classAttr} href="${escapeHtml(item.href)}"${currentAttr}> ${escapeHtml(item.label)} </a>`;
    })
    .join("");

  return `<header class="site-header">
  <nav class="site-nav" aria-label="Primary">
    <a class="brand" href="/notes/">
      <span class="brand-mark" aria-hidden="true">Y</span>
      <span>${escapeHtml(siteConfig.title)}</span>
    </a>
    <div class="nav-links">${links}</div>
  </nav>
</header>`;
}

function renderLayout({
  body,
  canonicalPath = siteConfig.notesPath,
  currentPath = siteConfig.notesPath,
  description = siteConfig.description,
  imagePath,
  modifiedTime,
  ogType = "website",
  publishedTime,
  structuredData,
  tags = [],
  title = siteConfig.title,
}) {
  const canonicalUrl = absoluteUrl(canonicalPath);
  const imageUrl = imagePath ? absoluteUrl(imagePath) : undefined;
  const pageTitle = title === siteConfig.title ? title : `${title} | ${siteConfig.title}`;
  const structuredDataHtml = structuredData ? renderJsonLd(structuredData) : "";
  const articleTimes =
    ogType === "article"
      ? `${publishedTime ? `<meta property="article:published_time" content="${escapeHtml(publishedTime)}">` : ""}${
          modifiedTime ? `<meta property="article:modified_time" content="${escapeHtml(modifiedTime)}">` : ""
        }${tags.map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}">`).join("")}`
      : "";

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="icon" href="/notes/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <meta property="og:type" content="${escapeHtml(ogType)}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  ${imageUrl ? `<meta property="og:image" content="${escapeHtml(imageUrl)}">` : ""}
  ${articleTimes}
  <meta name="twitter:card" content="${imageUrl ? "summary_large_image" : "summary"}">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  ${imageUrl ? `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">` : ""}
  <link rel="stylesheet" href="/notes/styles.css">
  ${structuredDataHtml}
  <script>
    (() => {
      const host = window.location.hostname;
      if (host === "yioo.link" || host.endsWith(".yioo.link")) {
        const script = document.createElement("script");
        script.defer = true;
        script.src = "/analytics-loader.js";
        document.head.appendChild(script);
      }
    })();
  </script>
</head>
<body>
  <a class="skip-link" href="#content">Skip to content</a>
  ${renderNav(currentPath)}
  <main id="content" class="page-shell">
    ${body}
  </main>
</body>
</html>
`;
}

function renderPostList(posts) {
  if (posts.length === 0) {
    return '<p class="empty-state">Published notes will appear here.</p>';
  }

  return `<ol class="post-list" aria-label="Published notes">
${posts
  .map(
    (post) => `  <li class="post-list-item">
    <a class="post-list-link" href="${escapeHtml(post.url)}">
      <span class="post-date"><time datetime="${escapeHtml(post.date)}">${escapeHtml(post.date)}</time></span>
      <span class="post-copy">
        <span class="post-title">${escapeHtml(post.title)}</span>
        <span class="post-summary">${escapeHtml(post.summary)}</span>
        <span class="post-taxonomy">
          <span class="post-category">${escapeHtml(post.category.label)}</span>
          ${
            post.tags.length > 0
              ? `<span class="post-tags" aria-label="Tags for ${escapeHtml(post.title)}">${post.tags
                  .map((tag) => `<span class="post-tag">${escapeHtml(tag)}</span>`)
                  .join("")}</span>`
              : ""
          }
        </span>
      </span>
    </a>
  </li>`,
  )
  .join("\n")}
</ol>`;
}

function renderIndex(posts) {
  const categories = categoriesWithPosts(posts);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    description: siteConfig.description,
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      dateModified: post.updated ?? post.date,
      datePublished: post.date,
      headline: post.title,
      url: post.canonicalUrl,
    })),
    name: siteConfig.title,
    url: `${siteConfig.baseUrl}/notes/`,
  };
  const body = `<section class="intro">
  <p class="eyebrow">Notes</p>
  <h1>Yioo Notes</h1>
  <p>Essays, research notes, and implementation thoughts collected as static documents under yioo.link.</p>
</section>
<nav class="category-strip" aria-label="Note categories">
  <a href="/notes/categories/">Categories</a>
  ${categories
    .map(
      (category) =>
        `<a href="${escapeHtml(category.url)}">${escapeHtml(category.label)}<span>${escapeHtml(category.posts.length)}</span></a>`,
    )
    .join("")}
</nav>
${renderPostList(posts)}`;

  return renderLayout({
    body,
    canonicalPath: "/notes/",
    currentPath: "/notes/",
    structuredData,
  });
}

function renderCategoryIndex(posts) {
  const categories = categoriesWithPosts(posts);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    description: "Primary sections for Yioo Notes posts.",
    hasPart: categories.map((category) => ({
      "@type": "CollectionPage",
      name: category.label,
      url: category.canonicalUrl,
    })),
    name: "Yioo Notes Categories",
    url: `${siteConfig.baseUrl}/notes/categories/`,
  };
  const body = `<section class="intro">
  <p class="eyebrow">Categories</p>
  <h1>Note Categories</h1>
  <p>Stable primary sections for published notes.</p>
</section>
<ol class="category-list" aria-label="Note categories">
${categories
  .map(
    (category) => `  <li>
    <a class="category-list-link" href="${escapeHtml(category.url)}">
      <span>
        <span class="category-title">${escapeHtml(category.label)}</span>
        <span class="category-description">${escapeHtml(category.description)}</span>
      </span>
      <span class="category-count">${escapeHtml(category.posts.length)}</span>
    </a>
  </li>`,
  )
  .join("\n")}
</ol>`;

  return renderLayout({
    body,
    canonicalPath: "/notes/categories/",
    currentPath: "/notes/categories/",
    description: "Primary sections for Yioo Notes posts.",
    structuredData,
    title: "Categories",
  });
}

function renderCategoryPage(category) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    description: category.description,
    hasPart: category.posts.map((post) => ({
      "@type": "BlogPosting",
      dateModified: post.updated ?? post.date,
      datePublished: post.date,
      headline: post.title,
      url: post.canonicalUrl,
    })),
    name: `${category.label} | Yioo Notes`,
    url: category.canonicalUrl,
  };
  const body = `<section class="intro">
  <p class="eyebrow">Category</p>
  <h1>${escapeHtml(category.label)}</h1>
  <p>${escapeHtml(category.description)}</p>
</section>
${renderPostList(category.posts)}`;

  return renderLayout({
    body,
    canonicalPath: category.url,
    currentPath: category.url,
    description: category.description,
    structuredData,
    title: category.label,
  });
}

function renderPost(post) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
      "@type": "Person",
      name: siteConfig.author,
    },
    dateModified: post.updated ?? post.date,
    datePublished: post.date,
    description: post.summary,
    headline: post.title,
    image: post.coverUrl ? [post.coverUrl] : undefined,
    keywords: post.tags,
    url: post.canonicalUrl,
  };
  const body = `<article class="article">
  <header class="article-header">
    <a class="back-link" href="/notes/">Notes</a>
    <h1>${escapeHtml(post.title)}</h1>
    <p>${escapeHtml(post.summary)}</p>
    <div class="article-meta">
      <time datetime="${escapeHtml(post.date)}">${escapeHtml(post.date)}</time>
      <a href="${escapeHtml(post.category.url)}">${escapeHtml(post.category.label)}</a>
      ${post.tags.length > 0 ? `<span>${escapeHtml(post.tags.join(", "))}</span>` : ""}
    </div>
  </header>
  ${post.cover ? `<img class="cover-image" src="${escapeHtml(post.cover)}" alt="" loading="eager">` : ""}
  <div class="article-content">${post.html}</div>
</article>`;

  return renderLayout({
    body,
    canonicalPath: post.canonical ?? post.url,
    currentPath: post.url,
    description: post.summary,
    imagePath: post.cover,
    modifiedTime: post.updated ?? post.date,
    ogType: "article",
    publishedTime: post.date,
    structuredData,
    tags: post.tags,
    title: post.title,
  });
}

function renderManifest(posts) {
  return `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      posts: posts.map((post) => ({
        canonicalUrl: post.canonicalUrl,
        category: {
          canonicalUrl: post.category.canonicalUrl,
          id: post.category.id,
          label: post.category.label,
          url: post.category.url,
        },
        cover: post.cover,
        date: post.date,
        slug: post.slug,
        summary: post.summary,
        tags: post.tags,
        title: post.title,
        updated: post.updated,
        url: post.url,
      })),
    },
    null,
    2,
  )}\n`;
}

function renderSitemap(posts) {
  const categories = categoriesWithPosts(posts);
  const urls = [
    {
      lastmod: posts[0]?.updated ?? posts[0]?.date ?? new Date().toISOString().slice(0, 10),
      loc: absoluteUrl("/notes/"),
    },
    {
      lastmod: posts[0]?.updated ?? posts[0]?.date ?? new Date().toISOString().slice(0, 10),
      loc: absoluteUrl("/notes/categories/"),
    },
    ...categories.map((category) => ({
      lastmod: category.posts[0]?.updated ?? category.posts[0]?.date ?? new Date().toISOString().slice(0, 10),
      loc: category.canonicalUrl,
    })),
    ...posts.map((post) => ({
      lastmod: post.updated ?? post.date,
      loc: post.canonicalUrl,
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url>\n    <loc>${escapeXml(url.loc)}</loc>\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>\n  </url>`)
    .join("\n")}\n</urlset>\n`;
}

function writeFile(relativePath, contents) {
  const destination = path.join(distNotesDirectory, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, contents);
}

function run(command, args, options = {}) {
  console.log(`[publish-posts] ${command} ${args.join(" ")}`);
  const result = childProcess.spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    stdio: options.capture ? "pipe" : "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    if (options.capture) {
      if (result.stdout) {
        process.stdout.write(result.stdout);
      }
      if (result.stderr) {
        process.stderr.write(result.stderr);
      }
    }
    throw new Error(`${command} exited with code ${result.status}`);
  }

  return result.stdout;
}

function runJson(command, args) {
  const output = run(command, [...args, "--output", "json"], { capture: true });
  try {
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`Could not parse JSON from ${command} ${args.join(" ")}: ${error.message}`);
  }
}

function normalizedPrefix(value) {
  const prefix = String(value).replace(/^\/+|\/+$/g, "");
  if (!prefix || prefix.includes("..")) {
    throw new Error(`Unsafe deployment prefix: ${value}`);
  }
  return prefix;
}

function validateTarget(options) {
  options.prefix = normalizedPrefix(options.prefix);

  const overrides = ["bucket", "distributionId", "prefix"].filter((field) => options[field] !== canonicalTarget[field]);
  if (overrides.length > 0 && !options.allowTargetOverride) {
    throw new Error(`Deployment target override requires --allow-target-override: ${overrides.join(", ")}`);
  }

  const identity = runJson("aws", ["sts", "get-caller-identity"]);
  run("aws", ["s3api", "head-bucket", "--bucket", options.bucket, "--expected-bucket-owner", identity.Account], { capture: true });
  const location = runJson("aws", ["s3api", "get-bucket-location", "--bucket", options.bucket]).LocationConstraint ?? "us-east-1";
  if (options.bucket === canonicalTarget.bucket && location !== canonicalTarget.region) {
    throw new Error(`Unexpected region for ${options.bucket}: ${location}`);
  }
  const versioning = runJson("aws", ["s3api", "get-bucket-versioning", "--bucket", options.bucket]);
  if (options.bucket === canonicalTarget.bucket && versioning.Status !== "Enabled") {
    throw new Error(`S3 versioning is not enabled for ${options.bucket}: ${versioning.Status ?? "unset"}`);
  }

  const response = runJson("aws", ["cloudfront", "get-distribution", "--id", options.distributionId]);
  const distribution = response.Distribution;
  const config = distribution?.DistributionConfig;
  if (!distribution || !config) {
    throw new Error(`CloudFront distribution was not returned: ${options.distributionId}`);
  }
  const distributionAccount = String(distribution.ARN ?? "").split(":")[4];
  if (distributionAccount && distributionAccount !== identity.Account) {
    throw new Error(`CloudFront account mismatch: ${distributionAccount} != ${identity.Account}`);
  }
  if (distribution.Status !== "Deployed" || config.Enabled !== true) {
    throw new Error(`CloudFront distribution is not enabled and deployed: status=${distribution.Status}, enabled=${config.Enabled}`);
  }

  const cacheBehaviors = config.CacheBehaviors?.Items ?? [];
  const expectedPatterns = new Set([`/${options.prefix}`, `/${options.prefix}/*`]);
  const matchingBehaviors = cacheBehaviors.filter((behavior) => expectedPatterns.has(behavior.PathPattern));
  if (matchingBehaviors.length === 0) {
    throw new Error(`CloudFront has no cache behavior for /${options.prefix} or /${options.prefix}/*`);
  }

  const origins = new Map((config.Origins?.Items ?? []).map((origin) => [origin.Id, origin]));
  for (const behavior of matchingBehaviors) {
    const origin = origins.get(behavior.TargetOriginId);
    if (!origin || !String(origin.DomainName).toLowerCase().includes(options.bucket.toLowerCase())) {
      throw new Error(`CloudFront behavior ${behavior.PathPattern} does not target bucket ${options.bucket}`);
    }
  }

  console.log(`[publish-posts] target verified: account=${identity.Account}, bucket=${options.bucket}, region=${location}, versioning=${versioning.Status ?? "unset"}, distribution=${options.distributionId}`);
}

function releaseInventory(directory) {
  const files = [];
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile()) {
        const contents = fs.readFileSync(fullPath);
        files.push({
          bytes: contents.byteLength,
          path: path.relative(directory, fullPath).replaceAll(path.sep, "/"),
          sha256: crypto.createHash("sha256").update(contents).digest("hex"),
        });
      }
    }
  };
  visit(directory);
  files.sort((left, right) => left.path.localeCompare(right.path));
  return files;
}

function printReleaseInventory(directory) {
  const files = releaseInventory(directory);
  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
  console.log(`[publish-posts] FullReleaseFiles=${files.length} FullReleaseBytes=${totalBytes}`);
  for (const file of files) {
    console.log(`[publish-posts] release ${file.sha256} ${file.bytes} ${file.path}`);
  }
  return files;
}

function previewUpload(options) {
  const destination = `s3://${options.bucket}/${options.prefix}`;
  console.log("[publish-posts] AWS full-release preview; review upload and delete actions before publishing");
  run("aws", ["s3", "sync", distNotesDirectory, destination, "--delete", "--dryrun", "--cache-control", "no-cache"]);
}

function upload(options) {
  const destination = `s3://${options.bucket}/${options.prefix}`;

  run("aws", ["s3", "sync", distNotesDirectory, destination, "--delete", "--cache-control", "no-cache"]);
  run("aws", [
    "s3",
    "cp",
    distNotesDirectory,
    destination,
    "--recursive",
    "--exclude",
    "*",
    "--include",
    "*.html",
    "--cache-control",
    "no-cache",
    "--content-type",
    "text/html; charset=utf-8",
  ]);
  run("aws", [
    "s3",
    "cp",
    distNotesDirectory,
    destination,
    "--recursive",
    "--exclude",
    "*",
    "--include",
    "*.json",
    "--cache-control",
    "no-cache",
    "--content-type",
    "application/json; charset=utf-8",
  ]);
  run("aws", [
    "s3",
    "cp",
    distNotesDirectory,
    destination,
    "--recursive",
    "--exclude",
    "*",
    "--include",
    "*.xml",
    "--cache-control",
    "no-cache",
    "--content-type",
    "application/xml; charset=utf-8",
  ]);
  run("aws", [
    "s3",
    "cp",
    path.join(distNotesDirectory, "styles.css"),
    `${destination}/styles.css`,
    "--cache-control",
    "no-cache",
    "--content-type",
    "text/css; charset=utf-8",
  ]);

  const assetsPath = path.join(distNotesDirectory, "assets");
  if (fs.existsSync(assetsPath)) {
    run("aws", ["s3", "cp", assetsPath, `${destination}/assets`, "--recursive", "--cache-control", "no-cache"]);
  }

  const faviconPath = path.join(distNotesDirectory, "favicon.svg");
  if (fs.existsSync(faviconPath)) {
    run("aws", [
      "s3",
      "cp",
      faviconPath,
      `${destination}/favicon.svg`,
      "--cache-control",
      "no-cache",
      "--content-type",
      "image/svg+xml",
    ]);
  }
}

function invalidate(options) {
  if (!options.invalidate) {
    return undefined;
  }

  const output = run(
    "aws",
    ["cloudfront", "create-invalidation", "--distribution-id", options.distributionId, "--paths", `/${options.prefix}*`, `/${options.prefix}/*`, "--output", "json"],
    { capture: true },
  );
  const parsed = JSON.parse(output);
  const invalidationId = parsed.Invalidation.Id;
  console.log(`[publish-posts] InvalidationId=${invalidationId}`);

  if (options.wait) {
    run("aws", ["cloudfront", "wait", "invalidation-completed", "--distribution-id", options.distributionId, "--id", invalidationId]);
  }

  return invalidationId;
}

export function renderPublishOutput(options = parseArgs([])) {
  syncStyles(root);

  const posts = getAllPosts();
  if (options.requireSlug && !posts.some((post) => post.slug === options.requireSlug)) {
    throw new Error(`No published post found for required slug: ${options.requireSlug}`);
  }

  fs.rmSync(distNotesDirectory, { recursive: true, force: true });
  fs.mkdirSync(distNotesDirectory, { recursive: true });
  fs.cpSync(publicNotesDirectory, distNotesDirectory, { recursive: true });

  writeFile("index.html", renderIndex(posts));
  writeFile(path.join("categories", "index.html"), renderCategoryIndex(posts));
  for (const category of categoriesWithPosts(posts)) {
    writeFile(path.join("categories", category.id, "index.html"), renderCategoryPage(category));
  }
  for (const post of posts) {
    writeFile(path.join(post.slug, "index.html"), renderPost(post));
  }
  writeFile("posts.manifest.json", renderManifest(posts));
  writeFile("sitemap.xml", renderSitemap(posts));

  return {
    outputPath: distNotesDirectory,
    posts,
  };
}

export function publish(options = parseArgs(process.argv.slice(2))) {
  const result = renderPublishOutput(options);
  console.log(`[publish-posts] rendered ${result.posts.length} published post(s) to ${path.relative(root, result.outputPath)}`);

  run(process.execPath, [path.join(root, "scripts", "verify-build.mjs")]);
  result.releaseFiles = printReleaseInventory(result.outputPath);

  if (options.dryRun || options.upload) {
    validateTarget(options);
    previewUpload(options);
  }

  if (options.upload) {
    upload(options);
    result.invalidationId = invalidate(options);
  } else if (options.dryRun) {
    console.log("[publish-posts] dry run complete; no upload or invalidation was performed");
  } else {
    console.log("[publish-posts] local release complete; use --dry-run to preview AWS changes or --upload --confirm-full-release to publish");
  }

  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  publish();
}
