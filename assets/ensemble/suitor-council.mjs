/* ensemble.suitor-council — the suitors gathered in COUNCIL in the great hall
   (Book XVI): the ambush ship has come home empty, a herald has announced the
   prince alive in the harbour, and the young nobles who have been eating
   Odysseus's house for four years now have to decide, together, what they are.
   ENSEMBLE asset. Companion to `ensemble.the-suitors` — same body family
   (short tunic trapezoid, cross-body sash, dark hair cap, braying mouth) but
   built as an ASSEMBLY rather than a bench-carouse: one separable member
   template instanced N times deterministically across depth bands, so the same
   crowd can hold a feast, a council, a conspiratorial huddle and a panic.

   Exposes the ENSEMBLE controls: FORMATION (council | split | feast | huddle |
   panic), DENSITY, ATTENTION (how hard the heads turn to the speaking floor),
   a reaction-WAVE (the news travelling through the ranks — heads snap round,
   seated men rise, heat spikes), and FOREGROUND/BACKGROUND depth (rows,
   perRow, band scale/tone grading).

   The Book XVI split is the point of the asset: the crowd separates into two
   masses across a cleared corridor — the VIOLENCE bloc (hands to hilts, fists
   up, leaning in: Antinous's murder plan) and the RESTRAINT bloc (open palms,
   heads drawn back: Amphinomus asking for an omen first). Faction is a
   per-member channel, not a redraw, so the same members can be re-polled.

   No named character is baked in. Antinous, Amphinomus, Penelope and
   Eurymachus are placed by the scene at the `head:*` and `focus:*` anchors.
   Solid grays + hard contour only; the engine dotify POST pass supplies the
   halftone. Atlas OD-B16-S05 — conspirators splitting between immediate
   violence, omen delay, and public concealment. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);

/* the separable gesture set of the member template. Each is one arm+prop
   configuration; the crowd's argument is legible from gestures alone. */
export const GESTURES = ["listen","shout","point","hilt","restrain","cup","cover"];

const params = {
  formation:"split",    // council | split | feast | huddle | panic
  rows:3,               // depth bands, back -> front
  perRow:[7,6,5],       // members per band (density control)
  density:1.0,          // 0 = front band only .. 1 = the whole hall
  attention:0.85,       // 0 = heads wandering .. 1 = every head on the floor
  heat:0.55,            // 0 = cool council .. 1 = shouting, fists, leaning in
  wave:0.5,             // position 0..1 of the news travelling across the ranks
  waveSpread:0.20,      // how wide that band of freshly-turned heads is
  factionBalance:0.5,   // share of the crowd on the VIOLENCE side
  gap:0.20,             // width of the cleared corridor in the split formation
  seatY:0.82,           // front-band footline as a fraction of H
  focusX:0.5,           // where the council's attention converges
  showFocus:true,       // draw the hearth + speaker's staff (the focus pole)
  showHall:true,        // draw the megaron shell behind the crowd
  seed:1613,
};

/* ---------------- ONE member: a young noble of the council ----------------
   m = { cx, baseY, s, shade, headTurn, face, lean, heat, faction, gesture,
         seated, feat }.  All geometry is keyed off s (member height), so the
   same template serves the 76px back band and the 150px front band. */
function arm(pen, sh, hand, F, sleeve, skin, s, bend){
  const g = pen.ctx;
  const dx = hand.x - sh.x, dy = hand.y - sh.y;
  const L = Math.hypot(dx, dy) || 1;
  const el = { x:(sh.x+hand.x)/2 + (-dy/L)*L*bend*F,
               y:(sh.y+hand.y)/2 + ( dx/L)*L*bend*F };
  pen.limb(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(el.x, el.y); }, sleeve, s*0.055);
  pen.limb(()=>{ g.moveTo(el.x, el.y); g.lineTo(hand.x, hand.y); }, skin, s*0.045);
  return el;
}

function drawNoble(pen, m){
  const g = pen.ctx;
  const s = m.s, cx = m.cx, baseY = m.baseY, feat = m.feat;
  const cw = Math.max(2, s*0.020);
  const tunic  = toneSolid(inkLevel(m.shade.tunic));
  const skin   = toneSolid(inkLevel(m.shade.skin));
  const dark   = toneSolid(inkLevel(m.shade.hair));
  const cloakT = toneSolid(inkLevel(m.shade.cloak));
  const metal  = toneSolid(inkLevel(6));
  const F      = m.face;                       // +1 faces right, -1 faces left
  const heat   = clamp01(m.heat);

  const seated  = !!m.seated;
  const seatTop = baseY - s*0.24;
  const hipY    = seated ? seatTop - s*0.07 : baseY - s*0.28;
  const shoY    = hipY - (seated ? s*0.36 : s*0.40);
  const tilt    = m.lean * s*0.10 * F;         // lean into the argument
  const sx      = cx + tilt;                   // shoulder centre (leaned)
  const shw     = s*0.185, hemw = s*0.225;
  const headR   = s*0.128*feat.headS;
  const headCy  = shoY - headR*1.04 + m.lean*s*0.01;
  const hx      = sx + m.headTurn*headR*0.24 + tilt*0.45;

  // ground shadow — keeps the member planted on the floor
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.beginPath(); g.ellipse(cx, baseY+s*0.012, hemw*1.00, s*0.026, 0,0,7); g.fill();

  // ---- legs ----
  if (seated){
    const kx = cx + F*s*0.20;
    pen.limb(()=>{ g.moveTo(kx, seatTop-s*0.02); g.lineTo(kx-F*s*0.03, baseY-s*0.02); }, skin, s*0.050);
    pen.limb(()=>{ g.moveTo(kx-F*s*0.06, seatTop-s*0.02); g.lineTo(kx-F*s*0.10, baseY-s*0.02); }, skin, s*0.048);
    pen.paint(()=>{ g.ellipse(kx-F*s*0.05, baseY, s*0.060, s*0.024, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
    // bench block under the seat
    pen.paint(()=>{ g.rect(cx-s*0.22, seatTop, s*0.44, s*0.09); }, toneSolid(inkLevel(5)), cw);
    // folded thighs
    pen.paint(()=>{ g.rect(cx-s*0.10, seatTop-s*0.11, s*0.32*(F>0?1:-1)+ (F>0?0:0), s*0.12); }, tunic, cw);
  } else {
    const fL = cx - s*0.082, fR = cx + s*0.082;
    pen.limb(()=>{ g.moveTo(cx-s*0.072, hipY); g.lineTo(fL, baseY-s*0.020); }, skin, s*0.066);
    pen.limb(()=>{ g.moveTo(cx+s*0.072, hipY); g.lineTo(fR, baseY-s*0.020); }, skin, s*0.066);
    pen.paint(()=>{ g.ellipse(fL, baseY, s*0.056, s*0.023, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
    pen.paint(()=>{ g.ellipse(fR, baseY, s*0.056, s*0.023, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
  }

  // ---- the sword: the standing mark of the VIOLENCE faction, slung at the
  // far hip so it reads even when the arm is down ----
  if (m.faction > 0){
    pen.limb(()=>{ g.moveTo(cx - F*hemw*0.55, hipY - s*0.03);
                   g.lineTo(cx - F*hemw*1.30, hipY + s*0.19); }, metal, s*0.030);
    pen.ink(()=>{ g.moveTo(cx - F*hemw*0.38, hipY - s*0.09);
                  g.lineTo(cx - F*hemw*0.78, hipY + s*0.01); }, cw*0.8);   // cross-guard
  }

  // ---- FAR arm, behind the torso ----
  {
    const sh   = { x: sx - F*shw*0.80, y: shoY + s*0.045 };
    const hand = m.gesture==="cover"
      ? { x: cx - F*hemw*0.35, y: hipY - s*0.03 }
      : { x: sx - F*(shw*0.80), y: hipY + s*0.03 - heat*s*0.05 };
    arm(pen, sh, hand, -F, tunic, skin, s, 0.10);
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.030, 0, 7); }, skin, cw*0.7);
  }

  // ---- torso: the short tunic trapezoid of the house's uninvited guests ----
  pen.paint(()=>{
    g.moveTo(sx-shw, shoY);
    g.lineTo(sx+shw, shoY);
    g.lineTo(cx+hemw, hipY);
    g.lineTo(cx-hemw, hipY);
    g.closePath();
  }, tunic, cw);
  pen.seam(()=>{ g.moveTo(cx-hemw*0.92, hipY-cw); g.lineTo(cx+hemw*0.92, hipY-cw); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(sx-shw*0.82, shoY+s*0.035); g.lineTo(cx+hemw*0.62, hipY-s*0.02); }, cw*0.6);

  // cloak thrown over one shoulder (some of them)
  if (feat.cloak){
    pen.paint(()=>{
      g.moveTo(sx - F*shw*0.15, shoY - headR*0.12);
      g.lineTo(sx + F*shw*1.02, shoY + s*0.05);
      g.lineTo(cx + F*hemw*0.90, hipY + s*0.02);
      g.lineTo(cx + F*hemw*0.12, hipY - s*0.01);
      g.closePath();
    }, cloakT, cw*0.9);
  }

  // ---- neck + head ----
  pen.paint(()=>{ g.rect(sx-headR*0.30, shoY-headR*0.60, headR*0.60, headR*0.90); }, skin, cw*0.8);
  if (feat.head !== "bald")
    pen.paint(()=>{ g.ellipse(hx, headCy+headR*0.16, headR*1.10, headR*1.22, 0,0,7); }, dark, cw*0.9);
  pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.90, headR, 0,0,7); }, skin, cw);

  // face — eyes/brow/nose all carry headTurn (ATTENTION) and heat (ANGER)
  const eyeY = headCy - headR*0.04;
  const gx   = m.headTurn*headR*0.30;
  const eyeR = headR*0.11;
  g.fillStyle = INK;
  if (m.headTurn > -0.55){ g.beginPath(); g.ellipse(hx+headR*0.32+gx, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  if (m.headTurn <  0.55){ g.beginPath(); g.ellipse(hx-headR*0.32+gx, eyeY, eyeR, eyeR*1.1, 0,0,7); g.fill(); }
  // brows drive down and inward as the council heats
  g.strokeStyle = INK; g.lineCap = "round";
  g.lineWidth = Math.max(2, headR*0.12);
  g.beginPath();
  g.moveTo(hx-headR*0.48+gx, eyeY-headR*0.44 + heat*headR*0.18);
  g.lineTo(hx-headR*0.10+gx, eyeY-headR*0.52);
  g.moveTo(hx+headR*0.10+gx, eyeY-headR*0.52);
  g.lineTo(hx+headR*0.48+gx, eyeY-headR*0.44 + heat*headR*0.18);
  g.stroke();
  // nose points the way the head faces
  g.lineWidth = Math.max(2, headR*0.12);
  g.beginPath();
  g.moveTo(hx+gx*0.6, eyeY+headR*0.06);
  g.lineTo(hx + m.headTurn*headR*0.42, eyeY+headR*0.40);
  g.stroke();
  // mouth: a set line when cool, a shouting hole when hot
  if (heat > 0.55 || m.gesture==="shout"){
    pen.paint(()=>{ g.ellipse(hx+gx*0.7, headCy+headR*0.56, headR*0.20, headR*0.26, 0,0,7); },
              toneSolid(inkLevel(7)), cw*0.6);
  } else {
    g.lineWidth = Math.max(2, headR*0.11);
    g.beginPath();
    g.moveTo(hx-headR*0.22+gx, headCy+headR*0.54);
    g.quadraticCurveTo(hx+gx, headCy+headR*0.54 + heat*headR*0.16, hx+headR*0.22+gx, headCy+headR*0.54);
    g.stroke();
  }
  // hair front sweep / beard — the young ones are mostly unbearded
  if (feat.head === "hair")
    pen.paint(()=>{
      g.moveTo(hx-headR*0.92, headCy-headR*0.02);
      g.quadraticCurveTo(hx, headCy-headR*1.34, hx+headR*0.92, headCy-headR*0.02);
      g.quadraticCurveTo(hx+headR*0.50, headCy-headR*0.52, hx, headCy-headR*0.46);
      g.quadraticCurveTo(hx-headR*0.50, headCy-headR*0.52, hx-headR*0.92, headCy-headR*0.02);
    }, dark, cw*0.8);
  else if (feat.head === "fillet")   // a banded head — the older/richer of them
    pen.paint(()=>{ g.rect(hx-headR*0.95, headCy-headR*0.52, headR*1.90, headR*0.30); }, cloakT, cw*0.7);
  if (feat.beard)
    pen.paint(()=>{
      g.moveTo(hx-headR*0.54, headCy+headR*0.36);
      g.quadraticCurveTo(hx, headCy+headR*1.34, hx+headR*0.54, headCy+headR*0.36);
      g.quadraticCurveTo(hx, headCy+headR*0.74, hx-headR*0.54, headCy+headR*0.36);
    }, dark, cw*0.7);

  // ---- NEAR arm + its prop: the gesture is the vote ----
  const sh = { x: sx + F*shw*0.82, y: shoY + s*0.045 };
  let hand, bend = 0.22, fist = true;
  switch (m.gesture){
    case "shout":                        // fist up over the shoulder
      hand = { x: sx + F*shw*0.70, y: shoY - s*0.30 }; bend = 0.24; break;
    case "point":                        // the accusing arm, thrown across the floor
      hand = { x: sx + F*(shw + s*0.16), y: shoY + s*0.22 }; bend = 0.22; break;
    case "hilt":                         // hand down on the sword hilt: murder
      hand = { x: cx - F*hemw*0.42, y: hipY - s*0.05 }; bend = 0.28; break;
    case "restrain":                     // flat open palm forward: wait for the omen
      hand = { x: sx + F*(shw + s*0.12), y: shoY + s*0.24 }; bend = 0.26; fist = false; break;
    case "cup":                          // a goblet still in the hand
      hand = { x: sx + F*(shw + s*0.09), y: shoY - s*0.12 }; bend = 0.22; break;
    case "cover":                        // hunched, hands low: say nothing in public
      hand = { x: cx + F*hemw*0.30, y: hipY - s*0.04 }; bend = 0.26; break;
    default:                             // listen — arm at the side
      hand = { x: sx + F*shw*0.92, y: hipY + s*0.02 }; bend = 0.16;
  }
  arm(pen, sh, hand, F, tunic, skin, s, bend);
  if (m.gesture === "restrain"){         // the flat palm, held out
    pen.paint(()=>{ g.ellipse(hand.x, hand.y, s*0.050, s*0.030, F>0?0.5:-0.5, 0, 7); }, skin, cw*0.7);
  } else if (m.gesture === "point"){
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.030, 0, 7); }, skin, cw*0.7);
    pen.ink(()=>{ g.moveTo(hand.x, hand.y); g.lineTo(hand.x + F*s*0.075, hand.y - s*0.010); }, cw*0.9);
  } else if (m.gesture === "cup"){
    const wx = hand.x, wy = hand.y;
    pen.paint(()=>{ g.moveTo(wx-s*0.045, wy-s*0.055); g.lineTo(wx+s*0.045, wy-s*0.055);
                    g.lineTo(wx+s*0.028, wy+s*0.012); g.lineTo(wx-s*0.028, wy+s*0.012);
                    g.closePath(); }, toneSolid(inkLevel(6)), cw*0.7);
    pen.paint(()=>{ g.rect(wx-s*0.012, wy+s*0.012, s*0.024, s*0.034); }, toneSolid(inkLevel(6)), cw*0.6);
  } else if (fist){
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.036, 0, 7); }, skin, cw*0.7);
  }
}

/* ---------------- the focus pole: the hall's hearth + the speaking staff.
   Whoever holds the staff has the floor; the council converges on it. This is
   an OBJECT, not a person — the named speakers are placed by the scene. ---- */
function drawFocus(pen, cx, baseY, s, lit){
  const g = pen.ctx;
  pen.paint(()=>{ g.ellipse(cx, baseY, s*0.86, s*0.26, 0,0,7); }, toneSolid(inkLevel(lit?4:3)), 5);
  pen.paint(()=>{ g.ellipse(cx, baseY-s*0.03, s*0.60, s*0.16, 0,0,7); }, toneSolid(inkLevel(lit?6:5)), 4);
  // three flame ticks off the coals
  pen.ink(()=>{
    for (let i=-1;i<=1;i++){
      const fx = cx + i*s*0.26;
      g.moveTo(fx, baseY-s*0.05);
      g.lineTo(fx + i*s*0.05, baseY-s*0.05-s*(lit?0.34:0.20));
    }
  }, 4);
  // the speaker's staff, planted at the hearth rim
  const stx = cx + s*0.98;
  pen.ink(()=>{ g.moveTo(stx, baseY+s*0.04); g.lineTo(stx-s*0.10, baseY-s*1.30); }, 5);
  pen.paint(()=>{ g.arc(stx-s*0.11, baseY-s*1.36, s*0.11, 0, 7); }, toneSolid(inkLevel(lit?7:6)), 4);
}

/* ---------------- the megaron shell the council stands in ---------------- */
function drawHall(pen, W, H, horizon){
  const g = pen.ctx;
  // dado band + hard horizon: the one horizontal that anchors the depth bands
  pen.paint(()=>{ g.rect(0, horizon-H*0.085, W, H*0.085); }, toneSolid(inkLevel(2)), 0);
  pen.ink(()=>{ g.moveTo(0, horizon); g.lineTo(W, horizon); }, 4);
  // hung shields / trophies — the same wall furniture as ensemble.the-suitors
  for (let i=0;i<5;i++){
    const hx = W*(0.28 + i*0.11), hy = horizon - H*0.155;
    pen.paint(()=>{ g.ellipse(hx, hy, W*0.030, H*0.028, 0,0,7); }, toneSolid(inkLevel(4)), 4);
    pen.ink(()=>{ g.moveTo(hx-W*0.030, hy); g.lineTo(hx+W*0.030, hy); }, 2);
  }
  // two hall columns, standing ON the back wall — they stop at the horizon so
  // they never cross the ranks, and start below the card label
  for (const px of [0.155, 0.845]){
    const bx = W*px, bw = W*0.038;
    pen.paint(()=>{ g.rect(bx-bw/2, H*0.125, bw, horizon-H*0.125); }, toneSolid(inkLevel(3)), 4);
    pen.paint(()=>{ g.rect(bx-bw*0.82, H*0.125, bw*1.64, H*0.026); }, toneSolid(inkLevel(4)), 4); // capital
    pen.seam(()=>{ g.moveTo(bx-bw*0.18, H*0.165); g.lineTo(bx-bw*0.18, horizon-H*0.01); }, 2);
  }
  // the court doorway at the far left — where a panicking crowd bolts
  const dx = W*0.022, dw = W*0.055, dtop = horizon - H*0.165;
  pen.paint(()=>{ g.rect(dx, dtop, dw, H*0.165); }, toneSolid(inkLevel(5)), 4);          // opening
  pen.paint(()=>{ g.rect(dx-W*0.014, dtop-H*0.012, W*0.014, H*0.177); }, toneSolid(inkLevel(3)), 3); // jamb
  pen.paint(()=>{ g.rect(dx+dw, dtop-H*0.012, W*0.014, H*0.177); }, toneSolid(inkLevel(3)), 3);      // jamb
  pen.paint(()=>{ g.rect(dx-W*0.018, dtop-H*0.020, dw+W*0.036, H*0.014); }, toneSolid(inkLevel(4)), 3); // lintel
}

/* ---------------- deterministic member build from params + state ---------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const formation = p.formation || "council";
  const attention = clamp01(p.attention);
  const heat      = clamp01(p.heat);
  const wave      = clamp01(p.wave);
  const sigma     = Math.max(0.05, p.waveSpread);
  const density   = clamp01(p.density);
  const rows      = Math.max(1, p.rows|0);
  const perRow    = p.perRow || params.perRow;
  const balance   = clamp01(p.factionBalance);
  const gap       = clamp(p.gap ?? params.gap, 0.04, 0.40);
  const focusX    = (p.focusX ?? 0.5) * W;
  const seatY     = p.seatY ?? params.seatY;
  const seed      = (p.seed ?? params.seed) >>> 0;

  const members = [];
  for (let r=0; r<rows; r++){
    const depth = rows>1 ? r/(rows-1) : 1;            // 0 = back .. 1 = front
    if (density < 1 && depth < (1-density)*0.9) continue;   // thin the deep bands first
    let n = perRow[Math.min(r, perRow.length-1)] || Math.max(2, 7-2*r);
    n = Math.max(2, Math.round(n * (0.55 + 0.45*density)));

    const scale   = lerp(84, 158, depth);
    const rowY    = H*(0.46 + depth*(seatY-0.46));
    const marginX = lerp(0.13, 0.095, depth);

    for (let i=0;i<n;i++){
      const rng = rnd((seed + r*211 + i*29 + 13) >>> 0);
      const t   = n>1 ? i/(n-1) : 0.5;
      let px    = lerp(marginX, 1-marginX, t);
      let by    = rowY;
      let side  = px < 0.5 ? -1 : 1;                  // -1 restraint .. +1 violence
      let seated = false;
      let aimX   = focusX;
      let heatM  = heat;

      if (formation === "council"){
        // a shallow bowl around the speaking floor: the wings curl forward
        by = rowY + Math.sin(t*Math.PI)*scale*0.11;
        side = rng() < balance ? 1 : -1;
      }
      else if (formation === "split"){
        // two masses across a cleared corridor; each faces the other over it
        const half = gap/2;
        side = t < 0.5 ? -1 : 1;
        const u = side < 0 ? t/0.5 : (t-0.5)/0.5;     // 0..1 inside the bloc
        px = side < 0 ? lerp(marginX, 0.5-half, u)
                      : lerp(0.5+half, 1-marginX, u);
        by = rowY + Math.sin(u*Math.PI)*scale*0.09;
        aimX = W*0.5;                                 // argue across the gap
        heatM = clamp01(heat * (side>0 ? 1.0 : 0.62));// the murder side is hotter
      }
      else if (formation === "feast"){
        // ranged along the benches, half of them sitting, attention scattered
        by = rowY;
        seated = depth > 0.25 && (i % 2 === 0);
        side = rng() < balance ? 1 : -1;
        heatM = clamp01(heat*0.35);
      }
      else if (formation === "huddle"){
        // a tight conspiratorial knot: the public face of the plan is nothing
        px = lerp(0.30, 0.70, t) + (depth-0.5)*0.06*(t<0.5?-1:1);
        by = rowY - (1-depth)*H*0.02;
        aimX = W*0.5;
        side = rng() < balance ? 1 : -1;
        heatM = clamp01(heat*0.45);
      }
      else if (formation === "panic"){
        // the mass breaks: knots and gaps, bodies drifting toward the doors
        const jog = (rng()-0.5);
        px = clamp01(px + jog*0.10 + (px-0.5)*0.22);
        by = rowY + (rng()-0.5)*scale*0.22;
        aimX = W*(rng()<0.5 ? 0.06 : 0.94);           // eyes on the exits
        side = rng() < balance ? 1 : -1;
        heatM = clamp01(0.55 + heat*0.45);
      }

      px = clamp(px, 0.06, 0.94);   // keep every body inside the frame
      const cx = W*px;

      // reaction-WAVE: the band of the crowd the news has just reached —
      // heads snap round, seated men come up off the bench, heat spikes.
      const d    = px - wave;
      const band = Math.exp(-(d*d)/(2*sigma*sigma));
      const hit  = clamp01(band);
      if (hit > 0.45) seated = false;
      heatM = clamp01(heatM + hit*0.45);

      // ATTENTION: how hard this head is turned onto what it is aimed at
      const att = clamp01(attention + hit*0.35);
      let headTurn = clamp((aimX - cx)/(W*0.24) * att, -1, 1);
      if (att < 0.25) headTurn = (rng()-0.5)*1.4;     // heads wandering
      const face = Math.abs(headTurn) < 0.06 ? (rng()<0.5?-1:1) : (headTurn>0 ? 1 : -1);

      // GESTURE: the member's vote, biased by faction, heat and formation
      let gesture;
      if (formation === "huddle")      gesture = rng() < 0.55 ? "cover" : "listen";
      else if (formation === "feast")  gesture = rng() < 0.55 ? "cup" : "listen";
      else if (formation === "panic")  gesture = rng() < 0.45 ? "shout" : (rng() < 0.5 ? "point" : "cover");
      else if (side > 0)               gesture = heatM > 0.62 ? (rng() < 0.45 ? "shout" : (rng()<0.5?"point":"hilt")) : "hilt";
      else                             gesture = heatM > 0.62 ? (rng() < 0.55 ? "restrain" : "point") : (rng()<0.6?"restrain":"listen");
      if (seated && (gesture==="shout"||gesture==="point")) gesture = "cup";

      const feat = {
        beard: rng() < 0.28,
        head:  (()=>{ const u = rng(); return u < 0.14 ? "fillet" : u < 0.94 ? "hair" : "bald"; })(),
        headS: 0.90 + rng()*0.22,
        cloak: rng() < 0.40,
        flip:  rng() < 0.5 ? -1 : 1,
      };
      const shade = {
        // the violence bloc runs one level darker — the two camps read as
        // two tonal masses before a single gesture is legible
        tunic: clamp(Math.round(lerp(3, 4, depth)) + (side>0 ? 1 : -1), 1, 6),
        skin:  Math.round(lerp(2, 2, depth)),
        hair:  Math.round(lerp(5, 6, depth)),
        cloak: Math.round(lerp(4, 5, depth)),
      };

      members.push({
        cx, baseY:by, s:scale, shade, feat, seated,
        headTurn, face, heat:heatM, faction:side,
        lean: clamp01(heatM*0.9 - (gesture==="restrain"?0.55:0) - (gesture==="cover"?0.35:0)),
        gesture, depth, px, band:r,
      });
    }
  }
  members.sort((a,b)=> a.baseY - b.baseY);       // painter's order: back -> front
  return { members, focusX, formation, attention, gap, showFocus:p.showFocus, showHall:p.showHall };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const built = buildMembers(W, H, st);
  const { members, focusX, formation, attention, gap } = built;
  const layers = (st && st.layers) || ["hall","floor","corridor","band-back","band-mid","band-front","focus"];
  const has = l => layers.includes(l);
  const horizon = H*0.32;

  // ---- the floor of the hall: lightest field, so the crowd reads as mass ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);
  if (has("hall") && built.showHall !== false) drawHall(pen, W, H, horizon);
  if (has("floor")){
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.20;
    for (let i=-6;i<=6;i++){ g.beginPath(); g.moveTo(focusX, H*0.99); g.lineTo(W*0.5+i*W*0.15, horizon); g.stroke(); }
    for (let j=1;j<=4;j++){ const y = horizon + (H-horizon)*(j/4)*(j/4); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha = 1;
  }

  // ---- the cleared corridor between the two camps ----
  if (has("corridor") && formation === "split"){
    g.save();
    g.fillStyle = inkLevel(0);
    g.beginPath();
    g.moveTo(W*(0.5-gap*0.42), horizon); g.lineTo(W*(0.5+gap*0.42), horizon);
    g.lineTo(W*(0.5+gap*0.72), H*0.99);  g.lineTo(W*(0.5-gap*0.72), H*0.99);
    g.closePath(); g.fill();
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.40;
    g.beginPath(); g.moveTo(W*(0.5-gap*0.42), horizon); g.lineTo(W*(0.5-gap*0.72), H*0.99); g.stroke();
    g.beginPath(); g.moveTo(W*(0.5+gap*0.42), horizon); g.lineTo(W*(0.5+gap*0.72), H*0.99); g.stroke();
    g.restore();
  }

  // ---- the council itself, back band -> front band ----
  const bandLayer = ["band-back","band-mid","band-front"];
  for (const m of members){
    const ln = bandLayer[Math.min(m.band, 2)];
    if (!has(ln)) continue;
    drawNoble(pen, m);
  }

  // ---- the hearth + the speaker's staff, low and forward ----
  if (has("focus") && built.showFocus !== false)
    drawFocus(pen, focusX, H*0.945, W*0.078, attention >= 0.5);
}

export const asset = {
  id:"ensemble.suitor-council",
  type:"ENSEMBLE",
  name:"Suitor council",
  statusWord:"PLOTTING",
  scene:"OD-B16-S05",

  params,
  // back -> front; a scene may pass a subset for reveal / occlusion
  layers:["hall","floor","corridor","band-back","band-mid","band-front","focus"],
  // normalized 0..1 anchors. head:* are where the scene places the named
  // speakers at the head of each bloc; focus:* is the shared attention pole.
  anchors:{
    "focus:floor":{x:.50,y:.86},     "focus:hearth":{x:.50,y:.945},
    "focus:staff":{x:.57,y:.87},
    "head:violence":{x:.64,y:.84},   "head:restraint":{x:.36,y:.84},
    "gap:mouth":{x:.50,y:.34},       "gap:foot":{x:.50,y:.98},
    "row:back":{x:.50,y:.46},        "row:mid":{x:.50,y:.64},   "row:front":{x:.50,y:.82},
    "door:court":{x:.06,y:.60},      "exit:hall":{x:.95,y:.62},
    "column:left":{x:.085,y:.30},    "column:right":{x:.915,y:.30},
    "camera:wide":{x:.50,y:.55},     "camera:split":{x:.50,y:.72},
  },
  // walkable / occupied regions for scene placement + pathing
  zones:{
    council:{ x0:.05,y0:.40,x1:.95,y1:.86 },
    corridor:{ x0:.40,y0:.34,x1:.60,y1:.98 },
    "bloc:restraint":{ x0:.05,y0:.40,x1:.42,y1:.86 },
    "bloc:violence":{  x0:.58,y0:.40,x1:.95,y1:.86 },
    floor:{ x0:.30,y0:.86,x1:.70,y1:.99 },
  },

  states:{
    initial:"assembled",
    nodes:{
      // gathered and listening: the council before the news lands
      assembled:{ preview:{ formation:"council", attention:0.90, heat:0.12, wave:1.4, density:1.0, status:"ASSEMBLED" } },
      // the herald's word travelling through the ranks — a wave of turned heads
      alarm:{     preview:{ formation:"council", attention:0.70, heat:0.35, wave:0.42, waveSpread:0.16, density:1.0, status:"ALARMED" } },
      // one mass, shouting: the debate before anyone has counted sides
      debate:{    preview:{ formation:"council", attention:0.85, heat:0.92, wave:1.4, density:1.0, status:"IN UPROAR" } },
      // THE SPLIT: Antinous's murder plan against Amphinomus's omen
      split:{     preview:{ formation:"split", attention:0.92, heat:0.72, wave:1.4, gap:0.20, factionBalance:0.5, density:1.0, status:"DIVIDED" } },
      // the murder bloc carries the room — the corridor narrows, the balance tips
      "split-violence":{ preview:{ formation:"split", attention:0.95, heat:0.95, wave:1.4, gap:0.13, factionBalance:0.72, density:1.0, status:"FOR MURDER" } },
      // restraint holds — wait for a favourable sign
      "split-restraint":{ preview:{ formation:"split", attention:0.85, heat:0.45, wave:1.4, gap:0.24, factionBalance:0.30, density:1.0, status:"FOR THE OMEN" } },
      // public concealment: a tight knot, hands down, nothing to see
      conceal:{   preview:{ formation:"huddle", attention:0.75, heat:0.25, wave:1.4, density:0.85, status:"CONCEALING" } },
      // the same crowd at table (Books XVII–XX)
      feast:{     preview:{ formation:"feast", attention:0.25, heat:0.10, wave:1.4, density:1.0, status:"FEASTING" } },
      // the same crowd breaking for the doors (Book XXII)
      panic:{     preview:{ formation:"panic", attention:0.30, heat:1.0, wave:1.4, density:1.0, status:"IN PANIC" } },
      // a thin room — early or wide framings
      sparse:{    preview:{ formation:"council", attention:0.8, heat:0.2, wave:1.4, density:0.5, status:"THIN" } },
    },
    edges:[
      ["assembled","alarm"],["alarm","debate"],["debate","split"],
      ["split","split-violence"],["split","split-restraint"],
      ["split-violence","conceal"],["split-restraint","conceal"],
      ["conceal","feast"],["feast","assembled"],["feast","alarm"],
      ["debate","panic"],["split-violence","panic"],["assembled","sparse"],["sparse","assembled"],
    ],
  },
  channels:["formation","attention","heat","wave","waveSpread","factionBalance","gap","density","depth"],

  // neutral preview = the asset's reason to exist: the council divided, the
  // corridor open between the murder bloc and the men asking for a sign
  preview:()=>({ formation:"split", attention:0.92, heat:0.68, wave:1.4, waveSpread:0.20,
                 gap:0.20, factionBalance:0.5, density:1.0, status:"DIVIDED", progress:0.45 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
