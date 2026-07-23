/* build-performance.mjs — compile the METIS-PERFORM v2 turn score and the
   AOIDOS v3 voice/knowledge profiles into compact runtime files the pages
   can afford to fetch.  Sources live in atlas/ ; outputs in viewer/.
   Run:  node harness/build-performance.mjs */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const J = async p => JSON.parse(await readFile(resolve(ROOT, p), "utf8"));

/* ── the score: every scene's turn graph, trimmed to what a driver needs ── */
const v2 = await J("atlas/odyssey_metis_performance_atlas_v2.json");
const turns = {};
let nTurns = 0;
for (const book of v2.books) for (const sc of book.scenes) {
  const tg = (sc.performanceProgram && sc.performanceProgram.turnGraph) || [];
  turns[sc.id] = tg.map(t => ({
    id: t.id, sp: t.speakerRef, spName: t.speakerName, ad: t.addresseeRef,
    act: t.speechAct, mode: t.mode, tactic: t.tactic,
    payload: t.semanticPayload, subtext: t.subtext,
    conceal: t.mustConceal || [], reveal: t.mustReveal || [],
    delivery: t.delivery,
  }));
  nTurns += tg.length;
}
await writeFile(resolve(ROOT, "viewer/performance-turns.json"),
  JSON.stringify({ built: new Date().toISOString(), scenes: Object.keys(turns).length, turns: nTurns, byScene: turns }));

/* ── the voices: AOIDOS character profiles + voice essences ── */
const v3 = await J("atlas/odyssey_aoidos_performance_driver_v3.json");
const voices = {};
for (const [id, vp] of Object.entries(v3.voiceProfiles || {}))
  voices[id] = { essence: vp.essence || vp.description || vp.summary || "",
                 speech: vp.speechTendencies || vp.register || vp.syntax || "" };
const cards = {};
for (const [aid, cp] of Object.entries(v3.characterPerformanceProfiles || {}))
  cards[aid] = { name: cp.name, voice: cp.voiceProfileId,
    functions: (cp.performanceFunctions || []).slice(0, 5),
    knowledge: cp.knowledgePolicy || null };
await writeFile(resolve(ROOT, "viewer/voice-cards.json"),
  JSON.stringify({ built: new Date().toISOString(), voices, cards }));

console.log("performance-turns.json:", Object.keys(turns).length, "scenes ·", nTurns, "turns");
console.log("voice-cards.json:", Object.keys(cards).length, "characters ·", Object.keys(voices).length, "voice profiles");
