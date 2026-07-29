/* location.eumaeus-hut-interior — INSIDE the swineherd's hut on the hilltop.
   LOCATION asset (empty navigable set — NO baked figures). Solid grays + hard
   contour into the offscreen ctx; the engine dotify pass supplies the halftone.

   THE ROOM AGREES WITH THE PLAN. Every wall, seat and stone here is placed by
   projecting scenes/_plans/eumaeus-hut.mjs through engine/blocking.mjs
   project() — the same depth law makeRestage uses (README §5). A figure the
   scene puts at station `hearth` stands at the hearth that is drawn here; a
   figure at `door` stands in the doorway that is drawn here. Nothing in this
   file is hand-tuned against parallel numbers.

   ONE DOOR, in the far wall. That is the whole architecture of Book XVI: the
   room can be emptied by a single exit, which is why the recognition can be
   private. A central hearth is the light. Stacked stone to waist height,
   timber and wattle above, thatch on rafters, hides on the wall, a pen wall
   on the right because a swineherd lives here. Poor, warm, small.

   States: "day" (light through the open door), "night" (shut and barred, the
   fire is the only light), "fire_high" (built up for the guest's meal —
   spit, pot, smoke to the roof hole). Each changes what is DRAWN.

   Serves OD-B16-S01, S02, S03, S06 and returns in Book XVII.
   Atlas: OD-B16-S03. */
import { makePen, toneSolid, inkLevel, INK, clamp } from "../../engine/halfworld-engine.mjs";
import { project } from "../../engine/blocking.mjs";
import { eumaeusHut } from "../../scenes/_plans/eumaeus-hut.mjs";

const MODES = ["day", "night", "fire_high"];

const params = {
  mode:"day",        // default light state
  ceilFar:0.150,     // thatch line where the roof meets the far wall (frac of H)
  ceilNear:0.052,    // thatch line overhead at the near edge of the room
  ext:1.35,          // how far past the near plan edge the room runs off-frame
  doorW:0.155,       // door width as a fraction of W
  doorH:0.80,        // door height as a fraction of the far wall's interior height
  penWall:true,      // the right wall is the pig-pen partition
  kingPost:true,     // the roof post at station dog_post
};

/* ---------- the room's geometry, straight out of the plan ---------- */
const ST = eumaeusHut.stations;
const P  = (x, z) => project({ x, z });          // normalized 0..1 frame coords

const FL = P(0, 0), FR = P(1, 0);                 // far wall corners (z = 0)
const NL = P(0, 1), NR = P(1, 1);                 // near corners (z = 1)
const EXT = params.ext;
const EL = { x: FL.x + (NL.x - FL.x) * EXT, y: FL.y + (NL.y - FL.y) * EXT };
const ER = { x: FR.x + (NR.x - FR.x) * EXT, y: FR.y + (NR.y - FR.y) * EXT };

/* The roof rides on the floor: for any point whose foot line is at y, the
   thatch above it is found by the same far->near parameter the floor uses, so
   the ceiling recedes on exactly the plan's depth law and never crosses it. */
const ceilN = y => params.ceilFar +
  (y - FL.y) * (params.ceilNear - params.ceilFar) / (EL.y - FL.y);

export const anchors = (() => {
  const a = {};
  for (const [k, v] of Object.entries(ST)){
    const p = P(v.x, v.z);
    a[k] = { x: +p.x.toFixed(3), y: +p.y.toFixed(3) };
  }
  a["camera:wide"]   = { x:.50, y:.50 };
  a["camera:hearth"] = { x:+P(ST.hearth.x, ST.hearth.z).x.toFixed(3), y:.66 };
  a["camera:door"]   = { x:.50, y:.44 };
  return a;
})();

/* ---------- small stamps ---------- */
function flame(pen, g, fx, fy, r, h, tone){
  pen.paint(() => {
    g.moveTo(fx - r, fy);
    g.quadraticCurveTo(fx - r * 0.72, fy - h * 0.52, fx - r * 0.20, fy - h * 0.86);
    g.quadraticCurveTo(fx - r * 0.06, fy - h * 0.42, fx + r * 0.10, fy - h * 1.00);
    g.quadraticCurveTo(fx + r * 0.34, fy - h * 0.50, fx + r * 0.42, fy - h * 0.70);
    g.quadraticCurveTo(fx + r * 0.86, fy - h * 0.36, fx + r, fy);
    g.closePath();
  }, tone, 3);
}
function log(pen, g, x, y, len, th, tone, tilt = 0){
  pen.paint(() => {
    const dx = Math.cos(tilt) * len / 2, dy = Math.sin(tilt) * len / 2;
    g.moveTo(x - dx, y - dy - th / 2); g.lineTo(x + dx, y + dy - th / 2);
    g.lineTo(x + dx, y + dy + th / 2); g.lineTo(x - dx, y - dy + th / 2);
    g.closePath();
  }, tone, 2.5);
}
function benchAt(pen, g, W, H, p, wFrac, tone, drape){
  const bw = W * wFrac * p.s, bh = H * 0.055 * p.s, th = bh * 0.40;
  pen.paint(() => { g.rect(p.x - bw / 2, p.y - bh, bw, th); }, tone, 4);          // plank
  pen.paint(() => { g.rect(p.x - bw * 0.42, p.y - bh + th, bw * 0.10, bh - th); },
            toneSolid(inkLevel(6)), 3);                                            // legs
  pen.paint(() => { g.rect(p.x + bw * 0.32, p.y - bh + th, bw * 0.10, bh - th); },
            toneSolid(inkLevel(6)), 3);
  if (drape) pen.paint(() => {
    g.ellipse(p.x + bw * 0.16, p.y - bh - th * 0.35, bw * 0.26, th * 0.62, 0, 0, 7);
  }, toneSolid(inkLevel(2)), 3);
}

/* ---------- the set ---------- */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const mode  = MODES.includes(st.state) ? st.state : params.mode;
  const night = mode !== "day";
  const roar  = mode === "fire_high";
  const layers = st.layers || ["shell","walls","backwall","door","floor","light",
                               "post","penfittings","corner","hearth","fire",
                               "seats","gear","smoke"];
  const has = l => layers.includes(l);

  const T = {
    ceil:  night ? 3 : 1,
    wall:  night ? 2 : 1,
    back:  night ? 2 : 1,
    floor: night ? 2 : 1,
    stone: night ? 4 : 3,
    wood:  night ? 6 : 5,
    deep:  night ? 7 : 6,
  };

  const pt = (x, z) => { const p = P(x, z); return { x:p.x * W, y:p.y * H, d:p.d, s:0.60 + 0.50 * p.d }; };
  const at = n => pt(ST[n].x, ST[n].z);
  const fl = { x: FL.x * W, y: FL.y * H }, fr = { x: FR.x * W, y: FR.y * H };
  const el = { x: EL.x * W, y: EL.y * H }, er = { x: ER.x * W, y: ER.y * H };
  const cy = y => ceilN(y / H) * H;
  const sillY = fl.y, wallTopFar = cy(fl.y), wallH = sillY - wallTopFar;
  const hearth = at("hearth");

  /* ---- SHELL: thatch ceiling on rafters, with the smoke hole ---- */
  if (has("shell")){
    pen.paint(() => {
      g.moveTo(fl.x, wallTopFar); g.lineTo(fr.x, wallTopFar);
      g.lineTo(er.x, cy(er.y));   g.lineTo(el.x, cy(el.y)); g.closePath();
    }, toneSolid(inkLevel(T.ceil)), 5);
    // rafter poles running away from the viewer, spaced in PLAN x
    for (const px of [0.12, 0.30, 0.70, 0.88]){
      const a = pt(px, 0), b = pt(px, 1);
      const bx = a.x + (b.x - a.x) * EXT, by = a.y + (b.y - a.y) * EXT;
      pen.ink(() => { g.moveTo(a.x, cy(a.y)); g.lineTo(bx, cy(by)); }, 4);
    }
    // ridge beam down the spine
    pen.paint(() => {
      const a = pt(0.5, 0), b = pt(0.5, 1);
      const bx = a.x + (b.x - a.x) * EXT, by = a.y + (b.y - a.y) * EXT;
      g.rect(Math.min(a.x, bx) - W * 0.007, cy(a.y), W * 0.014, cy(by) - cy(a.y));
    }, toneSolid(inkLevel(T.wood)), 2.5);
    // purlins at constant depth
    for (const pz of [0.34, 0.86]){
      const a = pt(0, pz), b = pt(1, pz);
      pen.ink(() => { g.moveTo(a.x, cy(a.y)); g.lineTo(b.x, cy(b.y)); }, 3);
    }
    // thatch straw: short strokes hanging off the far eave
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.30;
    for (let i = 0; i <= 20; i++){
      const x = fl.x + (fr.x - fl.x) * (i / 20);
      g.beginPath(); g.moveTo(x, wallTopFar); g.lineTo(x - W * 0.005, wallTopFar - H * 0.018); g.stroke();
    }
    g.globalAlpha = 1;
    // SMOKE HOLE over the hearth: sky by day, black at night
    const sh = pt(ST.hearth.x, ST.hearth.z * 0.62);
    const hw = W * 0.055, hh = H * 0.022;
    pen.paint(() => { g.rect(sh.x - hw / 2, cy(sh.y) - hh / 2, hw, hh); },
              toneSolid(inkLevel(night ? 7 : 0)), 4);
    if (!night){
      // a shaft of daylight dropping from the hole onto the hearth
      g.save(); g.fillStyle = "#ffffff"; g.globalAlpha = 0.95;
      g.beginPath();
      g.moveTo(sh.x - hw * 0.44, cy(sh.y));
      g.lineTo(sh.x + hw * 0.44, cy(sh.y));
      g.lineTo(hearth.x + W * 0.075, hearth.y);
      g.lineTo(hearth.x - W * 0.075, hearth.y);
      g.closePath(); g.fill(); g.restore();
    }
  }

  /* ---- WALLS: left wattle-and-daub, right the pen wall ---- */
  if (has("walls")){
    const face = (a, b, tone) => pen.paint(() => {
      g.moveTo(a.x, a.y); g.lineTo(b.x, b.y);
      g.lineTo(b.x, cy(b.y)); g.lineTo(a.x, cy(a.y)); g.closePath();
    }, tone, 5);
    face(fl, el, toneSolid(inkLevel(T.wall)));
    face(fr, er, toneSolid(inkLevel(T.wall)));

    // stacked-stone lower course on both walls (waist height)
    for (const [a, b] of [[fl, el], [fr, er]]){
      const k = 0.44;
      pen.paint(() => {
        g.moveTo(a.x, a.y); g.lineTo(b.x, b.y);
        g.lineTo(b.x, b.y - (b.y - cy(b.y)) * k);
        g.lineTo(a.x, a.y - (a.y - cy(a.y)) * k); g.closePath();
      }, toneSolid(inkLevel(T.stone)), 4);
      // courses + broken joints
      g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.45;
      for (const c of [0.15, 0.29]){
        g.beginPath();
        g.moveTo(a.x, a.y - (a.y - cy(a.y)) * c);
        g.lineTo(b.x, b.y - (b.y - cy(b.y)) * c); g.stroke();
      }
      for (const u of [0.12, 0.32, 0.56, 0.84]){
        const bx = a.x + (b.x - a.x) * u, by = a.y + (b.y - a.y) * u;
        g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by - (by - cy(by)) * 0.29); g.stroke();
      }
      g.globalAlpha = 1;
    }
    // timber studs standing in both walls
    for (const [a, b] of [[fl, el], [fr, er]]){
      for (const u of [0.16, 0.40, 0.70]){
        const bx = a.x + (b.x - a.x) * u, by = a.y + (b.y - a.y) * u;
        const tw = W * 0.013 * (0.7 + 0.9 * u);
        pen.paint(() => { g.rect(bx - tw / 2, cy(by), tw, by - cy(by)); },
                  toneSolid(inkLevel(T.wood)), 3);
      }
    }
  }

  /* ---- BACK WALL ---- */
  if (has("backwall")){
    pen.paint(() => { g.rect(fl.x, wallTopFar, fr.x - fl.x, wallH); },
              toneSolid(inkLevel(T.back)), 5);
    // stacked stone to waist
    pen.paint(() => { g.rect(fl.x, sillY - wallH * 0.44, fr.x - fl.x, wallH * 0.44); },
              toneSolid(inkLevel(T.stone)), 4);
    g.save();
    g.beginPath(); g.rect(fl.x, wallTopFar, fr.x - fl.x, wallH); g.clip();
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.45;
    for (let r = 1; r <= 2; r++){
      const y = sillY - wallH * 0.44 * (r / 3);
      g.beginPath(); g.moveTo(fl.x, y); g.lineTo(fr.x, y); g.stroke();
    }
    for (let i = 1; i < 8; i++){
      const x = fl.x + (fr.x - fl.x) * (i / 8);
      g.beginPath(); g.moveTo(x, sillY); g.lineTo(x, sillY - wallH * 0.28); g.stroke();
    }
    // wattle weave above the stone: a slack diagonal basketry
    g.globalAlpha = 0.30;
    for (let i = -4; i <= 8; i++){
      const x = fl.x + (fr.x - fl.x) * (i / 8);
      g.beginPath(); g.moveTo(x, sillY - wallH * 0.46);
      g.lineTo(x + (fr.x - fl.x) * 0.30, wallTopFar + wallH * 0.14); g.stroke();
    }
    g.globalAlpha = 1; g.restore();
    // tie beam under the eave
    pen.paint(() => { g.rect(fl.x, wallTopFar + wallH * 0.05, fr.x - fl.x, wallH * 0.055); },
              toneSolid(inkLevel(T.wood)), 2.5);
  }

  /* ---- THE ONE DOOR ---- */
  if (has("door")){
    const dw = W * params.doorW, dh = wallH * params.doorH;
    const dx = at("door").x, dTop = sillY - dh, jw = W * 0.024;
    // jambs + lintel
    pen.paint(() => { g.rect(dx - dw / 2 - jw, dTop - jw * 0.7, jw, dh + jw * 0.7); }, toneSolid(inkLevel(T.wood)), 4);
    pen.paint(() => { g.rect(dx + dw / 2,      dTop - jw * 0.7, jw, dh + jw * 0.7); }, toneSolid(inkLevel(T.wood)), 4);
    pen.paint(() => { g.rect(dx - dw / 2 - jw * 1.5, dTop - jw * 0.78, dw + jw * 3, jw * 0.78); },
              toneSolid(inkLevel(6)), 3.5);

    if (mode === "day"){
      // OPEN: the yard beyond, bright
      pen.paint(() => { g.rect(dx - dw / 2, dTop, dw, dh); }, toneSolid(inkLevel(0)), 4);
      const gy = dTop + dh * 0.58;
      pen.ink(() => { g.moveTo(dx - dw / 2, gy); g.lineTo(dx + dw / 2, gy); }, 3);
      // far hill shoulder
      pen.paint(() => {
        g.moveTo(dx - dw / 2, gy);
        g.quadraticCurveTo(dx, gy - dh * 0.20, dx + dw / 2, gy - dh * 0.06);
        g.lineTo(dx + dw / 2, gy); g.closePath();
      }, toneSolid(inkLevel(2)), 2);
      // stockade stakes outside
      for (let i = 0; i < 4; i++){
        const px = dx - dw * 0.40 + i * dw * 0.27;
        pen.paint(() => { g.rect(px, gy - dh * 0.30 - (i % 2) * dh * 0.04, dw * 0.055, dh * 0.30); },
                  toneSolid(inkLevel(5)), 2);
      }
    } else if (mode === "night"){
      // SHUT AND BARRED
      pen.paint(() => { g.rect(dx - dw / 2, dTop, dw, dh); }, toneSolid(inkLevel(5)), 4);
      for (let i = 1; i < 4; i++){
        const px = dx - dw / 2 + dw * (i / 4);
        pen.ink(() => { g.moveTo(px, dTop + dh * 0.02); g.lineTo(px, sillY - dh * 0.02); }, 3);
      }
      pen.ink(() => { g.moveTo(dx - dw * 0.46, dTop + dh * 0.08); g.lineTo(dx + dw * 0.46, sillY - dh * 0.10); }, 3);
      pen.paint(() => { g.rect(dx - dw * 0.54, dTop + dh * 0.46, dw * 1.08, dh * 0.10); },
                toneSolid(inkLevel(7)), 3);                                   // the draw-bar
      g.strokeStyle = INK; g.lineWidth = 3;
      g.beginPath(); g.arc(dx + dw * 0.30, dTop + dh * 0.70, dw * 0.07, 0, 7); g.stroke();
    } else {
      // AJAR: a leaf swung back, a sliver of dusk at the hinge
      pen.paint(() => { g.rect(dx - dw / 2, dTop, dw, dh); }, toneSolid(inkLevel(6)), 4);
      pen.paint(() => { g.rect(dx - dw / 2, dTop + dh * 0.06, dw * 0.22, dh * 0.94); },
                toneSolid(inkLevel(1)), 3);
      pen.paint(() => {
        g.moveTo(dx - dw * 0.06, dTop);
        g.lineTo(dx + dw / 2,    dTop + dh * 0.05);
        g.lineTo(dx + dw / 2,    sillY);
        g.lineTo(dx - dw * 0.06, sillY - dh * 0.04);
        g.closePath();
      }, toneSolid(inkLevel(5)), 4);
      for (let i = 1; i < 3; i++){
        const px = dx - dw * 0.06 + (dw * 0.56) * (i / 3);
        pen.ink(() => { g.moveTo(px, dTop + dh * 0.03); g.lineTo(px, sillY - dh * 0.02); }, 2);
      }
    }
    // threshold slab
    pen.paint(() => { g.ellipse(dx, sillY + H * 0.006, dw * 0.62, H * 0.014, 0, 0, 7); },
              toneSolid(inkLevel(T.stone)), 3);
  }

  /* ---- FLOOR: beaten earth ---- */
  if (has("floor")){
    pen.paint(() => {
      g.moveTo(fl.x, fl.y); g.lineTo(fr.x, fr.y);
      g.lineTo(er.x, er.y); g.lineTo(el.x, el.y); g.closePath();
    }, toneSolid(inkLevel(T.floor)), 5);
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.26;
    for (const pz of [0.28, 0.55, 0.82]){
      const a = pt(0, pz), b = pt(1, pz);
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
    }
    g.globalAlpha = 1;
  }

  /* ---- LIGHT: what the room is lit BY ---- */
  if (has("light")){
    if (mode === "day"){
      const dw = W * params.doorW, dx = at("door").x;
      g.save(); g.fillStyle = "#ffffff";
      g.beginPath();
      g.moveTo(dx - dw * 0.50, sillY); g.lineTo(dx + dw * 0.50, sillY);
      g.lineTo(dx + dw * 1.55, H * 1.02); g.lineTo(dx - dw * 1.55, H * 1.02);
      g.closePath(); g.fill(); g.restore();
      g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.22;
      g.beginPath(); g.moveTo(dx - dw * 0.50, sillY); g.lineTo(dx - dw * 1.55, H * 1.02);
      g.moveTo(dx + dw * 0.50, sillY); g.lineTo(dx + dw * 1.55, H * 1.02); g.stroke();
      g.globalAlpha = 1;
    } else {
      // firelight pool on the floor
      const rr = W * (roar ? 0.34 : 0.24);
      g.save(); g.fillStyle = "#ffffff"; g.globalAlpha = roar ? 1 : 0.86;
      g.beginPath(); g.ellipse(hearth.x, hearth.y + H * 0.02, rr, rr * 0.42, 0, 0, 7); g.fill();
      g.restore();
      // and the corners fall away dark
      g.save(); g.globalAlpha = 0.55; g.fillStyle = inkLevel(4);
      g.beginPath(); g.moveTo(fl.x, fl.y); g.lineTo(el.x, el.y);
      g.lineTo(el.x + W * 0.10, el.y); g.lineTo(fl.x + W * 0.06, fl.y); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(fr.x, fr.y); g.lineTo(er.x, er.y);
      g.lineTo(er.x - W * 0.10, er.y); g.lineTo(fr.x - W * 0.06, fr.y); g.closePath(); g.fill();
      g.restore();
    }
  }

  /* ---- ROOF POST at dog_post, with the dogs' mat at its foot ---- */
  if (has("post") && params.kingPost){
    const p = at("dog_post");
    const pw = W * 0.020 * p.s;
    pen.paint(() => { g.rect(p.x - pw / 2, cy(p.y), pw, p.y - cy(p.y)); },
              toneSolid(inkLevel(T.wood)), 4);
    pen.paint(() => { g.rect(p.x - pw * 1.9, cy(p.y) + (p.y - cy(p.y)) * 0.10, pw * 3.8, pw * 0.9); },
              toneSolid(inkLevel(7)), 3);                                       // brace
    pen.paint(() => { g.ellipse(p.x + pw * 1.4, p.y, W * 0.055 * p.s, H * 0.016 * p.s, 0, 0, 7); },
              toneSolid(inkLevel(night ? 5 : 3)), 3);                            // the dogs' mat
  }

  /* ---- PEN FITTINGS on the right wall ---- */
  if (has("penfittings") && params.penWall){
    const a = pt(1, 0.16), b = pt(1, 0.62);
    // hurdle rails above the stone, the pigs' side
    for (const k of [0.52, 0.70]){
      pen.paint(() => {
        const ay = a.y - (a.y - cy(a.y)) * k, by = b.y - (b.y - cy(b.y)) * k;
        g.moveTo(a.x, ay); g.lineTo(b.x, by);
        g.lineTo(b.x, by + H * 0.014); g.lineTo(a.x, ay + H * 0.010); g.closePath();
      }, toneSolid(inkLevel(T.wood)), 3);
    }
    // a low gate hatch through the wall into the pens
    const gA = pt(1, 0.30), gB = pt(1, 0.46);
    pen.paint(() => {
      g.moveTo(gA.x, gA.y - (gA.y - cy(gA.y)) * 0.06);
      g.lineTo(gB.x, gB.y - (gB.y - cy(gB.y)) * 0.06);
      g.lineTo(gB.x, gB.y - (gB.y - cy(gB.y)) * 0.42);
      g.lineTo(gA.x, gA.y - (gA.y - cy(gA.y)) * 0.42);
      g.closePath();
    }, toneSolid(inkLevel(night ? 7 : 5)), 4);
    // feeding trough on the floor against it
    const tr = pt(0.86, 0.50);
    const tw = W * 0.10 * tr.s, th = H * 0.032 * tr.s;
    pen.paint(() => { g.rect(tr.x - tw / 2, tr.y - th, tw, th); }, toneSolid(inkLevel(5)), 3);
    pen.paint(() => { g.rect(tr.x - tw / 2, tr.y - th, tw, th * 0.34); }, toneSolid(inkLevel(2)), 2);
  }

  /* ---- THE DARK CORNER ---- */
  if (has("corner")){
    const p = at("corner_dark");
    const cw = W * 0.11 * p.s, ch = H * 0.10 * p.s;
    // bedding heap of brushwood and fleeces
    pen.paint(() => {
      g.moveTo(p.x - cw, p.y);
      g.quadraticCurveTo(p.x - cw * 0.7, p.y - ch * 1.35, p.x, p.y - ch * 1.05);
      g.quadraticCurveTo(p.x + cw * 0.7, p.y - ch * 0.80, p.x + cw, p.y);
      g.closePath();
    }, toneSolid(inkLevel(night ? 7 : 4)), 4);
    pen.ink(() => { g.moveTo(p.x - cw * 0.55, p.y - ch * 0.30); g.lineTo(p.x + cw * 0.30, p.y - ch * 0.62); }, 2);
    // hides hanging on the wall above it
    for (let i = 0; i < 2; i++){
      const hx = p.x - cw * 0.5 + i * cw * 1.1, hy = p.y - ch * 1.9 - i * ch * 0.25;
      pen.paint(() => {
        g.moveTo(hx - cw * 0.34, hy);
        g.lineTo(hx - cw * 0.44, hy + ch * 1.25);
        g.quadraticCurveTo(hx, hy + ch * 1.60, hx + cw * 0.44, hy + ch * 1.10);
        g.lineTo(hx + cw * 0.32, hy);
        g.closePath();
      }, toneSolid(inkLevel(night ? 6 : 3)), 3);
      pen.ink(() => { g.moveTo(hx - cw * 0.34, hy); g.lineTo(hx + cw * 0.32, hy); }, 3);
    }
  }

  /* ---- THE HEARTH ---- */
  if (has("hearth")){
    const p = hearth;
    const r = W * 0.072 * p.s;
    // shadows thrown away from the fire, at night only
    if (night){
      g.save(); g.globalAlpha = 0.5; g.fillStyle = inkLevel(5);
      for (const nm of ["bench_far","seat_guest","bench_near"]){
        const q = at(nm);
        const dx = q.x - p.x, dy = (q.y - p.y) || 1;
        const L = W * 0.10 * q.s;
        g.beginPath();
        g.ellipse(q.x + Math.sign(dx || 1) * L * 0.55, q.y + Math.abs(dy) * 0.10,
                  L, H * 0.020 * q.s, 0, 0, 7);
        g.fill();
      }
      g.restore();
    }
    // ash bed
    pen.paint(() => { g.ellipse(p.x, p.y, r * 1.06, r * 0.48, 0, 0, 7); },
              toneSolid(inkLevel(3)), 3);
    pen.paint(() => { g.ellipse(p.x, p.y, r * 0.58, r * 0.26, 0, 0, 7); },
              toneSolid(inkLevel(6)), 2.5);
    // ring of stones
    for (let i = 0; i < 10; i++){
      const a = i / 10 * Math.PI * 2;
      pen.paint(() => {
        g.ellipse(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r * 0.48,
                  r * 0.25, r * 0.19, 0, 0, 7);
      }, toneSolid(inkLevel(i % 2 ? 6 : 5)), 3);
    }
    // firewood stacked beside it — round ends showing
    const wx = p.x - r * 2.7, wy = p.y + H * 0.010, lr = r * 0.20;
    for (let i = 0; i < 5; i++){
      const row = i < 3 ? 0 : 1;
      const cxw = wx + (i - (row ? 3.5 : 1)) * lr * 2.25;
      const cyw = wy - row * lr * 1.9;
      pen.paint(() => { g.rect(cxw - lr, cyw - lr, lr * 2, lr * 2); }, toneSolid(inkLevel(4)), 2.5);
      pen.ink(() => { g.ellipse(cxw, cyw, lr * 0.42, lr * 0.42, 0, 0, 7); }, 2);
    }
  }

  /* ---- THE FIRE ---- */
  if (has("fire")){
    const p = hearth;
    const r = W * 0.072 * p.s;
    if (mode === "day"){
      // embers keeping: two logs, a low tongue
      log(pen, g, p.x, p.y - r * 0.06, r * 1.30, r * 0.22, toneSolid(inkLevel(6)),  0.16);
      log(pen, g, p.x, p.y + r * 0.10, r * 1.20, r * 0.20, toneSolid(inkLevel(6)), -0.14);
      flame(pen, g, p.x, p.y - r * 0.10, r * 0.30, r * 0.52, toneSolid(inkLevel(5)));
    } else if (mode === "night"){
      log(pen, g, p.x, p.y + r * 0.08, r * 1.35, r * 0.24, toneSolid(inkLevel(6)), 0.12);
      flame(pen, g, p.x, p.y - r * 0.06, r * 0.52, r * 1.05, toneSolid(inkLevel(6)));
      flame(pen, g, p.x - r * 0.34, p.y - r * 0.02, r * 0.26, r * 0.58, toneSolid(inkLevel(5)));
    } else {
      // BUILT UP for the guest's meal: crib of logs, tall fire, spit and pot
      for (let i = 0; i < 3; i++)
        log(pen, g, p.x, p.y + r * 0.14 - i * r * 0.22, r * 1.5, r * 0.24,
            toneSolid(inkLevel(6)), i % 2 ? 0.20 : -0.20);
      flame(pen, g, p.x, p.y - r * 0.42, r * 0.72, r * 1.95, toneSolid(inkLevel(7)));
      flame(pen, g, p.x - r * 0.55, p.y - r * 0.20, r * 0.34, r * 1.00, toneSolid(inkLevel(6)));
      flame(pen, g, p.x + r * 0.58, p.y - r * 0.16, r * 0.30, r * 0.84, toneSolid(inkLevel(6)));
      // forked uprights + spit + the joint on it
      const uh = r * 2.35, ux = r * 1.55;
      for (const sgn of [-1, 1]){
        pen.paint(() => { g.rect(p.x + sgn * ux - r * 0.09, p.y - uh, r * 0.18, uh); },
                  toneSolid(inkLevel(7)), 3);
        pen.ink(() => {
          g.moveTo(p.x + sgn * ux - r * 0.22, p.y - uh - r * 0.24);
          g.lineTo(p.x + sgn * ux, p.y - uh);
          g.lineTo(p.x + sgn * ux + r * 0.22, p.y - uh - r * 0.24);
        }, 3);
      }
      pen.paint(() => { g.rect(p.x - ux * 1.25, p.y - uh - r * 0.06, ux * 2.5, r * 0.12); },
                toneSolid(inkLevel(7)), 2.5);
      pen.paint(() => { g.ellipse(p.x, p.y - uh + r * 0.26, r * 0.62, r * 0.30, 0, 0, 7); },
                toneSolid(inkLevel(6)), 3);
      // pot hung from the ridge on a chain
      const px = p.x + r * 2.3, py = p.y - r * 2.9;
      pen.ink(() => { g.moveTo(px, cy(p.y)); g.lineTo(px, py - r * 0.30); }, 2.5);
      pen.paint(() => {
        g.moveTo(px - r * 0.42, py - r * 0.26);
        g.bezierCurveTo(px - r * 0.60, py + r * 0.44, px + r * 0.60, py + r * 0.44, px + r * 0.42, py - r * 0.26);
        g.closePath();
      }, toneSolid(inkLevel(6)), 3);
      pen.ink(() => { g.moveTo(px - r * 0.42, py - r * 0.26); g.quadraticCurveTo(px, py - r * 0.72, px + r * 0.42, py - r * 0.26); }, 2.5);
    }
  }

  /* ---- SEATS: benches, the guest's stool ---- */
  if (has("seats")){
    benchAt(pen, g, W, H, at("bench_far"),  0.15, toneSolid(inkLevel(5)), true);
    // the beggar's stool — round top, three legs, a hide on it
    const s = at("seat_guest");
    const sw = W * 0.052 * s.s, sh = H * 0.048 * s.s;
    pen.paint(() => { g.ellipse(s.x, s.y - sh, sw, sw * 0.42, 0, 0, 7); }, toneSolid(inkLevel(5)), 4);
    for (const o of [-0.72, 0, 0.72]){
      pen.paint(() => { g.rect(s.x + sw * o - sw * 0.10, s.y - sh, sw * 0.20, sh * (o ? 0.92 : 1.0)); },
                toneSolid(inkLevel(6)), 2.5);
    }
    pen.paint(() => { g.ellipse(s.x + sw * 0.10, s.y - sh - sw * 0.20, sw * 0.78, sw * 0.30, 0, 0, 7); },
              toneSolid(inkLevel(2)), 3);
    benchAt(pen, g, W, H, at("bench_near"), 0.19, toneSolid(inkLevel(5)), false);
  }

  /* ---- GEAR hanging in the roof ---- */
  if (has("gear")){
    const a = pt(0.62, 0.22), b = pt(0.34, 0.30);
    // a side of bacon and a bundle of herbs on the purlin
    pen.paint(() => {
      g.moveTo(a.x - W * 0.020, cy(a.y));
      g.lineTo(a.x + W * 0.020, cy(a.y));
      g.lineTo(a.x + W * 0.013, cy(a.y) + H * 0.075);
      g.lineTo(a.x - W * 0.013, cy(a.y) + H * 0.070);
      g.closePath();
    }, toneSolid(inkLevel(6)), 3);
    pen.ink(() => { g.moveTo(b.x, cy(b.y)); g.lineTo(b.x, cy(b.y) + H * 0.030); }, 2.5);
    pen.paint(() => {
      g.moveTo(b.x - W * 0.016, cy(b.y) + H * 0.030);
      g.lineTo(b.x + W * 0.016, cy(b.y) + H * 0.030);
      g.lineTo(b.x, cy(b.y) + H * 0.082);
      g.closePath();
    }, toneSolid(inkLevel(5)), 3);
  }

  /* ---- SMOKE ---- */
  if (has("smoke")){
    const p = hearth;
    const r = W * 0.072 * p.s;
    const sh = pt(ST.hearth.x, ST.hearth.z * 0.62);
    const top = cy(sh.y);
    g.save();
    g.strokeStyle = inkLevel(roar ? 4 : 3);
    g.lineWidth = roar ? W * 0.030 : W * 0.012;
    g.lineCap = "round";
    g.globalAlpha = roar ? 0.55 : 0.34;
    g.beginPath();
    g.moveTo(p.x, p.y - r * (roar ? 2.2 : 1.0));
    g.quadraticCurveTo(p.x + r * 0.9, (p.y + top) / 2, sh.x, top + H * 0.02);
    g.stroke();
    if (roar){
      g.lineWidth = W * 0.016; g.globalAlpha = 0.4;
      g.beginPath();
      g.moveTo(p.x - r * 0.5, p.y - r * 1.8);
      g.quadraticCurveTo(p.x - r * 1.2, (p.y + top) / 2, sh.x - W * 0.02, top + H * 0.03);
      g.stroke();
    }
    g.restore();
  }
}

export const asset = {
  id:"location.eumaeus-hut-interior",
  type:"LOCATION",
  name:"Eumaeus's Hut — Interior",
  statusWord:"THE HUT",
  scene:"OD-B16-S03",

  params,
  plan:"eumaeus-hut",
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["shell","walls","backwall","door","floor","light","post","penfittings",
          "corner","hearth","fire","seats","gear","smoke"],
  // placement / camera anchors — PROJECTED FROM THE PLAN, never hand-tuned
  anchors,
  // walkable ground for scene placement / pathing (plan space -> frame)
  zones:{
    walkable:{ x0:.16,y0:.56,x1:.84,y1:.96 },
    hearth:{ x0:.36,y0:.68,x1:.53,y1:.78 },
    threshold_door:{ x0:.44,y0:.52,x1:.56,y1:.60 },
    "pen-side":{ x0:.66,y0:.56,x1:.84,y1:.80 },
    "corner-dark":{ x0:.17,y0:.68,x1:.30,y1:.80 },
  },
  states:{
    initial:"day",
    nodes:{
      day:{ preview:{ state:"day" } },
      night:{ preview:{ state:"night" } },
      fire_high:{ preview:{ state:"fire_high" } },
    },
    edges:[["day","night"],["day","fire_high"],["fire_high","night"],["night","day"]],
  },
  channels:["state","light","fire","door","reveal","camera"],

  preview:()=>({ state:"day", t:0.5, status:"THE HUT", progress:.2 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
