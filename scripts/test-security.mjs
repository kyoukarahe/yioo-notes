import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  renderMarkdownDocumentSafely,
  renderMarkdownSafely,
  serializeJsonForScript,
} from "../src/lib/content-security.mjs";
import { renderRssFeed } from "../src/lib/feed.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publishScript = path.join(root, "scripts", "publish-posts.mjs");
const deployScript = path.join(root, "scripts", "deploy.ps1");

function spawn(command, args, env = process.env) {
  return childProcess.spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    env,
    shell: false,
  });
}

function output(result) {
  return `${result.stdout ?? ""}\n${result.stderr ?? ""}\n${result.error?.stack ?? ""}`;
}

function publishedSlug() {
  for (const name of fs.readdirSync(path.join(root, "content", "posts")).filter((value) => value.endsWith(".md"))) {
    const raw = fs.readFileSync(path.join(root, "content", "posts", name), "utf8");
    if (/^status:\s*published\s*$/m.test(raw)) {
      const match = raw.match(/^slug:\s*([^\r\n]+)$/m);
      if (match) {
        return match[1].trim().replace(/^['"]|['"]$/g, "");
      }
    }
  }
  throw new Error("No published slug found for the security test.");
}

function readLog(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function assertNoAws(filePath, label) {
  assert.equal(readLog(filePath).split(/\r?\n/).some((line) => line.startsWith("aws ")), false, `${label} unexpectedly called AWS`);
}

const rendered = renderMarkdownSafely([
  "<script>alert('raw')</script>",
  "[unsafe](javascript:alert(1))",
  "[encoded](%6a%61vascript:alert(1))",
  "[entity](javascript&#58;alert(1))",
  "![unsafe image](data:text/html,boom)",
  "[safe](https://example.com/path)",
  "![safe image](/notes/assets/example.webp)",
].join("\n\n"));
assert.equal(rendered.includes("<script>"), false, "raw HTML must not become an active script");
assert.equal(/href="(?:javascript|data):/i.test(rendered), false, "dangerous link schemes must be removed");
assert.equal(/src="(?:javascript|data):/i.test(rendered), false, "dangerous image schemes must be removed");
assert.match(rendered, /href="https:\/\/example\.com\/path"/, "safe HTTPS links must remain usable");
assert.match(rendered, /src="\/notes\/assets\/example\.webp"/, "safe relative images must remain usable");

const headingDocument = renderMarkdownDocumentSafely([
  "## 같은 제목",
  "",
  "## 같은 제목",
  "",
  "## <img src=x onerror=alert(1)>",
].join("\n"));
assert.deepEqual(
  headingDocument.headings.map((heading) => heading.id),
  ["같은-제목", "같은-제목-2", "section"],
  "Korean heading ids must be stable and duplicate-aware",
);
assert.match(headingDocument.html, /<h2 id="같은-제목">같은 제목<\/h2>/);
assert.equal(headingDocument.html.includes("<img src=x"), false, "raw heading HTML must remain escaped");

const serialized = serializeJsonForScript({ value: "</script><script>alert(1)</script>&" });
assert.equal(serialized.includes("</script>"), false, "JSON-LD must not contain a literal closing script tag");
assert.equal(serialized.includes("<"), false, "JSON-LD must escape angle brackets");
assert.equal(serialized.includes("&"), false, "JSON-LD must escape ampersands");

const escapedFeed = renderRssFeed(
  [
    {
      canonicalUrl: "https://yioo.link/notes/safe/",
      date: "2026-08-27",
      summary: "요약 & <script>alert(1)</script>",
      tags: ["a&b"],
      title: "제목 <확인>",
    },
  ],
  { baseUrl: "https://yioo.link", description: "설명 & 확인", title: "Yioo Notes" },
);
assert.equal(escapedFeed.includes("<script>"), false, "RSS text must not contain active markup from content");
assert.match(escapedFeed, /요약 &amp; &lt;script&gt;/, "RSS descriptions must be XML escaped");
assert.match(escapedFeed, /<category>a&amp;b<\/category>/, "RSS categories must be XML escaped");

const publishSource = fs.readFileSync(publishScript, "utf8");
const deploySource = fs.readFileSync(deployScript, "utf8");
for (const [source, label] of [[publishSource, "publisher"], [deploySource, "PowerShell deployer"]]) {
  assert.match(source, /rss\.xml/, `${label} must handle the RSS object explicitly`);
  assert.match(source, /application\/rss\+xml; charset=utf-8/, `${label} must upload RSS with its feed MIME type`);
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "yioo-notes-security-"));
try {
  const callLog = path.join(tempRoot, "calls.log");
  fs.writeFileSync(path.join(tempRoot, "aws.cmd"), '@echo off\r\necho aws %*>>"%YIOO_TEST_CALL_LOG%"\r\nexit /b 91\r\n');
  fs.writeFileSync(
    path.join(tempRoot, "npm.cmd"),
    '@echo off\r\necho npm %*>>"%YIOO_TEST_CALL_LOG%"\r\nif /I "%1"=="run" if /I "%2"=="build" exit /b %YIOO_TEST_BUILD_EXIT%\r\nif /I "%1"=="run" if /I "%2"=="verify:build" exit /b %YIOO_TEST_VERIFY_EXIT%\r\nexit /b 0\r\n',
  );
  const shimEnv = {
    ...process.env,
    PATH: `${tempRoot}${path.delimiter}${process.env.PATH ?? ""}`,
    YIOO_TEST_BUILD_EXIT: "0",
    YIOO_TEST_CALL_LOG: callLog,
    YIOO_TEST_VERIFY_EXIT: "0",
  };

  const localPublish = spawn(process.execPath, [publishScript, "--require-slug", publishedSlug()], shimEnv);
  assert.equal(localPublish.status, 0, output(localPublish));
  assert.match(output(localPublish), /local release complete/, "default publisher path must remain local-only");
  assertNoAws(callLog, "default publisher path");

  const legacySlug = spawn(process.execPath, [publishScript, "--slug", publishedSlug()], shimEnv);
  assert.notEqual(legacySlug.status, 0, "legacy --slug must fail closed");
  assert.match(output(legacySlug), /full release/i);
  assertNoAws(callLog, "legacy slug rejection");

  const unconfirmedUpload = spawn(process.execPath, [publishScript, "--upload"], shimEnv);
  assert.notEqual(unconfirmedUpload.status, 0, "unconfirmed upload must fail closed");
  assert.match(output(unconfirmedUpload), /requires --confirm-full-release/);
  assertNoAws(callLog, "unconfirmed publisher upload");

  const unapprovedTarget = spawn(process.execPath, [publishScript, "--dry-run", "--bucket", "unexpected-bucket"], shimEnv);
  assert.notEqual(unapprovedTarget.status, 0, "target overrides must fail before AWS unless explicitly allowed");
  assert.match(output(unapprovedTarget), /requires --allow-target-override/);
  assertNoAws(callLog, "unapproved publisher target");

  const powershell = path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
  const unconfirmedDeploy = spawn(powershell, ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", deployScript], shimEnv);
  assert.notEqual(unconfirmedDeploy.status, 0, "unconfirmed deploy must fail before build or AWS");
  assert.match(output(unconfirmedDeploy), /requires -ConfirmFullRelease/);
  assertNoAws(callLog, "unconfirmed deploy");

  fs.writeFileSync(callLog, "");
  const buildFailure = spawn(
    powershell,
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", deployScript, "-ConfirmFullRelease", "-NoInvalidate"],
    { ...shimEnv, YIOO_TEST_BUILD_EXIT: "7", YIOO_TEST_VERIFY_EXIT: "0" },
  );
  assert.notEqual(buildFailure.status, 0, "deploy must stop when the build fails");
  assert.match(output(buildFailure), /npm\.cmd exited with code 7/);
  assertNoAws(callLog, "failed build");

  fs.mkdirSync(path.join(root, "dist", "notes"), { recursive: true });
  fs.writeFileSync(callLog, "");
  const verifyFailure = spawn(
    powershell,
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", deployScript, "-ConfirmFullRelease", "-NoInvalidate", "-SkipBuild"],
    { ...shimEnv, YIOO_TEST_BUILD_EXIT: "0", YIOO_TEST_VERIFY_EXIT: "9" },
  );
  assert.notEqual(verifyFailure.status, 0, "deploy must verify and stop even when -SkipBuild is used");
  assert.match(output(verifyFailure), /npm\.cmd exited with code 9/);
  assertNoAws(callLog, "failed verification");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log("Security regression tests passed.");
