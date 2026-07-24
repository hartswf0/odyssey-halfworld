/* build-drive-audio.mjs — pre-render the whole radio play with Gemini TTS.
   Casts every speaker with a director note, performs OUR authored lines,
   stitches per-scene WAV with the score's own pause timings, encodes m4a
   (afconvert, macOS), and writes drive/voice-manifest.json with per-segment
   start/dur so the page can sync captions to the audio.

   Usage:
     node harness/build-drive-audio.mjs            # all scenes (resumable)
     node harness/build-drive-audio.mjs 1 2        # only books 1 and 2
   Key: harness/.gemini-key (gitignored). Model: gemini-3.1-flash-tts-preview. */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const run = promisify(execFile);

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const KEY = (await readFile(resolve(ROOT, "harness/.gemini-key"), "utf8")).trim();
/* each TTS model carries its OWN 100-requests/day interactive quota; the
   prebuilt voices are the same cast on all of them */
const MODEL = process.env.TTS_MODEL || "gemini-3.1-flash-tts-preview";
const OUT = resolve(ROOT, "drive/voice");
await mkdir(OUT, { recursive: true });

const SCRIPT = JSON.parse(await readFile(resolve(ROOT, "drive/drive-script.json"), "utf8"));
const SPOKEN = JSON.parse(await readFile(resolve(ROOT, "viewer/spoken-lines.json"), "utf8")).lines;

/* ── THE CAST — prebuilt Gemini voices + director notes ── */
const CAST = {
  "PERFORMER.NARRATOR": ["Charon", "an ancient bard by a low fire — deep, unhurried, embers in the voice"],
  "character.zeus": ["Alnilam", "immense calm authority, slow thunder behind every word"],
  "character.athena": ["Kore", "bright incisive steel with a flicker of amusement"],
  "character.athena-mentes": ["Kore", "a goddess wearing a sea-captain's ease — steel under courtesy"],
  "character.athena-mentor": ["Kore", "a goddess in an old man's patience — steel under kindness"],
  "character.odysseus": ["Iapetus", "weathered cunning, warm gravel, a king even in rags"],
  "character.odysseus-beggar": ["Iapetus", "a king disguised as a beggar — roughened, careful, watching everything"],
  "character.telemachus": ["Leda", "young and earnest, finding his spine as he speaks"],
  "character.penelope": ["Vindemiatrix", "grave grace, sorrow held in check by intelligence"],
  "character.hermes": ["Laomedeia", "quick and winged, light irony, always halfway gone"],
  "character.calypso": ["Despina", "honeyed and slow, wounded pride beneath the sweetness"],
  "character.circe": ["Sulafat", "a warm enchantress — dangerous ease, every word a door"],
  "character.poseidon": ["Gacrux", "vast cold wrath, the patience of the sea"],
  "creature.polyphemus": ["Algenib", "monstrous and slow, hunger in the throat"],
  "character.menelaus": ["Orus", "seasoned royal warmth with old grief underneath"],
  "character.helen": ["Callirrhoe", "silken and knowing, the most watched voice in the world"],
  "character.nestor": ["Sadaltager", "old counsel, fond of the long way round a story"],
  "character.eumaeus": ["Achird", "loyal homespun warmth, grief worn soft"],
  "character.nausicaa": ["Aoede", "breezy, young, braver than she expected to be"],
  "character.alcinous": ["Schedar", "an even kingly host, generous and firm"],
  "character.arete": ["Autonoe", "queenly warmth, shrewd eyes"],
  "character.antinous": ["Pulcherrima", "arrogant, forward, born entitled"],
  "character.eurymachus": ["Umbriel", "smooth false courtesy over a blade"],
  "character.eurylochus": ["Fenrir", "fear-driven urgency, mutiny in the chest"],
  "character.tiresias": ["Enceladus", "breathy prophecy from beyond the grave, unhurried by the living"],
  "character.anticleia": ["Achernar", "soft, grieving, reaching"],
  "character.agamemnon": ["Gacrux", "a murdered king's bitterness, warning from the dark"],
  "character.elpenor": ["Zephyr", "young, dazed, pleading from the threshold of death"],
  "character.ino": ["Erinome", "clear sea-light, urgent mercy"],
  "character.theoclymenus": ["Enceladus", "a fugitive seer, omens crowding his sight"],
  "character.laertes": ["Sadaltager", "an old man in an orchard, weathered by waiting"],
};
const ENSEMBLE = ["Rasalgethi", "many voices moving as one body"];
const FALLBACK = [["Puck","a lively voice of the old world"],["Erinome","a clear voice of the old world"],
  ["Algieba","a smooth voice of the old world"],["Sadachbia","a bright voice of the old world"],
  ["Zephyr","a light voice of the old world"]];
const vhash = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
function castFor(id) {
  if (CAST[id]) return CAST[id];
  if (/^ensemble\./.test(id)) return ENSEMBLE;
  return FALLBACK[vhash(id) % FALLBACK.length];
}

/* ── segment → performed prompt ── */
function segText(seg) {
  if (seg.kind === "DIALOGUE" && seg.sourceTurnId && SPOKEN[seg.sourceTurnId]?.line)
    return SPOKEN[seg.sourceTurnId].line;
  return seg.text || "";
}
function segPrompt(seg) {
  const [, note] = castFor(seg.speakerId || "PERFORMER.NARRATOR");
  const dir = seg.sourceTurnId && SPOKEN[seg.sourceTurnId]?.direction;
  const tag =
    seg.kind === "SCENE_HEADER" ? "[measured, formal]" :
    seg.kind === "SPEAKER_CUE" ? "[quiet, quick]" :
    seg.kind === "AUDITORY_ACTION" ? "[low, vivid]" :
    seg.kind === "NARRATION" ? "[flowing]" :
    dir ? "[" + dir.replace(/[\[\]]/g, "") + "]" : "";
  return `You are ${seg.speakerName || "the narrator"} in a dramatic audio performance of Homer's Odyssey — ${note}. Perform the line; never announce yourself, never read flatly. ${tag} ${segText(seg)}`;
}

/* ── Gemini TTS (returns PCM16 mono 24k) with backoff + RPM throttle ── */
const RPM = +(process.env.TTS_RPM || 0);          /* e.g. 9 for a 10 RPM model */
let lastReq = 0;
async function throttle() {
  if (!RPM) return;
  const gap = 60000 / RPM;
  const wait = lastReq + gap - Date.now();
  lastReq = Math.max(Date.now(), lastReq + gap);
  if (wait > 0) await new Promise(s => setTimeout(s, wait));
}
async function tts(prompt, voice) {
  for (let attempt = 0; attempt < 5; attempt++) {
    await throttle();
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
      }),
    });
    if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 4000 * (attempt + 1))); continue; }
    const j = await r.json();
    if (j.error) throw new Error(j.error.message?.slice(0, 160) || "api error");
    const d = j.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData;
    if (!d) { await new Promise(s => setTimeout(s, 2000)); continue; }
    return Buffer.from(d.data, "base64");
  }
  throw new Error("tts failed after retries");
}

/* ── WAV writer ── */
function wav(pcm) {
  const h = Buffer.alloc(44), rate = 24000;
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}
const silence = ms => Buffer.alloc(Math.round(24000 * ms / 1000) * 2);

/* ── PARALLEL pipeline: a global request pool feeds several scenes at once ── */
const SEG_CONC = +(process.env.TTS_CONC || 8);   /* concurrent TTS requests */
const SCENE_CONC = 3;                             /* scenes in flight */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}
const only = process.argv.slice(2).map(Number).filter(Boolean);
const MANIFEST_PATH = resolve(ROOT, "drive/voice-manifest.json");
let MAN = {};
try { MAN = JSON.parse(await readFile(MANIFEST_PATH, "utf8")); } catch {}
let done = 0, made = 0, failedScenes = 0;
const t0 = Date.now();
async function buildScene(sc) {
  const m4a = resolve(OUT, sc.id + ".m4a");
  if (MAN[sc.id]) { try { await access(m4a); done++; return; } catch {} }
  const segs = sc.segments.filter(g => (segText(g) || "").trim());
  /* all segments of the scene generate CONCURRENTLY; order restored at stitch */
  const pcms = await mapLimit(segs, SEG_CONC, async seg => {
    const [voice] = castFor(seg.speakerId || "PERFORMER.NARRATOR");
    try { return await tts(segPrompt(seg), voice); }
    catch (e) { console.error("  seg failed:", sc.id, seg.kind, e.message); return null; }
  });
  if (pcms.some(p => !p)) { failedScenes++; return; }
  const parts = [], timing = []; let t = 0;
  segs.forEach((seg, k) => {
    const pcm = pcms[k], dur = pcm.length / 2 / 24000;
    timing.push({ gi: sc.segments.indexOf(seg), start: +t.toFixed(2), dur: +dur.toFixed(2) });
    parts.push(pcm); t += dur;
    const gap = Math.min(1600, seg.pauseAfterMs || 260);
    parts.push(silence(gap)); t += gap / 1000;
  });
  const wavPath = resolve(OUT, sc.id + ".wav");
  await writeFile(wavPath, wav(Buffer.concat(parts)));
  await run("afconvert", ["-f", "m4af", "-d", "aac", "-b", "64000", wavPath, m4a]);
  await run("rm", [wavPath]);
  MAN[sc.id] = { file: "drive/voice/" + sc.id + ".m4a", total: +t.toFixed(2), segments: timing };
  await writeFile(MANIFEST_PATH, JSON.stringify(MAN));
  made++;
  console.log(sc.id, "·", timing.length, "segs ·", t.toFixed(1) + "s ·",
    ((Date.now() - t0) / 60000).toFixed(1) + "min elapsed");
}
const queue = SCRIPT.scenes.filter(sc => !only.length || only.includes(sc.book));
await mapLimit(queue, SCENE_CONC, buildScene);
console.log("voice scenes:", Object.keys(MAN).length,
  "(", made, "new,", done, "already,", failedScenes, "failed — re-run to retry )");
