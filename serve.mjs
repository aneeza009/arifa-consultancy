// Zero-dependency static server for local preview. Usage: node serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const port = Number(process.argv[2] || process.env.PORT || 5173);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2'
};

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path.endsWith('/')) path += 'index.html';
    let file = normalize(join(root, path));
    if (!file.startsWith(root)) { res.writeHead(403).end('Forbidden'); return; }
    let s = await stat(file).catch(() => null);
    if (!s && !extname(file)) { file += '.html'; s = await stat(file).catch(() => null); }
    if (!s || s.isDirectory()) {
      const body = await readFile(join(root, '404.html')).catch(() => 'Not found');
      res.writeHead(404, { 'Content-Type': types['.html'] }).end(body); return;
    }
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(await readFile(file));
  } catch (e) { res.writeHead(500).end(String(e)); }
}).listen(port, () => console.log(`Arifa demo → http://localhost:${port}`));
