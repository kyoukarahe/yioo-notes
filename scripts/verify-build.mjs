import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const notesIndex = path.join(dist, "notes", "index.html");
const categoriesIndex = path.join(dist, "notes", "categories", "index.html");
const implementationCategory = path.join(dist, "notes", "categories", "implementation", "index.html");
const tagsIndex = path.join(dist, "notes", "tags", "index.html");
const aiAgentTagPage = path.join(dist, "notes", "tags", "ai-agent", "index.html");
const workflowTagPage = path.join(dist, "notes", "tags", "workflow", "index.html");
const manifestPath = path.join(dist, "notes", "posts.manifest.json");
const sitemapPath = path.join(dist, "notes", "sitemap.xml");
const rssPath = path.join(dist, "notes", "rss.xml");
const stylesPath = path.join(dist, "notes", "styles.css");
const fallbackSocialImagePath = path.join(dist, "notes", "assets", "social", "yioo-notes-og.png");
const fallbackSocialImageUrl = "https://yioo.link/notes/assets/social/yioo-notes-og.png";
const publishedSlug = "2026-08-11-how-to-use-llm-wiki";
const publishedPost = path.join(dist, "notes", publishedSlug, "index.html");
const coverImage = path.join(
  dist,
  "notes",
  "assets",
  "posts",
  publishedSlug,
  "cover.webp",
);
const diagramImage = path.join(
  dist,
  "notes",
  "assets",
  "posts",
  publishedSlug,
  "memory-layers.webp",
);
const publishedCanonical = `https://yioo.link/notes/${publishedSlug}/`;
const koreanSiteDescription = "AI와 도구, 구현과 생활 속 선택을 조사하고 생각한 글을 모아 둡니다.";
const koreanCategoryDescription = "Yioo Notes의 글을 주제별로 모아 봅니다.";
const expectedRelated = new Map([
  ["2026-08-11-how-to-use-llm-wiki", ["2026-08-12-how-to-verify-ai-agent-completion", "2026-08-16-long-agent-task-control"]],
  ["2026-08-12-how-to-verify-ai-agent-completion", ["2026-08-16-data-canonical-before-formulas", "2026-08-16-long-agent-task-control"]],
  ["2026-08-16-data-canonical-before-formulas", ["2026-08-12-how-to-verify-ai-agent-completion"]],
  ["2026-08-16-long-agent-task-control", ["2026-08-11-how-to-use-llm-wiki", "2026-08-12-how-to-verify-ai-agent-completion"]],
]);
const expectedFooterLinks = [
  ["/privacy_policy.html", "개인정보처리방침"],
  ["/terms.html", "이용약관"],
  ["/support.html", "도움말·FAQ"],
  ["/tools/", "도구"],
  ["/contact.html", "문의"],
];
const expectedFooterCopyright = "© 2026 Yioo. All rights reserved.";
const forbiddenSegments = [
  `${path.sep}drafts${path.sep}`,
  `${path.sep}private${path.sep}`,
];

function fail(message) {
  console.error(`[verify-build] ${message}`);
  process.exitCode = 1;
}

function walk(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

if (!fs.existsSync(notesIndex)) {
  fail("dist/notes/index.html is missing");
}

if (!fs.existsSync(publishedPost)) {
  fail(`dist/notes/${publishedSlug}/index.html is missing`);
}

if (!fs.existsSync(categoriesIndex)) {
  fail("dist/notes/categories/index.html is missing");
}

if (!fs.existsSync(implementationCategory)) {
  fail("dist/notes/categories/implementation/index.html is missing");
}

for (const [filePath, label] of [
  [tagsIndex, "tag index"],
  [aiAgentTagPage, "ai-agent tag page"],
  [workflowTagPage, "workflow tag page"],
]) {
  if (!fs.existsSync(filePath)) {
    fail(`${label} is missing`);
  }
}

if (!fs.existsSync(coverImage)) {
  fail(`dist/notes/assets/posts/${publishedSlug}/cover.webp is missing`);
}

if (!fs.existsSync(diagramImage)) {
  fail(`dist/notes/assets/posts/${publishedSlug}/memory-layers.webp is missing`);
}

if (!fs.existsSync(manifestPath)) {
  fail("dist/notes/posts.manifest.json is missing");
}

if (!fs.existsSync(sitemapPath)) {
  fail("dist/notes/sitemap.xml is missing");
}

if (!fs.existsSync(rssPath)) {
  fail("dist/notes/rss.xml is missing");
}

if (!fs.existsSync(stylesPath)) {
  fail("dist/notes/styles.css is missing");
}

if (!fs.existsSync(fallbackSocialImagePath)) {
  fail("dist/notes/assets/social/yioo-notes-og.png is missing");
} else {
  const png = fs.readFileSync(fallbackSocialImagePath);
  const signature = png.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a" || png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) {
    fail("fallback social image must be a 1200x630 PNG");
  }
}

for (const filePath of walk(dist)) {
  for (const segment of forbiddenSegments) {
    if (filePath.includes(segment)) {
      fail(`draft/private output detected: ${path.relative(root, filePath)}`);
    }
  }
}

for (const htmlPath of walk(path.join(dist, "notes")).filter((filePath) => filePath.endsWith(".html"))) {
  const label = path.relative(dist, htmlPath).replaceAll(path.sep, "/");
  const html = fs.readFileSync(htmlPath, "utf8");
  const footerCount = [...html.matchAll(/<footer class="site-footer">/g)].length;
  if (footerCount !== 1) {
    fail(`${label} must contain exactly one global footer, found ${footerCount}`);
    continue;
  }
  if (!html.includes('<nav class="footer-nav" aria-label="하단 메뉴">')) {
    fail(`${label} global footer navigation is missing`);
  }
  for (const [href, text] of expectedFooterLinks) {
    const link = `<a class="footer-link" href="${href}">${text}</a>`;
    if (!html.includes(link)) {
      fail(`${label} global footer link is missing: ${href}`);
    }
  }
  if (!html.includes(`<p class="footer-copyright">${expectedFooterCopyright}</p>`)) {
    fail(`${label} global footer copyright is missing or incorrect`);
  }
  const mainEnd = html.indexOf("</main>");
  const footerStart = html.indexOf('<footer class="site-footer">');
  const bodyEnd = html.indexOf("</body>");
  if (mainEnd === -1 || bodyEnd === -1 || footerStart < mainEnd || footerStart > bodyEnd) {
    fail(`${label} global footer must remain outside main and before the closing body tag`);
  }
  const articleEnd = html.indexOf("</article>");
  if (articleEnd !== -1 && footerStart < articleEnd) {
    fail(`${label} global footer must remain outside article content`);
  }
}

function verifyPostHtml(postPath, slug, canonical, imagePaths) {
  if (!fs.existsSync(postPath)) {
    return;
  }

  const postHtml = fs.readFileSync(postPath, "utf8");
  if (!postHtml.includes(`<link rel="canonical" href="${canonical}">`)) {
    fail(`${slug} canonical URL is missing or incorrect`);
  }
  if (!postHtml.includes(`<meta property="og:url" content="${canonical}">`)) {
    fail(`${slug} og:url is missing or incorrect`);
  }
  for (const imagePath of imagePaths) {
    if (!postHtml.includes(imagePath)) {
      fail(`${slug} image path is missing: ${imagePath}`);
    }
  }
  if (postHtml.includes('href="/_astro/') || postHtml.includes('href="/notes/_astro/')) {
    fail(`${slug} references generated _astro stylesheet assets instead of /notes/styles.css`);
  }
  if (!postHtml.includes('href="/notes/styles.css"')) {
    fail(`${slug} /notes/styles.css stylesheet reference is missing`);
  }
  const headingIds = [...postHtml.matchAll(/<h2 id="([^"]+)">/g)]
    .map((match) => match[1])
    .filter((id) => id !== "related-posts-title");
  if (headingIds.length >= 3) {
    if (!postHtml.includes('<details class="article-toc" open>')) {
      fail(`${slug} automatic article TOC is missing`);
    }
    if (!postHtml.includes('<nav aria-label="글 목차">')) {
      fail(`${slug} semantic TOC navigation is missing`);
    }
    for (const id of headingIds) {
      if (!postHtml.includes(`href="#${id}"`)) {
        fail(`${slug} TOC is missing the heading target: ${id}`);
      }
    }
  }
  if (new Set(headingIds).size !== headingIds.length) {
    fail(`${slug} contains duplicate H2 ids`);
  }
}

function verifySocialMetadata(html, label, expectedImageUrl) {
  const required = [
    `<meta property="og:image" content="${expectedImageUrl}">`,
    `<meta property="og:image:secure_url" content="${expectedImageUrl}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:image" content="${expectedImageUrl}">`,
  ];
  for (const fragment of required) {
    if (!html.includes(fragment)) {
      fail(`${label} social metadata is missing: ${fragment}`);
    }
  }
  if (!/<meta property="og:image:alt" content="[^"]+">/.test(html)) {
    fail(`${label} og:image:alt is missing or empty`);
  }
  if (!/<meta name="twitter:image:alt" content="[^"]+">/.test(html)) {
    fail(`${label} twitter:image:alt is missing or empty`);
  }
}

verifyPostHtml(
  publishedPost,
  publishedSlug,
  publishedCanonical,
  [
    `/notes/assets/posts/${publishedSlug}/cover.webp`,
    `/notes/assets/posts/${publishedSlug}/memory-layers.webp`,
  ],
);

if (fs.existsSync(notesIndex)) {
  const indexHtml = fs.readFileSync(notesIndex, "utf8");
  if (indexHtml.includes('href="/_astro/') || indexHtml.includes('href="/notes/_astro/')) {
    fail("notes index references generated _astro stylesheet assets instead of /notes/styles.css");
  }
  if (!indexHtml.includes('href="/notes/styles.css"')) {
    fail("notes index /notes/styles.css stylesheet reference is missing");
  }
  if (!indexHtml.includes('/notes/categories/implementation/')) {
    fail("notes index category link is missing");
  }
  if (!indexHtml.includes(`<meta name="description" content="${koreanSiteDescription}">`)) {
    fail("notes index Korean meta description is missing");
  }
  if (!indexHtml.includes(`<p>${koreanSiteDescription}</p>`)) {
    fail("notes index Korean visible description is missing");
  }
  verifySocialMetadata(indexHtml, "notes index", fallbackSocialImageUrl);
  if (!indexHtml.includes('href="/notes/tags/"')) {
    fail("notes index tag navigation link is missing");
  }
  if (!indexHtml.includes('<link rel="alternate" type="application/rss+xml" title="Yioo Notes RSS" href="/notes/rss.xml">')) {
    fail("notes index RSS autodiscovery link is missing");
  }
  if (!indexHtml.includes('<a class="post-tag" href="/notes/tags/ai-agent/">ai-agent</a>')) {
    fail("notes index repeated tag link is missing");
  }
  if (indexHtml.includes('href="/notes/tags/verification/"')) {
    fail("notes index exposes a singleton tag archive link");
  }
  for (const match of indexHtml.matchAll(/<a class="post-list-link"[\s\S]*?<\/a>/g)) {
    if (match[0].includes('class="post-tag"') || match[0].includes('class="post-category"')) {
      fail("notes index contains nested taxonomy links inside a post link");
    }
  }
}

if (fs.existsSync(tagsIndex)) {
  const tagIndexHtml = fs.readFileSync(tagsIndex, "utf8");
  for (const tag of ["ai-agent", "workflow"]) {
    if (!tagIndexHtml.includes(`href="/notes/tags/${tag}/"`)) {
      fail(`tag index is missing repeated tag: ${tag}`);
    }
  }
  if (tagIndexHtml.includes("#verification")) {
    fail("tag index includes singleton tag verification");
  }
}

for (const [filePath, tag] of [
  [aiAgentTagPage, "ai-agent"],
  [workflowTagPage, "workflow"],
]) {
  if (!fs.existsSync(filePath)) {
    continue;
  }
  const html = fs.readFileSync(filePath, "utf8");
  if (!html.includes(`<link rel="canonical" href="https://yioo.link/notes/tags/${tag}/">`)) {
    fail(`${tag} tag canonical URL is missing or incorrect`);
  }
  const postLinkCount = [...html.matchAll(/class="post-list-link"/g)].length;
  if (postLinkCount !== 2) {
    fail(`${tag} tag page must contain exactly two current posts, found ${postLinkCount}`);
  }
}

if (fs.existsSync(categoriesIndex)) {
  const categoryIndexHtml = fs.readFileSync(categoriesIndex, "utf8");
  if (!categoryIndexHtml.includes('href="/notes/styles.css"')) {
    fail("category index /notes/styles.css stylesheet reference is missing");
  }
  if (!categoryIndexHtml.includes('/notes/categories/implementation/')) {
    fail("implementation category link is missing from category index");
  }
  if (!categoryIndexHtml.includes(`<meta name="description" content="${koreanCategoryDescription}">`)) {
    fail("category index Korean meta description is missing");
  }
  if (!categoryIndexHtml.includes("관심 있는 주제에서 글을 찾아보세요.")) {
    fail("category index Korean visible description is missing");
  }
  if (categoryIndexHtml.includes("Primary sections for Yioo Notes posts.")) {
    fail("category index still contains the legacy English description");
  }
  verifySocialMetadata(categoryIndexHtml, "category index", fallbackSocialImageUrl);
}

if (fs.existsSync(implementationCategory)) {
  const categoryHtml = fs.readFileSync(implementationCategory, "utf8");
  if (!categoryHtml.includes('<link rel="canonical" href="https://yioo.link/notes/categories/implementation/">')) {
    fail("implementation category canonical URL is missing or incorrect");
  }
  if (!categoryHtml.includes(publishedCanonical)) {
    fail("implementation category page does not include the published post");
  }
}

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const post = manifest.posts?.find((item) => item.slug === publishedSlug);
  if (!post) {
    fail("published post is missing from posts.manifest.json");
  } else if (post.canonicalUrl !== publishedCanonical) {
    fail("published post manifest canonicalUrl is incorrect");
  } else if (post.category?.id !== "implementation") {
    fail("published post manifest category is incorrect");
  }

  for (const item of manifest.posts ?? []) {
    const htmlPath = path.join(dist, "notes", item.slug, "index.html");
    if (!fs.existsSync(htmlPath)) {
      continue;
    }
    const html = fs.readFileSync(htmlPath, "utf8");
    const expectedImageUrl = item.socialImage
      ? new URL(item.socialImage, "https://yioo.link").toString()
      : fallbackSocialImageUrl;
    verifySocialMetadata(html, item.slug, expectedImageUrl);
    const related = expectedRelated.get(item.slug) ?? [];
    if (JSON.stringify(item.related ?? []) !== JSON.stringify(related)) {
      fail(`${item.slug} manifest related-post list is incorrect`);
    }
    if (related.length > 0) {
      if (!html.includes('<aside class="related-posts" aria-labelledby="related-posts-title">')) {
        fail(`${item.slug} related-post section is missing`);
      }
      for (const relatedSlug of related) {
        if (!html.includes(`href="/notes/${relatedSlug}/"`)) {
          fail(`${item.slug} is missing related post link: ${relatedSlug}`);
        }
      }
      if (html.indexOf('class="related-posts"') < html.indexOf("</article>")) {
        fail(`${item.slug} related posts must remain outside the article so the disclosure stays at the article end`);
      }
    } else if (html.includes('class="related-posts"')) {
      fail(`${item.slug} contains an uncurated related-post section`);
    }
  }
}

if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  if (!sitemap.includes("<loc>https://yioo.link/notes/</loc>")) {
    fail("notes index is missing from sitemap.xml");
  }
  if (!sitemap.includes("<loc>https://yioo.link/notes/categories/</loc>")) {
    fail("category index is missing from sitemap.xml");
  }
  if (!sitemap.includes("<loc>https://yioo.link/notes/categories/implementation/</loc>")) {
    fail("implementation category page is missing from sitemap.xml");
  }
  for (const url of [
    "https://yioo.link/notes/tags/",
    "https://yioo.link/notes/tags/ai-agent/",
    "https://yioo.link/notes/tags/workflow/",
  ]) {
    if (!sitemap.includes(`<loc>${url}</loc>`)) {
      fail(`tag URL is missing from sitemap.xml: ${url}`);
    }
  }
  if (sitemap.includes("https://yioo.link/notes/tags/verification/")) {
    fail("singleton tag archive is present in sitemap.xml");
  }
  if (!sitemap.includes(`<loc>${publishedCanonical}</loc>`)) {
    fail("published post is missing from sitemap.xml");
  }
}

if (fs.existsSync(rssPath) && fs.existsSync(manifestPath)) {
  const rss = fs.readFileSync(rssPath, "utf8");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const requiredFragments = [
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<atom:link href="https://yioo.link/notes/rss.xml" rel="self" type="application/rss+xml"/>',
    "<language>ko</language>",
    `<description>${koreanSiteDescription}</description>`,
  ];
  for (const fragment of requiredFragments) {
    if (!rss.includes(fragment)) {
      fail(`RSS required fragment is missing: ${fragment}`);
    }
  }
  const itemCount = [...rss.matchAll(/<item>/g)].length;
  if (itemCount !== (manifest.posts?.length ?? 0)) {
    fail(`RSS item count ${itemCount} does not match manifest count ${manifest.posts?.length ?? 0}`);
  }
  let previousIndex = -1;
  for (const post of manifest.posts ?? []) {
    const itemIndex = rss.indexOf(`<guid isPermaLink="true">${post.canonicalUrl}</guid>`);
    if (itemIndex === -1) {
      fail(`RSS is missing published post: ${post.slug}`);
    } else if (itemIndex <= previousIndex) {
      fail(`RSS post order differs from the manifest at: ${post.slug}`);
    }
    previousIndex = itemIndex;
  }
  if (/(content\/drafts|content\/private|\/notes\/drafts\/|\/notes\/private\/)/i.test(rss)) {
    fail("RSS contains a draft/private path");
  }
}

if (process.exitCode) {
  process.exit();
}

console.log(
  "[verify-build] dist/notes, published post, assets, manifest, sitemap, and SEO URLs verified",
);
