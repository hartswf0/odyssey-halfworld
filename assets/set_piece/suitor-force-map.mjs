/* set_piece.suitor-force-map — the Book-XVI RECKONING, drawn as a counting board.
   SET_PIECE. Telemachus has just asked the only question that matters: how many
   are they, and how many are we. Odysseus makes him count. Fifty-two out of
   Dulichium, twenty-four out of Same, twenty out of Zacynthus, twelve of Ithaca
   itself, and with them a herald and a singer. A hundred and eight men. Against
   two.

   THE DIAGRAM IS THE ARGUMENT. One marker is one man, at one pitch, all the way
   down the sheet: a hundred and eight filled discs massed into four island
   blocks whose AREA is the count, then a heavy rule, then — at exactly the same
   pitch — two ringed markers. The imbalance is not asserted anywhere in words.
   You read it the way Telemachus reads it, by looking.

   Above the blocks the ODDS BAR states the same fact as a single proportional
   strip: a hundred and eight units of solid ink, and at its far end the two-unit
   tick that is the whole loyal force, ringed so it can be found at all.

   Below the rule the ALLY BAND carries the rest of the arithmetic Odysseus is
   actually doing: two men, two loyal servants who can be called (Eumaeus and
   Philoetius, drawn open because they are not in the room yet), and two divine
   channels — Athena and Zeus — struck as arrows into the muster, because the
   answer he gives his son is that those two are worth counting.

   The bottom strip is the PALACE PLAN the count will be settled in: the court
   gate, the side door onto the road, the hall with the suitor mass in it, the
   threshold the two men hold, and the storeroom where the arms are locked.

   Drawn as a separable chart component in SOLID grays + hard contour; the engine
   dotify pass supplies the halftone. Every glyph is built from bars and discs
   heavy enough to survive the dot lattice — no small type, no thin rules.
   Atlas: OD-B16-S04 — island-by-island counts, palace positions, weapon store,
   doors, loyal servants, and divine intervention channels. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

/* ---------------- the count itself ---------------- */
export const CONTINGENTS = [
  { key:"dulichium", name:"DULICHIUM", n:52, cols:13 },
  { key:"same",      name:"SAME",      n:24, cols:12 },
  { key:"zacynthus", name:"ZACYNTHUS", n:20, cols:10 },
  { key:"ithaca",    name:"ITHACA",    n:12, cols:12 },
];
export const SUITOR_TOTAL = CONTINGENTS.reduce((s, c) => s + c.n, 0);   // 108
const OFFICERS = { name:"HERALD + BARD", n:2 };                          // Medon, Phemius
const LOYAL_FORCE = 2;                                                   // Odysseus, Telemachus

const params = {
  frame:true,
  graticule:true,
  cell:0.0625,       // horizontal pitch of one marker (fraction of W)
  rowPitch:0.0355,   // vertical pitch of one marker row (fraction of H)
  markR:0.0195,      // marker radius (fraction of W)
  fieldX:0.085,      // left edge of the counting field
  suitorLevel:7,     // massed enemy markers — solid
  wallLW:7,          // plan wall weight
  barY:0.128, barH:0.020,          // the odds bar
  ruleLW:7,
};

/* ---------------- layout, computed once and shared by draw + anchors -------- */
const LAYOUT = (() => {
  const L = { blocks:[], officers:null };
  let y = 0.182;
  for (const c of CONTINGENTS){
    const rows = Math.ceil(c.n / c.cols);
    const b = { ...c, rows, header:y + 0.024, rowsTop:y + 0.050 };
    b.bottom = b.rowsTop + (rows - 1) * params.rowPitch;
    b.mid = { x: params.fieldX + (c.cols * params.cell) / 2,
              y: (b.rowsTop + b.bottom) / 2 };
    L.blocks.push(b);
    y = b.bottom + 0.020;
  }
  L.officers = { header:y + 0.024, rowsTop:y + 0.050 };
  L.officers.bottom = L.officers.rowsTop;
  L.rule = L.officers.bottom + 0.024;          // the heavy rule under the count
  L.allyMarks  = L.rule + 0.066;               // ally marker line
  L.allyLabels = L.rule + 0.112;               // ally caption baseline
  L.rule2 = L.rule + 0.130;
  L.plan = { y0:L.rule2 + 0.006, y1:0.946, x0:0.085, x1:0.915 };
  return L;
})();

/* the three ally groups, left to right: our two, the two who can be called,
   and the two channels that are not men at all */
const ALLY_GROUPS = [
  { key:"men",   label:"MEN",   n:2, x:0.110, kind:"ours" },
  { key:"loyal", label:"LOYAL", n:2, x:0.360, kind:"open" },
  { key:"gods",  label:"GODS",  n:2, x:0.610, kind:"divine" },
];
const ALLY_GAP = 0.062;

/* the palace plan strip, read left -> right: court, hall, storeroom */
const PLAN = {
  courtX:0.300,        // wall between court and hall
  storeX:0.760,        // wall between hall and storeroom
  gateY:0.5,           // court gate: gap in the left wall, mid height
  gateH:0.34,          // as a fraction of the strip height
  sideDoorX:0.130,     // side door: gap in the TOP wall (the road door)
  sideDoorW:0.046,
  hallDoorY:0.5, hallDoorH:0.30,   // threshold the two men hold
  storeDoorY:0.5, storeDoorH:0.26, // barred door into the arms
};

/* ---------------- heavy segmented numerals ----------------
   Small type dissolves under the dot lattice, so every number on this sheet is
   built from bars. Seven segments, drawn as filled rectangles. */
const SEG = {
  "0":"abcdef", "1":"bc", "2":"abged", "3":"abgcd", "4":"fgbc",
  "5":"afgcd", "6":"afgecd", "7":"abc", "8":"abcdefg", "9":"abcdfg",
};
function segDigit(g, ch, x, y, w, h, th){
  const s = SEG[ch]; if (!s) return;
  const put = (px, py, pw, ph) => { g.beginPath(); g.rect(px, py, pw, ph); g.fill(); };
  const my = y + h/2;
  g.fillStyle = INK;
  if (s.includes("a")) put(x, y, w, th);
  if (s.includes("g")) put(x, my - th/2, w, th);
  if (s.includes("d")) put(x, y + h - th, w, th);
  if (s.includes("f")) put(x, y, th, h/2);
  if (s.includes("b")) put(x + w - th, y, th, h/2);
  if (s.includes("e")) put(x, my, th, h/2);
  if (s.includes("c")) put(x + w - th, my, th, h/2);
}
function segWidth(str, w, gap){ return str.length*w + (str.length - 1)*gap; }
function segNum(g, str, x, y, w, h, th, gap){
  let cx = x;
  for (const ch of str){ segDigit(g, ch, cx, y, w, h, th); cx += w + gap; }
  return cx - gap - x;
}

/* ---------------- text ---------------- */
function tracked(g, text, x, y, size, track, color){
  g.save(); g.fillStyle = color; g.textBaseline = "alphabetic";
  g.font = `800 ${Math.round(size)}px Helvetica,Arial,sans-serif`;
  let cx = x; for (const ch of text){ g.fillText(ch, cx, y); cx += g.measureText(ch).width + track; }
  g.restore();
}

/* ---------------- markers ---------------- */
function suitorMark(pen, g, x, y, r){
  pen.paint(() => { g.arc(x, y, r, 0, 7); }, toneSolid(inkLevel(params.suitorLevel)), 3);
}
function ourMark(pen, g, x, y, r){
  pen.paint(() => { g.arc(x, y, r, 0, 7); }, toneSolid(inkLevel(0)), 3);
  g.save(); g.strokeStyle = INK; g.lineWidth = Math.max(5, r*0.42);
  g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.restore();
  g.fillStyle = ACCENT; g.beginPath(); g.arc(x, y, r*0.34, 0, 7); g.fill();
}
function openMark(pen, g, x, y, r){
  pen.paint(() => { g.arc(x, y, r, 0, 7); }, toneSolid(inkLevel(0)), 2);
  g.save(); g.strokeStyle = INK; g.lineWidth = Math.max(4, r*0.30);
  g.setLineDash([r*0.62, r*0.52]);
  g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
  g.setLineDash([]); g.restore();
}
function divineMark(pen, g, x, y, r){
  g.save(); g.strokeStyle = INK; g.lineWidth = Math.max(4, r*0.30); g.lineCap = "round";
  for (let i = 0; i < 8; i++){
    const a = i/8*Math.PI*2;
    g.beginPath();
    g.moveTo(x + Math.cos(a)*r*0.86, y + Math.sin(a)*r*0.86);
    g.lineTo(x + Math.cos(a)*r*1.46, y + Math.sin(a)*r*1.46);
    g.stroke();
  }
  g.restore();
  pen.paint(() => { g.arc(x, y, r*0.80, 0, 7); }, toneSolid(inkLevel(2)), 4);
  g.fillStyle = INK; g.beginPath(); g.arc(x, y, r*0.30, 0, 7); g.fill();
}
function squareMark(pen, g, x, y, r){
  pen.paint(() => { g.rect(x - r, y - r, r*2, r*2); }, toneSolid(inkLevel(0)), 5);
}

/* an arrow polyline: fat ink trunk + solid head at the last vertex */
function drawArrow(g, pts, { lw = 6, dashed = false, alpha = 1 } = {}){
  g.save(); g.strokeStyle = INK; g.globalAlpha = alpha;
  g.lineWidth = lw; g.lineCap = "round"; g.lineJoin = "round";
  if (dashed) g.setLineDash([lw*2.6, lw*2.1]);
  g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
  g.stroke(); g.setLineDash([]);
  const a = pts[pts.length-2], c = pts[pts.length-1];
  const dx = c.x-a.x, dy = c.y-a.y, L = Math.hypot(dx,dy)||1, ux = dx/L, uy = dy/L;
  const hs = lw*2.5;
  g.fillStyle = INK; g.beginPath();
  g.moveTo(c.x, c.y);
  g.lineTo(c.x - ux*hs - uy*hs*0.62, c.y - uy*hs + ux*hs*0.62);
  g.lineTo(c.x - ux*hs + uy*hs*0.62, c.y - uy*hs - ux*hs*0.62);
  g.closePath(); g.fill(); g.restore();
}

/* the weapons-cache glyph: a round shield over two crossed spears */
function armsGlyph(pen, g, cx, cy, r){
  g.save(); g.strokeStyle = INK; g.lineCap = "round"; g.lineWidth = Math.max(3, r*0.20);
  g.beginPath(); g.moveTo(cx - r*0.95, cy + r*0.95); g.lineTo(cx + r*0.95, cy - r*0.95); g.stroke();
  g.beginPath(); g.moveTo(cx - r*0.95, cy - r*0.95); g.lineTo(cx + r*0.95, cy + r*0.95); g.stroke();
  g.restore();
  pen.paint(() => { g.arc(cx, cy, r*0.62, 0, 7); }, toneSolid(inkLevel(4)), Math.max(3, r*0.18));
  g.fillStyle = inkLevel(7); g.beginPath(); g.arc(cx, cy, r*0.20, 0, 7); g.fill();
}

/* ---------------- the sheet ---------------- */
function drawChart(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const layers = st.layers || ["grid","odds","blocks","officers","rule","against",
                               "divine","plan","labels"];
  const has = l => layers.includes(l);
  const focus = st.focus || "all";
  const t = st.t || 0;
  const L = LAYOUT;

  const cell = params.cell*W, r = params.markR*W;
  const fx = params.fieldX*W;
  const hd = W*0.050;                       // header text size
  const track = W*0.005;

  /* ---- graticule: faint survey ruling under everything ---- */
  if (has("grid") && params.graticule){
    g.save(); g.strokeStyle = INK; g.globalAlpha = 0.09; g.lineWidth = 2;
    for (let i = 1; i < 10; i++){ const x = W*i/10; g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.stroke(); }
    for (let j = 1; j < 14; j++){ const y = H*j/14; g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.restore();
  }

  /* ---- THE ODDS BAR: one strip, proportional, and the two-unit tick ---- */
  if (has("odds")){
    const bx0 = 0.085*W, bx1 = 0.915*W, by = params.barY*H, bh = params.barH*H;
    const share = SUITOR_TOTAL / (SUITOR_TOTAL + LOYAL_FORCE);
    const split = bx0 + (bx1 - bx0)*share;
    pen.paint(() => { g.rect(bx0, by, split - bx0, bh); }, toneSolid(inkLevel(7)), 4);
    pen.paint(() => { g.rect(split, by, bx1 - split, bh); }, toneSolid(inkLevel(0)), 4);
    // ring the two-unit tick so the eye can find it at all
    g.save(); g.strokeStyle = INK; g.lineWidth = 5;
    g.beginPath(); g.ellipse((split + bx1)/2, by + bh/2, (bx1 - split)*1.6, bh*1.15, 0, 0, 7);
    g.stroke(); g.restore();
    // unit ticks along the massed side — this bar is countable too
    g.save(); g.strokeStyle = "#ffffff"; g.lineWidth = 2; g.globalAlpha = 0.9;
    for (let i = 1; i < 9; i++){
      const x = bx0 + (split - bx0)*i/9;
      g.beginPath(); g.moveTo(x, by + bh*0.20); g.lineTo(x, by + bh*0.80); g.stroke();
    }
    g.restore();
    // the two numbers, in bars — the biggest type on the sheet
    const dh = H*0.040, dw = W*0.034, dth = W*0.0110, dgap = W*0.011;
    const dy = 0.062*H;
    segNum(g, String(SUITOR_TOTAL), bx0, dy, dw, dh, dth, dgap);
    const twoW = segWidth("2", dw, dgap);
    segNum(g, String(LOYAL_FORCE), bx1 - twoW, dy, dw, dh, dth, dgap);
  }

  /* ---- THE COUNT: four island blocks, one marker per man ---- */
  if (has("blocks")){
    for (const b of L.blocks){
      // header: the island, and its number in bars at the right margin
      if (has("labels")) tracked(g, b.name, fx, b.header*H, hd, track, INK);
      const dh = H*0.030, dw = W*0.023, dth = W*0.0075, dgap = W*0.008;
      const s = String(b.n), sw = segWidth(s, dw, dgap);
      segNum(g, s, 0.915*W - sw, b.header*H - dh*0.86, dw, dh, dth, dgap);
      // a thin bracket tying the number to its block
      g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.50;
      g.beginPath();
      g.moveTo(fx, (b.header + 0.007)*H);
      g.lineTo(0.915*W, (b.header + 0.007)*H);
      g.stroke(); g.restore();
      // the markers
      let left = b.n;
      for (let row = 0; row < b.rows; row++){
        const inRow = Math.min(b.cols, left); left -= inRow;
        const y = (b.rowsTop + row*params.rowPitch)*H;
        for (let c = 0; c < inRow; c++) suitorMark(pen, g, fx + (c + 0.5)*cell, y, r);
      }
    }
  }

  /* ---- the two who are counted but will not fight ---- */
  if (has("officers")){
    const o = L.officers;
    if (has("labels")) tracked(g, OFFICERS.name, fx, o.header*H, hd, track, INK);
    const dh = H*0.030, dw = W*0.023, dth = W*0.0075, dgap = W*0.008;
    const s = String(OFFICERS.n), sw = segWidth(s, dw, dgap);
    segNum(g, s, 0.915*W - sw, o.header*H - dh*0.86, dw, dh, dth, dgap);
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.50;
    g.beginPath(); g.moveTo(fx, (o.header + 0.007)*H); g.lineTo(0.915*W, (o.header + 0.007)*H);
    g.stroke(); g.restore();
    for (let c = 0; c < OFFICERS.n; c++)
      squareMark(pen, g, fx + (c + 0.5)*cell, o.rowsTop*H, r*0.86);
  }

  /* ---- THE RULE: everything above is against everything below ---- */
  if (has("rule")){
    g.save(); g.fillStyle = INK;
    g.fillRect(0.085*W, L.rule*H - params.ruleLW/2, 0.830*W, params.ruleLW);
    g.restore();
    // a solid pip at each end — the rule is a boundary, not a underline
    g.fillStyle = INK;
    for (const x of [0.085*W, 0.915*W]){
      g.beginPath(); g.arc(x, L.rule*H, params.ruleLW*1.4, 0, 7); g.fill();
    }
  }

  /* ---- THE ALLY BAND: two men, two servants, two gods ---- */
  if (has("against")){
    for (const grp of ALLY_GROUPS){
      for (let i = 0; i < grp.n; i++){
        const x = (grp.x + i*ALLY_GAP)*W, y = L.allyMarks*H;
        if (grp.kind === "ours")   ourMark(pen, g, x, y, r*1.22);
        if (grp.kind === "open")   openMark(pen, g, x, y, r*1.22);
        if (grp.kind === "divine") divineMark(pen, g, x, y, r*1.06);
      }
      if (has("labels")) tracked(g, grp.label, grp.x*W, L.allyLabels*H, hd, track, INK);
    }
  }

  /* ---- DIVINE CHANNELS: the two arrows that make the arithmetic bearable ---- */
  if (has("divine")){
    const lit = focus === "committed" || focus === "all";
    const y = L.allyMarks*H;
    for (let i = 0; i < 2; i++){
      const from = { x:(ALLY_GROUPS[2].x + i*ALLY_GAP)*W, y: y - r*1.8 };
      const to   = { x:(ALLY_GROUPS[0].x + i*ALLY_GAP)*W, y: y - r*1.8 };
      const mid  = { x:(from.x + to.x)/2, y: y - r*(2.4 + i*1.1) };
      drawArrow(g, [from, mid, to],
                { lw: lit ? 6 : 5, dashed: !lit, alpha: lit ? 0.95 : 0.55 });
    }
    // a travelling pip riding the near channel — the help is on its way
    if (lit){
      const u = (t*0.30) % 1;
      const from = { x:ALLY_GROUPS[2].x*W, y: y - r*1.8 };
      const to   = { x:ALLY_GROUPS[0].x*W, y: y - r*1.8 };
      const mid  = { x:(from.x + to.x)/2, y: y - r*2.4 };
      const px = lerp(lerp(from.x, mid.x, u), lerp(mid.x, to.x, u), u);
      const py = lerp(lerp(from.y, mid.y, u), lerp(mid.y, to.y, u), u);
      pen.paint(() => { g.arc(px, py, r*0.60, 0, 7); }, toneSolid(inkLevel(0)), 4);
      g.fillStyle = ACCENT; g.beginPath(); g.arc(px, py, r*0.28, 0, 7); g.fill();
    }
  }

  /* ---- THE PALACE PLAN: where the count gets settled ---- */
  if (has("plan")){
    const p = L.plan;
    const X0 = p.x0*W, X1 = p.x1*W, Y0 = p.y0*H, Y1 = p.y1*H;
    const HGT = Y1 - Y0;
    const cx = PLAN.courtX*W, sx = PLAN.storeX*W;
    const lw = params.wallLW;

    // floors
    g.fillStyle = inkLevel(1); g.fillRect(X0, Y0, X1 - X0, HGT);
    g.fillStyle = inkLevel(2); g.fillRect(X0, Y0, cx - X0, HGT);          // court
    g.fillStyle = inkLevel(3); g.fillRect(sx, Y0, X1 - sx, HGT);          // storeroom, sealed

    // walls with their openings
    g.save(); g.strokeStyle = INK; g.lineCap = "butt"; g.lineWidth = lw;
    const gy0 = Y0 + HGT*(PLAN.gateY - PLAN.gateH/2), gy1 = Y0 + HGT*(PLAN.gateY + PLAN.gateH/2);
    g.beginPath(); g.moveTo(X0, Y0); g.lineTo(X0, gy0); g.stroke();       // left wall, gate gap
    g.beginPath(); g.moveTo(X0, gy1); g.lineTo(X0, Y1); g.stroke();
    g.beginPath(); g.moveTo(X1, Y0); g.lineTo(X1, Y1); g.stroke();        // right wall
    const sdL = (PLAN.sideDoorX - PLAN.sideDoorW/2)*W, sdR = (PLAN.sideDoorX + PLAN.sideDoorW/2)*W;
    g.beginPath(); g.moveTo(X0, Y0); g.lineTo(sdL, Y0); g.stroke();       // top wall, side door
    g.beginPath(); g.moveTo(sdR, Y0); g.lineTo(X1, Y0); g.stroke();
    g.beginPath(); g.moveTo(X0, Y1); g.lineTo(X1, Y1); g.stroke();        // bottom wall
    const hy0 = Y0 + HGT*(PLAN.hallDoorY - PLAN.hallDoorH/2);
    const hy1 = Y0 + HGT*(PLAN.hallDoorY + PLAN.hallDoorH/2);
    g.beginPath(); g.moveTo(cx, Y0); g.lineTo(cx, hy0); g.stroke();       // court/hall partition
    g.beginPath(); g.moveTo(cx, hy1); g.lineTo(cx, Y1); g.stroke();
    const ty0 = Y0 + HGT*(PLAN.storeDoorY - PLAN.storeDoorH/2);
    const ty1 = Y0 + HGT*(PLAN.storeDoorY + PLAN.storeDoorH/2);
    g.beginPath(); g.moveTo(sx, Y0); g.lineTo(sx, ty0); g.stroke();       // hall/store partition
    g.beginPath(); g.moveTo(sx, ty1); g.lineTo(sx, Y1); g.stroke();
    g.restore();

    // jamb ticks framing every opening
    g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = "round";
    const jt = W*0.014;
    const jV = (x, y) => { g.beginPath(); g.moveTo(x - jt, y); g.lineTo(x + jt, y); g.stroke(); };
    const jH = (x, y) => { g.beginPath(); g.moveTo(x, y - jt); g.lineTo(x, y + jt); g.stroke(); };
    jV(X0, gy0); jV(X0, gy1);
    jV(cx, hy0); jV(cx, hy1);
    jV(sx, ty0); jV(sx, ty1);
    jH(sdL, Y0); jH(sdR, Y0);
    // the storeroom door is barred
    g.lineWidth = 4;
    for (let k = 0; k < 3; k++){
      const y = lerp(ty0, ty1, (k + 0.5)/3);
      g.beginPath(); g.moveTo(sx - jt*0.7, y); g.lineTo(sx + jt*0.7, y); g.stroke();
    }
    g.restore();

    // the mass in the hall — the same markers, at plan scale
    const mr = W*0.0125;
    for (let row = 0; row < 2; row++){
      for (let c = 0; c < 8; c++){
        const x = lerp(cx + W*0.052, sx - W*0.028, c/7);
        const y = lerp(Y0 + HGT*0.32, Y1 - HGT*0.22, row);
        pen.paint(() => { g.arc(x, y, mr, 0, 7); }, toneSolid(inkLevel(7)), 2.5);
      }
    }
    // the two, holding the threshold
    ourMark(pen, g, cx + W*0.018, Y0 + HGT*0.34, mr*1.6);
    ourMark(pen, g, cx + W*0.018, Y0 + HGT*0.72, mr*1.6);
    // the arms, locked away
    armsGlyph(pen, g, (sx + X1)/2, Y0 + HGT*0.52, W*0.038);
    /* no type in the strip: at this height a caption would sit on the walls and
       on the mass. The plan is read off its glyphs — the gate gap, the jambed
       threshold with the two ringed markers standing in it, the massed hall, and
       the barred door with the arms behind it. */
  }

  /* ---- the survey border ---- */
  if (params.frame) pen.ink(() => { g.rect(W*0.045, H*0.045, W*0.910, H*0.910); }, 4);
}

/* ---------------- anchors, from the same layout the sheet is drawn from ----- */
const anchors = (() => {
  const a = {};
  for (const b of LAYOUT.blocks)
    a[`count:${b.key}`] = { x:+b.mid.x.toFixed(3), y:+b.mid.y.toFixed(3) };
  a["count:officers"] = { x:params.fieldX + params.cell, y:LAYOUT.officers.rowsTop };
  a["total:suitors"]  = { x:0.860, y:LAYOUT.rule - 0.014 };
  a["bar:odds"]       = { x:0.500, y:params.barY + params.barH/2 };
  a["bar:the-two"]    = { x:0.905, y:params.barY + params.barH/2 };
  for (const grp of ALLY_GROUPS)
    a[`muster:${grp.key}`] = { x:+(grp.x + ALLY_GAP/2).toFixed(3), y:LAYOUT.allyMarks };
  a["channel:athena"] = { x:ALLY_GROUPS[2].x, y:LAYOUT.allyMarks };
  a["channel:zeus"]   = { x:+(ALLY_GROUPS[2].x + ALLY_GAP).toFixed(3), y:LAYOUT.allyMarks };
  a["plan:court"]     = { x:0.190, y:0.892 };
  a["plan:hall"]      = { x:0.520, y:0.892 };
  a["plan:storeroom"] = { x:0.838, y:0.892 };
  a["door:gate"]      = { x:0.085, y:0.892 };
  a["door:side"]      = { x:PLAN.sideDoorX, y:LAYOUT.plan.y0 };
  a["door:threshold"] = { x:PLAN.courtX, y:0.892 };
  a["door:storeroom"] = { x:PLAN.storeX, y:0.892 };
  a["store:arms"]     = { x:0.838, y:0.892 };
  a["muster:threshold"] = { x:0.280, y:0.892 };
  a["camera:sheet"]   = { x:0.500, y:0.500 };
  a["camera:count"]   = { x:0.500, y:0.400 };
  a["camera:plan"]    = { x:0.500, y:0.892 };
  for (const [k, v] of Object.entries(a)){
    a[k] = { x:+clamp(v.x, 0, 1).toFixed(3), y:+clamp(v.y, 0, 1).toFixed(3) };
  }
  return a;
})();

export const asset = {
  id:"set_piece.suitor-force-map",
  type:"SET_PIECE",
  name:"Suitor force map",
  statusWord:"COUNTED",
  scene:"OD-B16-S04",

  params,
  counts:{ dulichium:52, same:24, zacynthus:20, ithaca:12,
           herald:1, bard:1, suitors:SUITOR_TOTAL, ours:LOYAL_FORCE,
           loyal:2, divine:2 },
  // back -> front draw order; scene state can pass a subset to reveal in beats
  layers:["grid","odds","blocks","officers","rule","against","divine","plan","labels"],
  // normalized 0..1 callout / placement anchors (chart nodes, not baked figures)
  anchors,
  // collision boundaries / footprints on the sheet
  zones:{
    odds:{ x0:.085, y0:.040, x1:.915, y1:.130 },
    count:{ x0:.085, y0:.180, x1:.915, y1:LAYOUT.officers.bottom + .020 },
    "block-dulichium":{ x0:.085, y0:LAYOUT.blocks[0].rowsTop - .020,
                        x1:.900, y1:LAYOUT.blocks[0].bottom + .020 },
    against:{ x0:.085, y0:LAYOUT.rule + .004, x1:.915, y1:LAYOUT.rule2 - .004 },
    plan:{ x0:LAYOUT.plan.x0, y0:LAYOUT.plan.y0, x1:LAYOUT.plan.x1, y1:LAYOUT.plan.y1 },
    storeroom:{ x0:PLAN.storeX, y0:LAYOUT.plan.y0, x1:LAYOUT.plan.x1, y1:LAYOUT.plan.y1 },
    sheet:{ x0:.045, y0:.045, x1:.955, y1:.955 },
  },
  // depth layer for scene compositing (a flat mid-ground tactical sheet)
  depth:"midground",
  states:{
    initial:"count",
    nodes:{
      // the whole reckoning
      count:{ preview:{ focus:"all", status:"COUNTED", progress:.45 } },
      // the question only: the bar, the blocks, the rule
      odds:{ preview:{ layers:["grid","odds","blocks","officers","rule","labels"],
                       focus:"odds", status:"ODDS", progress:.25 } },
      // the answer: what is on our side of the rule, and the plan it plays in
      allies:{ preview:{ layers:["grid","odds","rule","against","divine","plan","labels"],
                         focus:"allies", status:"ALLIES", progress:.7 } },
      // channels lit, the pip running, the two at the threshold
      committed:{ preview:{ focus:"committed", status:"COMMITTED", progress:.92 } },
    },
    edges:[["count","odds"],["odds","count"],["count","allies"],
           ["allies","committed"],["committed","count"]],
  },
  channels:["reveal","count","focus","channel"],

  preview:()=>({ focus:"all", t:1.2, status:"COUNTED", progress:.45 }),
  draw(ctx,W,H,state){ drawChart(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
