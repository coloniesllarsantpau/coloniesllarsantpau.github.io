const fs = require('fs');
const http = require('http');
const path = require('path');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
};

// Servidor estàtic a localhost (context segur, on els service workers funcionen) que imita Pages:
// /ruta fa 301 a /ruta/ i una ruta inexistent dona 404. El directori servit es pot canviar amb
// `serveix(dir)` sense canviar d'origen, com quan es publica una versió nova de la web.
async function startServer(initialDir) {
  let dir = initialDir;
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.join(dir, pathname);
    if (!file.startsWith(dir)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: `${pathname}/` }).end();
        return;
      }
      file = path.join(file, 'index.html');
    }
    if (!fs.existsSync(file)) {
      res.writeHead(404).end('no trobat');
      return;
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return {
    url: `http://localhost:${server.address().port}`,
    serveix(newDir) {
      dir = newDir;
    },
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

module.exports = { startServer };
