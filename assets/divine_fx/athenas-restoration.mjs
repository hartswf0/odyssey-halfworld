/* divine_fx.athenas-restoration — the wand-stroke that lifts the disguise, and
   (run backward) lays it on again. DIVINE_FX asset. Book XVI+; atlas uses=2.

   NOT a diagram. divine_fx.disguise-transformation is the periodic-table entry
   for this event: a side-by-side BEFORE/AFTER morph pair with a ruler and a
   reversible arrow, correct for the card catalog and useless inside a scene.
   This module is the IN-SCENE version: a vertical corridor of ink laid OVER
   the body that is changing, drawn on an untouched white field so the engine's
   per-type `multiply` blend (README §5) drops the paper and lands only ink on
   the set. It never draws a figure. The figure is character.odysseus-b16
   running its guise ramp underneath, on the same clock.

   CONTRACT WITH THE FIGURE. state.t is the SAME u the figure's guise blend
   uses. Drive both from one scene clock and the ash sheds exactly as the skin
   ramps. At t<=0 and t>=1 this asset draws NOTHING, so it can sit in the cast
   for the whole scene and only exist during the change.
     dir:"restore"  sweep runs foot -> crown, age falls away downward
     dir:"reveil"   sweep runs crown -> foot, age settles on downward
   Both directions shed DOWNWARD — gravity does not reverse when a god does.

   SOURCE (wand at the crown) -> FIELD (the corridor) -> TRANSFORM (the sweep
   band) -> CONSEQUENCE (shed marks falling, one ACCENT mark at the snap).
   Solid tone + hard contour only; the engine POST pass supplies the halftone.
   Do NOT pre-dither. */
import { makePen, inkLevel, INK, ACCENT, clamp, lerp, smooth, rnd }
  from "../../engine/halfworld-engine.mjs";

const params = {
  // the body being changed, normalized to the stage. Scenes override this to
  // match wherever the figure actually stands — see OD-B16-S03.
  figure:{ x:0.500, y:0.940, w:0.220, h:0.640 },
  corridorPad:1.35,     // corridor width as a multiple of figure width
  shed:22,              // shed marks (the age/rags falling away)
  rays:11,              // spark rays at the wand touch
  snapAt:0.5,           // where the garment flips — matches guise.mjs snapAt
  spark:1.0,
};

const clamp01 = x => clamp(x, 0, 1);
const TAU = Math.PI * 2;

/* the corridor: a light vertical shaft the change happens inside. Kept pale so
   that under multiply it barely tints the set — the sweep band carries the ink. */
function drawCorridor(pen, g, W, H, F, e){
  const w = F.w * W * params.corridorPad;
  const x = F.x * W - w / 2;
  const yTop = (F.y - F.h) * H;
  const hgt = F.h * H;
  g.save();
  g.globalAlpha = 0.30 * e;
  g.fillStyle = inkLevel(1);
  g.fillRect(x, yTop, w, hgt);
  g.restore();
  g.save();
  g.globalAlpha = 0.42 * e;
  g.strokeStyle = INK; g.lineWidth = 2;
  g.beginPath(); g.moveTo(x, yTop);     g.lineTo(x, yTop + hgt);
  g.moveTo(x + w, yTop); g.lineTo(x + w, yTop + hgt); g.stroke();
  g.restore();
}

/* the sweep: the band where the change is actually happening right now. */
function drawSweep(pen, g, W, H, F, u, dir){
  const w = F.w * W * params.corridorPad;
  const x = F.x * W - w / 2;
  const yTop = (F.y - F.h) * H;
  const hgt  = F.h * H;
  const band = hgt * 0.17;
  // restore rises, reveil falls
  const p = dir === "reveil" ? u : 1 - u;
  const yc = yTop + p * hgt;

  g.save();
  const gr = g.createLinearGradient(0, yc - band, 0, yc + band);
  gr.addColorStop(0,   "rgba(255,255,255,0)");
  gr.addColorStop(0.5, inkLevel(4));
  gr.addColorStop(1,   "rgba(255,255,255,0)");
  g.globalAlpha = 0.72;
  g.fillStyle = gr;
  g.fillRect(x, yc - band, w, band * 2);
  g.restore();

  // hard leading edge — the actual line of change
  pen.ink(() => { g.moveTo(x, yc); g.lineTo(x + w, yc); }, 5);

  // hatch trailing the edge, denser at the edge
  g.save();
  g.strokeStyle = INK; g.lineWidth = 2;
  for (let i = 1; i <= 7; i++){
    const off = (dir === "reveil" ? -1 : 1) * band * (i / 7) * 1.9;
    g.globalAlpha = 0.30 * (1 - i / 8);
    g.beginPath(); g.moveTo(x, yc + off); g.lineTo(x + w, yc + off); g.stroke();
  }
  g.restore();
}

/* shed: what the change throws off — flecks of age and rag, always falling. */
function drawShed(pen, g, W, H, F, u, dir){
  const w = F.w * W * params.corridorPad;
  const x0 = F.x * W - w / 2;
  const yTop = (F.y - F.h) * H;
  const hgt = F.h * H;
  const ground = F.y * H;
  g.save();
  g.strokeStyle = INK;
  for (let i = 0; i < params.shed; i++){
    const s = rnd(i * 37 + 11);
    const s2 = rnd(i * 91 + 5);
    const born = s * 0.7;                       // when this fleck lets go
    if (u < born) continue;
    const age = clamp01((u - born) / 0.45);
    const px = x0 + w * (0.10 + 0.80 * s2);
    const startY = yTop + hgt * (dir === "reveil" ? s : 1 - s);
    const py = startY + (ground - startY) * smooth(age) * 0.9;
    const len = hgt * 0.035 * (1 - age * 0.5);
    g.globalAlpha = 0.55 * (1 - age);
    g.lineWidth = 2 + 2 * (1 - age);
    g.beginPath(); g.moveTo(px, py); g.lineTo(px + hgt * 0.012 * (s2 - 0.5), py + len);
    g.stroke();
  }
  g.restore();
}

/* the wand touch at the crown — source of the whole event. */
function drawSpark(pen, g, W, H, F, e){
  if (e <= 0.01) return;
  const cx = F.x * W;
  const cy = (F.y - F.h) * H;
  const R = F.h * H * 0.085 * (0.6 + 0.6 * e);
  g.save();
  g.strokeStyle = INK; g.lineWidth = 3;
  for (let i = 0; i < params.rays; i++){
    const a = (i / params.rays) * TAU + e * 0.4;
    const r0 = R * 0.35, r1 = R * (0.85 + 0.35 * rnd(i * 13));
    g.globalAlpha = 0.30 + 0.55 * e;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    g.stroke();
  }
  g.globalAlpha = 0.9 * e;
  g.fillStyle = inkLevel(6);
  g.beginPath(); g.arc(cx, cy, R * 0.22, 0, TAU); g.fill();
  g.restore();
}

/* THE SNAP — the single blue mark, spent at the one frame the garment flips.
   This is the frame the figure's discrete params change on. One accent, once. */
function drawSnap(pen, g, W, H, F, u){
  const d = Math.abs(u - params.snapAt);
  if (d > 0.06) return;
  const e = 1 - d / 0.06;
  const w = F.w * W * params.corridorPad;
  const x = F.x * W - w / 2;
  const yc = (F.y - F.h) * H + (1 - u) * F.h * H;
  g.save();
  g.globalAlpha = 0.85 * e;
  g.strokeStyle = ACCENT; g.lineWidth = 4;
  g.beginPath(); g.moveTo(x, yc); g.lineTo(x + w, yc); g.stroke();
  g.restore();
}

function drawFX(ctx, W, H, state){
  const g = ctx;
  const u = clamp01(state.t ?? 0);
  if (u <= 0.001 || u >= 0.999) return;          // absent outside the change
  const dir = state.dir === "reveil" ? "reveil" : "restore";
  const F = { ...params.figure, ...(state.figure || {}) };
  const pen = makePen(g, { outline:true });
  const spark = (state.spark ?? params.spark) * (1 - Math.abs(u - 0.35) * 1.4);
  const env = Math.sin(Math.PI * u);              // 0 at the ends, 1 mid-change

  const layers = state.layers ||
    ["corridor","sweep","shed","spark","snap"];
  if (layers.includes("corridor")) drawCorridor(pen, g, W, H, F, env);
  if (layers.includes("sweep"))    drawSweep(pen, g, W, H, F, u, dir);
  if (layers.includes("shed"))     drawShed(pen, g, W, H, F, u, dir);
  if (layers.includes("spark"))    drawSpark(pen, g, W, H, F, clamp01(spark));
  if (layers.includes("snap"))     drawSnap(pen, g, W, H, F, u);
}

export const asset = {
  id:"divine-fx.athenas-restoration",
  type:"DIVINE_FX",
  name:"Athena's Restoration",
  statusWord:"RESTORING",
  scene:"OD-B16-S03",
  blend:"multiply",                    // README §5 per-type default, made explicit
  pairsWith:"character.odysseus-b16",  // drive state.t from the same guise u

  params,
  layers:["corridor","sweep","shed","spark","snap"],
  anchors:{ crown:{x:.50,y:.30}, feet:{x:.50,y:.94} },
  channels:["t","dir","spark","figure"],
  duration:3.2,

  states:{
    initial:"sweeping",
    nodes:{
      absent:   { preview:{ t:0.0,  dir:"restore", status:"—",         progress:0.00 } },
      touched:  { preview:{ t:0.18, dir:"restore", spark:1.0, status:"WAND",      progress:0.18 } },
      sweeping: { preview:{ t:0.50, dir:"restore", spark:0.7, status:"RESTORING", progress:0.50 } },
      settling: { preview:{ t:0.82, dir:"restore", spark:0.3, status:"RESTORED",  progress:0.82 } },
      // run backward — Book XVI S06, the disguise laid on again
      reveiling:{ preview:{ t:0.50, dir:"reveil",  spark:0.7, status:"CONCEALING",progress:0.50 } },
    },
    edges:[["absent","touched"],["touched","sweeping"],["sweeping","settling"],
           ["settling","sweeping"],["sweeping","touched"],["touched","absent"],
           ["sweeping","reveiling"],["reveiling","sweeping"]],
  },

  preview:()=>({ t:0.50, dir:"restore", spark:0.85, status:"RESTORING", progress:0.50,
                 layers:["corridor","sweep","shed","spark","snap"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
