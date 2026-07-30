/* ensemble.suitors-families — the households of the dead suitors, DIVIDING.
   ENSEMBLE asset. Book XXIV, OD-B24-S06: the bodies have been carried home and
   buried, and Ithaca is called to assembly. Eupeithes speaks from the stone and
   asks for blood. The crowd does not agree with itself: more than half spring up
   for arms, and the rest stay on the seats and will not move. Homer counts them
   — the split is the event.

   The asset IS that split. ONE separable member template (drawMourner) instanced
   deterministically across three depth bands. A single scalar per member — its
   local `commit` — carries it continuously through three attitudes:

       commit = 0.0   GRIEVING   veiled, head bowed, hands at the face, still
       commit -> 1.0  (militia)  risen, head up on the stone, spear thrown up
       commit -> 1.0  (caution)  seated on the agora stone, palm out, level

   Which of the two ends a member travels toward is its FACTION, assigned by the
   `split` fraction, not by chance — so `split` alone re-weights the assembly.
   A REACTION-WAVE front sweeps out from the speaking-stone, so at any `wave`
   position the near ranks have already chosen and the far ranks are still in
   raw grief: the division is a gradient across the agora, never a cut.

   ENSEMBLE controls, all exposed as channels:
     formation    assembly | column | scatter
     split        fraction of the crowd that goes to the militia (0..1)
     divide       0 = one undivided body of mourners .. 1 = two blocs, paper between
     wave         reaction front, 0 = nobody has moved .. 1 = the whole agora has
     waveSpread   width of the transition band (how abrupt the division is)
     attention    how hard the heads turn onto the stone
     density      thins the deep bands first
     rows/perRow/seatY/nearScale — foreground / background grading

   No named character is baked in. Eupeithes, Medon, Halitherses and Laertes are
   placed by the scene at `rostrum:stone`, `head:militia`, `head:caution`. The
   dead are drawn as covered BIERS — diagrams, never figures. The two counts are
   drawn as TALLY GEOMETRY, not type. Solid grays + hard contour only; the engine
   dotify POST pass supplies the halftone. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x, 0, 1);
const smooth  = t => { t = clamp01(t); return t*t*(3-2*t); };

/* the separable gesture set — the division is legible from arms alone */
export const GESTURES = ["veil","beat","spear","fist","palm","clasp"];
export const FACTIONS  = ["militia","caution"];

const params = {
  formation:"assembly",  // assembly | column | scatter
  rows:3,                // depth bands, back -> front
  perRow:[8,8,6],        // members per band
  density:1.0,           // 0 = front band only .. 1 = the whole agora
  split:0.58,            // "more than half" — fraction that goes to the militia
  divide:0.70,           // 0 = one crowd .. 1 = two blocs with a channel of paper
  wave:0.62,             // reaction front, sweeping out from the speaking-stone
  waveSpread:0.22,       // width of the transition band
  attention:0.85,        // 0 = heads wandering .. 1 = every head on the stone
  grief:1.0,             // weight of the mourning that has not yet been converted
  nearScale:1.0,         // foreground grading
  seatY:0.895,           // front-band footline as a fraction of H
  rostrumX:0.062,        // the speaking-stone: where the wave starts
  rostrumY:0.880,
  showBiers:true,        // the covered dead at the back of the agora
  showSeats:true,        // the agora's stone seats, in separate blocks
  showReadout:true,      // the two tally counts at the head of the sheet
  showFront:true,        // the dashed reaction-front marker
  seed:2406,
};

/* ---------------- 2-segment arm, shoulder -> elbow -> hand ---------------- */
function arm(pen, sh, hand, F, sleeve, skin, s, bend){
  const g = pen.ctx;
  const dx = hand.x - sh.x, dy = hand.y - sh.y;
  const L = Math.hypot(dx, dy) || 1;
  const el = { x:(sh.x+hand.x)/2 + (-dy/L)*L*bend*F,
               y:(sh.y+hand.y)/2 + ( dx/L)*L*bend*F };
  pen.limb(()=>{ g.moveTo(sh.x, sh.y); g.lineTo(el.x, el.y); }, sleeve, s*0.050);
  pen.limb(()=>{ g.moveTo(el.x, el.y); g.lineTo(hand.x, hand.y); }, skin, s*0.040);
  return el;
}

/* ---------------- ONE member: a mourner at the moment of choosing ----------
   Keyed entirely off s (member height), so the same template serves the 76px
   back band and the 142px front band. grief / rise / stay are the three blend
   weights derived from the member's faction and its local commit. */
function drawMourner(pen, m){
  const g = pen.ctx;
  const s = m.s, cx = m.cx, baseY = m.baseY, feat = m.feat, F = m.face;
  const cw = Math.max(2, s*0.020);
  const grief = m.grief, rise = m.rise, stay = m.stay;

  const robe  = toneSolid(inkLevel(m.shade.robe));
  const skin  = toneSolid(inkLevel(m.shade.skin));
  const dark  = toneSolid(inkLevel(m.shade.hair));
  const veilT = toneSolid(inkLevel(m.shade.veil));
  const band  = toneSolid(inkLevel(m.shade.band));

  const seated  = !!m.seated;
  const seatTop = baseY - s*0.245;
  const hipY    = seated ? seatTop - s*0.050 : baseY - s*0.310;
  const shoY    = hipY - (seated ? s*0.325 : s*0.400);
  const tilt    = m.lean * s*0.085 * F;
  const sx      = cx + tilt;
  const shw     = s*0.170, hemw = s*0.225;
  const headR   = s*0.124*feat.headS;
  const bow     = clamp01(grief*0.95 + stay*0.16);
  const headCy  = shoY - headR*(1.04 - bow*0.30) - rise*headR*0.10;
  const hx      = sx + m.headTurn*headR*0.24 + tilt*0.40 + F*bow*headR*0.26;

  /* ---- the agora stone under a seated man: a separate block, never a bench bar ---- */
  if (seated){
    pen.paint(()=>{ g.rect(cx-s*0.185, seatTop, s*0.37, s*0.245); }, toneSolid(inkLevel(2)), cw*0.9);
    pen.seam(()=>{ g.moveTo(cx-s*0.185, seatTop+s*0.085); g.lineTo(cx+s*0.185, seatTop+s*0.085); }, cw*0.6);
  }

  /* ---- ground shadow: plants the body, adds no mass ---- */
  g.fillStyle = "rgba(0,0,0,0.08)";
  g.beginPath(); g.ellipse(cx, baseY+s*0.012, hemw*0.92, s*0.022, 0,0,7); g.fill();

  /* ---- legs ---- */
  if (seated){
    const kx = cx + F*s*0.20;
    pen.limb(()=>{ g.moveTo(cx+F*s*0.02, seatTop-s*0.005); g.lineTo(kx, seatTop+s*0.030); }, robe, s*0.060);
    pen.limb(()=>{ g.moveTo(kx, seatTop+s*0.030); g.lineTo(kx-F*s*0.045, baseY-s*0.018); }, skin, s*0.048);
    pen.paint(()=>{ g.ellipse(kx-F*s*0.055, baseY, s*0.052, s*0.021, 0,0,7); }, toneSolid(inkLevel(4)), cw*0.7);
  } else {
    const stride = s*0.058 + rise*s*0.034;
    const fL = cx - stride, fR = cx + stride;
    pen.limb(()=>{ g.moveTo(cx-s*0.062, hipY); g.lineTo(fL, baseY-s*0.018); }, skin, s*0.060);
    pen.limb(()=>{ g.moveTo(cx+s*0.062, hipY); g.lineTo(fR, baseY-s*0.018); }, skin, s*0.060);
    pen.paint(()=>{ g.ellipse(fL, baseY, s*0.050, s*0.021, 0,0,7); }, toneSolid(inkLevel(4)), cw*0.7);
    pen.paint(()=>{ g.ellipse(fR, baseY, s*0.050, s*0.021, 0,0,7); }, toneSolid(inkLevel(4)), cw*0.7);
  }

  /* ---- FAR arm, behind the torso ---- */
  {
    const sh = { x: sx - F*shw*0.80, y: shoY + s*0.045 };
    let hand;
    switch (m.gesture){
      case "veil":  hand = { x: hx - F*headR*0.62, y: headCy + headR*0.86 }; break;   // both hands to the face
      case "beat":  hand = { x: sx - F*shw*0.20,   y: shoY + s*0.150 };      break;   // fist on the chest
      case "clasp": hand = { x: cx + F*hemw*0.06,  y: hipY - s*0.060 };      break;   // clasped low
      default:      hand = { x: sx - F*shw*0.88,   y: hipY + s*0.010 };
    }
    arm(pen, sh, hand, -F, robe, skin, s, 0.10);
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.027, 0, 7); }, skin, cw*0.7);
  }

  /* ---- torso: the long mourning robe, LIGHT — the paper does the work ---- */
  pen.paint(()=>{
    g.moveTo(sx-shw, shoY);
    g.lineTo(sx+shw, shoY);
    g.lineTo(cx+hemw, hipY);
    g.lineTo(cx-hemw, hipY);
    g.closePath();
  }, robe, cw);
  pen.seam(()=>{ g.moveTo(sx-shw*0.20, shoY+s*0.030); g.lineTo(cx-hemw*0.24, hipY-s*0.02); }, cw*0.6);
  if (!seated){
    // the skirt of the robe, below the hip — kept light, tapering, no hip rule
    pen.paint(()=>{
      g.moveTo(cx-hemw*0.98, hipY-s*0.012);
      g.lineTo(cx+hemw*0.98, hipY-s*0.012);
      g.lineTo(cx+hemw*0.78, hipY+s*0.110);
      g.lineTo(cx-hemw*0.78, hipY+s*0.110);
      g.closePath();
    }, robe, cw*0.9);
  }
  // the one dark accent on every body: the mourning band on the upper arm
  pen.paint(()=>{ g.rect(sx + F*shw*0.46, shoY+s*0.048, s*0.052*(F>0?1:-1), s*0.036); }, band, cw*0.5);

  /* ---- neck + head ---- */
  pen.paint(()=>{ g.rect(sx-headR*0.28, shoY-headR*0.56, headR*0.56, headR*0.86); }, skin, cw*0.8);
  // the veil / hair mass behind the skull
  pen.paint(()=>{ g.ellipse(hx, headCy+headR*0.14, headR*1.14, headR*1.26, 0,0,7); },
            feat.veiled ? veilT : dark, cw*0.9);

  if (bow > 0.62){
    /* ---- deep grief: the head is down and hooded. No face is shown. ---- */
    pen.paint(()=>{ g.ellipse(hx, headCy+headR*0.18, headR*0.88, headR*0.94, 0,0,7); }, skin, cw);
    pen.paint(()=>{
      g.moveTo(hx-headR*0.98, headCy+headR*0.34);
      g.quadraticCurveTo(hx, headCy-headR*1.24, hx+headR*0.98, headCy+headR*0.34);
      g.quadraticCurveTo(hx, headCy+headR*0.82, hx-headR*0.98, headCy+headR*0.34);
    }, feat.veiled ? veilT : dark, cw*0.8);
    // the veil falls past the jaw on the near side
    pen.ink(()=>{ g.moveTo(hx + F*headR*0.86, headCy+headR*0.20);
                  g.lineTo(hx + F*headR*0.74, headCy+headR*1.30); }, cw*0.8);
  } else {
    pen.paint(()=>{ g.ellipse(hx, headCy, headR*0.90, headR, 0,0,7); }, skin, cw);
    const eyeY = headCy - headR*0.04;
    const gx   = m.headTurn*headR*0.30;
    const eyeR = headR*0.112;
    const exL = hx - headR*0.32 + gx, exR = hx + headR*0.32 + gx;
    g.fillStyle = INK;
    if (m.headTurn > -0.55){ g.beginPath(); g.ellipse(exR, eyeY, eyeR, eyeR*1.10, 0,0,7); g.fill(); }
    if (m.headTurn <  0.55){ g.beginPath(); g.ellipse(exL, eyeY, eyeR, eyeR*1.10, 0,0,7); g.fill(); }
    // brows: driven DOWN and together by the militia's anger, level for caution
    g.strokeStyle = INK; g.lineCap = "round"; g.lineWidth = Math.max(2, headR*0.13);
    {
      const knot = rise*headR*0.20, lift = stay*headR*0.06;
      g.beginPath();
      g.moveTo(hx-headR*0.48+gx, eyeY-headR*0.42 - lift);
      g.lineTo(hx-headR*0.10+gx, eyeY-headR*0.36 + knot);
      g.moveTo(hx+headR*0.10+gx, eyeY-headR*0.36 + knot);
      g.lineTo(hx+headR*0.48+gx, eyeY-headR*0.42 - lift);
      g.stroke();
    }
    g.lineWidth = Math.max(2, headR*0.12);
    g.beginPath();
    g.moveTo(hx+gx*0.6, eyeY+headR*0.08);
    g.lineTo(hx + m.headTurn*headR*0.42, eyeY+headR*0.38);
    g.stroke();
    // mouth: a shout for the risen, a set line for those who stay
    if (m.mouth > 0.30){
      pen.paint(()=>{ g.ellipse(hx+gx*0.7, headCy+headR*0.56, headR*(0.15+0.09*m.mouth),
                                headR*(0.11+0.24*m.mouth), 0,0,7); }, toneSolid(inkLevel(7)), cw*0.6);
    } else {
      g.lineWidth = Math.max(2, headR*0.12);
      g.beginPath();
      g.moveTo(hx-headR*0.24+gx, headCy+headR*0.56);
      g.lineTo(hx+headR*0.24+gx, headCy+headR*0.56);
      g.stroke();
    }
    // cap of hair / edge of the pushed-back veil
    pen.paint(()=>{
      g.moveTo(hx-headR*0.94, headCy-headR*0.02);
      g.quadraticCurveTo(hx, headCy-headR*1.30, hx+headR*0.94, headCy-headR*0.02);
      g.quadraticCurveTo(hx+headR*0.50, headCy-headR*0.54, hx, headCy-headR*0.46);
      g.quadraticCurveTo(hx-headR*0.50, headCy-headR*0.54, hx-headR*0.94, headCy-headR*0.02);
    }, feat.veiled ? veilT : dark, cw*0.8);
    if (feat.beard)
      pen.paint(()=>{
        g.moveTo(hx-headR*0.50, headCy+headR*0.36);
        g.quadraticCurveTo(hx, headCy+headR*1.28, hx+headR*0.50, headCy+headR*0.36);
        g.quadraticCurveTo(hx, headCy+headR*0.72, hx-headR*0.50, headCy+headR*0.36);
      }, dark, cw*0.7);
  }

  /* ---- NEAR arm: the gesture IS the member's side of the division ---- */
  const sh = { x: sx + F*shw*0.82, y: shoY + s*0.045 };
  let hand, bend = 0.22, kind = "fist";
  switch (m.gesture){
    case "veil":                                  // knuckles at the eyes, grieving
      hand = { x: hx + F*headR*0.66, y: headCy + headR*0.74 }; bend = 0.30; break;
    case "beat":                                  // fist brought down on the breast
      hand = { x: sx + F*shw*0.24, y: shoY + s*0.170 }; bend = 0.30; break;
    case "spear":                                 // the shaft comes up out of the crowd
      hand = { x: sx + F*(shw + s*0.11), y: shoY - s*0.150 }; bend = 0.18; kind = "spear"; break;
    case "fist":                                  // bare arm thrown up for arms
      hand = { x: sx + F*(shw + s*0.10), y: shoY - s*0.300 }; bend = 0.16; break;
    case "palm":                                  // flat palm out — hold, wait
      hand = { x: sx + F*(shw + s*0.150), y: shoY + s*0.030 }; bend = 0.24; kind = "palm"; break;
    case "clasp":                                 // hands together at the waist
      hand = { x: cx + F*hemw*0.22, y: hipY - s*0.050 }; bend = 0.26; kind = "palm"; break;
    default:
      hand = { x: sx + F*shw*0.92, y: hipY + s*0.02 }; bend = 0.16;
  }
  arm(pen, sh, hand, F, robe, skin, s, bend);

  if (kind === "spear"){
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.033, 0, 7); }, skin, cw*0.7);
    // shaft: a hard diagonal, tipped and butted — the militia's silhouette,
    // long enough to lift a picket of verticals out of the crowd
    const th  = m.spearTilt;
    const up  = s*(1.02 + m.spearLen*0.22);
    const tx  = hand.x + Math.sin(th)*up, ty = hand.y - Math.cos(th)*up;
    const bx  = hand.x - Math.sin(th)*s*0.26, by = hand.y + Math.cos(th)*s*0.26;
    pen.ink(()=>{ g.moveTo(bx, by); g.lineTo(tx, ty); }, Math.max(4, s*0.040));
    const hn = s*0.175, hw = s*0.054;
    pen.paint(()=>{
      g.moveTo(tx + Math.sin(th)*hn, ty - Math.cos(th)*hn);
      g.lineTo(tx + Math.cos(th)*hw, ty + Math.sin(th)*hw);
      g.lineTo(tx - Math.cos(th)*hw, ty - Math.sin(th)*hw);
      g.closePath();
    }, toneSolid(inkLevel(6)), Math.max(3, cw));
  } else if (kind === "palm"){
    pen.paint(()=>{ g.ellipse(hand.x, hand.y, s*0.040, s*0.030, F>0?0.30:-0.30, 0, 7); }, skin, cw*0.7);
    pen.ink(()=>{ for (let k=-1;k<=1;k++){
      g.moveTo(hand.x + F*s*0.016, hand.y + k*s*0.020);
      g.lineTo(hand.x + F*s*0.056, hand.y + k*s*0.026 - s*0.010);
    } }, cw*0.8);
  } else {
    pen.paint(()=>{ g.arc(hand.x, hand.y, s*0.033, 0, 7); }, skin, cw*0.7);
    if (m.gesture === "fist")
      pen.ink(()=>{ g.moveTo(hand.x - s*0.026, hand.y - s*0.026);
                    g.lineTo(hand.x + s*0.026, hand.y - s*0.026); }, cw*0.8);
  }

  // an elder's staff, planted: the vertical of the half that will not move
  if (m.staff){
    const stx = cx + F*hemw*1.16;
    pen.ink(()=>{ g.moveTo(stx, baseY); g.lineTo(stx - F*s*0.055, shoY - s*0.230); },
            Math.max(3.5, s*0.036));
    pen.paint(()=>{ g.ellipse(stx - F*s*0.058, shoY - s*0.255, s*0.040, s*0.044, 0,0,7); },
              toneSolid(inkLevel(5)), Math.max(2.5, cw*0.8));
  }
  // a shield carried low by a few of the risen — light disc, one dark boss
  if (m.shield){
    const bxx = cx - F*hemw*1.02, byy = hipY + s*0.030;
    pen.paint(()=>{ g.ellipse(bxx, byy, s*0.115, s*0.140, 0,0,7); }, toneSolid(inkLevel(2)), cw);
    pen.paint(()=>{ g.ellipse(bxx, byy, s*0.036, s*0.042, 0,0,7); }, toneSolid(inkLevel(6)), cw*0.7);
  }
  return { hx, headCy, headR };
}

/* ---------------- the dead: covered biers, drawn as diagrams ----------------
   Never a figure under the cloth — a trestle, a sheet with two folds, and a
   dark stone set at the head. Short spans with real gaps between them. */
function drawBier(pen, x, y, u){
  const g = pen.ctx;
  // the sheet: a low covered HUMP, higher than it is flat, so the silhouette
  // can never be read as a beam across the frame
  pen.paint(()=>{
    g.moveTo(x-u*0.82, y);
    g.lineTo(x-u*0.70, y-u*0.52);
    g.quadraticCurveTo(x-u*0.20, y-u*1.02, x+u*0.24, y-u*0.74);
    g.lineTo(x+u*0.74, y-u*0.44);
    g.lineTo(x+u*0.82, y);
    g.closePath();
  }, toneSolid(inkLevel(1)), 4);
  // two fold seams down the cloth
  pen.seam(()=>{ g.moveTo(x-u*0.34, y-u*0.86); g.lineTo(x-u*0.42, y-u*0.06); }, 2.4);
  pen.seam(()=>{ g.moveTo(x+u*0.26, y-u*0.74); g.lineTo(x+u*0.20, y-u*0.06); }, 2.4);
  // trestle: two legs, splayed, with the floor showing between them
  pen.ink(()=>{ g.moveTo(x-u*0.62, y); g.lineTo(x-u*0.74, y+u*0.34); }, 3.2);
  pen.ink(()=>{ g.moveTo(x+u*0.62, y); g.lineTo(x+u*0.74, y+u*0.34); }, 3.2);
  // the head-stone set at the near end: the one dark note
  pen.paint(()=>{ g.rect(x-u*1.16, y-u*0.72, u*0.22, u*0.72); }, toneSolid(inkLevel(6)), 3);
}

/* ---------------- the speaking-stone the wave starts from ----------------
   A stepped block, empty. Eupeithes is CAST onto `rostrum:stone`, not drawn. */
function drawRostrum(pen, x, y, u){
  const g = pen.ctx;
  pen.paint(()=>{ g.rect(x-u*0.86, y-u*0.34, u*1.72, u*0.34); }, toneSolid(inkLevel(2)), 4);
  pen.paint(()=>{ g.rect(x-u*0.64, y-u*0.66, u*1.28, u*0.32); }, toneSolid(inkLevel(1)), 4);
  pen.seam(()=>{ g.moveTo(x-u*0.52, y-u*0.20); g.lineTo(x+u*0.52, y-u*0.20); }, 2.4);
  // the herald's staff, left leaning on the stone — the right to speak
  pen.ink(()=>{ g.moveTo(x+u*0.74, y); g.lineTo(x+u*0.34, y-u*1.90); }, 4);
  pen.paint(()=>{ g.ellipse(x+u*0.32, y-u*2.02, u*0.15, u*0.17, 0,0,7); }, toneSolid(inkLevel(5)), 3);
}

/* ---------------- the agora's stone seats: SEPARATE blocks, real gaps -------
   Baselines are STAGGERED so the row of blocks never lines up into a rule. */
function drawSeats(pen, W, H, horizon, span){
  const g = pen.ctx;
  const at = f => span[0] + (span[1]-span[0])*f;
  const blocks = [[-0.02,0.30,-0.016],[0.40,0.68,0.010],[0.78,1.02,-0.012]];
  for (const [f0,f1,dy] of blocks){
    const a0 = at(f0), b0 = at(f1);
    const base = horizon + H*dy;
    const h = H*0.024;
    // the seat: a low solid course of stone with a lighter slab on top
    pen.paint(()=>{ g.rect(W*a0, base-h, W*(b0-a0), h); }, toneSolid(inkLevel(3)), 3.2);
    pen.paint(()=>{ g.rect(W*a0-3, base-h-H*0.011, W*(b0-a0)+6, H*0.011); },
              toneSolid(inkLevel(1)), 3.2);
  }
}

/* ---------------- the town above the far side: broken roofs, no skyline bar -- */
function drawRoofs(pen, W, H, horizon, span){
  const g = pen.ctx;
  const at = f => span[0] + (span[1]-span[0])*f;
  const roofs = [[0.14,0.030],[0.46,0.042],[0.92,0.026]];
  for (const [f, hh] of roofs){
    const x = W*at(f), w = W*(0.026 + hh*0.30), y = horizon - H*0.038;
    pen.paint(()=>{ g.rect(x-w/2, y-H*hh*0.58, w, H*hh*0.58); }, toneSolid(inkLevel(1)), 2.5);
    pen.paint(()=>{ g.moveTo(x-w*0.68, y-H*hh*0.58); g.lineTo(x, y-H*hh*0.96);
                    g.lineTo(x+w*0.68, y-H*hh*0.58); g.closePath(); }, toneSolid(inkLevel(2)), 2.5);
  }
}

/* ---------------- the count, as GEOMETRY: tally ticks in fives ---------------
   Never type. Groups of five ticks with a slash, under a faction icon:
   a spearhead for the militia, an open palm for the ones who stay. */
function drawTally(pen, cx, cy, u, n, kind){
  const g = pen.ctx;
  // ---- icon ----
  g.lineCap = "round"; g.lineJoin = "round";
  if (kind === "spear"){
    pen.paint(()=>{
      g.moveTo(cx, cy-u*0.88);
      g.lineTo(cx+u*0.21, cy-u*0.10); g.lineTo(cx+u*0.10, cy+u*0.20);
      g.lineTo(cx-u*0.10, cy+u*0.20); g.lineTo(cx-u*0.21, cy-u*0.10);
      g.closePath();
    }, toneSolid(inkLevel(6)), Math.max(4, u*0.11));
    pen.ink(()=>{ g.moveTo(cx, cy+u*0.20); g.lineTo(cx, cy+u*0.74); }, Math.max(5, u*0.15));
  } else {
    // palm + thumb as one light plane, four fingers of unequal length above it
    pen.paint(()=>{
      g.moveTo(cx-u*0.34, cy+u*0.44);
      g.lineTo(cx-u*0.38, cy-u*0.10);
      g.lineTo(cx+u*0.38, cy-u*0.10);
      g.lineTo(cx+u*0.34, cy+u*0.44);
      g.closePath();
    }, toneSolid(inkLevel(1)), Math.max(3, u*0.10));
    pen.paint(()=>{
      g.moveTo(cx-u*0.34, cy+u*0.06);
      g.lineTo(cx-u*0.74, cy-u*0.14);
      g.lineTo(cx-u*0.66, cy+u*0.28);
      g.closePath();
    }, toneSolid(inkLevel(1)), Math.max(3, u*0.10));
    const fl = [0.46, 0.62, 0.56, 0.38];
    pen.ink(()=>{ for (let k=0;k<4;k++){
      const fx = cx - u*0.27 + k*u*0.18;
      g.moveTo(fx, cy-u*0.06); g.lineTo(fx, cy-u*0.06-u*fl[k]);
    } }, Math.max(4, u*0.13));
  }
  // ---- tally: groups of five ----
  const groups = Math.ceil(Math.max(0,n)/5) || 0;
  const tickW  = u*0.20, gapG = u*0.34;
  const gW     = tickW*4 + gapG;
  const total  = groups*gW - gapG;
  let x = cx - total/2;
  const y0 = cy + u*1.02, y1 = cy + u*1.72;
  g.strokeStyle = INK; g.lineWidth = Math.max(3, u*0.115); g.lineCap = "round";
  let left = n;
  for (let gi=0; gi<groups; gi++){
    const k = Math.min(5, left); left -= 5;
    const upright = Math.min(k, 4);
    for (let t=0; t<upright; t++){
      g.beginPath(); g.moveTo(x + t*tickW, y0); g.lineTo(x + t*tickW, y1); g.stroke();
    }
    if (k === 5){
      g.beginPath();
      g.moveTo(x - tickW*0.36, y1 - (y1-y0)*0.22);
      g.lineTo(x + tickW*3.36, y0 + (y1-y0)*0.22);
      g.stroke();
    }
    x += gW;
  }
}

/* ---------------- deterministic member build ---------------- */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const formation = p.formation || "assembly";
  const attention = clamp01(p.attention);
  const griefW    = clamp01(p.grief ?? 1);
  const wave      = p.wave ?? params.wave;
  const sigma     = Math.max(0.05, p.waveSpread ?? params.waveSpread);
  const split     = clamp(p.split ?? params.split, 0.05, 0.95);
  const divide    = clamp01(p.divide ?? params.divide);
  const density   = clamp01(p.density);
  const rows      = Math.max(1, p.rows|0);
  const perRow    = p.perRow || params.perRow;
  const seatY     = p.seatY ?? params.seatY;
  const nearScale = p.nearScale ?? 1;
  const rostrumX  = (p.rostrumX ?? params.rostrumX) * W;
  const seed      = (p.seed ?? params.seed) >>> 0;

  // The channel of paper that opens between the two blocs. Each bloc is given
  // floor in PROPORTION to its numbers, so `split` moves the channel itself —
  // the position of the division is the reading, not a fixed centre line.
  const gap = 0.035 + divide*0.150;
  const X0 = 0.115, USABLE = 0.850 - gap;
  const M0 = X0,        M1 = X0 + USABLE*split;          // militia bloc span
  const C0 = M1 + gap,  C1 = C0 + USABLE*(1-split);      // caution bloc span
  const channelC = (M1 + C0)/2;

  const members = [];
  let nMil = 0, nCau = 0;

  for (let r=0; r<rows; r++){
    const depth = rows>1 ? r/(rows-1) : 1;                  // 0 = back .. 1 = front
    if (density < 1 && depth < (1-density)*0.9) continue;   // thin the deep bands first
    let n = perRow[Math.min(r, perRow.length-1)] || Math.max(2, 9-2*r);
    n = Math.max(2, Math.round(n * (0.55 + 0.45*density)));

    const scale = lerp(80, 146, depth) * lerp(1, nearScale, depth);
    const rowY  = H*(0.445 + depth*(seatY-0.445));
    const stagger = (r % 2) * 0.42;

    for (let i=0;i<n;i++){
      const rng = rnd((seed + r*211 + i*37 + 13) >>> 0);
      const u   = n>1 ? (i + stagger) / (n - 1 + stagger) : 0.5;   // 0 left .. 1 right
      const mil = u < split;

      // ---- position: two blocs whose separation is the `divide` channel ----
      let px, by = rowY, seated = false;
      if (mil){
        const v = split>0 ? u/split : 0;
        px = lerp(M0, M1, v);
      } else {
        const v = split<1 ? (u-split)/(1-split) : 0;
        px = lerp(C0, C1, v);
      }

      if (formation === "assembly"){
        // a shallow bowl facing the speaking-stone: the wings curl forward.
        // plus a per-member footline jitter, so no two hems can line up into
        // a bar across the band
        by = rowY + (1 - Math.sin(clamp01(u)*Math.PI))*scale*0.14 + (rng()-0.5)*scale*0.11;
      } else if (formation === "column"){
        // the militia has strung out toward the field; caution keeps its seats
        if (mil){
          const v = split>0 ? u/split : 0;
          px = lerp(0.055, M1*0.94, Math.pow(v, 1.35));
          by = rowY - (1-v)*scale*0.16 + (rng()-0.5)*scale*0.08;
        } else {
          by = rowY + (rng()-0.5)*scale*0.09;
        }
      } else if (formation === "scatter"){
        px += (rng()-0.5)*0.055;
        by  = rowY + (rng()-0.5)*scale*0.22;
      }
      px = clamp(px, 0.045, 0.965);
      const cx = W*px;

      // ---- the REACTION WAVE: it starts at the stone and travels outward ----
      const arrive = clamp01((px - (rostrumX/W)) / 0.95);
      const commit = smooth(clamp01((wave - arrive)/sigma * 0.5 + 0.5));

      const grief = clamp01((1-commit) * griefW);
      const rise  = mil  ? commit*(1-grief*0.30) : 0;
      const stay  = !mil ? commit*(1-grief*0.30) : 0;

      // ATTENTION: heads come up off the ground and onto the stone as they choose
      const att = clamp01(attention * (0.16 + 0.84*commit));
      let headTurn = clamp((rostrumX - cx)/(W*0.34) * att, -1, 1);
      if (att < 0.25) headTurn = (rng()-0.5)*1.2;                // still staring down
      const face = Math.abs(headTurn) < 0.06 ? (rng()<0.5?-1:1) : (headTurn>0 ? 1 : -1);

      // GESTURE — the member's side of the division, read from arms alone
      let gesture;
      if (commit < 0.42)      gesture = rng() < 0.58 ? "veil" : "beat";
      else if (mil)           gesture = rng() < 0.78 ? "spear" : "fist";
      else                    gesture = rng() < 0.62 ? "palm"  : "clasp";

      // the ones who stay TAKE THEIR SEATS — that is the whole point of them
      if (!mil && commit > 0.55 && (i % 2 === 0 || depth > 0.6)) seated = true;
      if (formation === "column" && mil) seated = false;

      const feat = {
        beard:  rng() < 0.34,
        veiled: rng() < (mil ? 0.30 : 0.55),
        headS:  0.90 + rng()*0.20,
      };
      const shade = {
        // light planes, dark accents: robes stay in the paper half of the scale
        robe: clamp(Math.round(lerp(1, 3, depth)) + (rng()<0.30 ? 1 : 0), 1, 4),
        skin: 2,
        hair: Math.round(lerp(5, 6, depth)),
        veil: clamp(Math.round(lerp(4, 5, depth)), 3, 5),
        band: clamp(Math.round(lerp(5, 6, depth)), 4, 6),
      };

      if (mil) nMil++; else nCau++;

      members.push({
        cx, baseY:by, s:scale, depth, px, band:r, seated, feat, shade,
        faction: mil ? "militia" : "caution",
        headTurn, face, gesture, commit, grief, rise, stay,
        // grief folds the body down; the risen tip forward off the heel
        lean: rise*0.75 - grief*0.30 - stay*0.10,
        mouth: clamp01(rise*0.85),
        shield: mil && commit > 0.72 && (i % 3 === 1),
        staff:  !mil && commit > 0.55 && gesture === "clasp",
        spearTilt: -0.12 - (rng()-0.5)*0.14,      // the picket leans toward the field
        spearLen: rng(),
      });
    }
  }
  members.sort((a,b)=> a.baseY - b.baseY);   // painter's order: back -> front
  return { members, counts:{ militia:nMil, caution:nCau }, wave, sigma, divide, split,
           gap, channelC, blocs:{ militia:[M0,M1], caution:[C0,C1] }, formation,
           showBiers:p.showBiers, showSeats:p.showSeats,
           showReadout:p.showReadout, showFront:p.showFront,
           rostrum:{ x:(p.rostrumX ?? params.rostrumX)*W, y:(p.rostrumY ?? params.rostrumY)*H } };
}

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const layers = (st && st.layers) ||
    ["ground","seats","biers","rostrum","band-back","band-mid","band-front","divide","readout","front-marker"];
  const has = l => layers.includes(l);
  const horizon = H*0.330;

  // lightest possible field — the paper carries the sheet
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);

  // ---- ground: the far edge of the agora, in SHORT SEGMENTS AT DIFFERENT
  //      HEIGHTS, so the join can never stripe the frame ----
  if (has("ground")){
    const runs = [[0.00,0.078,0.003,2.2],[0.142,0.262,-0.004,3.2],[0.336,0.414,0.005,2.2],
                  [0.492,0.560,-0.003,2.8],[0.640,0.726,0.004,2.2],[0.804,0.872,-0.005,3.0],
                  [0.930,0.985,0.002,2.2]];
    for (const [a0,b0,dy,lw] of runs)
      pen.ink(()=>{ g.moveTo(W*a0, horizon+H*dy); g.lineTo(W*b0, horizon+H*dy); }, lw);
    // broken depth rules, cut open at the channel so the division reads in the floor
    g.strokeStyle = INK; g.lineWidth = 2; g.globalAlpha = 0.14;
    for (let j=1;j<=3;j++){
      const y = horizon + (H-horizon)*(j/4)*(j/4);
      g.beginPath(); g.moveTo(W*0.045, y); g.lineTo(W*(B.blocs.militia[1]-0.01), y); g.stroke();
      g.beginPath(); g.moveTo(W*(B.blocs.caution[0]+0.01), y); g.lineTo(W*0.968, y); g.stroke();
    }
    // short sight ticks fanning off the speaking-stone — kept close to it, so
    // they never scratch across the crowd
    for (let i=0;i<=5;i++){
      const tx = lerp(W*0.10, W*0.42, i/5), ty = lerp(B.rostrum.y-H*0.10, horizon+H*0.16, i/5);
      g.beginPath();
      g.moveTo(B.rostrum.x + W*0.02, B.rostrum.y - H*0.03);
      g.lineTo(lerp(B.rostrum.x, tx, 0.42), lerp(B.rostrum.y-H*0.03, ty, 0.42));
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  const cB = B.blocs.caution, mB = B.blocs.militia;
  if (has("seats") && B.showSeats !== false) drawSeats(pen, W, H, horizon, cB);

  // ---- the dead, covered, on the ground behind the militia: three, with gaps ----
  if (has("biers") && B.showBiers !== false){
    const bw = mB[1]-mB[0];
    drawBier(pen, W*(mB[0]+bw*0.10), horizon+H*0.014, W*0.060);
    drawBier(pen, W*(mB[0]+bw*0.62), horizon-H*0.026, W*0.046);
  }

  if (has("rostrum")) drawRostrum(pen, B.rostrum.x, B.rostrum.y, W*0.056);

  // ---- the crowd, back band -> front band ----
  const bandLayer = ["band-back","band-mid","band-front"];
  for (const m of B.members){
    if (!has(bandLayer[Math.min(m.band, 2)])) continue;
    drawMourner(pen, m);
  }

  // ---- the division itself: the channel of paper, marked at the floor ----
  if (has("divide") && B.divide > 0.06){
    const cx = W*B.channelC;
    g.save();
    g.strokeStyle = INK; g.lineCap = "round"; g.globalAlpha = 0.60;
    g.lineWidth = Math.max(3, W*0.0060);
    g.setLineDash([W*0.010, W*0.022]);
    g.beginPath(); g.moveTo(cx, horizon + H*0.020); g.lineTo(cx, H*0.905); g.stroke();
    g.setLineDash([]);
    // two arrows opening away from each other — the crowd coming apart
    g.globalAlpha = 0.90; g.lineWidth = Math.max(4, W*0.0085);
    const ay = H*0.938, reach = W*(0.030 + B.divide*0.070);
    for (const d of [-1, 1]){
      const tip = cx + d*(W*0.014 + reach);
      g.beginPath();
      g.moveTo(cx + d*W*0.014, ay); g.lineTo(tip, ay);
      g.moveTo(tip, ay); g.lineTo(tip - d*W*0.028, ay - W*0.019);
      g.moveTo(tip, ay); g.lineTo(tip - d*W*0.028, ay + W*0.019);
      g.stroke();
    }
    g.restore();
  }

  // ---- the two counts, as tally geometry, at the head of the sheet ----
  if (has("readout") && B.showReadout !== false){
    const u = W*0.082;
    const cy = H*0.088;
    const mc = W*clamp((mB[0]+mB[1])/2, 0.19, 0.42);
    const cc = W*clamp((cB[0]+cB[1])/2, 0.60, 0.83);
    drawTally(pen, mc, cy, u, B.counts.militia, "spear");
    drawTally(pen, cc, cy, u, B.counts.caution, "palm");
    // the rule joining the two readouts, cut clean open at the channel
    g.save();
    g.strokeStyle = INK; g.globalAlpha = 0.30; g.lineWidth = 3;
    g.beginPath(); g.moveTo(W*0.055, cy); g.lineTo(mc - u*2.05, cy); g.stroke();
    g.beginPath(); g.moveTo(mc + u*2.05, cy); g.lineTo(W*(B.channelC-0.035), cy); g.stroke();
    g.beginPath(); g.moveTo(W*(B.channelC+0.035), cy); g.lineTo(cc - u*2.05, cy); g.stroke();
    g.beginPath(); g.moveTo(cc + u*2.05, cy); g.lineTo(W*0.945, cy); g.stroke();
    g.restore();
  }

  // ---- the reaction FRONT, marked as an instrument reading ----
  if (has("front-marker") && B.showFront !== false && B.wave > 0.02 && B.wave < 0.98){
    const wx = lerp(W*0.06, W*0.97, clamp01(B.wave));
    g.save();
    g.strokeStyle = ACCENT; g.lineWidth = Math.max(3, W*0.007); g.globalAlpha = 0.60;
    g.setLineDash([W*0.014, W*0.020]);
    g.beginPath(); g.moveTo(wx, horizon - H*0.070); g.lineTo(wx, horizon + H*0.085); g.stroke();
    g.setLineDash([]);
    g.lineWidth = Math.max(2, W*0.005); g.globalAlpha = 0.65;
    g.beginPath();
    g.moveTo(wx - W*0.062, horizon - H*0.042); g.lineTo(wx, horizon - H*0.042);
    g.moveTo(wx - W*0.062, horizon - H*0.042); g.lineTo(wx - W*0.044, horizon - H*0.056);
    g.moveTo(wx - W*0.062, horizon - H*0.042); g.lineTo(wx - W*0.044, horizon - H*0.028);
    g.stroke();
    g.restore();
  }
}

export const asset = {
  id:"ensemble.suitors-families",
  type:"ENSEMBLE",
  name:"Suitors' families",
  statusWord:"DIVIDING",
  scene:"OD-B24-S06",

  params,
  // back -> front; a scene may pass a subset for reveal / occlusion
  layers:["ground","seats","biers","rostrum","band-back","band-mid","band-front",
          "divide","readout","front-marker"],
  // normalized 0..1 anchors — the scene places its named speakers on these
  anchors:{
    "rostrum:stone":{x:.062,y:.885},     "rostrum:staff":{x:.100,y:.775},
    "head:militia":{x:.230,y:.895},      "head:caution":{x:.700,y:.885},
    "head:mourning":{x:.905,y:.870},
    "bloc:militia":{x:.290,y:.760},      "bloc:caution":{x:.740,y:.760},
    "divide:channel":{x:.500,y:.700},    "divide:mouth":{x:.500,y:.955},
    "bier:1":{x:.205,y:.390},            "bier:2":{x:.345,y:.375},
    "bier:3":{x:.455,y:.393},
    "seat:stone":{x:.590,y:.395},
    "wave:start":{x:.062,y:.700},        "wave:end":{x:.965,y:.700},
    "row:back":{x:.50,y:.505},           "row:mid":{x:.50,y:.70},  "row:front":{x:.50,y:.90},
    "exit:field":{x:.030,y:.700},        "exit:town":{x:.975,y:.700},
    "camera:wide":{x:.50,y:.58},         "camera:split":{x:.50,y:.74},
  },
  zones:{
    agora:{ x0:.03,y0:.40,x1:.97,y1:.96 },
    "bloc:militia":{ x0:.04,y0:.44,x1:.46,y1:.96 },
    "bloc:caution":{ x0:.54,y0:.44,x1:.97,y1:.96 },
    channel:{ x0:.46,y0:.40,x1:.54,y1:.96 },
    biers:{ x0:.14,y0:.33,x1:.52,y1:.44 },
  },

  states:{
    initial:"mourning",
    nodes:{
      // one undivided body of grief — the bodies are home, nobody has spoken
      mourning:{   preview:{ formation:"assembly", divide:0.0, wave:-0.12, waveSpread:0.22,
                             attention:0.20, grief:1.0, density:1.0, status:"MOURNING" } },
      // Eupeithes on the stone: the near ranks lift their heads
      rousing:{    preview:{ formation:"assembly", divide:0.16, wave:0.30, waveSpread:0.20,
                             attention:0.70, grief:1.0, density:1.0, status:"ROUSING" } },
      // THE SPLIT, caught mid-sweep: spears up on the left, still veiled on the right
      dividing:{   preview:{ formation:"assembly", divide:0.70, wave:0.62, waveSpread:0.22,
                             attention:0.85, grief:1.0, density:1.0, status:"DIVIDING" } },
      // the wave has passed: two blocs, a channel of floor between them
      divided:{    preview:{ formation:"assembly", divide:1.0, wave:1.25, waveSpread:0.18,
                             attention:0.92, grief:0.5, density:1.0, status:"DIVIDED" } },
      // the militia carries it — more than half, spears and shields up
      arming:{     preview:{ formation:"assembly", divide:1.0, wave:1.25, waveSpread:0.16,
                             split:0.68, attention:0.95, grief:0.3, density:1.0, status:"ARMING" } },
      // the caution half prevails — most of the agora keeps its seat
      restraining:{preview:{ formation:"assembly", divide:1.0, wave:1.25, waveSpread:0.18,
                             split:0.32, attention:0.88, grief:0.4, density:1.0, status:"RESTRAINING" } },
      // the revenge party strings out toward the country
      marching:{   preview:{ formation:"column", divide:1.0, wave:1.30, waveSpread:0.16,
                             split:0.60, attention:0.55, grief:0.2, density:1.0, status:"MARCHING" } },
      // broken into knots, arguing across the channel
      arguing:{    preview:{ formation:"scatter", divide:0.55, wave:1.10, waveSpread:0.26,
                             attention:0.60, grief:0.5, density:1.0, status:"ARGUING" } },
      // a thin agora — wide or late framings
      sparse:{     preview:{ formation:"assembly", divide:0.80, wave:0.70, waveSpread:0.22,
                             attention:0.85, grief:0.8, density:0.5, status:"THIN" } },
    },
    edges:[
      ["mourning","rousing"],["rousing","dividing"],["dividing","divided"],
      ["divided","arming"],["divided","restraining"],["arming","marching"],
      ["restraining","arguing"],["arguing","divided"],["dividing","arguing"],
      ["mourning","sparse"],["sparse","dividing"],["marching","mourning"],
    ],
  },
  channels:["formation","split","divide","wave","waveSpread","attention",
            "grief","density","rows","nearScale"],

  // neutral preview = the asset's reason to exist: the crowd caught mid-division,
  // spears already up on the near side, the far side still veiled and bowed
  preview:()=>({ formation:"assembly", split:0.58, divide:0.70, wave:0.62, waveSpread:0.22,
                 attention:0.85, grief:1.0, density:1.0,
                 status:"DIVIDING", progress:0.62 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
