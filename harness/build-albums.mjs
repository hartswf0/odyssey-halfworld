/* build-albums.mjs — scan audio/<ALBUM>/ folders for tracks and write
   audio/albums.json. Drop a new album folder (or symlink) into audio/ and
   re-run:  node harness/build-albums.mjs */
import { readdir, writeFile, stat } from "node:fs/promises";
import { dirname, resolve, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const AUD = resolve(ROOT, "audio");
const EXT = new Set([".ogg", ".mp3", ".wav", ".m4a"]);

function cleanTitle(file) {
  const base = basename(file, extname(file));
  const parts = base.split(" - ").map(x => x.trim()).filter(Boolean);
  if (parts.length >= 3) return parts.slice(1, -1).join(" - "); // Album - Title - Artist
  if (parts.length === 2) return parts[/\d/.test(parts[0]) ? 0 : 1];
  return base;
}
const numOf = t => { const m = /^(\d{1,2})[_\s.-]/.exec(t); return m ? +m[1] : null; };

const albums = [];
for (const dir of (await readdir(AUD, { withFileTypes: true }))) {
  const full = resolve(AUD, dir.name);
  let isDir = dir.isDirectory();
  if (dir.isSymbolicLink()) { try { isDir = (await stat(full)).isDirectory(); } catch { continue; } }
  if (!isDir) continue;
  const files = (await readdir(full)).filter(f => EXT.has(extname(f).toLowerCase())).sort();
  if (!files.length) continue;
  /* optional curated title→book map for albums without NN_ prefixes */
  let bookmap = {};
  try { bookmap = JSON.parse(await (await import("node:fs/promises")).readFile(resolve(full, "bookmap.json"), "utf8")); } catch {}
  albums.push({
    id: dir.name.toLowerCase().replace(/\W+/g, "-"),
    name: dir.name.replace(/[-_]/g, " "),
    dir: "audio/" + dir.name,
    tracks: files.map(f => { const t = cleanTitle(f);
      const title = t.replace(/^\d{1,2}[_\s.-]+/, "");
      return { file: f, title, num: numOf(t) ?? bookmap[title] ?? null }; }),
  });
}
await writeFile(resolve(AUD, "albums.json"), JSON.stringify({ built: new Date().toISOString(), albums }, null, 1));
console.log("albums.json:", albums.map(a => a.name + " (" + a.tracks.length + " tracks)").join(" · "));
