/* ensemble.suitor-gift-procession — the bidding, walked in.

   ENSEMBLE asset. Book XVIII, OD-B18-S04: Penelope stands at the stair and
   asks for gifts, and the suitors — who have eaten the house for four years —
   suddenly want to be seen giving. Heralds are sent. The procession that
   comes back up the hall is not generosity, it is an AUCTION with feet: a
   robe with twelve gold pins, a chain strung with amber, a pair of triple-drop
   earrings, a brooch, a worked collar — each one carried out and held up a
   little higher than the last, because the man behind you is watching.

   The asset IS that escalation. ONE separable member template (`drawBearer`)
   instanced deterministically across three depth bands. Each member is a
   servant or a suitor carrying ONE gift from a small catalogue, and a single
   scalar — the member's local `lift` — carries it continuously through:

       lift = 0.0   WAITING     gift held at the waist, head down the line
       lift = 0.5   RAISING     gift up, body leaning onto the dais
       lift = 1.0   PRESENTING  gift over the shoulder, arm at full extension

   A REACTION-WAVE front sweeps that lift along the queue, so at any `wave`
   position one part of the line has already delivered and dropped its hands
   while another is only now hoisting — the competition is visible as a
   travelling crest of raised arms, never as a cut.

   ENSEMBLE controls, all exposed as channels:
     formation   queue | fan | press | file
     density     thins the DEEP bands first (see member `dp` thresholds)
     attention   how hard the heads turn onto the receiving dais
     wave        0 = nobody has presented .. 1 = the whole line has
     waveSpread  width of the crest (how many arms are up at once)
     raise       ceiling on lift — hold the whole line at half-hoist
     depth       foreground/background grading (band tone + band scale)

   No named character is baked in. Penelope is NOT drawn: the receiving dais
   stands empty with a `focus:receiver` anchor for the scene to place her on.
   The gift catalogue is also published overhead as an INDEX of five outlined
   plates on a rising staircase — the sequence, as a diagram — so the member
   template's separability is legible in the card itself.

   Solid grays + hard contour only; the engine dotify POST pass supplies the
   halftone. Light garments, dark accents (hair, beard, gift metal), plenty of
   paper. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);
const smooth  = t => { t = clamp01(t); return t*t*(3-2*t); };

/* the separable gift catalogue — the member template's one swappable part */
export const GIFTS = ["robe", "chain", "earrings", "brooch", "collar"];

/* ---------------- the roster: one template, instanced ----------------
   band 0 = back (small, light) .. 2 = front (large, darker)
   q  = place in the queue; the wave front travels along q, left -> right
   dp = density threshold: the member is dropped when density < dp
        (back-band members have the highest dp, so depth thins first)      */
const MEMBERS = [
  { gift:"chain",    role:"servant", band:0, x:0.33, q:2, dp:0.72 },
  { gift:"brooch",   role:"suitor",  band:0, x:0.62, q:5, dp:0.86 },
  { gift:"robe",     role:"servant", band:1, x:0.24, q:1, dp:0.44 },
  { gift:"earrings", role:"suitor",  band:1, x:0.46, q:4, dp:0.56 },
  { gift:"collar",   role:"servant", band:2, x:0.11, q:0, dp:0.05 },
  { gift:"robe",     role:"suitor",  band:2, x:0.40, q:3, dp:0.16 },
  { gift:"chain",    role:"servant", band:2, x:0.67, q:6, dp:0.28 },
];

const BAND_Y     = [0.575, 0.715, 0.925];   // footline as a fraction of H
const BAND_S     = [150, 185, 235];         // member height in px
const BAND_CLOTH = [2, 3, 3];               // garment ink level (kept LIGHT)
const BAND_SKIN  = [1, 1, 2];

const params = {
  formation:"queue",   // queue | fan | press | file
  bands:3,
  density:1.0,         // 0 = front band only .. 1 = the whole line
  attention:0.8,       // 0 = heads down the line .. 1 = every head on the dais
  wave:0.58,           // the crest position along the queue
  waveSpread:0.50,     // width of the crest (how many arms are up together)
  raise:1.0,           // ceiling on local lift
  depth:1.0,           // foreground/background grading strength
  focus:{ x:0.848, y:0.478 },   // the receiving dais
  showIndex:true,      // the five-plate gift catalogue overhead
  showDais:true,       // the empty receiving dais + footstool
  showDoor:true,       // the hall door the heralds come back through
  showFront:true,      // the dashed reaction-front marker
};

/* ============================================================
   GIFT CATALOGUE — five glyphs, each sized off a nominal figure height s.
   (x,y) is the gift's own centre. giftGrips() publishes where the hands go,
   so the member rig never has to know what it is carrying.
   ============================================================ */
function giftGrips(kind, x, y, s){
  switch(kind){
    case "chain":    return [ {x:x-s*0.170, y:y-s*0.02}, {x:x+s*0.170, y:y-s*0.02} ];
    case "robe":     return [ {x:x-s*0.140, y:y-s*0.050}, {x:x+s*0.140, y:y-s*0.050} ];
    case "earrings": return [ {x:x, y:y+s*0.075} ];
    case "collar":   return [ {x:x-s*0.115, y:y+s*0.11}, {x:x+s*0.115, y:y+s*0.11} ];
    default:         return [ {x:x, y:y+s*0.105} ];   // brooch
  }
}

/* normalized bounding box of each glyph in units of s, so the INDEX can fit
   any of them into the same plate without a hand-tuned number per plate */
const GIFT_BOX = {
  brooch:  { w:0.28, h:0.28, cy: 0.000 },
  chain:   { w:0.41, h:0.34, cy: 0.110 },
  earrings:{ w:0.22, h:0.27, cy: 0.113 },
  collar:  { w:0.31, h:0.31, cy: 0.010 },
  robe:    { w:0.33, h:0.42, cy: 0.130 },
};

function drawGift(pen, kind, x, y, s, cw){
  const g = pen.ctx;
  const metal = toneSolid(inkLevel(6));
  const half  = toneSolid(inkLevel(4));
  const pale  = toneSolid(inkLevel(1));
  const paper = toneSolid(inkLevel(0));

  if (kind === "brooch"){
    // long pin behind, then a hard worked disc with a light eye
    pen.paint(()=>{ g.rect(x-s*0.115, y-s*0.014, s*0.23, s*0.028); }, half, cw);
    const r = s*0.088;
    for(let i=0;i<8;i++){                       // radial spikes
      const a = i*Math.PI/4;
      pen.paint(()=>{
        g.moveTo(x+Math.cos(a)*r*0.9, y+Math.sin(a)*r*0.9);
        g.lineTo(x+Math.cos(a+0.30)*r*1.45, y+Math.sin(a+0.30)*r*1.45);
        g.lineTo(x+Math.cos(a-0.30)*r*1.45, y+Math.sin(a-0.30)*r*1.45);
        g.closePath();
      }, half, cw*0.7);
    }
    pen.paint(()=>{ g.arc(x, y, r, 0, 7); }, metal, cw);
    pen.paint(()=>{ g.arc(x, y, r*0.44, 0, 7); }, paper, cw*0.9);
    return;
  }

  if (kind === "chain"){
    // a strung necklace sagging between two hands, amber pendant at the low point
    const a = { x:x-s*0.170, y:y-s*0.02 }, b = { x:x+s*0.170, y:y-s*0.02 };
    const cyc = y + s*0.235;                    // quadratic control -> sag
    pen.ink(()=>{ g.moveTo(a.x,a.y); g.quadraticCurveTo(x, cyc, b.x, b.y); }, cw*0.9);
    const N = 9, br = s*0.038;
    for(let i=0;i<N;i++){
      const t = i/(N-1), it = 1-t;
      const bx = it*it*a.x + 2*it*t*x + t*t*b.x;
      const by = it*it*a.y + 2*it*t*cyc + t*t*b.y;
      pen.paint(()=>{ g.arc(bx, by, br*(i%2?0.72:1), 0, 7); }, i%2 ? half : metal, cw*0.7);
    }
    const py = 0.25*a.y + 0.5*cyc + 0.25*b.y;   // pendant hangs off the low bead
    pen.paint(()=>{
      g.moveTo(x, py+s*0.02); g.lineTo(x+s*0.058, py+s*0.095);
      g.lineTo(x, py+s*0.170); g.lineTo(x-s*0.058, py+s*0.095); g.closePath();
    }, metal, cw);
    pen.paint(()=>{ g.arc(x, py+s*0.095, s*0.024, 0, 7); }, paper, cw*0.7);
    return;
  }

  if (kind === "earrings"){
    // a carrying rod with a matched pair of triple-drop earrings
    pen.paint(()=>{ g.rect(x-s*0.105, y-s*0.016, s*0.21, s*0.032); }, half, cw);
    for(const sgn of [-1, 1]){
      const ex = x + sgn*s*0.062;
      pen.ink(()=>{ g.moveTo(ex, y+s*0.016); g.lineTo(ex, y+s*0.055); }, cw*0.8);
      pen.paint(()=>{                                  // upper triangle
        g.moveTo(ex-s*0.040, y+s*0.055); g.lineTo(ex+s*0.040, y+s*0.055);
        g.lineTo(ex, y+s*0.135); g.closePath();
      }, metal, cw*0.8);
      pen.paint(()=>{ g.arc(ex, y+s*0.170, s*0.030, 0, 7); }, half, cw*0.8);
      pen.paint(()=>{ g.arc(ex, y+s*0.222, s*0.019, 0, 7); }, metal, cw*0.7);
    }
    return;
  }

  if (kind === "collar"){
    // a worked gold collar carried flat on its board — pierced crescent
    const ccy = y - s*0.055, R = s*0.145, r = s*0.078;
    pen.paint(()=>{
      g.arc(x, ccy, R, Math.PI*0.10, Math.PI*0.90);
      g.arc(x, ccy, r, Math.PI*0.90, Math.PI*0.10, true);
      g.closePath();
    }, metal, cw);
    for(let i=0;i<4;i++){                        // pierced light holes
      const a = Math.PI*(0.26 + i*0.16);
      pen.paint(()=>{ g.arc(x+Math.cos(a)*(R+r)/2, ccy+Math.sin(a)*(R+r)/2, s*0.021, 0, 7); }, paper, cw*0.6);
    }
    pen.paint(()=>{ g.rect(x-s*0.150, y+s*0.085, s*0.30, s*0.036); }, pale, cw); // board
    pen.seam(()=>{ g.moveTo(x-s*0.05, y+s*0.085); g.lineTo(x-s*0.05, y+s*0.121); }, cw*0.7);
    return;
  }

  // robe — a folded bolt on both forearms, the cloth falling free below it
  const bw = s*0.26, top = y - s*0.100, fh = s*0.070;
  pen.paint(()=>{                                  // the fold, foreshortened
    g.moveTo(x-bw/2, top); g.lineTo(x-bw/2+s*0.046, top-s*0.046);
    g.lineTo(x+bw/2+s*0.046, top-s*0.046); g.lineTo(x+bw/2, top); g.closePath();
  }, pale, cw);
  pen.paint(()=>{ g.rect(x-bw/2, top, bw, fh); }, half, cw);
  const fy = top + fh, dep = s*0.230;
  const tw = bw*0.44, bwid = bw*0.56;              // the fall flares as cloth does
  const hemPt = i => ({ x: x - bwid + (2*bwid)*(i/4), y: fy + dep + ((i%2) ? s*0.048 : 0) });
  pen.paint(()=>{                                  // the fall, a LIGHT plane
    g.moveTo(x-tw, fy); g.lineTo(x+tw, fy);
    for(let i=4;i>=0;i--){ const p=hemPt(i); g.lineTo(p.x, p.y); }
    g.closePath();
  }, pale, cw);
  for(let i=1;i<4;i++){                             // fold seams down the fall
    const p = hemPt(i);
    pen.seam(()=>{ g.moveTo(x-tw+(2*tw)*(i/4), fy+s*0.020); g.lineTo(p.x, p.y-s*0.030); }, cw*0.8);
  }
  pen.paint(()=>{                                  // the dark worked border, a filled band
    const p0 = hemPt(0); g.moveTo(p0.x, p0.y);
    for(let i=1;i<=4;i++){ const p=hemPt(i); g.lineTo(p.x, p.y); }
    for(let i=4;i>=0;i--){ const p=hemPt(i); g.lineTo(p.x, p.y - s*0.040); }
    g.closePath();
  }, toneSolid(inkLevel(5)), cw*0.8);
}

/* ---------------- one 2-segment arm, shoulder -> elbow -> hand ---------- */
function arm(pen, sh, hand, sleeve, skin, s, bend, cw){
  const g = pen.ctx;
  const dx = hand.x-sh.x, dy = hand.y-sh.y, L = Math.hypot(dx,dy) || 1;
  const el = { x:(sh.x+hand.x)/2 + (-dy/L)*L*bend, y:(sh.y+hand.y)/2 + (dx/L)*L*bend };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, sleeve, s*0.062);
  pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(hand.x,hand.y); }, skin, s*0.050);
  pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.030, 0, 7); }, skin, cw*0.8);
  return el;
}

/* ============================================================
   THE MEMBER TEMPLATE — one bearer, drawn deterministically.
   Everything keyed off s so the same code serves the 150px back band and
   the 235px front band. `lift` is the member's whole performance.
   ============================================================ */
function drawBearer(pen, m){
  const g = pen.ctx;
  const s = m.s, cx = m.cx, baseY = m.baseY, F = m.face;
  const cw = Math.max(2, s*0.019);
  const lift = m.lift, turn = m.headTurn;
  const suitor = m.role === "suitor";

  const cloth = toneSolid(inkLevel(m.tone.cloth));
  const skin  = toneSolid(inkLevel(m.tone.skin));
  const hairT = toneSolid(inkLevel(6));
  const sashT = toneSolid(inkLevel(5));
  const shoeT = toneSolid(inkLevel(5));

  const headR  = s*0.080;
  const headCy = baseY - s*0.895;
  const shoY   = baseY - s*0.775;
  const hipY   = baseY - s*0.460;
  const hemY   = suitor ? baseY - s*0.075 : baseY - s*0.300;
  const shw    = s*0.205;
  const hemw   = suitor ? s*0.300 : s*0.245;
  const lean   = F * s * (0.018 + 0.040*lift);       // presses onto the dais

  /* ---- ground shadow: plants the body, adds no mass ---- */
  g.fillStyle = "rgba(0,0,0,0.09)";
  g.beginPath(); g.ellipse(cx, baseY+s*0.010, hemw*0.80, s*0.020, 0,0,7); g.fill();

  /* ---- legs: a walking stride, drawn under the garment ---- */
  const kneeY = baseY - s*0.215, ankY = baseY - s*0.020;
  const legT = suitor ? cloth : skin;
  // trailing leg
  pen.limb(()=>{ g.moveTo(cx-F*s*0.030, hipY); g.lineTo(cx-F*s*0.075, kneeY); }, legT, s*0.062);
  pen.limb(()=>{ g.moveTo(cx-F*s*0.075, kneeY); g.lineTo(cx-F*s*0.105, ankY); }, legT, s*0.050);
  pen.paint(()=>{ g.ellipse(cx-F*s*0.115, baseY, s*0.052, s*0.021, 0,0,7); }, shoeT, cw*0.8);
  // leading leg
  pen.limb(()=>{ g.moveTo(cx+F*s*0.030, hipY); g.lineTo(cx+F*s*0.085, kneeY); }, legT, s*0.066);
  pen.limb(()=>{ g.moveTo(cx+F*s*0.085, kneeY); g.lineTo(cx+F*s*0.125, ankY); }, legT, s*0.052);
  pen.paint(()=>{ g.ellipse(cx+F*s*0.140, baseY, s*0.054, s*0.022, 0,0,7); }, shoeT, cw*0.8);

  /* ---- gift geometry + grips (computed before the arms) ---- */
  const gx = cx + F*(s*0.270 + lift*s*0.050) + lean;
  const gy = shoY + s*0.115 - lift*s*0.345;
  const grips = giftGrips(m.gift, gx, gy, s);

  const shN = { x:cx + F*shw*0.34 + lean, y:shoY + s*0.030 };   // near shoulder
  const shF = { x:cx - F*shw*0.34 + lean, y:shoY + s*0.038 };   // far shoulder

  /* ---- FAR arm, behind the torso ---- */
  const farHand = grips.length > 1
    ? grips[0]
    : (suitor
        ? { x:cx - F*s*0.235, y:shoY + s*0.055 - lift*s*0.150 }   // open bidding palm
        : { x:cx - F*s*0.075, y:hipY + s*0.020 });                // at his side
  arm(pen, shF, farHand, cloth, skin, s, -0.10*F, cw);
  if (suitor && grips.length === 1)                               // open bidding palm
    pen.paint(()=>{ g.ellipse(farHand.x - F*s*0.020, farHand.y - s*0.016,
                              s*0.044, s*0.030, -F*0.5, 0, 7); }, skin, cw*0.8);

  /* ---- TORSO ---- */
  pen.paint(()=>{
    g.moveTo(cx - shw/2 + lean, shoY);
    g.lineTo(cx + shw/2 + lean, shoY);
    g.lineTo(cx + hemw/2, hemY);
    g.lineTo(cx - hemw/2, hemY);
    g.closePath();
  }, cloth, cw);
  // hem, broken into two runs so nothing reads as a bar
  pen.seam(()=>{ g.moveTo(cx-hemw*0.46, hemY-s*0.014); g.lineTo(cx-hemw*0.08, hemY-s*0.014); }, cw*0.8);
  pen.seam(()=>{ g.moveTo(cx+hemw*0.06, hemY-s*0.014); g.lineTo(cx+hemw*0.46, hemY-s*0.014); }, cw*0.8);
  // belt + a single fold seam
  pen.seam(()=>{ g.moveTo(cx-shw*0.46+lean*0.5, hipY-s*0.010); g.lineTo(cx+shw*0.46+lean*0.5, hipY-s*0.010); }, cw*0.9);
  pen.seam(()=>{ g.moveTo(cx+lean*0.6, hipY+s*0.010); g.lineTo(cx+F*s*0.020, hemY-s*0.030); }, cw*0.7);
  if (suitor){                                    // the dark diagonal sash
    pen.paint(()=>{
      g.moveTo(cx - shw*0.44 + lean, shoY + s*0.030);
      g.lineTo(cx - shw*0.16 + lean, shoY + s*0.020);
      g.lineTo(cx + hemw*0.30, hipY + s*0.045);
      g.lineTo(cx + hemw*0.10, hipY + s*0.055);
      g.closePath();
    }, sashT, cw*0.8);
  }

  /* ---- NECK + HEAD ---- */
  const hx = cx + lean + F*headR*0.42*turn;
  const hy = headCy - lift*s*0.012;
  pen.limb(()=>{ g.moveTo(cx+lean, shoY+s*0.004); g.lineTo(hx, hy+headR*0.72); }, skin, s*0.050);
  if (suitor)                                     // long hair lobe behind
    pen.paint(()=>{ g.arc(hx - F*headR*0.55, hy + headR*0.28, headR*0.72, 0, 7); }, hairT, cw*0.8);
  pen.paint(()=>{ g.arc(hx, hy, headR, 0, 7); }, skin, cw);
  // eye + brow — kept as marks, not as detail that the lattice will eat
  g.fillStyle = INK;
  g.beginPath(); g.arc(hx + F*headR*0.36, hy - headR*0.10, headR*0.17, 0, 7); g.fill();
  pen.ink(()=>{ g.moveTo(hx + F*headR*0.12, hy - headR*0.38);
                g.lineTo(hx + F*headR*0.62, hy - headR*0.30); }, cw*0.9);
  pen.ink(()=>{ g.moveTo(hx + F*headR*0.72, hy - headR*0.02);
                g.lineTo(hx + F*headR*0.90, hy + headR*0.22); }, cw*0.8);   // nose
  // hair cap over the crown
  pen.paint(()=>{ g.arc(hx, hy - headR*0.08, headR*1.04, Math.PI*0.97, Math.PI*2.03); }, hairT, cw*0.8);
  if (suitor)                                     // beard wedge
    pen.paint(()=>{
      g.moveTo(hx - F*headR*0.62, hy + headR*0.30);
      g.lineTo(hx + F*headR*0.86, hy + headR*0.34);
      g.lineTo(hx + F*headR*0.14, hy + headR*1.44); g.closePath();
    }, hairT, cw*0.8);

  /* ---- NEAR arm (or both, for a two-handed gift) + the GIFT ---- */
  arm(pen, shN, grips[grips.length-1], cloth, skin, s, 0.12*F, cw);
  drawGift(pen, m.gift, gx, gy, s, cw);
}

/* ============================================================
   THE HALL — kept deliberately sparse: a door at the tail of the line, an
   empty receiving dais at the head of it, and broken floor rules. No
   full-width beam, terrace or dado anywhere.
   ============================================================ */
function drawDoor(pen, W, H){
  const g = pen.ctx;
  const pale = toneSolid(inkLevel(1)), dim = toneSolid(inkLevel(3));
  const x0 = W*0.055, x1 = W*0.145, yTop = H*0.398, yBot = H*0.580;
  // the opening: the one deep dark in the back half — the hall the heralds
  // keep going out to, and coming back through with another armful
  pen.paint(()=>{ g.rect(x0, yTop, x1-x0, yBot-yTop); }, toneSolid(inkLevel(6)), 4);
  // a herald's shadow crossing it — a mark, never a figure
  pen.paint(()=>{ g.rect(x0+W*0.026, yTop+H*0.052, W*0.030, (yBot-yTop)-H*0.052); }, dim, 3);
  // jambs + lintel, light so the dark stays a note and not a mass
  pen.paint(()=>{ g.rect(x0-W*0.026, yTop, W*0.026, yBot-yTop); }, pale, 4);
  pen.paint(()=>{ g.rect(x1, yTop, W*0.026, yBot-yTop); }, pale, 4);
  pen.paint(()=>{ g.rect(x0-W*0.040, yTop-H*0.026, (x1-x0)+W*0.080, H*0.026); }, dim, 4);
  pen.seam(()=>{ g.moveTo(x0+W*0.036, yTop-H*0.026); g.lineTo(x0+W*0.036, yTop); }, 3);
}

function drawDais(pen, W, H){
  const g = pen.ctx;
  const pale = toneSolid(inkLevel(1)), dim = toneSolid(inkLevel(3)), dark = toneSolid(inkLevel(5));
  const floor = H*0.600;
  // two steps, each broken by a riser seam so neither reads as a bar
  pen.paint(()=>{ g.rect(W*0.700, floor-H*0.030, W*0.285, H*0.030); }, pale, 4);
  pen.paint(()=>{ g.rect(W*0.740, floor-H*0.062, W*0.225, H*0.032); }, dim, 4);
  pen.seam(()=>{ g.moveTo(W*0.845, floor-H*0.030); g.lineTo(W*0.845, floor); }, 3);
  pen.seam(()=>{ g.moveTo(W*0.880, floor-H*0.062); g.lineTo(W*0.880, floor-H*0.030); }, 3);
  // the empty chair, in profile, facing the line
  const seatY = floor-H*0.062, sx = W*0.762;
  pen.paint(()=>{ g.rect(sx+W*0.150, seatY-H*0.150, W*0.028, H*0.128); }, dim, 4); // back post
  pen.paint(()=>{ g.rect(sx+W*0.126, seatY-H*0.168, W*0.076, H*0.022); }, dark, 4);// finial
  pen.paint(()=>{ g.rect(sx, seatY-H*0.048, W*0.176, H*0.024); }, pale, 4);        // seat
  pen.ink(()=>{ g.moveTo(sx+W*0.016, seatY-H*0.024); g.lineTo(sx+W*0.008, seatY); }, 4);
  pen.ink(()=>{ g.moveTo(sx+W*0.150, seatY-H*0.024); g.lineTo(sx+W*0.158, seatY); }, 4);
  // footstool, waiting
  pen.paint(()=>{ g.rect(W*0.702, floor-H*0.046, W*0.066, H*0.016); }, dim, 4);
  pen.ink(()=>{ g.moveTo(W*0.710, floor-H*0.030); g.lineTo(W*0.708, floor-H*0.006); }, 3);
  pen.ink(()=>{ g.moveTo(W*0.760, floor-H*0.030); g.lineTo(W*0.762, floor-H*0.006); }, 3);
}

function drawFloorRules(pen, W, H){
  const g = pen.ctx;
  g.save(); g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.30;
  const runs = [
    [H*0.600, [[0.20,0.44],[0.50,0.68]]],
    [H*0.740, [[0.04,0.32],[0.38,0.62],[0.70,0.94]]],
    [H*0.940, [[0.03,0.30],[0.36,0.66],[0.72,0.97]]],
  ];
  for(const [y, segs] of runs)
    for(const [a,b] of segs){ g.beginPath(); g.moveTo(W*a, y); g.lineTo(W*b, y); g.stroke(); }
  g.restore();
}

/* the gift INDEX: five outlined plates on a rising staircase = the sequence */
function drawIndex(pen, W, H){
  const g = pen.ctx;
  const P = W*0.122;                                   // plate side
  const x0 = W*0.075, gap = (W*0.850 - P*5) / 4;
  for(let i=0;i<5;i++){
    const px = x0 + i*(P+gap), base = H*0.290 - i*H*0.020;
    pen.paint(()=>{ g.rect(px, base-P, P, P); }, toneSolid(inkLevel(0)), 4);
    // the riser under each plate — a short stub, never a continuous ledge
    pen.paint(()=>{ g.rect(px+P*0.32, base, P*0.36, H*0.013); }, toneSolid(inkLevel(3)), 3);
    // fit the glyph to the plate from its published box
    const kind = GIFTS[i], box = GIFT_BOX[kind];
    const gs = (P*0.86) / Math.max(box.w, box.h);
    drawGift(pen, kind, px + P/2, base - P/2 - box.cy*gs, gs, 3);
  }
}

/* the dashed reaction-front marker + its direction wedge */
function drawFront(pen, W, H, waveX){
  const g = pen.ctx;
  // a TRACK under the index, not a line through the crowd: three dashed runs
  // and a solid wedge marking where the crest of raised gifts currently is
  const y = H*0.328;
  g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.45;
  for(const [a,b] of [[0.075,0.325],[0.375,0.625],[0.675,0.925]])
    for(let x=W*a; x<W*b; x+=W*0.026){
      g.beginPath(); g.moveTo(x, y); g.lineTo(x+W*0.014, y); g.stroke();
    }
  g.restore();
  pen.ink(()=>{ g.moveTo(waveX, y-H*0.030); g.lineTo(waveX, y+H*0.030); }, 4);
  g.save(); g.fillStyle = INK;
  g.beginPath(); g.moveTo(waveX-W*0.020, y+H*0.014); g.lineTo(waveX+W*0.020, y+H*0.014);
  g.lineTo(waveX, y+H*0.048); g.closePath(); g.fill();
  g.restore();
}

/* ============================================================
   STAGE
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const P = { ...params, ...st };
  const formation = P.formation || "queue";
  const density   = clamp01(P.density ?? 1);
  const attention = clamp01(P.attention ?? 0.8);
  const wave      = clamp01(P.wave ?? 0.5);
  const spread    = Math.max(0.06, P.waveSpread ?? 0.34);
  const raise     = clamp01(P.raise ?? 1);
  const depth     = clamp01(P.depth ?? 1);
  const focus     = P.focus || params.focus;

  if (P.showDoor  !== false) drawDoor(pen, W, H);
  if (P.showDais  !== false) drawDais(pen, W, H);
  drawFloorRules(pen, W, H);
  if (P.showIndex !== false) drawIndex(pen, W, H);

  const roster = MEMBERS.filter(m => density >= m.dp).sort((a,b)=> a.band - b.band);
  const qMax = Math.max(1, ...MEMBERS.map(m=>m.q));

  for(const m of roster){
    // --- FORMATION: where the member stands ---
    let nx = m.x;
    if (formation === "fan")   nx = 0.44 + (m.x-0.44)*1.28;
    if (formation === "press") nx = lerp(m.x, 0.62, 0.42);
    if (formation === "file")  nx = lerp(m.x, 0.30 + m.band*0.12, 0.50);
    const cx = clamp(nx, 0.07, 0.93) * W;

    // --- DEPTH: band scale + tone, graded by `depth` ---
    const s      = lerp(BAND_S[1], BAND_S[m.band], depth);
    const baseY  = BAND_Y[m.band] * H;
    const cloth  = Math.round(lerp(3, BAND_CLOTH[m.band], depth));
    const skinLv = Math.round(lerp(1, BAND_SKIN[m.band], depth));

    // --- REACTION WAVE: the travelling crest of raised gifts ---
    const qn   = m.q / qMax;
    const prog = clamp01(0.5 + (wave - qn)/(2*spread));
    const lift = raise * Math.sin(Math.PI*prog);
    const headTurn = attention * (0.30 + 0.70*smooth(lift));

    drawBearer(pen, {
      cx, baseY, s, face:1, gift:m.gift, role:m.role,
      lift, headTurn, tone:{ cloth, skin:skinLv },
    });
  }

  if (P.showFront !== false){
    // the front sits where the crest currently is, mapped into stage x
    // the marker rides the SAME span as the index plates, so the wedge points
    // at the gift the crest is currently on
    drawFront(pen, W, H, (0.075 + clamp01(wave)*0.850) * W);
  }
  // the receiving mark: a hard open bracket on the dais, never a figure
  const fx = focus.x*W, fy = focus.y*H;
  pen.ink(()=>{ const g=pen.ctx;
    g.moveTo(fx-W*0.030, fy-H*0.024); g.lineTo(fx-W*0.048, fy-H*0.024);
    g.lineTo(fx-W*0.048, fy+H*0.024); g.lineTo(fx-W*0.030, fy+H*0.024); }, 4);
  pen.ink(()=>{ const g=pen.ctx;
    g.moveTo(fx+W*0.030, fy-H*0.024); g.lineTo(fx+W*0.048, fy-H*0.024);
    g.lineTo(fx+W*0.048, fy+H*0.024); g.lineTo(fx+W*0.030, fy+H*0.024); }, 4);
}

export const asset = {
  id:"ensemble.suitor-gift-procession",
  type:"ENSEMBLE",
  name:"Suitor gift procession",
  statusWord:"OUTBIDDING",
  scene:"OD-B18-S04",

  params,
  /* ONE separable member template + a swappable gift catalogue */
  member:{ template:"bearer", roles:["servant","suitor"], gifts:GIFTS, roster:MEMBERS },
  layers:["door","dais","floor-rules","gift-index","band-back","band-mid","band-front","front-marker","focus-brackets"],

  anchors:{
    "focus:receiver":{ x:.845, y:.545 },
    "station:dais":{ x:.845, y:.600 },
    "station:footstool":{ x:.740, y:.585 },
    "queue:head":{ x:.780, y:.925 },
    "queue:tail":{ x:.160, y:.925 },
    "entrance:hall-door":{ x:.100, y:.580 },
    "exit:right":{ x:.960, y:.940 },
    "index:catalogue":{ x:.500, y:.230 },
    "camera:wide":{ x:.500, y:.600 },
    "camera:close-gift":{ x:.780, y:.760 },
  },
  zones:{
    walkable:{ x0:.05, y0:.55, x1:.95, y1:.98 },
    presenting:{ x0:.58, y0:.58, x1:.95, y1:.96 },
    queueing:{ x0:.05, y0:.55, x1:.58, y1:.96 },
  },

  states:{
    initial:"presenting",
    nodes:{
      waiting:{    preview:{ formation:"queue", wave:0.02, waveSpread:0.30, raise:0.35, attention:0.45, density:1.0, depth:1.0 } },
      presenting:{ preview:{ formation:"queue", wave:0.58, waveSpread:0.50, raise:1.0,  attention:0.80, density:1.0, depth:1.0 } },
      outbidding:{ preview:{ formation:"press", wave:0.66, waveSpread:0.78, raise:1.0,  attention:1.00, density:1.0, depth:1.0 } },
      delivered:{  preview:{ formation:"fan",   wave:1.00, waveSpread:0.26, raise:0.9,  attention:0.60, density:0.6, depth:1.0 } },
      dispersing:{ preview:{ formation:"file",  wave:1.00, waveSpread:0.20, raise:0.2,  attention:0.20, density:0.3, depth:0.7 } },
    },
    edges:[["waiting","presenting"],["presenting","outbidding"],["outbidding","delivered"],
           ["delivered","presenting"],["delivered","dispersing"]],
  },
  channels:["formation","density","attention","wave","waveSpread","raise","depth"],

  preview:()=>({
    formation:"queue", density:1.0, attention:0.82,
    wave:0.58, waveSpread:0.50, raise:1.0, depth:1.0,
    status:"OUTBIDDING", progress:.52,
  }),

  draw(ctx,W,H,state){ drawEnsemble(ctx,W,H,state||{}); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
