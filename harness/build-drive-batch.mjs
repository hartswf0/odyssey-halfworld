/* build-drive-batch.mjs — the BATCH route for the studio voices.
   The interactive API caps at 100 requests/day on this tier; batch mode runs
   on its own quota at half price. Three subcommands:

     node harness/build-drive-batch.mjs submit   # JSONL of every missing segment → upload → create batch
     node harness/build-drive-batch.mjs poll     # check batch state (safe to re-run)
     node harness/build-drive-batch.mjs collect  # download results → stitch scenes → m4a + manifest
*/
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const run = promisify(execFile);

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const KEY = (await readFile(resolve(ROOT, "harness/.gemini-key"), "utf8")).trim();
const MODEL = "gemini-3.1-flash-tts-preview";
const API = "https://generativelanguage.googleapis.com";
const STATE_PATH = resolve(ROOT, "harness/.drive-batch-state.json");
const OUT = resolve(ROOT, "drive/voice");
await mkdir(OUT, { recursive: true });

const SCRIPT = JSON.parse(await readFile(resolve(ROOT, "drive/drive-script.json"), "utf8"));
const SPOKEN = JSON.parse(await readFile(resolve(ROOT, "viewer/spoken-lines.json"), "utf8")).lines;
const MANIFEST_PATH = resolve(ROOT, "drive/voice-manifest.json");
let MAN = {}; try { MAN = JSON.parse(await readFile(MANIFEST_PATH, "utf8")); } catch {}

/* ── cast + prompts (same law as the interactive builder) ── */
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
const castFor = id => CAST[id] || (/^ensemble\./.test(id) ? ENSEMBLE : FALLBACK[vhash(id) % FALLBACK.length]);
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

const api = (path, opts) => fetch(API + path + (path.includes("?") ? "&" : "?") + "key=" + KEY, opts)
  .then(async r => { const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = { raw: t }; }
    if (!r.ok) throw new Error("HTTP " + r.status + " · " + JSON.stringify(j).slice(0, 300)); return j; });

const cmd = process.argv[2] || "poll";

/* multi-batch state: {batches:[{op,label,segments,submitted}]} (legacy {op} upgraded) */
async function loadState(){
  try{const s=JSON.parse(await readFile(STATE_PATH,"utf8"));
    if(s.batches)return s;
    if(s.op)return {batches:[{op:s.op,label:"all",segments:s.segments,submitted:s.submitted}]};
  }catch{}
  return {batches:[]};
}
const saveState=s=>writeFile(STATE_PATH,JSON.stringify(s,null,1));
async function submitLines(lines,label){
  const jsonl=lines.join("\n");
  const boundary="odysseyB"+Date.now()+Math.floor(Math.random()*999);
  const body=Buffer.concat([
    Buffer.from(`--${boundary}\r\ncontent-type: application/json\r\n\r\n`+
      JSON.stringify({file:{displayName:"odyssey-"+label+".jsonl"}})+`\r\n`),
    Buffer.from(`--${boundary}\r\ncontent-type: application/jsonl\r\n\r\n`),
    Buffer.from(jsonl),
    Buffer.from(`\r\n--${boundary}--`),
  ]);
  const up=await fetch(`${API}/upload/v1beta/files?uploadType=multipart&key=${KEY}`,{
    method:"POST",headers:{"content-type":`multipart/related; boundary=${boundary}`},body});
  const upj=await up.json();
  if(!up.ok)throw new Error("upload failed: "+JSON.stringify(upj).slice(0,200));
  const fileName=upj.file?.name||upj.name;
  const batch=await api(`/v1beta/models/${MODEL}:batchGenerateContent`,{
    method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({batch:{displayName:"odyssey-"+label,inputConfig:{fileName}}})});
  return batch.name;
}
function linesForScene(sc){
  const out=[];
  sc.segments.forEach((seg,gi)=>{
    if(!(segText(seg)||"").trim())return;
    const [voice]=castFor(seg.speakerId||"PERFORMER.NARRATOR");
    out.push(JSON.stringify({key:sc.id+"|"+gi,request:{
      contents:[{parts:[{text:segPrompt(seg)}]}],
      generationConfig:{responseModalities:["AUDIO"],
        speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:voice}}}}}}));
  });
  return out;
}

if (cmd === "submit-books") {
  /* one BATCH PER BOOK — each book's audio lands and is visible independently */
  const books = process.argv.slice(3).map(Number).filter(Boolean);
  const st = await loadState();
  for (const b of books) {
    if (st.batches.some(x => x.label === "book-" + b)) { console.log("book", b, "— already submitted"); continue; }
    const scenes = SCRIPT.scenes.filter(sc => sc.book === b && !MAN[sc.id]);
    const lines = scenes.flatMap(linesForScene);
    if (!lines.length) { console.log("book", b, "— nothing to submit"); continue; }
    try {
      const op = await submitLines(lines, "book-" + String(b).padStart(2, "0"));
      st.batches.push({ op, label: "book-" + b, segments: lines.length, submitted: new Date().toISOString() });
      await saveState(st);                    /* save after EVERY book — crashes lose nothing */
      console.log("BOOK", b, "SUBMITTED:", op, "·", lines.length, "segments");
    } catch (e) {
      console.error("BOOK", b, "submit failed:", e.message.slice(0, 140), "— retrying in 30s");
      await new Promise(s => setTimeout(s, 30000));
      books.push(b);                          /* requeue at the end */
    }
  }

} else if (cmd === "submit") {
  /* every segment of every scene not yet in the manifest */
  const lines = [];
  for (const sc of SCRIPT.scenes) {
    if (MAN[sc.id]) continue;
    sc.segments.forEach((seg, gi) => {
      if (!(segText(seg) || "").trim()) return;
      const [voice] = castFor(seg.speakerId || "PERFORMER.NARRATOR");
      lines.push(JSON.stringify({ key: sc.id + "|" + gi, request: {
        contents: [{ parts: [{ text: segPrompt(seg) }] }],
        generationConfig: { responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
      }}));
    });
  }
  if (!lines.length) { console.log("nothing to submit — all scenes have audio"); process.exit(0); }
  const jsonl = lines.join("\n");
  console.log("segments to render:", lines.length, "·", (jsonl.length / 1024).toFixed(0) + "KB jsonl");
  /* upload the JSONL via the File API (multipart) */
  const boundary = "odysseyB" + Date.now();
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\ncontent-type: application/json\r\n\r\n` +
      JSON.stringify({ file: { displayName: "odyssey-voice-batch.jsonl" } }) + `\r\n`),
    Buffer.from(`--${boundary}\r\ncontent-type: application/jsonl\r\n\r\n`),
    Buffer.from(jsonl),
    Buffer.from(`\r\n--${boundary}--`),
  ]);
  const up = await fetch(`${API}/upload/v1beta/files?uploadType=multipart&key=${KEY}`, {
    method: "POST", headers: { "content-type": `multipart/related; boundary=${boundary}` }, body });
  const upj = await up.json();
  if (!up.ok) { console.error("upload failed:", JSON.stringify(upj).slice(0, 400)); process.exit(1); }
  const fileName = upj.file?.name || upj.name;
  console.log("uploaded:", fileName);
  const batch = await api(`/v1beta/models/${MODEL}:batchGenerateContent`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ batch: { displayName: "odyssey-studio-voices",
      inputConfig: { fileName } } }),
  });
  await writeFile(STATE_PATH, JSON.stringify({ op: batch.name, submitted: new Date().toISOString(),
    segments: lines.length }, null, 1));
  console.log("BATCH SUBMITTED:", batch.name, "· poll with: node harness/build-drive-batch.mjs poll");

} else if (cmd === "poll") {
  const st = await loadState();
  let doneCount = 0;
  for (const b of st.batches) {
    const op = await api(`/v1beta/${b.op}`).catch(e => ({ error: { message: e.message } }));
    const state = op.metadata?.state || op.state || (op.done ? "DONE" : "?");
    if (/SUCCEEDED|DONE/.test(state) || op.done) doneCount++;
    console.log((b.label || "batch").padEnd(9), state, "·", b.segments, "segs",
      op.error ? "· ERR " + JSON.stringify(op.error).slice(0, 120) : "");
  }
  console.log(doneCount + "/" + st.batches.length, "batches complete");
  if (doneCount) console.log("→ node harness/build-drive-batch.mjs collect");

} else if (cmd === "collect") {
  const st = await loadState();
  let text = "";
  for (const b of st.batches) {
    const op = await api(`/v1beta/${b.op}`).catch(() => null);
    if (!op) continue;
    const state = op.metadata?.state || op.state || (op.done ? "DONE" : "?");
    if (!(/SUCCEEDED|DONE/.test(state) || op.done)) continue;
    const respFile = op.response?.batch?.output?.responsesFile
      || op.response?.output?.responsesFile
      || op.response?.responsesFile
      || op.metadata?.output?.responsesFile;
    if (!respFile) { console.log(b.label, "done but no responsesFile — raw:", JSON.stringify(op).slice(0, 400)); continue; }
    const dl = await fetch(`${API}/v1beta/${respFile}:download?alt=media&key=${KEY}`);
    if (!dl.ok) { console.error(b.label, "download failed HTTP", dl.status); continue; }
    text += await dl.text() + "\n";
    console.log(b.label, "· downloaded");
  }
  if (!text.trim()) { console.log("nothing collectable yet"); process.exit(1); }
  /* group PCM per scene */
  const byScene = {};
  for (const ln of text.split("\n")) {
    if (!ln.trim()) continue;
    let j; try { j = JSON.parse(ln); } catch { continue; }
    const key = j.key || j.metadata?.key; if (!key) continue;
    const [sid, gi] = key.split("|");
    const d = j.response?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData;
    if (!d) { (byScene[sid] = byScene[sid] || {}).__fail = true; continue; }
    (byScene[sid] = byScene[sid] || {})[+gi] = Buffer.from(d.data, "base64");
  }
  const wav = pcm => { const h = Buffer.alloc(44), rate = 24000;
    h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVEfmt ", 8);
    h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
    h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32);
    h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
    return Buffer.concat([h, pcm]); };
  const silence = ms => Buffer.alloc(Math.round(24000 * ms / 1000) * 2);
  let made = 0;
  for (const sc of SCRIPT.scenes) {
    if (MAN[sc.id] || !byScene[sc.id] || byScene[sc.id].__fail) continue;
    const got = byScene[sc.id];
    const parts = [], timing = []; let t = 0, ok = true;
    sc.segments.forEach((seg, gi) => {
      if (!(segText(seg) || "").trim()) return;
      const pcm = got[gi]; if (!pcm) { ok = false; return; }
      const dur = pcm.length / 2 / 24000;
      timing.push({ gi, start: +t.toFixed(2), dur: +dur.toFixed(2) });
      parts.push(pcm); t += dur;
      const gap = Math.min(1600, seg.pauseAfterMs || 260);
      parts.push(silence(gap)); t += gap / 1000;
    });
    if (!ok || !parts.length) continue;
    const wavPath = resolve(OUT, sc.id + ".wav"), m4a = resolve(OUT, sc.id + ".m4a");
    await writeFile(wavPath, wav(Buffer.concat(parts)));
    await run("afconvert", ["-f", "m4af", "-d", "aac", "-b", "64000", wavPath, m4a]);
    await run("rm", [wavPath]);
    MAN[sc.id] = { file: "drive/voice/" + sc.id + ".m4a", total: +t.toFixed(2), segments: timing };
    made++;
  }
  await writeFile(MANIFEST_PATH, JSON.stringify(MAN));
  console.log("collected:", made, "new scenes · manifest total:", Object.keys(MAN).length);
}
