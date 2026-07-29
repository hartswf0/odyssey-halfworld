/* ============================================================
   engine/guise.mjs — ADDITIVE. Book XVI+ only.
   Nothing in Books I–XV imports this file. Existing modules are untouched.

   PROBLEM. character.odysseus, .odysseus-restored and .odysseus-as-beggar are
   three separate modules with three skin values, a 20% scale spread and
   divergent hand overpaint. Book 16 casts all three within six scenes and
   asks the audience to read them as one man. They cannot.

   SOLUTION. One base spec + named deltas. Every guise is the same body with a
   different surface, so restoration is INTERPOLATION along one param set
   rather than a crossfade between two strangers.

     const fig = makeGuiseFigure(BASE, { king:{}, beggar:{ skin:"#c4bba9" } });
     fig.draw(ctx, W, H, { guise:"beggar", pose:"walk_neutral" })
     fig.draw(ctx, W, H, { guise:{ from:"beggar", to:"king", u:0.62 } })

   Continuous params (skin, hairColor, scale) lerp. Discrete params (garment,
   hair, cloak, beard) SNAP at u >= snapAt — you cannot half-wear rags, and
   the snap is what Athena's flare is for. Put the fx on the same frame.
   ============================================================ */
import { makeFigure, clamp01, lerp, smooth } from "./halfworld-engine.mjs";

const CONTINUOUS = ["scale"];
const COLOR      = ["skin", "hairColor"];

const h2 = h => { h = String(h).replace("#",""); if (h.length===3) h = h.split("").map(c=>c+c).join("");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]; };
const x2 = n => Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,"0");
export function mixHex(a, b, u){
  const A = h2(a), B = h2(b);
  return "#" + x2(lerp(A[0],B[0],u)) + x2(lerp(A[1],B[1],u)) + x2(lerp(A[2],B[2],u));
}

/* figures are built at module scope in this codebase, so a blended guise needs
   its own figure. Quantize u to STEPS and cache — 12 heroes, not 60/second. */
const STEPS = 12;
const CACHE = new Map();
const CACHE_MAX = 64;
function cached(key, build){
  let f = CACHE.get(key);
  if (!f){
    f = build();
    CACHE.set(key, f);
    if (CACHE.size > CACHE_MAX) CACHE.delete(CACHE.keys().next().value);
  }
  return f;
}

export function mixSpec(A, B, u, snapAt = 0.5){
  const out = { ...A };
  for (const k of Object.keys(B)) out[k] = u >= snapAt ? B[k] : A[k];   // discrete: snap
  for (const k of COLOR)      if (A[k] && B[k]) out[k] = mixHex(A[k], B[k], u);
  for (const k of CONTINUOUS) if (A[k] != null && B[k] != null) out[k] = lerp(A[k], B[k], u);
  return out;
}

/**
 * @param base   the shared body — the one true Odysseus spec
 * @param guises { name: partialSpecDelta }  first key is the default
 * @param opts   { snapAt } threshold at which discrete params flip
 */
export function makeGuiseFigure(base, guises, opts = {}){
  const snapAt = opts.snapAt ?? 0.5;
  const names  = Object.keys(guises);
  const specs  = {};
  const figs   = {};
  for (const n of names){
    specs[n] = { ...base, ...guises[n] };
    figs[n]  = makeFigure(specs[n]);
  }
  const dflt = names[0];
  const id   = opts.id || "guise";

  function resolve(g){
    if (!g) return figs[dflt];
    if (typeof g === "string") return figs[g] || figs[dflt];
    // { from, to, u } — a transformation in progress
    const from = specs[g.from] || specs[dflt];
    const to   = specs[g.to]   || specs[dflt];
    const u    = smooth(clamp01(g.u ?? 0));
    const q    = Math.round(u * STEPS) / STEPS;
    if (q <= 0) return figs[g.from] || figs[dflt];
    if (q >= 1) return figs[g.to]   || figs[dflt];
    return cached(`${id}|${g.from}>${g.to}|${q}`, () => makeFigure(mixSpec(from, to, q, snapAt)));
  }

  return {
    specs, figs, guises: names, base,
    /** the mixed spec at a moment — for fx assets that need to match surface */
    specAt(g){
      if (!g || typeof g === "string") return specs[g] || specs[dflt];
      return mixSpec(specs[g.from] || specs[dflt], specs[g.to] || specs[dflt],
                     smooth(clamp01(g.u ?? 0)), snapAt);
    },
    draw(ctx, W, H, state = {}){
      const f = resolve(state.guise);
      if (state.band) f.spec.band = state.band;
      return f.draw(ctx, W, H, state);
    },
  };
}

export default makeGuiseFigure;
