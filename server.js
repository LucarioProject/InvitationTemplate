const fs = require("fs");
const http = require("http");
const path = require("path");

const port = process.env.PORT || 8080;
const publicDir = path.join(__dirname, "public");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000"
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const requestedUrl = new URL(req.url, `http://${req.headers.host}`);
  const decodedPath = decodeURIComponent(requestedUrl.pathname);
  const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const relativePath = safePath === "/" ? "index.html" : safePath.replace(/^[/\\]/, "");
  let filePath = path.join(publicDir, relativePath);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(res, filePath);
      return;
    }

    filePath = path.join(publicDir, "index.html");
    sendFile(res, filePath);
  });
});

server.listen(port, () => {
  console.log(`Invitacion disponible en http://localhost:${port}`);
});
