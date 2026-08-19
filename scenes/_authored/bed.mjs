/* ============================================================================
   THE BED — OD-B23-S04, drawn.

   Every other frame in this film is ASSEMBLED: pre-rendered asset cards, keyed
   and pasted onto a stage by placeInstance and keyedModuleCanvas. Four hundred
   and forty parts, arranged. That is the right way to build a world of a
   hundred and fifty-two scenes and it is why the film can exist at all.

   It is also the wrong way to draw this.

   Odysseus's bed is carved from a living olive tree still rooted in the
   ground. He built the room around it. It is the one object in the poem that
   cannot be moved, copied, counterfeited or taken apart — which is exactly
   why Penelope uses it to know him, after twenty years, when nothing else she
   can see is proof of anything. Every other test in the Odyssey can be passed
   by a good liar, and the man in front of her is the best liar in the world.

   So this scene is not assembled. It is ONE CLOSED PATH: the roots, the trunk,
   the bed, and the two people holding each other are a single continuous
   outline, drawn in one pass, and nothing in it can be lifted out and reused
   anywhere else in the film. After two and a half hours of a machine
   fabricating a world, the machine stops fabricating and draws.

   That is the argument of the whole project landing in one shot: a film made
   by construction, about a man who constructs, arriving at the one thing he
   made that is true because it is rooted.

   THE ONE MOVING THING. Everything holds. Only the crown stirs — the tree is
   alive, which is the entire point of it, and it is the only living motion in
   the frame. Motion here is not decoration; it is the difference between
   furniture and a tree.

   Pure function of u ∈ [0,1). No frame reads any state from the frame before.
========================================================================== */

const TAU = Math.PI * 2;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;
/* the world's eight ink levels: 0 paper, 7 full ink */
const inkLevel = (l) => {
  const v = Math.round(255 - Math.max(0, Math.min(7, l)) * 255 / 7);
  const h = v.toString(16).padStart(2, "0");
  return "#" + h + h + h;
};
const INK = "#141210";

/* deterministic per-leaf jitter — no Math.random anywhere in a render path */
const rnd = (i) => { const s = Math.sin(i * 12.9898) * 43758.5453; return s - Math.floor(s); };

export const id = "OD-B23-S04";
export const title = "The Bed";

/* ---------------------------------------------------------------------------
   draw(g, W, H, t, dur)
   t is seconds into the scene; dur is its length. The authored window is the
   recognition itself — the film plays its assembled hall on either side.
--------------------------------------------------------------------------- */
export function draw(g, W, H, t, dur = 40) {
  const u = clamp01(dur > 0 ? t / dur : 0);
  const S = Math.min(W / 1120, H / 760);          // authored at the stage's own size
  const px = (n) => n * S;

  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, W, H);
  g.translate((W - 1120 * S) / 2, (H - 760 * S) / 2);
  g.scale(S, S);
  g.lineJoin = "round"; g.lineCap = "round";

  const FLOOR = 640;                              // the ground line
  const TRUNK = 604;                              // the trunk's centre x
  const OUT = 7;                                  // the one contour weight

  /* ---- the room, stated and no more --------------------------------------
     Two verticals and a lintel. The hall has been drawn ninety times already;
     here it only has to say "indoors" and then get out of the way. */
  g.strokeStyle = inkLevel(2); g.lineWidth = 3.2;
  g.beginPath();
  g.moveTo(150, 96); g.lineTo(150, FLOOR);
  g.moveTo(980, 96); g.lineTo(980, FLOOR);
  g.moveTo(150, 96); g.lineTo(980, 96);
  g.stroke();
  /* the floor: broken, per the law against unbroken full-width spans */
  g.strokeStyle = INK; g.lineWidth = 4;
  g.beginPath();
  for (const [a, b] of [[92, 380], [408, 700], [726, 1030]]) { g.moveTo(a, FLOOR); g.lineTo(b, FLOOR); }
  g.stroke();

  /* ---- BELOW THE FLOOR: the roots ---------------------------------------
     Nothing else in this film is drawn below its own ground line. The bed is
     the only object with anything underneath it, and that is the fact the
     whole scene turns on — so the soil goes down FIRST and the roots are cut
     back into it. Draft one laid the roots down and then filled the soil over
     the top of them, which erased the only argument the picture had to make.
  ------------------------------------------------------------------------ */
  g.fillStyle = inkLevel(2);
  g.beginPath(); g.moveTo(0, FLOOR); g.lineTo(1120, FLOOR); g.lineTo(1120, 760); g.lineTo(0, 760);
  g.closePath(); g.fill();
  g.strokeStyle = "#ffffff";
  for (let i = 0; i < 9; i++) {
    const a = (i - 4) / 4;
    g.lineWidth = 17 - Math.abs(a) * 10;
    g.beginPath();
    g.moveTo(TRUNK + a * 30, FLOOR + 2);
    g.quadraticCurveTo(TRUNK + a * 130, FLOOR + 52, TRUNK + a * 250, FLOOR + 104 + Math.abs(a) * 12);
    g.stroke();
  }
  g.strokeStyle = INK;
  for (let i = 0; i < 9; i++) {
    const a = (i - 4) / 4;
    g.lineWidth = 5.5 - Math.abs(a) * 2.2;
    g.beginPath();
    g.moveTo(TRUNK + a * 30, FLOOR + 2);
    g.quadraticCurveTo(TRUNK + a * 130, FLOOR + 52, TRUNK + a * 250, FLOOR + 104 + Math.abs(a) * 12);
    g.stroke();
  }

  /* ═══ THE ONE CLOSED PATH ═══════════════════════════════════════════════
     Trunk, crown and bedframe leave the pen once, so the whole thing carries a
     single hard contour and there is no seam where the tree becomes furniture.
     That is the visual claim: it is not a bed NEXT TO a tree. */
  const bedY = 470, bedL = 250, bedR = 940;
  const TW = 52;                                   // half the trunk's width

  const shape = () => {
    g.beginPath();
    g.moveTo(TRUNK - TW, FLOOR);
    g.quadraticCurveTo(TRUNK - TW - 10, 430, TRUNK - TW + 6, 300);
    g.quadraticCurveTo(TRUNK - TW - 4, 250, TRUNK - 44, 208);
    /* the crown: low, wide, olive */
    g.quadraticCurveTo(TRUNK - 150, 210, TRUNK - 214, 158);
    g.quadraticCurveTo(TRUNK - 140, 132, TRUNK - 104, 92);
    g.quadraticCurveTo(TRUNK - 30, 56, TRUNK + 30, 88);
    g.quadraticCurveTo(TRUNK + 120, 118, TRUNK + 200, 160);
    g.quadraticCurveTo(TRUNK + 132, 206, TRUNK + 44, 208);
    g.quadraticCurveTo(TRUNK + TW + 4, 250, TRUNK + TW - 6, 300);
    /* down into the bed's head-post without a joint */
    g.quadraticCurveTo(TRUNK + TW + 8, 420, TRUNK + TW, bedY - 30);
    g.lineTo(bedR - 44, bedY - 30);
    g.lineTo(bedR - 44, bedY + 10);
    g.lineTo(bedR, bedY + 10);
    g.lineTo(bedR, FLOOR - 2);
    g.lineTo(bedR - 34, FLOOR - 2);
    g.lineTo(bedR - 34, bedY + 50);
    g.lineTo(bedL + 34, bedY + 50);
    g.lineTo(bedL + 34, FLOOR - 2);
    g.lineTo(bedL, FLOOR - 2);
    g.lineTo(bedL, bedY + 10);
    g.lineTo(bedL + 44, bedY + 10);
    g.lineTo(bedL + 44, bedY - 30);
    g.lineTo(TRUNK - TW, bedY - 30);
    g.closePath();
  };
  g.fillStyle = "#ffffff"; shape(); g.fill();
  g.strokeStyle = INK; g.lineWidth = OUT; shape(); g.stroke();

  /* the trunk carries mass: a tone inside its own width, and bark */
  g.save();
  g.beginPath();
  g.moveTo(TRUNK - TW + 7, FLOOR); g.lineTo(TRUNK - TW + 7, 230);
  g.lineTo(TRUNK + TW - 7, 230);  g.lineTo(TRUNK + TW - 7, FLOOR);
  g.closePath(); g.clip();
  g.fillStyle = inkLevel(2); g.fillRect(TRUNK - TW, 220, TW * 2, FLOOR - 220);
  g.strokeStyle = inkLevel(4); g.lineWidth = 3.4;
  g.beginPath();
  for (const dx of [-30, -8, 14, 34]) {
    g.moveTo(TRUNK + dx, 236);
    g.quadraticCurveTo(TRUNK + dx * 1.15, 430, TRUNK + dx * 0.86, FLOOR);
  }
  g.stroke();
  g.restore();

  /* the mattress: one flat tone, no texture */
  g.fillStyle = inkLevel(2);
  g.fillRect(bedL + 44, bedY - 26, bedR - bedL - 88, 72);
  g.strokeStyle = INK; g.lineWidth = 3.4;
  g.strokeRect(bedL + 44, bedY - 26, bedR - bedL - 88, 72);

  /* ---- THE ONLY MOVING THING --------------------------------------------
     Sixty leaves on the crown, each stirring on its own phase. Everything
     else in the frame holds absolutely still. */
  g.fillStyle = INK;
  for (let i = 0; i < 60; i++) {
    const a = rnd(i), b = rnd(i + 91), c = rnd(i + 311);
    const ang = a * TAU;
    const rad = 46 + b * 132;
    const cx = TRUNK - 6 + Math.cos(ang) * rad * 1.32;
    const cy = 146 - Math.abs(Math.sin(ang)) * rad * 0.62 - b * 26;
    const stir = Math.sin(u * TAU + c * TAU) * (2.2 + b * 3.4);
    const L = 13 + c * 9;
    g.save();
    g.translate(cx + stir, cy + stir * 0.35);
    g.rotate(ang * 0.5 + stir * 0.05);
    g.beginPath(); g.ellipse(0, 0, L, L * 0.34, 0, 0, TAU); g.fill();
    g.restore();
  }

  /* ═══ THE TWO OF THEM ═══════════════════════════════════════════════════
     One silhouette. Not two figures placed near each other — a single closed
     outline with two heads, because that is what the scene is and because
     every other body in this film is a separate pasted card. */
  const bx = 356, by = FLOOR;                     // their feet, on the floor
  const hold = 1 - Math.pow(1 - clamp01(u * 1.6), 3);   // they close, and stay closed
  const gap = lerp(30, 5, hold);

  /* THE OUTLINE HAS TO DO THE WORK. Draft two drew a correct silhouette and it
     read as a lump with two heads on it, because a merged outline only says
     "two people" if the CONTOUR ITSELF turns — a notch under the arm that
     holds her, a gap of paper between the crowns, a hem that flares. Interior
     lines cannot rescue a shape whose edge says nothing. */
  const pair = () => {
    g.beginPath();
    g.moveTo(bx - 150, by);                                      // her hem, wide
    g.lineTo(bx - 128, by - 14);
    g.quadraticCurveTo(bx - 108, by - 128, bx - 92, by - 214);
    g.quadraticCurveTo(bx - 106, by - 258, bx - 86, by - 292);   // waist, shoulder
    g.quadraticCurveTo(bx - 96, by - 336, bx - 68, by - 354);
    g.quadraticCurveTo(bx - 96, by - 392, bx - 68, by - 422);    // HER HEAD
    g.quadraticCurveTo(bx - 40, by - 450, bx - 14, by - 418);
    g.quadraticCurveTo(bx - 6, by - 388, bx - 20, by - 358);
    /* the gap between them: the contour dives to paper and climbs again, so
       two crowns are visible as two */
    g.quadraticCurveTo(bx + 2, by - 344, bx + 12, by - 372);
    g.quadraticCurveTo(bx + 18, by - 402, bx + 34, by - 424);    // HIS HEAD
    g.quadraticCurveTo(bx + 66, by - 458, bx + 96, by - 424);
    g.quadraticCurveTo(bx + 114, by - 388, bx + 92, by - 356);
    g.quadraticCurveTo(bx + 128, by - 338, bx + 140, by - 292);  // his shoulder
    /* THE NOTCH: his forearm comes forward across her, so the outline turns in
       and back out. This one dent is what makes the mass read as an embrace. */
    g.quadraticCurveTo(bx + 150, by - 262, bx + 138, by - 248);
    g.quadraticCurveTo(bx + 108, by - 236, bx + 116, by - 216);
    g.quadraticCurveTo(bx + 130, by - 190, bx + 126, by - 120);
    g.lineTo(bx + 118, by);
    g.closePath();
  };
  g.fillStyle = "#ffffff"; pair(); g.fill();
  g.strokeStyle = INK; g.lineWidth = OUT; pair(); g.stroke();

  /* his forearm across her back, continuing the notch inward */
  g.strokeStyle = INK; g.lineWidth = 6.5;
  g.beginPath();
  g.moveTo(bx + 120, by - 232);
  g.quadraticCurveTo(bx + 26, by - 262, bx - 74, by - 284);
  g.stroke();
  /* her hand up at his shoulder */
  g.lineWidth = 5.5;
  g.beginPath();
  g.moveTo(bx - 80, by - 300);
  g.quadraticCurveTo(bx - 26, by - 340, bx + 34, by - 336);
  g.stroke();
  /* the hem, and one fold, so the skirt is cloth and not a cone */
  g.strokeStyle = INK; g.lineWidth = 4;
  g.beginPath(); g.moveTo(bx - 150, by - 4); g.lineTo(bx - 104, by - 22); g.stroke();
  g.strokeStyle = inkLevel(4); g.lineWidth = 3.2;
  g.beginPath();
  g.moveTo(bx - 116, by - 30); g.quadraticCurveTo(bx - 100, by - 130, bx - 88, by - 208);
  g.stroke();

  /* her hair and his beard: big flat masses. In this world a head is a shape
     plus one mass — the film has drawn ninety of them that way. */
  g.fillStyle = INK;
  g.beginPath();
  g.moveTo(bx - 92, by - 416); g.quadraticCurveTo(bx - 122, by - 350, bx - 96, by - 288);
  g.quadraticCurveTo(bx - 58, by - 306, bx - 46, by - 352);
  g.quadraticCurveTo(bx - 58, by - 396, bx - 44, by - 424);
  g.quadraticCurveTo(bx - 72, by - 434, bx - 92, by - 416);
  g.closePath(); g.fill();
  g.beginPath();
  g.moveTo(bx + 36, by - 388); g.quadraticCurveTo(bx + 62, by - 342, bx + 96, by - 360);
  g.quadraticCurveTo(bx + 106, by - 404, bx + 84, by - 420);
  g.quadraticCurveTo(bx + 54, by - 412, bx + 36, by - 388);
  g.closePath(); g.fill();

  /* eyes closed, both of them — the one recognition in the poem that is not
     made by looking */
  g.strokeStyle = INK; g.lineWidth = 4;
  g.beginPath();
  g.moveTo(bx - 82, by - 394); g.quadraticCurveTo(bx - 71, by - 386, bx - 60, by - 394);
  g.moveTo(bx + 50, by - 408); g.quadraticCurveTo(bx + 61, by - 400, bx + 72, by - 408);
  g.stroke();

  g.restore();
}
