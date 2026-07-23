/* serve.mjs — tiny static server for the Odyssey World Studio.
   Usage: node harness/serve.mjs [port]   (default 8877)
   Range requests supported (audio seeking needs them). */
import { createServer } from "node:http";
import { stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PORT = +(process.argv[2] || 8877);
const MIME = { ".html":"text/html", ".mjs":"text/javascript", ".js":"text/javascript",
               ".json":"application/json", ".png":"image/png", ".css":"text/css",
               ".md":"text/plain; charset=utf-8", ".ogg":"audio/ogg", ".mp3":"audio/mpeg",
               ".wav":"audio/wav", ".jpeg":"image/jpeg", ".jpg":"image/jpeg", ".svg":"image/svg+xml" };

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = resolve(ROOT, "." + p);
    if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    const st = await stat(f);
    const type = MIME[extname(f).toLowerCase()] || "application/octet-stream";
    const range = req.headers.range;
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
      let start = m[1] ? +m[1] : 0;
      let end = m[2] ? +m[2] : st.size - 1;
      if (start >= st.size) { res.writeHead(416, { "content-range": `bytes */${st.size}` }); return res.end(); }
      end = Math.min(end, st.size - 1);
      res.writeHead(206, { "content-type": type, "cache-control": "no-store",
        "accept-ranges": "bytes", "content-length": end - start + 1,
        "content-range": `bytes ${start}-${end}/${st.size}` });
      createReadStream(f, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { "content-type": type, "cache-control": "no-store",
        "accept-ranges": "bytes", "content-length": st.size });
      createReadStream(f).pipe(res);
    }
  } catch (e) { res.writeHead(404); res.end("404"); }
}).listen(PORT, "127.0.0.1", () =>
  console.log(`Odyssey Halfworld → http://127.0.0.1:${PORT}/`));
