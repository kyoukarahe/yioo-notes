import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const notesIndex = path.join(dist, "notes", "index.html");
const manifestPath = path.join(dist, "notes", "posts.manifest.json");
const sitemapPath = path.join(dist, "notes", "sitemap.xml");
const astroAssetsPath = path.join(dist, "notes", "_astro");
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

if (!fs.existsSync(testImage)) {
  fail(`dist/notes/assets/posts/${testSlug}/test-image.webp is missing`);
}

if (!fs.existsSync(manifestPath)) {
  fail("dist/notes/posts.manifest.json is missing");
}

if (!fs.existsSync(sitemapPath)) {
  fail("dist/notes/sitemap.xml is missing");
}

if (!fs.existsSync(astroAssetsPath)) {
  fail("dist/notes/_astro is missing");
}

if (!walk(astroAssetsPath).some((filePath) => filePath.endsWith(".css"))) {
  fail("dist/notes/_astro CSS asset is missing");
}

for (const filePath of walk(dist)) {
  for (const segment of forbiddenSegments) {
    if (filePath.includes(segment)) {
      fail(`draft/private output detected: ${path.relative(root, filePath)}`);
    }
  }
}

if (fs.existsSync(testPost)) {
  const postHtml = fs.readFileSync(testPost, "utf8");
  if (!postHtml.includes(`<link rel="canonical" href="${testCanonical}">`)) {
    fail("test post canonical URL is missing or incorrect");
  }
  if (!postHtml.includes(`<meta property="og:url" content="${testCanonical}">`)) {
    fail("test post og:url is missing or incorrect");
  }
  if (!postHtml.includes(`/notes/assets/posts/${testSlug}/test-image.webp`)) {
    fail("test post image path is missing");
  }
  if (postHtml.includes('href="/_astro/')) {
    fail('test post references root /_astro assets instead of /notes/_astro');
  }
  if (!postHtml.includes('href="/notes/_astro/')) {
    fail("test post /notes/_astro stylesheet reference is missing");
  }
}

if (fs.existsSync(notesIndex)) {
  const indexHtml = fs.readFileSync(notesIndex, "utf8");
  if (indexHtml.includes('href="/_astro/')) {
    fail('notes index references root /_astro assets instead of /notes/_astro');
  }
  if (!indexHtml.includes('href="/notes/_astro/')) {
    fail("notes index /notes/_astro stylesheet reference is missing");
  }
}

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const post = manifest.posts?.find((item) => item.slug === testSlug);
  if (!post) {
    fail("test post is missing from posts.manifest.json");
  } else if (post.canonicalUrl !== testCanonical) {
    fail("test post manifest canonicalUrl is incorrect");
  }
}

if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  if (!sitemap.includes("<loc>https://yioo.link/notes/</loc>")) {
    fail("notes index is missing from sitemap.xml");
  }
  if (!sitemap.includes(`<loc>${testCanonical}</loc>`)) {
    fail("test post is missing from sitemap.xml");
  }
}

if (process.exitCode) {
  process.exit();
}

console.log(
  "[verify-build] dist/notes, test post, assets, manifest, sitemap, and SEO URLs verified",
);
