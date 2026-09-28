import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { source, syncAssets } from './sync-assets.mjs';

const root = fileURLToPath(new URL('../dist', import.meta.url));
await syncAssets();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const server = http.createServer(async (request, response) => {
  try {
    const parsed = new URL(request.url, 'http://127.0.0.1');
    const requested = decodeURIComponent(parsed.pathname);
    const target = path.resolve(root, '.' + (requested === '/' ? '/index.html' : requested));
    if (!target.startsWith(root + path.sep)) { response.writeHead(403); response.end('Forbidden'); return; }
    const data = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(data);
  } catch { response.writeHead(404); response.end('Not found'); }
});
let debounce;
watch(source, () => { clearTimeout(debounce); debounce = setTimeout(() => syncAssets().then(result => console.log(`Assets actualizados: ${result.files}`)).catch(console.error), 350); });
server.listen(4173, '127.0.0.1', () => console.log('DanceFit listo: http://127.0.0.1:4173'));
