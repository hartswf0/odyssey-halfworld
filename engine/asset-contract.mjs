/* ============================================================
   ASSET CONTRACT  ·  odyssey-halfworld
   Every generated asset module is an ESM file exporting `asset`, an object
   satisfying this shape. The atlas demands each asset return "procedural
   draw parameters, layer order, anchors, state machine, animation channels,
   runtime ID, and a neutral preview pose/state — not a flattened
   illustration." This encodes exactly that.
   ============================================================ */

/*
export const asset = {
  id:        "character.odysseus",     // runtime ID, `type.slug(name)`
  type:      "CHARACTER",              // one of ASSET_TYPES
  name:      "Odysseus",               // display / card label
  statusWord:"CRAFTY",                 // one-word mood/state shown on the card
  scene:     "OD-B01-S01",             // origin scene id (first appearance)

  // procedural draw parameters — the knobs that define this instance
  params:    { skin:"#cdb89a", build:1.1, hair:"curly", beard:true, ... },

  // layer order (back -> front) the draw() honors
  layers:    ["shadow","hair-back","body","garment","near-arm","face","hair-front","props"],

  // named attachment / contact / camera anchors in 0..1 asset space
  anchors:   { head:{x:.5,y:.18}, rightHand:{x:.72,y:.55}, spearGrip:{x:.74,y:.5} },

  // state machine: states + allowed transitions (drives scene dispatch)
  states:    { initial:"neutral", nodes:{ neutral:{}, speaking:{}, alarmed:{} },
               edges:[["neutral","speaking"],["speaking","neutral"]] },

  // animation channels the runtime can drive over the scene clock
  channels:  ["gaze","mouth","breath","pose","stance"],

  // neutral preview pose/state for the card + gallery
  preview:   () => ({ pose:"neutral", gaze:{x:0,y:0}, mouth:0, t:0, status:"CRAFTY", progress:.2 }),

  // THE render: solid tones + hard contour into an offscreen ctx sized W×H.
  // The engine's POST pass turns this into the dot-matrix look; do NOT
  // pre-dither. state carries {pose,gaze,mouth,t,pipeline,...}.
  draw:      (ctx, W, H, state) => { ...uses engine primitives/rig... },
};
*/

export const ASSET_TYPES = [
  "CHARACTER","CREATURE","LOCATION","PROP","ENSEMBLE",
  "DIVINE_FX","SET_PIECE","ENVIRONMENT","VEHICLE","SOUND_SOURCE","WEARABLE",
];

export function slug(s){
  return String(s).toLowerCase()
    .replace(/['’`]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
}
export function assetId(type, name){ return `${slug(type)}.${slug(name)}`; }

/* Validate a module's `asset`. Returns { ok, errors:[], warnings:[] }.
   The render harness calls this before scoring so structural failures are
   caught cheaply (no browser needed for the structural half). */
export function validateAsset(a){
  const errors=[], warnings=[];
  const need=(c,m)=>{ if(!c) errors.push(m); };
  const want=(c,m)=>{ if(!c) warnings.push(m); };
  need(a && typeof a==="object", "asset export missing or not an object");
  if(!a || typeof a!=="object") return { ok:false, errors, warnings };
  need(typeof a.id==="string" && a.id.includes("."), "id must be `type.slug` string");
  need(ASSET_TYPES.includes(a.type), `type must be one of ${ASSET_TYPES.join("/")}`);
  need(typeof a.name==="string" && a.name.length>0, "name required");
  need(typeof a.draw==="function", "draw(ctx,W,H,state) required");
  want(a.params && typeof a.params==="object", "params object recommended");
  want(Array.isArray(a.layers) && a.layers.length>0, "layers[] recommended");
  want(a.anchors && Object.keys(a.anchors||{}).length>0, "anchors{} recommended");
  want(a.states && a.states.nodes, "states{} state machine recommended");
  want(Array.isArray(a.channels) && a.channels.length>0, "channels[] recommended");
  need(typeof a.preview==="function", "preview() returning a state required");
  // anchors must be in 0..1 space
  if(a.anchors) for(const [k,v] of Object.entries(a.anchors)){
    if(!v || typeof v.x!=="number" || typeof v.y!=="number") warnings.push(`anchor ${k} must be {x,y}`);
    else if(v.x<0||v.x>1||v.y<0||v.y>1) warnings.push(`anchor ${k} should be normalized 0..1`);
  }
  return { ok: errors.length===0, errors, warnings };
}

/* Type-specific construction requirements distilled from the atlas
   "Construction:" clauses — handed to the writer agent per type so every
   asset of a type is built to the same spec. */
export const TYPE_SPEC = {
  CHARACTER:  "Full-body reusable articulated performer; stable identity across front/three-quarter/profile/back; separate costume layers; face, gaze, mouth, hands, shoulders, elbows, hips, knees, feet exposed to the rig. Use engine.makeFigure().",
  CREATURE:   "Full articulated non-human performer with its own skeleton/segments; expose locomotion, attack/idle states, and gaze/attention. Build custom geometry on engine primitives.",
  LOCATION:   "Empty navigable set: foreground/middle/background, walkable zones, entrances, exits, thresholds, occlusion layers, placement anchors, camera anchors. Do NOT bake characters in.",
  PROP:       "Isolated reusable object; declared scale, grip/support/contact anchors, ownership, collision shape, and all scene-required states (e.g. dormant/active/held).",
  ENSEMBLE:   "Repeatable group from a separable member template; expose formation, density, attention, reaction-wave, foreground/background controls. Draw N members deterministically.",
  DIVINE_FX:  "Procedural supernatural effect with source, target, field, duration, transformation states, and a visible consequence. Animate over t.",
  SET_PIECE:  "Separable architectural/environmental component; placement anchors, collision boundaries, depth layer, alternate states.",
  ENVIRONMENT:"Procedural world actor (wind/sea/fire/fog/darkness/omen); field parameters, intensity, direction, and effect on the scene.",
  VEHICLE:    "Reusable rideable/boarded object; board/ride/dock anchors, motion states, capacity, and collision shape.",
  SOUND_SOURCE:"Addressable diegetic emitter rendered as a visible diagram: position, intensity, rhythm, start/stop states, relation to visible action.",
  WEARABLE:   "Body-attached item with attach anchors to a figure; dormant/worn/active states; ownership.",
};

export const CONTRACT_VERSION = "hw-contract/1.0.0";
