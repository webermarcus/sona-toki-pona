// server.js — toki pona course dev server
// Serves static files AND proxies /api/messages → api.anthropic.com
// so the browser never touches the Anthropic API directly (avoids CORS).
//
// Usage:  node server.js
// Then open http://localhost:3000
//
// No npm install needed — uses only built-in Node modules.

const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ── PUT YOUR KEY HERE ──────────────────────────────────────────────
const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY || "";
// ──────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.jsx':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.otf':  'font/otf',
  '.ttf':  'font/ttf',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {

  // ── CORS preflight ───────────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // ── Anthropic proxy ──────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/api/messages') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const bodyBuf = Buffer.from(body, 'utf8');
      const options = {
        hostname: 'api.anthropic.com',
        path:     '/v1/messages',
        method:   'POST',
        headers:  {
          'Content-Type':      'application/json',
          'Content-Length':    bodyBuf.length,
          'x-api-key':         ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
      };
      const proxyReq = https.request(options, proxyRes => {
        res.writeHead(proxyRes.statusCode, {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        proxyRes.pipe(res);
      });
      proxyReq.on('error', err => {
        console.error('Proxy error:', err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
      proxyReq.write(bodyBuf);
      proxyReq.end();
    });
    return;
  }

  // ── Static files ─────────────────────────────────────────────────
  let urlPath = req.url.split('?')[0]; // strip query strings
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(__dirname, urlPath);

  // Security: don't serve files outside the project directory
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404); res.end(`Not found: ${urlPath}`);
      } else {
        res.writeHead(500); res.end('Server error');
      }
      return;
    }
    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  sona toki pona — http://localhost:${PORT}\n`);
});