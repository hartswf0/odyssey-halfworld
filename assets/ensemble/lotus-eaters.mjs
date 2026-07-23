/* ensemble.lotus-eaters — gentle, placid natives offering the lotus.
   ENSEMBLE asset. Scene function (OD-B09-S03): nonviolent HOSTS who greet the
   landing crew by extending lotus blossoms in open, cupped hands — offering food
   without pursuit, without overt aggression. Built from ONE separable member
   template (drawHost) instanced N times deterministically across an
   OFFERING-CLUSTER that faces a shared shore-threshold focus (the newcomers).

   Exposes formation (offering-cluster | line), density (rows/perRow), a PLACID
   attention channel (`serenity`: drowsy droop of the eyes, soft bow of the head,
   the calm that reads as non-hostile), `offering` (how far the blossom-bearing
   hands reach toward the visitor), a gentle `sway`, and foreground/background
   depth. Drawn in SOLID grays + hard contour; the engine dotify pass supplies the
   halftone. The newcomers/crew are NOT baked in — only a faint shore-threshold
   glyph on the left the whole cluster gently turns toward. The single blue mark
   rides the lotus nectar-centers (the narcotic that makes them forget the way home). */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp, rnd } from "../../engine/halfworld-engine.mjs";

const clamp01 = x => clamp(x,0,1);

const params = {
  formation:"cluster",       // cluster (offering-huddle) | line (a calm receiving-row)
  rows:2,                    // depth tiers (back..front)
  perRow:[4,3],              // members per tier (density)
  focus:{ x:0.145, y:0.72 }, // the shore threshold the hosts face — where visitors land (0..1)
  serenity:0.85,             // placid attention: 0=alert .. 1=drowsy/serene, heads bow, eyes droop
  offering:0.9,              // how far the cupped, blossom-bearing hands reach out (0..1)
  sway:0.35,                 // gentle non-pursuing sway of the standing bodies
  showFocus:true,            // draw the faint shore-threshold glyph the cluster turns toward
  showStrewn:true,           // fallen blossoms strewn on the calm ground
  groundY:0.90,              // front-row feet line as fraction of H
};

/* ---------------- one arm: shoulder -> elbow -> cupped wrist (offering reach) --- */
function reachArm(pen, sh, wr, tone, w){
  const mx=(sh.x+wr.x)/2, my=(sh.y+wr.y)/2;
  const el={ x:mx - (wr.y-sh.y)*0.05, y:my + Math.abs(wr.x-sh.x)*0.06 + w*0.4 };
  pen.limb(()=>{ pen.ctx.moveTo(sh.x,sh.y); pen.ctx.lineTo(el.x,el.y); }, tone, w);
  pen.limb(()=>{ pen.ctx.moveTo(el.x,el.y); pen.ctx.lineTo(wr.x,wr.y); }, tone, w*0.86);
  return el;
}

/* -------- the LOTUS blossom offered in the hands (the readable motif) --------
   A pale, open cup of petals (light tone so it POPS against the robes) with a
   darker seed-head and a single blue nectar mark — the narcotic core. */
function drawLotus(pen, x, y, r, tilt){
  const g = pen.ctx;
  const petal = toneSolid(inkLevel(2));      // pale petals
  const petalB= toneSolid(inkLevel(3));      // shaded back petals
  const lw = Math.max(1.5, r*0.10);
  // back row of petals (fan slightly wider, one tone darker)
  for (let k=-2;k<=2;k++){
    const a = tilt + k*0.42;
    pen.paint(()=>{ g.ellipse(x + Math.cos(a-Math.PI/2)*r*0.5, y + Math.sin(a-Math.PI/2)*r*0.5,
                              r*0.26, r*0.62, a, 0, 7); }, petalB, lw);
  }
  // front row of petals (opening upward, pale)
  for (let k=-2;k<=2;k++){
    const a = tilt + k*0.5;
    pen.paint(()=>{ g.ellipse(x + Math.cos(a-Math.PI/2)*r*0.34, y + Math.sin(a-Math.PI/2)*r*0.34,
                              r*0.22, r*0.55, a, 0, 7); }, petal, lw);
  }
  // seed-head cup
  pen.paint(()=>{ g.ellipse(x, y, r*0.34, r*0.26, 0, 0, 7); }, toneSolid(inkLevel(4)), lw);
  // the blue nectar mark — the narcotic center
  g.fillStyle = ACCENT; g.beginPath(); g.arc(x, y - r*0.02, Math.max(2, r*0.16), 0, 7); g.fill();
}

/* ============================================================
   ONE member template — a STANDING host in a long robe, both arms extended
   forward to cup a lotus blossom out toward the visitor. Serene: head bowed a
   touch, eyes drooping to soft closed arcs (drowsy narcotic calm), calm mouth.
   `serenity` deepens the droop/bow; `offering` sets the reach; `sway` leans body.
   ============================================================ */
function drawHost(pen, m){
  const g = pen.ctx, s = m.s, dir = m.faceDir;   // dir -1 => faces the shore on the left
  const robe = toneSolid(inkLevel(m.shade.robe));
  const robe2= toneSolid(inkLevel(m.shade.robe+1));
  const skin = toneSolid(inkLevel(m.shade.skin));
  const hair = toneSolid(inkLevel(m.shade.hair));
  const lw   = Math.max(2, s*0.024);
  const ser  = m.serenity;

  const feetY   = m.baseY;
  const hemHalf = s*0.24;
  const waistY  = feetY - s*0.50;
  const waistHalf = s*0.155;
  const torsoLen= s*0.32;
  const shoY    = waistY - torsoLen;
  const swayX   = m.sway;                        // gentle body lean
  const shoCx   = m.cx + swayX;
  const shoHalf = s*0.165;
  const headR   = s*0.135*m.feat.headS;

  // ---- long robe SKIRT: hem (wide) -> waist (narrower) ----
  pen.paint(()=>{
    g.moveTo(m.cx - hemHalf, feetY);
    g.lineTo(m.cx + hemHalf, feetY);
    g.lineTo(m.cx + waistHalf, waistY);
    g.lineTo(m.cx - waistHalf, waistY);
    g.closePath();
  }, robe, lw);
  // vertical drape folds
  pen.seam(()=>{ g.moveTo(m.cx - hemHalf*0.4, feetY); g.lineTo(m.cx - waistHalf*0.35, waistY); }, Math.max(1.4,s*0.012));
  pen.seam(()=>{ g.moveTo(m.cx + hemHalf*0.4, feetY); g.lineTo(m.cx + waistHalf*0.35, waistY); }, Math.max(1.4,s*0.012));
  pen.seam(()=>{ g.moveTo(m.cx, feetY - s*0.02); g.lineTo(m.cx + swayX*0.4, waistY); }, Math.max(1.4,s*0.012));

  // ---- TORSO: waist -> shoulders (leaning gently with the sway) ----
  pen.paint(()=>{
    g.moveTo(m.cx - waistHalf, waistY);
    g.lineTo(m.cx + waistHalf, waistY);
    g.lineTo(shoCx + shoHalf, shoY);
    g.lineTo(shoCx - shoHalf, shoY);
    g.closePath();
  }, robe2, lw);
  // sash across the waist
  pen.seam(()=>{ g.moveTo(m.cx - waistHalf, waistY); g.lineTo(m.cx + waistHalf, waistY); }, Math.max(2,s*0.02));

  const shFront = { x: shoCx + dir*shoHalf*0.86, y: shoY + s*0.02 };  // shoulder toward the visitor
  const shBack  = { x: shoCx - dir*shoHalf*0.86, y: shoY + s*0.02 };  // shoulder away
  const armW    = Math.max(3, s*0.06);

  // ---- the OFFERING: both cupped hands converge on a blossom held out toward the shore ----
  const reach = m.offering;
  const offX  = shoCx + dir*(s*0.17 + reach*s*0.24);
  const offY  = shoY + s*0.15 + reach*s*0.06;
  const wF = { x: offX + dir*s*0.03, y: offY + s*0.015 };   // front hand
  const wB = { x: offX - dir*s*0.03, y: offY - s*0.015 };   // back hand
  // far arm first (behind the blossom), then near arm
  reachArm(pen, shBack, wB, robe2, armW*0.92);

  // ---- head + serene face (turned a touch toward the visitor, bowed by serenity) ----
  const headBow  = ser*headR*0.5;
  const headTurn = dir*lerp(0.2, 0.45, m.depth);
  const headCx   = shoCx + dir*headR*0.18 + headTurn*headR*0.2;
  const headCy   = shoY - headR*0.95 + headBow;

  // neck
  pen.paint(()=>{ g.rect(headCx - headR*0.26, shoY - headR*0.45, headR*0.52, headR*0.7); }, skin, Math.max(2,s*0.016));
  // hair back
  if (m.feat.hair!=="bald")
    pen.paint(()=>{ g.ellipse(headCx, headCy+headR*0.12, headR*1.14, headR*1.2, 0,0,7); }, hair, Math.max(2,s*0.022));
  // head
  pen.paint(()=>{ g.ellipse(headCx, headCy, headR*0.9, headR, 0,0,7); }, skin, Math.max(2,s*0.026));

  // ---- serene face: drooping eyes, calm level mouth (a faint restful smile) ----
  const gx   = headTurn*headR*0.28;
  const eyeY = headCy - headR*0.02;
  const eL = headCx - headR*0.32 + gx, eR = headCx + headR*0.32 + gx;
  const droop = clamp01(0.35 + ser*0.6);            // serene => eyes near-closed, downcast arcs
  g.strokeStyle=INK; g.lineCap="round"; g.lineWidth=Math.max(2,headR*0.12);
  const softEye=(ex)=>{
    g.beginPath();
    g.moveTo(ex - headR*0.16, eyeY);
    g.quadraticCurveTo(ex, eyeY + headR*0.12*droop, ex + headR*0.16, eyeY);
    g.stroke();
  };
  softEye(eL); softEye(eR);
  // gentle brows, lifted and relaxed
  g.lineWidth=Math.max(2,headR*0.09);
  g.beginPath(); g.moveTo(eL - headR*0.18, eyeY - headR*0.26); g.quadraticCurveTo(eL, eyeY - headR*0.32, eL + headR*0.18, eyeY - headR*0.24); g.stroke();
  g.beginPath(); g.moveTo(eR - headR*0.18, eyeY - headR*0.24); g.quadraticCurveTo(eR, eyeY - headR*0.32, eR + headR*0.18, eyeY - headR*0.26); g.stroke();
  // nose toward the visitor
  g.lineWidth=Math.max(2,headR*0.1);
  g.beginPath(); g.moveTo(headCx + gx*0.5, eyeY + headR*0.14); g.lineTo(headCx + dir*headR*0.32, eyeY + headR*0.42); g.stroke();
  // calm mouth: a soft, faintly upturned line — restful, not laughing
  g.lineWidth=Math.max(2,headR*0.1);
  const mY = headCy + headR*0.54;
  g.beginPath();
  g.moveTo(headCx - headR*0.22 + gx, mY);
  g.quadraticCurveTo(headCx + gx, mY + headR*0.12, headCx + headR*0.22 + gx, mY);
  g.stroke();
  // hair front cap
  if (m.feat.hair!=="bald")
    pen.paint(()=>{
      g.moveTo(headCx-headR*0.92, headCy-headR*0.04);
      g.quadraticCurveTo(headCx, headCy-headR*1.3, headCx+headR*0.92, headCy-headR*0.04);
      g.quadraticCurveTo(headCx+headR*0.48, headCy-headR*0.52, headCx, headCy-headR*0.44);
      g.quadraticCurveTo(headCx-headR*0.48, headCy-headR*0.52, headCx-headR*0.92, headCy-headR*0.04);
    }, hair, Math.max(2,s*0.02));

  // ---- near arm (visitor-side shoulder) reaching to the blossom ----
  reachArm(pen, shFront, wF, robe2, armW);

  // ---- cupped OPEN HANDS beneath the blossom, palms up ----
  pen.paint(()=>{ g.ellipse((wF.x+wB.x)/2, offY + s*0.02, s*0.075, s*0.045, 0, 0, 7); }, skin, lw*0.8);
  pen.seam(()=>{ g.moveTo(offX - s*0.06, offY + s*0.03); g.quadraticCurveTo(offX, offY + s*0.06, offX + s*0.06, offY + s*0.03); }, Math.max(1.4,s*0.012));

  // ---- the LOTUS blossom, cupped in the open hands, tilted out toward the visitor ----
  drawLotus(pen, offX, offY - s*0.05, s*0.15, dir*0.35);

  return { head:{ x:headCx, y:headCy }, r:headR, off:{ x:offX, y:offY } };
}

/* -------- the shore THRESHOLD the hosts face (NOT the crew themselves) --------
   A faint diagram on the left: a low shore line, a couple of reeds, and a soft
   arrival path — so the cluster's orientation reads without baking characters. */
function drawFocus(pen, x, y, s){
  const g = pen.ctx;
  // shore / waterline
  g.strokeStyle=INK; g.globalAlpha=0.5; g.lineWidth=Math.max(2,s*0.05); g.lineCap="round";
  g.beginPath();
  g.moveTo(x - s*0.7, y + s*0.35);
  g.quadraticCurveTo(x, y + s*0.18, x + s*0.7, y + s*0.38);
  g.stroke();
  g.beginPath();
  g.moveTo(x - s*0.7, y + s*0.52);
  g.quadraticCurveTo(x + s*0.1, y + s*0.36, x + s*0.7, y + s*0.55);
  g.stroke();
  g.globalAlpha=1;
  // a couple of reeds
  g.lineWidth=Math.max(2,s*0.05);
  for (const rx of [-0.5,-0.34,0.42]){
    g.beginPath(); g.moveTo(x + rx*s, y + s*0.3); g.quadraticCurveTo(x + rx*s - s*0.06, y - s*0.2, x + rx*s + s*0.04, y - s*0.55); g.stroke();
  }
  // a soft arrival path arrow toward the cluster (blue, the drawing-in)
  g.strokeStyle=ACCENT; g.globalAlpha=0.6; g.lineWidth=Math.max(2,s*0.06);
  g.beginPath(); g.moveTo(x + s*0.2, y - s*0.05); g.lineTo(x + s*0.9, y - s*0.05); g.stroke();
  g.beginPath(); g.moveTo(x + s*0.78, y - s*0.16); g.lineTo(x + s*0.92, y - s*0.05); g.lineTo(x + s*0.78, y + s*0.06); g.stroke();
  g.globalAlpha=1;
}

/* ============================================================
   build the offering-cluster deterministically from params + state.
   Members are placed to the RIGHT of the shore focus, all gently turned toward
   it, standing (never advancing) — the non-pursuit is encoded as planted feet +
   only a soft sway. serenity + offering are shared placid channels.
   ============================================================ */
function buildMembers(W, H, st){
  const p = { ...params, ...st, focus:{ ...params.focus, ...(st&&st.focus||{}) } };
  const serenity = clamp01(p.serenity);
  const offering = clamp01(p.offering);
  const swayAmt  = clamp01(p.sway);
  const rows = Math.max(1, p.rows|0);
  const perRow = p.perRow || [4,3];
  const fx = p.focus.x*W, fy = p.focus.y*H;

  const seats = [];
  for (let r=0;r<rows;r++){
    const depth = rows>1 ? r/(rows-1) : 0;          // 0=back .. 1=front
    const n = perRow[Math.min(r, perRow.length-1)] || 3;
    for (let i=0;i<n;i++) seats.push({ r, i, n, depth });
  }

  const members = [];
  seats.forEach((seat, idx)=>{
    const { r, i, n, depth } = seat;
    const scale  = lerp(158, 246, depth);            // back small .. front large
    const rowY   = H*(0.42 + depth*(p.groundY-0.42));
    const marginX= lerp(0.31, 0.25, depth);          // cluster sits right of the shore
    const spread = p.formation==="line" ? 0.56 : 0.53;
    const stagger= (r%2)*0.5;
    const t  = n>1 ? (i+stagger)/(n-1+stagger) : 0.5;
    const px = clamp01(lerp(marginX, marginX+spread, clamp01(t)));
    let cx = W*px;
    let by = rowY;
    // offering-CLUSTER: the ranks curl into a soft huddle facing the shore
    if (p.formation==="cluster"){
      const a = (px - marginX)/spread;               // 0 near shore .. 1 far
      by += Math.sin(a*Math.PI)* -scale*0.06;
      cx += Math.sin(a*Math.PI)* -scale*0.015;
    }

    const rng = rnd((r*131+i*29+7)>>>0);
    const feat = { hair: rng()<0.16?"bald":"full", headS: 0.9+rng()*0.2 };
    // per-member serenity + reach jitter (a living, unsynchronised calm)
    const ser  = clamp01(serenity + (rng()-0.5)*0.18);
    const reach= clamp01(offering + (rng()-0.5)*0.16);
    const phase= rng()*6.283;
    const sway = dirTo(fx, cx) * 0 + Math.sin(phase)*swayAmt*scale*0.05;
    const dir  = dirTo(fx, cx);

    members.push({
      cx, baseY:by, s:scale, depth, px, faceDir:dir,
      serenity:ser, offering:reach, sway,
      feat,
      shade:{
        robe: Math.round(lerp(3, 4.2, depth)),
        skin: Math.round(lerp(2, 2.6, depth)),
        hair: Math.round(lerp(4, 5.4, depth)),
      },
    });
  });

  // draw back -> front so near hosts occlude the far ones
  members.sort((a,b)=> a.baseY - b.baseY);
  return { members, serenity, offering, focus:{ x:fx, y:fy }, showFocus:p.showFocus, showStrewn:p.showStrewn };
}
function dirTo(fx, cx){ return fx <= cx ? -1 : 1; }

function drawEnsemble(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const B = buildMembers(W, H, st);

  // faint calm ground rules
  g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.14;
  for (let k=0;k<=3;k++){ const y=H*(0.58+k*0.10); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
  g.globalAlpha=1;

  // strewn fallen blossoms on the ground (pale — the abundance underfoot)
  if (B.showStrewn){
    const sr = rnd(9173);
    for (let i=0;i<10;i++){
      const x = W*(0.2 + sr()*0.75), y = H*(0.72 + sr()*0.2), r = W*(0.012+sr()*0.014);
      pen.paint(()=>{ g.ellipse(x, y, r, r*0.5, sr()*3, 0, 7); }, toneSolid(inkLevel(2)), Math.max(1.4, r*0.3));
      g.fillStyle=ACCENT; g.beginPath(); g.arc(x, y, Math.max(1.5, r*0.28), 0, 7); g.fill();
    }
  }

  // the shore THRESHOLD glyph on the left (where the visitors land)
  if (B.showFocus) drawFocus(pen, B.focus.x, B.focus.y, W*0.10);

  // the offering hosts, back -> front
  B.members.forEach(m => drawHost(pen, m));
}

export const asset = {
  id:"ensemble.lotus-eaters",
  type:"ENSEMBLE",
  name:"Lotus-eaters",
  statusWord:"PLACID",
  scene:"OD-B09-S03",

  params,
  // back -> front draw order the ensemble honors
  layers:["ground","strewn-blossoms","shore-threshold","back-row","front-row","offered-lotus"],
  // normalized 0..1 anchors: the shore focus, cluster handles, an offered-blossom point
  anchors:{
    "focus:shore":{x:.145,y:.72}, "path:arrival":{x:.24,y:.70},
    "cluster:back":{x:.52,y:.50}, "cluster:front":{x:.50,y:.82},
    "host:near":{x:.40,y:.80}, "host:far":{x:.88,y:.54},
    "offer:lotus":{x:.42,y:.62}, "camera:wide":{x:.52,y:.60},
  },
  zones:{ hosts:{ x0:.26,y0:.44,x1:.96,y1:.94 }, shore:{ x0:.02,y0:.58,x1:.24,y1:.88 } },
  states:{
    initial:"offering",
    nodes:{
      // the placid greeting: serene hosts holding out the lotus, no pursuit
      offering:{ preview:{ serenity:0.85, offering:0.9, sway:0.35, status:"OFFERING" } },
      // hands lift the blossom fully forward — the invitation at its warmest
      "beckoning":{ preview:{ serenity:0.8, offering:1.0, sway:0.4, status:"BECKONING" } },
      // deep drowsy calm; heads bowed, eyes all but closed, blossoms lowered a touch
      "drowsy":{ preview:{ serenity:1.0, offering:0.6, sway:0.5, status:"DROWSY" } },
      // at rest between visitors; blossoms held low, still non-hostile
      resting:{ preview:{ serenity:0.7, offering:0.3, sway:0.25, status:"RESTING" } },
    },
    edges:[
      ["offering","beckoning"],["beckoning","drowsy"],["drowsy","offering"],
      ["offering","resting"],["resting","offering"],
    ],
  },
  channels:["serenity","offering","sway","formation","density","depth","focus"],

  // neutral preview = the placid cluster holding out the lotus toward the shore
  preview:()=>({ serenity:0.85, offering:0.9, sway:0.35, formation:"cluster",
                 status:"PLACID", progress:0.4 }),

  draw(ctx, W, H, state){ drawEnsemble(ctx, W, H, state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
