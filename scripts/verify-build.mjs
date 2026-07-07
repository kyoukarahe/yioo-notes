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
const testSlug = "2026-06-26-test-note";
const testPost = path.join(dist, "notes", testSlug, "index.html");
const testImage = path.join(
  dist,
  "notes",
  "assets",
  "posts",
  testSlug,
  "test-image.webp",
);
const testCanonical = `https://yioo.link/notes/${testSlug}/`;
const scriptTestSlug = "2026-06-26-script-publish-test";
const scriptTestPost = path.join(dist, "notes", scriptTestSlug, "index.html");
const scriptTestImage = path.join(
  dist,
  "notes",
  "assets",
  "posts",
  scriptTestSlug,
  "script-publish-flow.svg",
);
const scriptTestCanonical = `https://yioo.link/notes/${scriptTestSlug}/`;
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

if (!fs.existsSync(testPost)) {
  fail(`dist/notes/${testSlug}/index.html is missing`);
}

if (!fs.existsSync(categoriesIndex)) {
  fail("dist/notes/categories/index.html is missing");
}

if (!fs.existsSync(implementationCategory)) {
  fail("dist/notes/categories/implementation/index.html is missing");
}

if (!fs.existsSync(scriptTestPost)) {
  fail(`dist/notes/${scriptTestSlug}/index.html is missing`);
}

if (!fs.existsSync(testImage)) {
  fail(`dist/notes/assets/posts/${testSlug}/test-image.webp is missing`);
}

if (!fs.existsSync(scriptTestImage)) {
  fail(`dist/notes/assets/posts/${scriptTestSlug}/script-publish-flow.svg is missing`);
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

function verifyPostHtml(postPath, slug, canonical, imagePath) {
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
  if (!postHtml.includes(imagePath)) {
    fail(`${slug} image path is missing`);
  }
  if (postHtml.includes('href="/_astro/') || postHtml.includes('href="/notes/_astro/')) {
    fail(`${slug} references generated _astro stylesheet assets instead of /notes/styles.css`);
  }
  if (!postHtml.includes('href="/notes/styles.css"')) {
    fail(`${slug} /notes/styles.css stylesheet reference is missing`);
  }
}

verifyPostHtml(testPost, testSlug, testCanonical, `/notes/assets/posts/${testSlug}/test-image.webp`);
verifyPostHtml(
  scriptTestPost,
  scriptTestSlug,
  scriptTestCanonical,
  `/notes/assets/posts/${scriptTestSlug}/script-publish-flow.svg`,
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
  if (!categoryHtml.includes(testCanonical) || !categoryHtml.includes(scriptTestCanonical)) {
    fail("implementation category page does not include both test posts");
  }
}

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const post = manifest.posts?.find((item) => item.slug === testSlug);
  const scriptPost = manifest.posts?.find((item) => item.slug === scriptTestSlug);
  if (!post) {
    fail("test post is missing from posts.manifest.json");
  } else if (post.canonicalUrl !== testCanonical) {
    fail("test post manifest canonicalUrl is incorrect");
  } else if (post.category?.id !== "implementation") {
    fail("test post manifest category is incorrect");
  }
  if (!scriptPost) {
    fail("script publish test post is missing from posts.manifest.json");
  } else if (scriptPost.canonicalUrl !== scriptTestCanonical) {
    fail("script publish test post manifest canonicalUrl is incorrect");
  } else if (scriptPost.category?.id !== "implementation") {
    fail("script publish test post manifest category is incorrect");
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
  if (!sitemap.includes(`<loc>${testCanonical}</loc>`)) {
    fail("test post is missing from sitemap.xml");
  }
  if (!sitemap.includes(`<loc>${scriptTestCanonical}</loc>`)) {
    fail("script publish test post is missing from sitemap.xml");
  }
}

if (process.exitCode) {
  process.exit();
}

console.log(
  "[verify-build] dist/notes, test posts, assets, manifest, sitemap, and SEO URLs verified",
);
