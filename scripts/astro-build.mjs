import childProcess from "node:child_process";
import path from "node:path";

const root = process.cwd();
const astroBin = path.join(root, "node_modules", "astro", "astro.js");
const result = childProcess.spawnSync(process.execPath, [astroBin, "build", ...process.argv.slice(2)], {
  cwd: root,
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: "1",
  },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
