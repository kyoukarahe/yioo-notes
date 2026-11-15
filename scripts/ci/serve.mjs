import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
export async function serve(directory = 'dist', port = 8798, host = '127.0.0.1') {
  const base = fs.realpathSync(directory);
  const server = http.createServer((req, res) => {
    try {
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
      const pathname = decodeURIComponent(new URL(req.url, 'http://preview.invalid').pathname);
      if (!pathname.startsWith('/notes/') || pathname.includes('\\')) { res.writeHead(404).end(); return; }
      const file = path.resolve(base, `.${pathname}`, pathname.endsWith('/') ? 'index.html' : '');
      if (!file.startsWith(`${base}${path.sep}`) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
      const real = fs.realpathSync(file);
      if (!real.startsWith(`${base}${path.sep}`)) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
      if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
    } catch { res.writeHead(400).end(); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, resolve); });
  return server;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = await serve(process.env.NOTES_DIST ?? 'dist', Number(process.env.PORT ?? 8798), process.env.HOST ?? '127.0.0.1');
  console.log(`Notes preview: ${JSON.stringify(server.address())}/notes/`);
  for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => process.exit(0)));
}
