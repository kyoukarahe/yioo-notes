import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function syncStyles(root = process.cwd()) {
  const source = path.join(root, "src", "styles", "global.css");
  const destination = path.join(root, "public", "notes", "styles.css");

  if (!fs.existsSync(source)) {
    throw new Error(`Missing source stylesheet: ${source}`);
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);

  return {
    source,
    destination,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = syncStyles();
  console.log(`[sync-styles] ${path.relative(process.cwd(), result.destination)} updated`);
}
