/* ensemble.heroines-shades — the waiting chorus of famous women's ghosts.
   ENSEMBLE asset. A repeatable group of pale female ancestor-shades built from
   ONE separable member template (drawShade + a veil/gown rig) instanced N times
   deterministically along a shallow chorus arc in the murk of Erebus. They wait
   in a hushed CHORUS; one shade at a time steps FORWARD to the testimony spot
   at the blood-trench, speaks, and RETURNS to her place while the rest turn to
   listen. Exposes formation (chorus | one-forward), forwardIndex (which shade
   testifies), step (0 in the arc .. 1 at the trench), attention (0 all facing
   out .. 1 the chorus all turned to the speaker), returning (the speaker turns
   back), and density. Drawn PALE — very light gown tones with a hard black
   contour so each shade reads as a bright, near-transparent form; the dark
   blood-trench at the front is the single deep-ink accent. The engine dotify
   POST pass supplies the halftone. No named heroine is baked in — the template
   varies by veil/gown so the roster reads as a crowd of distinct women.
   Atlas OD-B11-S05: individual female ancestors entering one at a time from a
   waiting chorus and returning after testimony. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "/engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);
const smooth  = t => { t=clamp01(t); return t*t*(3-2*t); };

const VEILS = ["full","shoulder","crown"];   // shroud styles across the roster

const params = {
  formation:"one-forward", // chorus | one-forward
  forwardIndex:3,          // which roster member steps out to testify
  step:1.0,                // 0 = still in the arc .. 1 = at the trench, testifying
  attention:0.9,           // 0 all shades face outward .. 1 all turned to the speaker
  returning:false,         // the speaker has turned back toward her place
  density:1.0,             // 0 = only the near band .. 1 = the whole chorus
  spread:1.0,              // lateral width of the chorus arc about centre
  showTrench:true,         // the blood-trench the shade approaches to speak
  showArch:true,           // the faint gate-of-Erebus arch framing the murk
  trench:{ x:0.50, y:0.88 },
};

/* member roster: a separable template on a deterministic list. Each entry is a
   distinct woman — veil style, gown pallor, and slight stature vary so the
   chorus reads as many individuals from one template. arc index left->right. */
const MEMBERS = [
  { veil:"full",     gownLvl:1, veilLvl:3, tall:1.03, clasp:"low"  },
  { veil:"shoulder", gownLvl:2, veilLvl:2, tall:0.97, clasp:"waist"},
  { veil:"crown",    gownLvl:1, veilLvl:3, tall:1.00, clasp:"low"  },
  { veil:"full",     gownLvl:2, veilLvl:3, tall:1.05, clasp:"waist"},
  { veil:"shoulder", gownLvl:1, veilLvl:2, tall:0.96, clasp:"low"  },
  { veil:"crown",    gownLvl:2, veilLvl:3, tall:1.01, clasp:"waist"},
  { veil:"full",     gownLvl:1, veilLvl:2, tall:0.99, clasp:"low"  },
  { veil:"shoulder", gownLvl:2, veilLvl:3, tall:1.02, clasp:"waist"},
];

/* ============================================================
   MEMBER TEMPLATE — one pale female shade, drawn deterministically in
   very light solid grays + hard black contour so she reads as a bright,
   near-transparent form. look carries veil/gown identity; P the pose.
   ============================================================ */
function drawShade(pen, g, cx, footY, s, look, P){
  const gown  = toneSolid(inkLevel(look.gownLvl));
  const gown2 = toneSolid(inkLevel(Math.min(4, look.gownLvl+1)));
  const skin  = toneSolid(inkLevel(1));               // palest — a ghost face
  const veilT = toneSolid(inkLevel(look.veilLvl));
  const cw    = Math.max(2, s*0.016) * (look.speaking?1.35:1);
  const F     = look.F;
  const headTurn = P.headTurn||0;

  const shoY   = footY - s*0.70;
  const shoW   = s*0.30;
  const hemW   = s*0.58;
  const headR  = s*0.108;
  const headCy = shoY - headR*1.5;
  const hx     = cx + headTurn*s;
  const hy     = headCy;

  // faint mist the gown dissolves into at the floor
  g.fillStyle = "rgba(0,0,0,0.05)";
  g.beginPath(); g.ellipse(cx, footY+s*0.008, hemW*0.62, s*0.030, 0,0,7); g.fill();

  // ---- BACK ARM / raised hand when testifying (behind the gown) ----
  if (look.speaking){
    drawArm(pen,g, {x:cx-F*shoW*0.42, y:shoY+s*0.04}, {x:-F*0.16,y:0.55}, s, skin, gown2, Math.max(3,s*0.05), cw);
  }

  // ---- GOWN (shoulders -> flared, softly wavy hem: a bell shroud) ----
  pen.paint(()=>{
    g.moveTo(cx-shoW/2, shoY);
    g.quadraticCurveTo(cx-shoW*0.62, shoY+s*0.30, cx-hemW/2, footY-s*0.02);
    // wavy dissolving hem
    const steps=6;
    for(let k=0;k<=steps;k++){
      const t=k/steps, x=lerp(cx-hemW/2, cx+hemW/2, t);
      const y=footY - Math.sin(t*Math.PI*3 + look.F*0.6)*s*0.012;
      g.lineTo(x,y);
    }
    g.quadraticCurveTo(cx+shoW*0.62, shoY+s*0.30, cx+shoW/2, shoY);
    g.closePath();
  }, gown, cw);
  // a couple of vertical drape folds for volume
  pen.seam(()=>{ g.moveTo(cx, shoY+s*0.06); g.lineTo(cx+P.leanHem*s, footY-s*0.02); }, cw*0.7);
  pen.seam(()=>{ g.moveTo(cx-shoW*0.24, shoY+s*0.10); g.lineTo(cx-hemW*0.28, footY-s*0.03); }, cw*0.55);
  pen.seam(()=>{ g.moveTo(cx+shoW*0.24, shoY+s*0.10); g.lineTo(cx+hemW*0.28, footY-s*0.03); }, cw*0.55);

  // ---- clasped hands (waiting) — a small pale knot at the waist ----
  if (!look.speaking){
    const wy = shoY + s*0.24;
    pen.paint(()=>{ g.ellipse(cx, wy, s*0.045, s*0.032, 0,0,7); }, skin, cw*0.7);
  }

  // ---- VEIL BACK MASS + NECK + HEAD ----
  drawVeilBack(pen,g, hx, hy, headR, shoY, cx, s, look, veilT, cw);
  pen.limb(()=>{ g.moveTo(cx, shoY+s*0.004); g.lineTo(hx, hy+headR*0.7); }, skin, s*0.045);
  pen.paint(()=>{ g.ellipse(hx, hy, headR*0.9, headR, 0,0,7); }, skin, cw);
  drawFace(g, hx, hy, headR, F, look.speaking);
  drawVeilFront(pen,g, hx, hy, headR, shoY, cx, s, look, veilT, cw);

  // ---- FRONT ARM / testifying hand raised & open (over the gown) ----
  if (look.speaking){
    drawArm(pen,g, {x:cx+F*shoW*0.42, y:shoY+s*0.04}, {x:F*0.30,y:-0.42}, s, skin, gown2, Math.max(3,s*0.05), cw);
  }
}

/* downcast, spare features — a ghost barely present */
function drawFace(g, hx, hy, headR, F, speaking){
  g.strokeStyle=INK; g.lineCap="round";
  g.lineWidth=Math.max(1.4, headR*0.11);
  // downcast eyes = two short strokes
  g.beginPath(); g.moveTo(hx-headR*0.40, hy-headR*0.02); g.lineTo(hx-headR*0.14, hy+headR*0.02); g.stroke();
  g.beginPath(); g.moveTo(hx+headR*0.14, hy+headR*0.02); g.lineTo(hx+headR*0.40, hy-headR*0.02); g.stroke();
  // nose
  g.lineWidth=Math.max(1.2, headR*0.09);
  g.beginPath(); g.moveTo(hx+F*headR*0.05, hy+headR*0.06); g.lineTo(hx+F*headR*0.10, hy+headR*0.34); g.stroke();
  // mouth — a small open speech mark for the one testifying, else a faint line
  if (speaking){
    g.fillStyle=INK; g.beginPath(); g.ellipse(hx, hy+headR*0.55, headR*0.14, headR*0.12, 0,0,7); g.fill();
  } else {
    g.beginPath(); g.moveTo(hx-headR*0.20, hy+headR*0.56); g.lineTo(hx+headR*0.20, hy+headR*0.56); g.stroke();
  }
}

/* veil back layer: a pale shroud framing behind the head, style-dependent */
function drawVeilBack(pen,g, hx,hy,headR, shoY, cx, s, look, veilT, cw){
  if (look.veil==="crown"){
    // hair pinned back under a circlet — a pale mass to the shoulders
    pen.paint(()=>{ g.ellipse(hx, hy+headR*0.35, headR*1.18, headR*1.35, 0,0,7); }, toneSolid(inkLevel(3)), cw*0.85);
    return;
  }
  // full / shoulder: a hood drape rising above the crown and out past the head
  const drop = look.veil==="full" ? shoY + (footY_gap(shoY, s)) : shoY + s*0.02;
  pen.paint(()=>{
    g.moveTo(hx-headR*1.35, hy+headR*0.2);
    g.quadraticCurveTo(hx, hy-headR*1.7, hx+headR*1.35, hy+headR*0.2);
    g.lineTo(hx+headR*1.5, drop);
    g.lineTo(hx-headR*1.5, drop);
    g.closePath();
  }, veilT, cw*0.9);
}
function footY_gap(shoY, s){ return s*0.34; }   // how far a full veil drapes below the shoulders

/* veil front: two framing edges over the face; full veils add a chin drape */
function drawVeilFront(pen,g, hx,hy,headR, shoY, cx, s, look, veilT, cw){
  if (look.veil==="crown"){
    // circlet band across the brow
    pen.ink(()=>{ g.moveTo(hx-headR*0.9, hy-headR*0.55); g.quadraticCurveTo(hx, hy-headR*0.8, hx+headR*0.9, hy-headR*0.55); }, cw*0.8);
    return;
  }
  // framing veil edges hugging the face
  pen.ink(()=>{
    g.moveTo(hx-headR*0.95, hy-headR*0.15);
    g.quadraticCurveTo(hx-headR*1.05, hy-headR*1.2, hx, hy-headR*1.28);
    g.quadraticCurveTo(hx+headR*1.05, hy-headR*1.2, hx+headR*0.95, hy-headR*0.15);
  }, cw*0.75);
  if (look.veil==="full"){
    // a chin drape falling to the shoulders (kept light so the face reads)
    pen.paint(()=>{
      g.moveTo(hx-headR*0.95, hy+headR*0.1);
      g.quadraticCurveTo(hx-headR*0.7, shoY+s*0.06, hx, shoY+s*0.08);
      g.quadraticCurveTo(hx+headR*0.7, shoY+s*0.06, hx+headR*0.95, hy+headR*0.1);
      g.quadraticCurveTo(hx, hy+headR*0.7, hx-headR*0.95, hy+headR*0.1);
      g.closePath();
    }, toneSolid(inkLevel(Math.max(1, look.veilLvl-1))), cw*0.7);
  }
}

/* two-segment arm reaching to a hand target = shoulder + dir*reach*s */
function drawArm(pen,g, sh, target, s, skin, sleeve, thick, cw){
  const n = Math.hypot(target.x, target.y)||1;
  const dx = target.x/n, dy = target.y/n;
  const reach = s*0.28;
  const hand = { x: sh.x + dx*reach,      y: sh.y + dy*reach };
  const el   = { x: sh.x + dx*reach*0.55 - dy*reach*0.10, y: sh.y + dy*reach*0.55 + dx*reach*0.10 };
  pen.limb(()=>{ g.moveTo(sh.x,sh.y); g.lineTo(el.x,el.y); }, sleeve, thick);       // upper (sleeve)
  pen.limb(()=>{ g.moveTo(el.x,el.y); g.lineTo(hand.x,hand.y); }, skin, thick*0.78);// forearm
  pen.paint(()=>{ g.arc(hand.x,hand.y, s*0.026, 0,7); }, skin, cw*0.7);             // open hand
  return hand;
}

/* ============================================================
   FORMATION — place each member along the chorus arc; pull the chosen
   forwardIndex out to the trench when in one-forward. Returns records
   sorted back->front for correct occlusion.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st };
  const spread   = clamp(p.spread, 0.5, 1.5);
  const density  = clamp01(p.density);
  const attention= clamp01(p.attention);
  const step     = clamp01(p.step);
  const oneFwd   = p.formation==="one-forward";
  const fwdI     = clamp(p.forwardIndex|0, 0, MEMBERS.length-1);
  const trench   = { x:p.trench.x*W, y:p.trench.y*H };
  const fwdSpot  = { x:0.50*W, y:0.835*H };     // the testimony position at the trench

  const roster = MEMBERS.map((m,i)=>({ ...m, i }))
    .filter(m => density>=1 ? true : (m.i%2===0 || m.i===fwdI));

  const N = MEMBERS.length;
  const recs = [];
  for (const m of roster){
    // home slot on a shallow bowl arc (ends nearer/larger, centre back/smaller)
    const t = m.i/(N-1);
    const homeX = clamp(0.5 + (t-0.5)*0.78*spread, 0.10, 0.90)*W;
    const bow   = Math.sin(t*Math.PI);                 // 0 ends .. 1 centre
    const homeY = (0.615 - bow*0.075)*H;               // centre sits further back
    const homeS = lerp(232, 150, bow) * m.tall;        // further = smaller

    let cx=homeX, cy=homeY, s=homeS, speaking=false, headTurn=0, leanHem=0;
    const isForward = oneFwd && m.i===fwdI;

    if (isForward){
      // ease from the home slot out to the trench spot
      const k = smooth(step);
      cx = lerp(homeX, fwdSpot.x, k);
      cy = lerp(homeY, fwdSpot.y, k);
      s  = lerp(homeS, 300*m.tall, k);
      speaking = step>0.6 && !p.returning;
      // face the trench going out; turn back when returning
      headTurn = (p.returning ? -0.05 : 0.02);
      leanHem  = p.returning ? -0.05 : 0.05;
    } else {
      // waiting chorus — heads turn toward the speaker by `attention`
      const focusX = oneFwd ? fwdSpot.x : W*0.5;
      headTurn = ((focusX-homeX)/W) * 0.16 * (oneFwd?attention:0.15);
      leanHem  = headTurn*0.5;
    }

    const look = {
      veil:m.veil, gownLvl:m.gownLvl, veilLvl:m.veilLvl, clasp:m.clasp,
      F: (isForward ? 1 : (headTurn>=0?1:-1)),
      speaking,
    };
    recs.push({ cx, footY:cy, s, look, P:{ headTurn, leanHem }, isForward });
  }
  recs.sort((a,b)=> a.footY - b.footY);   // back -> front
  return { recs, trench, showTrench:p.showTrench, showArch:p.showArch, oneFwd,
           anySpeaking: recs.some(r=>r.look.speaking) };
}

/* ============================================================
   STAGE — the murk of Erebus, the blood-trench, then the chorus.
   ============================================================ */
function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);
  const floorY = H*0.60;

  // ---- the void above (palest — almost bare paper) ----
  g.fillStyle = inkLevel(1); g.fillRect(0,0,W,H);

  // ---- faint gate-of-Erebus arch framing the murk behind the chorus ----
  if (B.showArch){
    pen.ink(()=>{
      g.moveTo(W*0.14, floorY);
      g.quadraticCurveTo(W*0.14, H*0.16, W*0.50, H*0.13);
      g.quadraticCurveTo(W*0.86, H*0.16, W*0.86, floorY);
    }, 3);
    // a second, inner arch line for depth
    g.globalAlpha=0.5;
    pen.ink(()=>{
      g.moveTo(W*0.20, floorY);
      g.quadraticCurveTo(W*0.20, H*0.22, W*0.50, H*0.19);
      g.quadraticCurveTo(W*0.80, H*0.22, W*0.80, floorY);
    }, 2);
    g.globalAlpha=1;
  }

  // ---- the underworld floor (soft mid-light band the shades stand on) ----
  pen.paint(()=>{ g.rect(0, floorY, W, H-floorY); }, toneSolid(inkLevel(2)), 0);
  pen.ink(()=>{ g.moveTo(0,floorY); g.lineTo(W,floorY); }, 2);
  // drifting mist streaks across the floor
  g.strokeStyle=INK; g.globalAlpha=0.16; g.lineWidth=2;
  for(let j=0;j<3;j++){ const y=floorY+(H-floorY)*(0.22+0.24*j);
    g.beginPath(); g.moveTo(W*0.04,y); g.lineTo(W*0.44,y-4);
    g.moveTo(W*0.56,y+3); g.lineTo(W*0.96,y-3); g.stroke(); }
  g.globalAlpha=1;

  // ---- the blood-trench at the front (the single DEEP-INK accent) ----
  if (B.showTrench){
    const tx=B.trench.x, ty=B.trench.y;
    pen.paint(()=>{ g.ellipse(tx, ty, W*0.115, H*0.028, 0,0,7); }, toneSolid(inkLevel(6)), 4);
    pen.paint(()=>{ g.ellipse(tx, ty-H*0.004, W*0.085, H*0.018, 0,0,7); }, toneSolid(inkLevel(7)), 3);
    // a faint rim highlight
    pen.ink(()=>{ g.ellipse(tx, ty, W*0.115, H*0.028, 0, Math.PI*0.05, Math.PI*0.95); }, 2);
  }

  // ---- the chorus of shades, back -> front ----
  for (const r of B.recs) drawShade(pen, g, r.cx, r.footY, r.s, r.look, r.P);
}

export const asset = {
  id:"ensemble.heroines-shades",
  type:"ENSEMBLE",
  name:"Heroines' shades",
  statusWord:"WAITING",
  scene:"OD-B11-S05",

  params,
  // one member template + veil/gown rig, instanced across the chorus arc
  member:{ template:"drawShade", veils:VEILS, roster:MEMBERS },
  // back -> front draw order the stage honors
  layers:["void","arch","floor","mist","trench","chorus"],
  // normalized placement / focus anchors (NOT baked characters)
  anchors:{
    "spot:testify":{x:.50,y:.855}, "trench":{x:.50,y:.92},
    "arc:left":{x:.12,y:.62},  "arc:centre":{x:.50,y:.54}, "arc:right":{x:.88,y:.62},
    "gate:erebus":{x:.50,y:.14},
    "camera:wide":{x:.50,y:.55}, "camera:testify":{x:.50,y:.80},
  },
  // the shades' standing ground between the gate and the trench
  zones:{ arc:{ x0:.08,y0:.52,x1:.92,y1:.70 }, testify:{ x0:.38,y0:.80,x1:.62,y1:.94 } },
  channels:["formation","forwardIndex","step","attention","returning","density","spread"],
  states:{
    initial:"waiting",
    nodes:{
      // the hushed chorus, all shades facing outward, none forward yet
      "waiting":  { preview:{ formation:"chorus", attention:0.1, status:"WAITING" } },
      // one shade has stepped forward and turned to speak; the rest listen
      "testify":  { preview:{ formation:"one-forward", forwardIndex:3, step:1.0, attention:0.9, status:"TESTIFY" } },
      // the same shade is easing back to her place, turned away
      "returning":{ preview:{ formation:"one-forward", forwardIndex:3, step:0.45, attention:0.7, returning:true, status:"RETURNING" } },
    },
    edges:[["waiting","testify"],["testify","returning"],["returning","waiting"]],
  },

  // neutral preview = the signature beat: chorus + one shade forward at the trench
  preview:()=>({ formation:"one-forward", forwardIndex:3, step:1.0, attention:0.9, status:"TESTIFY", progress:0.4 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
