import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const notesIndex = path.join(dist, "notes", "index.html");
const categoriesIndex = path.join(dist, "notes", "categories", "index.html");
const implementationCategory = path.join(dist, "notes", "categories", "implementation", "index.html");
const manifestPath = path.join(dist, "notes", "posts.manifest.json");
const sitemapPath = path.join(dist, "notes", "sitemap.xml");
const stylesPath = path.join(dist, "notes", "styles.css");
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

if (!fs.existsSync(stylesPath)) {
  fail("dist/notes/styles.css is missing");
}

for (const filePath of walk(dist)) {
  for (const segment of forbiddenSegments) {
    if (filePath.includes(segment)) {
      fail(`draft/private output detected: ${path.relative(root, filePath)}`);
    }
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
}

if (fs.existsSync(categoriesIndex)) {
  const categoryIndexHtml = fs.readFileSync(categoriesIndex, "utf8");
  if (!categoryIndexHtml.includes('href="/notes/styles.css"')) {
    fail("category index /notes/styles.css stylesheet reference is missing");
  }
  if (!categoryIndexHtml.includes('/notes/categories/implementation/')) {
    fail("implementation category link is missing from category index");
  }
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
  if (!sitemap.includes(`<loc>${publishedCanonical}</loc>`)) {
    fail("published post is missing from sitemap.xml");
  }
}

if (process.exitCode) {
  process.exit();
}

console.log(
  "[verify-build] dist/notes, published post, assets, manifest, sitemap, and SEO URLs verified",
);
