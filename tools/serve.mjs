#!/usr/bin/env node
// Локальный сервер без зависимостей: отдаёт файлы сайта, а любой другой путь — index.html (адреса вида /stage/3).
// Запуск: node tools/serve.mjs [порт]   → http://localhost:8080
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const PORT = +(process.argv[2] || process.env.PORT || 8080);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.md': 'text/markdown; charset=utf-8' };

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  // ресурсы с любого вложенного пути: /stage/assets/app.js → /assets/app.js
  const ai = p.indexOf('/assets/');
  if (ai > 0) p = p.slice(ai);
  let file = path.join(ROOT, path.normalize(p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory() || !p.startsWith('/assets/')) file = path.join(ROOT, 'index.html');
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log('Навигатор Тенно: http://localhost:' + PORT + '  (Ctrl+C — остановить)'));
