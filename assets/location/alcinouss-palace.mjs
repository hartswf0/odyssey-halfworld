/* location.alcinouss-palace — the splendid Phaeacian royal hall of King Alcinous.
   LOCATION asset (empty navigable set — NO baked characters). Built in SOLID
   grays + hard contour into the offscreen ctx; the engine dotify pass supplies
   the halftone. Declares fg/mid/bg depth, walkable zone, door thresholds,
   occlusion layers, placement + camera anchors, and alternate states.
   Atlas: OD-B07-S02 — bronze-walled royal complex: golden double doors, silver
   door-posts, a great living hall with a central hearth, a guest route running
   from the threshold to the royal thrones, gleaming metal surfaces. */
import { makePen, toneSolid, inkLevel, INK, ACCENT, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const params = {
  floorLevel:0.70,      // horizon / floor line as fraction of H
  bronzeSeams:9,        // vertical plating seams across the bronze back wall
  doors:true,           // golden double doors, center back
  posts:true,           // silver door-posts flanking the doors
  hearth:true,          // central living-hall hearth
  thrones:2,            // royal seats flanking (king + queen)
  sideSeats:3,          // lower lords' benches receding down each side wall
};

/* draw a subset of layers so scene state can reveal/occlude depth + light */
function drawSet(ctx, W, H, st){
  const pen = makePen(ctx, { outline:true });
  const g = ctx;
  const horizon = H*params.floorLevel;
  const T = st.t || 0;
  // fire: 0 = banked embers, 1 = full living flame on the central hearth
  const fire = st.fire != null ? st.fire : 0.7;
  // gleam: brightness of the bronze/gold/silver metal surfaces (0.5 dim .. 1 lit)
  const gleam = st.gleam != null ? st.gleam : 0.8;
  const layers = st.layers || ["backwall","frieze","sidewalls","posts","doors","floor","guestroute","sideseats","thrones","hearth","anchors"];
  const has = l => layers.includes(l);
  const cx = W*0.5;

  // ---- BACK WALL — bronze plating (mid tone, brighter with gleam) ----
  if (has("backwall")){
    const wallTone = Math.round(lerp(4.0, 3.0, clamp(gleam,0,1)));
    pen.paint(()=>{ g.rect(W*0.05, H*0.11, W*0.90, horizon-H*0.11); }, toneSolid(inkLevel(wallTone)), 5);
    // vertical plating seams — reads as riveted bronze panels
    const n=params.bronzeSeams;
    for(let i=1;i<n;i++){ const sx=W*0.05 + (W*0.90)*(i/n);
      pen.ink(()=>{ g.moveTo(sx, H*0.13); g.lineTo(sx, horizon); }, 2); }
    // a bright sheen band low on the wall (gleaming metal highlight)
    pen.paint(()=>{ g.rect(W*0.05, horizon-H*0.09, W*0.90, H*0.03); }, toneSolid(inkLevel(2)), 3);
  }

  // ---- FRIEZE / cornice band along the top of the bronze wall ----
  if (has("frieze")){
    pen.paint(()=>{ g.rect(W*0.03, H*0.06, W*0.94, H*0.055); }, toneSolid(inkLevel(5)), 5);
    // dentil marks across the frieze
    for(let i=0;i<26;i++){ const dx=W*0.05 + (W*0.90)*(i/25);
      pen.ink(()=>{ g.moveTo(dx, H*0.075); g.lineTo(dx, H*0.10); }, 2); }
    pen.ink(()=>{ g.moveTo(W*0.03, H*0.115); g.lineTo(W*0.97, H*0.115); }, 3);
  }

  // ---- SIDE WALLS — receding bronze walls that frame the hall depth ----
  if (has("sidewalls")){
    // left
    pen.paint(()=>{
      g.moveTo(0, H*0.06); g.lineTo(W*0.05, H*0.11);
      g.lineTo(W*0.05, horizon); g.lineTo(0, horizon+H*0.06); g.closePath();
    }, toneSolid(inkLevel(3)), 4);
    // right
    pen.paint(()=>{
      g.moveTo(W, H*0.06); g.lineTo(W*0.95, H*0.11);
      g.lineTo(W*0.95, horizon); g.lineTo(W, horizon+H*0.06); g.closePath();
    }, toneSolid(inkLevel(3)), 4);
  }

  // ---- SILVER DOOR-POSTS flanking the golden doors (light, gleaming) ----
  const dw=W*0.20, dh=H*0.42, dTop=horizon-dh;
  if (has("posts") && params.posts){
    const postTone = Math.round(lerp(3.0, 1.0, clamp(gleam,0,1)));
    const pw=W*0.035;
    for(const px of [cx-dw/2-pw*0.6, cx+dw/2+pw*0.6]){
      // shaft
      pen.paint(()=>{ g.rect(px-pw/2, dTop-H*0.02, pw, dh+H*0.02); }, toneSolid(inkLevel(postTone)), 5);
      // capital
      pen.paint(()=>{ g.rect(px-pw*0.9, dTop-H*0.04, pw*1.8, H*0.028); }, toneSolid(inkLevel(2)), 4);
      // base plinth
      pen.paint(()=>{ g.rect(px-pw*0.85, horizon-H*0.03, pw*1.7, H*0.03); }, toneSolid(inkLevel(4)), 4);
      // highlight groove down the shaft
      pen.ink(()=>{ g.moveTo(px, dTop); g.lineTo(px, horizon-H*0.03); }, 2);
    }
    // silver lintel spanning the posts, above the doors
    pen.paint(()=>{ g.rect(cx-dw/2-pw*1.1, dTop-H*0.055, dw+pw*2.2, H*0.045); }, toneSolid(inkLevel(2)), 5);
  }

  // ---- GOLDEN DOUBLE DOORS in the back wall, center ----
  if (has("doors") && params.doors){
    const doorTone = Math.round(lerp(4.0, 2.0, clamp(gleam,0,1))); // gold gleams brighter with light
    // recessed dark reveal behind the leaves
    pen.paint(()=>{ g.rect(cx-dw/2, dTop, dw, dh); }, toneSolid(inkLevel(6)), 4);
    const leafW=dw*0.47, gap=dw*0.03;
    for(const sgn of [-1,1]){
      const lx = cx + sgn*(gap/2) + (sgn<0 ? -leafW : 0);
      // door leaf (golden, gleaming)
      pen.paint(()=>{ g.rect(lx, dTop+H*0.008, leafW, dh-H*0.016); }, toneSolid(inkLevel(doorTone)), 5);
      // recessed panels on each leaf (two per leaf)
      for(let r=0;r<2;r++){
        const py = dTop+H*0.02 + r*(dh*0.46);
        pen.paint(()=>{ g.rect(lx+leafW*0.16, py, leafW*0.68, dh*0.40); }, toneSolid(inkLevel(doorTone+1)), 3);
      }
      // ring handle near the center seam
      const hx = cx + sgn*gap*1.2 + sgn*leafW*0.10;
      pen.ink(()=>{ g.ellipse(hx, horizon-dh*0.42, W*0.014, W*0.014, 0, 0, 7); }, 3);
    }
    // center seam between the two leaves
    pen.ink(()=>{ g.moveTo(cx, dTop+H*0.008); g.lineTo(cx, horizon-H*0.01); }, 3);
    // threshold bar on the floor
    pen.ink(()=>{ g.moveTo(cx-dw/2-W*0.02, horizon); g.lineTo(cx+dw/2+W*0.02, horizon); }, 4);
  }

  // ---- FLOOR (foreground, light so it reads as polished ground) ----
  if (has("floor")){
    g.fillStyle=inkLevel(2); g.fillRect(0,horizon,W,H-horizon);
    // recede lines toward the doors (vanishing at hall center)
    g.strokeStyle=INK; g.lineWidth=2; g.globalAlpha=0.30;
    for(let i=-6;i<=6;i++){ g.beginPath(); g.moveTo(cx, horizon); g.lineTo(cx+i*W*0.15, H); g.stroke(); }
    for(let j=1;j<=3;j++){ const y=horizon+(H-horizon)*(j/3)*(j/3); g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    g.globalAlpha=1;
  }

  // ---- GUEST ROUTE — a paved runner from the threshold to the thrones ----
  if (has("guestroute")){
    // trapezoid runner widening toward the viewer (perspective)
    pen.paint(()=>{
      g.moveTo(cx-W*0.06, horizon);
      g.lineTo(cx+W*0.06, horizon);
      g.lineTo(cx+W*0.21, H*0.985);
      g.lineTo(cx-W*0.21, H*0.985);
      g.closePath();
    }, toneSolid(inkLevel(3)), 3);
    // border seams of the runner
    pen.ink(()=>{ g.moveTo(cx-W*0.06, horizon); g.lineTo(cx-W*0.21, H*0.985); }, 3);
    pen.ink(()=>{ g.moveTo(cx+W*0.06, horizon); g.lineTo(cx+W*0.21, H*0.985); }, 3);
    // paving cross-bars along the route
    for(let j=1;j<=4;j++){
      const p=j/5, y=lerp(horizon, H*0.985, p*p);
      const halfw=lerp(W*0.06, W*0.21, p*p);
      pen.ink(()=>{ g.moveTo(cx-halfw, y); g.lineTo(cx+halfw, y); }, 2);
    }
  }

  // ---- SIDE SEATS — lords' benches receding along each side wall ----
  if (has("sideseats") && params.sideseats){
    const n=params.sideseats;
    for(const sgn of [-1,1]){
      for(let i=0;i<n;i++){
        const depth=i/(n-1);                          // 0 near .. ~1 toward back
        const bx = cx + sgn*(W*0.34 - depth*W*0.10);
        const by = horizon + H*0.06 - depth*H*0.075;
        const bw = W*0.085*(1-depth*0.35), bh = H*0.045*(1-depth*0.30);
        // seat block
        pen.paint(()=>{ g.rect(bx-bw/2, by-bh, bw, bh); }, toneSolid(inkLevel(4)), 4);
        // low back
        pen.paint(()=>{ g.rect(bx-bw/2, by-bh-bh*0.9, bw, bh*0.9); }, toneSolid(inkLevel(5)), 3);
      }
    }
  }

  // ---- ROYAL THRONES flanking the hearth (king + queen seats, on the dais) ----
  if (has("thrones") && params.thrones){
    const tw=W*0.13, th=H*0.20;
    for(const sgn of [-1,1]){
      const tx = cx + sgn*W*0.245;
      const ty = horizon + H*0.05;                    // seated on the near dais
      // tall seat back (mid tone so it reads as furniture, not a void)
      pen.paint(()=>{ g.rect(tx-tw/2, ty-th, tw, th*0.78); }, toneSolid(inkLevel(4)), 5);
      // triangular pediment crest atop the back
      pen.paint(()=>{ g.moveTo(tx-tw*0.5, ty-th); g.lineTo(tx, ty-th-H*0.035); g.lineTo(tx+tw*0.5, ty-th); g.closePath(); }, toneSolid(inkLevel(5)), 4);
      // bright inlay stripe up the seat back (gleaming metal)
      pen.paint(()=>{ g.rect(tx-tw*0.11, ty-th+H*0.015, tw*0.22, th*0.52); }, toneSolid(inkLevel(2)), 3);
      // seat cushion block (lighter top face)
      pen.paint(()=>{ g.rect(tx-tw*0.56, ty-th*0.14, tw*1.12, th*0.30); }, toneSolid(inkLevel(3)), 5);
      // arms
      pen.paint(()=>{ g.rect(tx-tw*0.56, ty-th*0.20, tw*0.15, th*0.44); }, toneSolid(inkLevel(5)), 4);
      pen.paint(()=>{ g.rect(tx+tw*0.41, ty-th*0.20, tw*0.15, th*0.44); }, toneSolid(inkLevel(5)), 4);
      // front legs
      pen.paint(()=>{ g.rect(tx-tw*0.50, ty+th*0.16, tw*0.10, th*0.16); }, toneSolid(inkLevel(6)), 3);
      pen.paint(()=>{ g.rect(tx+tw*0.40, ty+th*0.16, tw*0.10, th*0.16); }, toneSolid(inkLevel(6)), 3);
    }
  }

  // ---- CENTRAL HEARTH — the great living-hall fire (foreground-mid) ----
  if (has("hearth") && params.hearth){
    const hx=cx, hy=horizon+H*0.13, hr=W*0.145;
    // low circular stone kerb of the hearth (broad, foreshortened, front lip)
    pen.paint(()=>{ g.ellipse(hx, hy+hr*0.16, hr, hr*0.40, 0, 0, 7); }, toneSolid(inkLevel(4)), 5);
    // stone basin rim (elliptical top)
    pen.paint(()=>{ g.ellipse(hx, hy, hr*0.86, hr*0.34, 0, 0, 7); }, toneSolid(inkLevel(5)), 4);
    // dark inner bowl of coals
    pen.paint(()=>{ g.ellipse(hx, hy, hr*0.62, hr*0.24, 0, 0, 7); }, toneSolid(inkLevel(6)), 3);
    // FLAME tongues rising from the bowl. Filled in light tone with NO hard
    // contour, so the halftone reads them as bright fire (not a dark plume).
    const flames=5;
    for(let i=0;i<flames;i++){
      const fx = hx + (i-(flames-1)/2)*hr*0.24;
      const flick = 0.75 + 0.35*Math.sin(T*3.0 + i*1.7);
      const fh = hr*(0.28 + 0.42*fire)*flick;
      const fw = hr*0.13;
      const tone = i===Math.floor(flames/2) ? 1 : 2;   // brightest at center
      pen.fillPath(()=>{
        g.moveTo(fx-fw, hy-hr*0.06);
        g.quadraticCurveTo(fx-fw*0.5, hy-fh*0.6, fx, hy-fh);
        g.quadraticCurveTo(fx+fw*0.5, hy-fh*0.6, fx+fw, hy-hr*0.06);
        g.quadraticCurveTo(fx, hy-hr*0.24, fx-fw, hy-hr*0.06);
        g.closePath();
      }, inkLevel(tone));
    }
    // faint contour just at the flame roots so the fire ties to the coals
    pen.ink(()=>{ g.moveTo(hx-hr*0.5, hy-hr*0.06); g.lineTo(hx+hr*0.5, hy-hr*0.06); }, 2);
  }
}

export const asset = {
  id:"location.alcinouss-palace",
  type:"LOCATION",
  name:"Alcinous's Palace",
  statusWord:"SPLENDID",
  scene:"OD-B07-S02",

  params,
  // back -> front draw order the set honors; scene state can pass a subset
  layers:["backwall","frieze","sidewalls","posts","doors","thrones","sideseats","floor","guestroute","hearth","anchors"],
  // normalized 0..1 placement / camera anchors (NOT baked characters)
  anchors:{
    "throne:alcinous":{x:.34,y:.66}, "throne:arete":{x:.66,y:.66},
    "doors:golden":{x:.50,y:.55}, "post:silver-left":{x:.37,y:.55}, "post:silver-right":{x:.63,y:.55},
    "hearth:central":{x:.50,y:.82}, "seat:lords-left":{x:.14,y:.72}, "seat:lords-right":{x:.86,y:.72},
    "route:guest-arrival":{x:.50,y:.95}, "route:guest-stand":{x:.50,y:.76},
    "threshold:doors":{x:.50,y:.70}, "entrance:doors":{x:.50,y:.70}, "exit:doors":{x:.50,y:.70},
    "camera:wide":{x:.50,y:.50}, "camera:thrones":{x:.50,y:.62}, "camera:hearth":{x:.50,y:.80},
  },
  // walkable ground region (for scene placement / pathing) + sub-zones
  zones:{
    walkable:{ x0:.08,y0:.70,x1:.92,y1:.98 },
    "guest-route":{ x0:.35,y0:.70,x1:.65,y1:.98 },
    "hearth-ring":{ x0:.38,y0:.74,x1:.62,y1:.92 },
    "throne-dais":{ x0:.26,y0:.62,x1:.74,y1:.72 },
  },
  states:{
    initial:"hall-of-welcome",
    nodes:{
      "hall-of-welcome":{ preview:{ layers:["backwall","frieze","sidewalls","posts","doors","thrones","sideseats","floor","guestroute","hearth"], fire:0.75, gleam:0.85 } },
      "doors-open":{ preview:{ layers:["backwall","frieze","sidewalls","posts","thrones","sideseats","floor","guestroute","hearth"], fire:0.7, gleam:0.9 } },
      "embers-low":{ preview:{ layers:["backwall","frieze","sidewalls","posts","doors","thrones","sideseats","floor","guestroute","hearth"], fire:0.2, gleam:0.55 } },
    },
    edges:[["hall-of-welcome","doors-open"],["hall-of-welcome","embers-low"],["doors-open","hall-of-welcome"]],
  },
  channels:["fire","gleam","reveal","camera","light","t"],

  preview:()=>({ layers:["backwall","frieze","sidewalls","posts","doors","thrones","sideseats","floor","guestroute","hearth"], fire:0.8, gleam:0.85, t:0.6, status:"SPLENDID", progress:.22 }),
  draw(ctx,W,H,state){ drawSet(ctx,W,H,state); return { anchors:asset.anchors, zones:asset.zones }; },
};
export default asset;
