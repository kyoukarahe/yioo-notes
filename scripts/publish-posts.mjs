import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { syncStyles } from "./sync-styles.mjs";

const root = process.cwd();
const siteConfig = JSON.parse(fs.readFileSync(path.join(root, "src", "config", "site.config.json"), "utf8"));
const postsDirectory = path.join(root, "content", "posts");
const publicNotesDirectory = path.join(root, "public", "notes");
const distNotesDirectory = path.join(root, "dist", "notes");

function parseArgs(argv) {
  const options = {
    bucket: "yioo-notes",
    distributionId: "EWYEJXEIKC81C",
    dryRun: false,
    invalidate: true,
    prefix: "notes",
    slug: undefined,
    upload: true,
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
    } else if (arg === "--slug") {
      options.slug = next();
    } else if (arg.startsWith("--slug=")) {
      options.slug = arg.slice("--slug=".length);
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--no-upload") {
      options.upload = false;
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

function escapeScriptJson(value) {
  return value.replaceAll("<", "\\u003c");
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

  return {
    body: parsed.content,
    canonical: canonicalPath,
    canonicalUrl: absoluteUrl(canonicalPath),
    cover,
    coverUrl: cover ? absoluteUrl(cover) : undefined,
    date: assertString(data.date, "date", filePath),
    html: marked.parse(parsed.content, { async: false }),
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

function renderJsonLd(data) {
  return `<script type="application/ld+json">${escapeScriptJson(JSON.stringify(data))}</script>`;
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
        ${
          post.tags.length > 0
            ? `<span class="post-tags" aria-label="Tags">${post.tags
                .map((tag) => `<span class="post-tag">${escapeHtml(tag)}</span>`)
                .join("")}</span>`
            : ""
        }
      </span>
    </a>
  </li>`,
  )
  .join("\n")}
</ol>`;
}

function renderIndex(posts) {
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
${renderPostList(posts)}`;

  return renderLayout({
    body,
    canonicalPath: "/notes/",
    currentPath: "/notes/",
    structuredData,
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
  const urls = [
    {
      lastmod: posts[0]?.updated ?? posts[0]?.date ?? new Date().toISOString().slice(0, 10),
      loc: absoluteUrl("/notes/"),
    },
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

function upload(options) {
  const destination = `s3://${options.bucket}/${options.prefix}`;
  const common = options.dryRun ? ["--dryrun"] : [];

  run("aws", ["s3", "sync", distNotesDirectory, destination, "--delete", "--cache-control", "no-cache", ...common]);
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
    ...common,
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
    ...common,
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
    ...common,
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
    ...common,
  ]);

  const assetsPath = path.join(distNotesDirectory, "assets");
  if (fs.existsSync(assetsPath)) {
    run("aws", ["s3", "cp", assetsPath, `${destination}/assets`, "--recursive", "--cache-control", "no-cache", ...common]);
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
      ...common,
    ]);
  }
}

function invalidate(options) {
  if (!options.invalidate || options.dryRun) {
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
  if (options.slug && !posts.some((post) => post.slug === options.slug)) {
    throw new Error(`No published post found for slug: ${options.slug}`);
  }

  fs.rmSync(distNotesDirectory, { recursive: true, force: true });
  fs.mkdirSync(distNotesDirectory, { recursive: true });
  fs.cpSync(publicNotesDirectory, distNotesDirectory, { recursive: true });

  writeFile("index.html", renderIndex(posts));
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

  if (options.upload) {
    upload(options);
    result.invalidationId = invalidate(options);
  } else {
    console.log("[publish-posts] skipped upload because --no-upload was set");
  }

  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  publish();
}
