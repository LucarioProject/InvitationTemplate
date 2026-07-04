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
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4"
};

function sendFile(req, res, filePath, stats) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";
  const isAudio = contentType.startsWith("audio/");

  if (isAudio && req.headers.range) {
    const range = req.headers.range;
    const fileSize = stats.size;
    const parts = range.replace(/bytes=/, "").split("-");
    const start = Number.parseInt(parts[0], 10);
    const end = parts[1] ? Number.parseInt(parts[1], 10) : fileSize - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start >= fileSize || end >= fileSize) {
      res.writeHead(416, {
        "Content-Range": `bytes */${fileSize}`
      });
      res.end();
      return;
    }

    res.writeHead(206, {
      "Content-Type": contentType,
      "Content-Length": end - start + 1,
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000"
    });
    fs.createReadStream(filePath, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": stats.size,
    "Accept-Ranges": isAudio ? "bytes" : "none",
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
      sendFile(req, res, filePath, stats);
      return;
    }

    filePath = path.join(publicDir, "index.html");
    fs.stat(filePath, (indexError, indexStats) => {
      if (indexError) {
        res.writeHead(500);
        res.end("Internal Server Error");
        return;
      }

      sendFile(req, res, filePath, indexStats);
    });
  });
});

server.listen(port, () => {
  console.log(`Invitacion disponible en http://localhost:${port}`);
});
