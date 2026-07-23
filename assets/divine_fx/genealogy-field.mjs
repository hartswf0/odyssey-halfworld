/* divine_fx.genealogy-field — the recited bloodlines of the famous women, drawn
   as a faint kinship-line network. DIVINE_FX asset.
   Scene function (OD-B11-S05): in the underworld each heroine names herself by her
   descent — mother, father, the god who lay with her, the sons she bore, the deaths
   that took them. The recollection surfaces as a FIELD of tiny figure-nodes linked
   by lineage lines, with small glyphs pinned to the lines: a BIRTH sprout, a DEATH
   cross, a DIVINE-ENCOUNTER spark where a god crosses a mortal line. No heavy text —
   the network itself is the genealogy.

   Procedural DIVINE_FX: SOURCE (the speaking heroine, a crisp node at the base from
   which her line is recited) -> FIELD (the whole deterministic kinship graph surfaces,
   generation by generation, ancestors upward) -> TRANSFORM (one bloodline from the
   speaker up to a divine ancestor is traced and emphasised, a token walking it) ->
   visible CONSEQUENCE (the line to the god lights, its birth/death/encounter glyphs
   pulse). Animate everything over state.t.

   Drawn in SOLID grays + hard black contour (engine primitives only); the engine POST
   pass supplies the dot-matrix halftone. Do NOT pre-dither. The network is drawn at
   LOW ink so it reads as faint recollection; only the source node + the traced
   bloodline carry a hard, crisp mark. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "/engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);
const frac = x => x - Math.floor(x);
const pr = (i,s=1)=> frac(Math.sin(i*12.9898 + s*78.233)*43758.5453);

/* generational tiers, ancestors (divine) at top -> speaker at the base.
   counts read top(2 gods) .. down to the mortal generations. */
const TIERS = [2,3,4,3];           // node counts per ancestral tier
const params = {
  tiers:TIERS,
  tierY:[0.135,0.335,0.535,0.735], // y of each tier (frac of H)
  speakerY:0.905,                  // the reciting heroine at the base
  spread:[0.20,0.80],              // x-range the tiers fan across
  glyphPulse:2.0,
};

/* ---- deterministic kinship graph: nodes (figures) + lineage edges ----
   Built once per draw from fixed seeds so the field is stable & legible. */
function buildGraph(W,H){
  const nodes=[]; // {x,y,tier,divine,glyph}
  const idxByTier=[];
  for(let t=0;t<TIERS.length;t++){
    const c=TIERS[t]; const row=[]; const y=params.tierY[t]*H;
    for(let i=0;i<c;i++){
      const jit=(pr(t*7+i,3)-0.5)*W*0.04;
      const x=lerp(params.spread[0],params.spread[1],(i+0.5)/c)*W + jit;
      const divine = (t===0);                                   // top tier = gods
      // glyph: gods carry a divine-encounter mark; mortals a birth or death event
      let glyph=null;
      if(divine) glyph="divine";
      else { const r=pr(t*11+i,5); glyph = r<0.34?"birth" : r>0.72?"death" : null; }
      const n={x,y,tier:t,idx:i,divine,glyph};
      nodes.push(n); row.push(nodes.length-1);
    }
    idxByTier.push(row);
  }
  // speaker node (source) at the base
  const spk={x:W*0.5,y:params.speakerY*H,tier:TIERS.length,idx:0,divine:false,glyph:"speaker"};
  nodes.push(spk); const spkIdx=nodes.length-1;
  idxByTier.push([spkIdx]);

  // edges: each node links up to 1-2 nearest parents in the tier above (lineage)
  const edges=[];
  const connect=(childRow,parentRow,seedBase)=>{
    for(const ci of childRow){
      const c=nodes[ci];
      // sort parents by horizontal proximity
      const sorted=[...parentRow].sort((a,b)=>Math.abs(nodes[a].x-c.x)-Math.abs(nodes[b].x-c.x));
      const nParents = 1 + (pr(ci,seedBase)>0.55?1:0);
      for(let k=0;k<Math.min(nParents,sorted.length);k++){
        const pi=sorted[k];
        const divineLink = nodes[pi].divine;                    // a god crossing the line
        edges.push({a:pi,b:ci,divine:divineLink});
      }
    }
  };
  for(let t=1;t<TIERS.length;t++) connect(idxByTier[t], idxByTier[t-1], t*3+1);
  connect([spkIdx], idxByTier[TIERS.length-1], 99);            // speaker -> her parents

  // highlighted bloodline: speaker -> first parent -> ... -> a divine ancestor
  const path=[spkIdx];
  let cur=spkIdx;
  for(let guard=0; guard<TIERS.length+1; guard++){
    const up=edges.filter(e=>e.b===cur).map(e=>e.a);
    if(!up.length) break;
    // prefer a parent that eventually reaches the gods: pick the one highest (smallest tier)
    up.sort((a,b)=>nodes[a].tier-nodes[b].tier || Math.abs(nodes[a].x-nodes[cur].x)-Math.abs(nodes[b].x-nodes[cur].x));
    cur=up[0]; path.push(cur);
    if(nodes[cur].divine) break;
  }
  return {nodes,edges,path,spkIdx,idxByTier};
}

/* ---- a lineage line between two node chests, gently bowed ---- */
function lineage(g,a,b,lw,inkL){
  const mx=(a.x+b.x)/2, my=(a.y+b.y)/2 - Math.abs(a.x-b.x)*0.10;
  g.strokeStyle=inkLevel(inkL); g.lineWidth=lw; g.lineCap="round";
  g.beginPath(); g.moveTo(a.x,a.y); g.quadraticCurveTo(mx,my,b.x,b.y); g.stroke();
}

/* ---- a tiny standing figure silhouette centred on its chest point ---- */
function figure(g,x,y,s,fillL,crisp){
  const edge = crisp ? null : inkLevel(clamp(fillL+2,1,7));
  // robe body — tapered trapezoid, chest at (x,y)
  g.beginPath();
  g.moveTo(x-s*0.34, y-s*0.20);
  g.quadraticCurveTo(x-s*0.62, y+s*1.3, x-s*0.80, y+s*2.1);
  g.lineTo(x+s*0.80, y+s*2.1);
  g.quadraticCurveTo(x+s*0.62, y+s*1.3, x+s*0.34, y-s*0.20);
  g.closePath();
  g.fillStyle=inkLevel(fillL); g.fill();
  if(crisp){ g.strokeStyle=INK; g.lineWidth=Math.max(2,s*0.16); } else { g.strokeStyle=edge; g.lineWidth=1.4; }
  g.lineJoin="round"; g.stroke();
  // head
  g.beginPath(); g.arc(x, y-s*0.95, s*0.52, 0, TAU);
  g.fillStyle=inkLevel(fillL); g.fill();
  if(crisp){ g.strokeStyle=INK; g.lineWidth=Math.max(2,s*0.16); } else { g.strokeStyle=edge; g.lineWidth=1.4; }
  g.stroke();
}

/* ---- glyphs pinned to the lineage: BIRTH sprout / DEATH cross / DIVINE spark ---- */
function birthGlyph(g,x,y,s,inkL){                 // a seedling rising from a dot
  g.strokeStyle=inkLevel(inkL); g.lineWidth=Math.max(1.6,s*0.16); g.lineCap="round";
  g.beginPath(); g.moveTo(x,y+s*0.5); g.lineTo(x,y-s*0.35); g.stroke();
  g.beginPath(); g.moveTo(x,y-s*0.05); g.quadraticCurveTo(x-s*0.6,y-s*0.2,x-s*0.55,y-s*0.7); g.stroke();
  g.beginPath(); g.moveTo(x,y-s*0.05); g.quadraticCurveTo(x+s*0.6,y-s*0.2,x+s*0.55,y-s*0.7); g.stroke();
  g.fillStyle=inkLevel(clamp(inkL+1,1,7)); g.beginPath(); g.arc(x,y+s*0.55,s*0.18,0,TAU); g.fill();
}
function deathGlyph(g,x,y,s,inkL){                 // a small upright cross / grave mark
  g.strokeStyle=inkLevel(inkL); g.lineWidth=Math.max(1.6,s*0.18); g.lineCap="round";
  g.beginPath(); g.moveTo(x,y-s*0.55); g.lineTo(x,y+s*0.6); g.stroke();
  g.beginPath(); g.moveTo(x-s*0.42,y-s*0.18); g.lineTo(x+s*0.42,y-s*0.18); g.stroke();
}
function divineSpark(g,x,y,s,inkL,t){              // a radiant asterisk (a god's touch)
  g.strokeStyle=inkLevel(inkL); g.lineWidth=Math.max(1.4,s*0.14); g.lineCap="round";
  const rot=t*0.4;
  for(let k=0;k<6;k++){ const a=rot+k/6*TAU; const r0=s*0.18, r1=s*0.78;
    g.beginPath(); g.moveTo(x+Math.cos(a)*r0,y+Math.sin(a)*r0); g.lineTo(x+Math.cos(a)*r1,y+Math.sin(a)*r1); g.stroke(); }
  g.fillStyle=inkLevel(clamp(inkL+1,1,7)); g.beginPath(); g.arc(x,y,s*0.20,0,TAU); g.fill();
}

/* ---- a divine ancestor's halo (rays around the god figure) ---- */
function halo(g,x,y,s,inkL,t){
  g.strokeStyle=inkLevel(inkL); g.lineCap="round";
  for(let k=0;k<10;k++){ const a=t*0.15+k/10*TAU; const r0=s*1.1, r1=s*(1.55+0.14*Math.sin(t*2+k));
    g.lineWidth=Math.max(1.2,s*0.12);
    g.beginPath(); g.moveTo(x+Math.cos(a)*r0,y-s*0.5+Math.sin(a)*r0); g.lineTo(x+Math.cos(a)*r1,y-s*0.5+Math.sin(a)*r1); g.stroke(); }
}

function drawFX(ctx,W,H,st){
  const pen=makePen(ctx,{outline:true});
  const g=ctx;
  const t=st.t ?? 0;
  const layers=st.layers || ["field","edges","figures","glyphs","highlight","source","token"];
  const has=l=>layers.includes(l);
  const traced = st.traced!==false;                  // whether the bloodline is emphasised
  const revealT = clamp01(st.reveal ?? 1);           // 0..1 how far the field has surfaced

  const {nodes,edges,path,spkIdx}=buildGraph(W,H);
  const nodeS=W*0.030;                               // figure scale
  const pathSet=new Set(); for(let i=0;i<path.length-1;i++){} // edges on path resolved below
  const onPath=(a,b)=>{ for(let i=0;i<path.length-1;i++){ if((path[i]===a&&path[i+1]===b)||(path[i]===b&&path[i+1]===a)) return true; } return false; };
  const nodeOnPath=i=>path.includes(i);

  // reveal a node once the recollection has surfaced its generation (ancestors last)
  const nodeReveal=n=>{
    if(n.tier>=TIERS.length) return 1;               // speaker always present
    const depth=1 - n.tier/TIERS.length;             // near speaker reveals first
    return clamp01((revealT - (1-depth)*0.85)/0.15);
  };

  // ---- FIELD wash (light) so the diagram sits on paper ----
  if(has("field")){ g.fillStyle=inkLevel(1); g.fillRect(0,0,W,H); }

  // ---- lineage EDGES (faint network; path edges brighter when traced) ----
  if(has("edges")){
    for(const e of edges){
      const A=nodes[e.a], B=nodes[e.b];
      const rv=Math.min(nodeReveal(A),nodeReveal(B)); if(rv<=0.02) continue;
      const hot = traced && onPath(e.a,e.b);
      const baseL = e.divine?3:2;
      const inkL = hot?5:clamp(Math.round(baseL*rv+1),1,4);
      const lw = (hot?Math.max(3,W*0.006):Math.max(1.6,W*0.004));
      g.save(); g.globalAlpha=hot?1:0.55+0.4*rv;
      lineage(g,A,B,lw,inkL);
      g.restore();
    }
  }

  // ---- FIGURES (the named ancestors), ancestors faint, gods haloed ----
  if(has("figures")){
    for(let i=0;i<nodes.length;i++){
      const n=nodes[i]; if(n.tier>=TIERS.length) continue;    // speaker drawn as source
      const rv=nodeReveal(n); if(rv<=0.02) continue;
      const hot = traced && nodeOnPath(i);
      const fillL = hot?5:clamp(Math.round(2*rv+1),1,4);
      if(n.divine) halo(g,n.x,n.y,nodeS*1.15,hot?4:clamp(Math.round(2*rv+1),1,4), t + i);
      g.save(); g.globalAlpha=0.5+0.5*rv;
      figure(g,n.x,n.y,nodeS,fillL, hot);
      g.restore();
    }
  }

  // ---- GLYPHS pinned to lines: birth / death on nodes, divine spark on god-edges ----
  if(has("glyphs")){
    const pulse=0.5+0.5*Math.sin(t*params.glyphPulse);
    for(let i=0;i<nodes.length;i++){
      const n=nodes[i]; if(n.tier>=TIERS.length) continue;
      const rv=nodeReveal(n); if(rv<0.5) continue;
      const hot = traced && nodeOnPath(i);
      const gi = hot?clamp(5+Math.round(pulse),4,6):4;
      const gs = nodeS*1.15;
      if(n.glyph==="birth") birthGlyph(g,n.x - nodeS*1.45, n.y - nodeS*0.2, gs, gi);
      else if(n.glyph==="death") deathGlyph(g,n.x + nodeS*1.45, n.y - nodeS*0.2, gs, gi);
    }
    // divine-encounter sparks at the midpoint of god->mortal edges
    for(const e of edges){
      if(!e.divine) continue;
      const A=nodes[e.a], B=nodes[e.b];
      const rv=Math.min(nodeReveal(A),nodeReveal(B)); if(rv<0.5) continue;
      const hot = traced && onPath(e.a,e.b);
      const mx=(A.x+B.x)/2, my=(A.y+B.y)/2 - Math.abs(A.x-B.x)*0.10;
      divineSpark(g,mx,my,nodeS*1.2, hot?clamp(5+Math.round(pulse),4,6):4, t);
    }
  }

  // ---- HIGHLIGHT: a crisp emphasis pass on the traced bloodline nodes ----
  if(has("highlight") && traced){
    // a soft halo ring behind each path node so the line reads through the field
    for(const i of path){
      const n=nodes[i]; if(n.tier>=TIERS.length) continue;
      g.strokeStyle=inkLevel(4); g.lineWidth=2; g.globalAlpha=0.5;
      g.beginPath(); g.arc(n.x,n.y,nodeS*1.7,0,TAU); g.stroke(); g.globalAlpha=1;
    }
  }

  // ---- SOURCE: the reciting heroine at the base, the one crisp anchor mark ----
  if(has("source")){
    const S=nodes[spkIdx];
    const pulse=0.5+0.5*Math.sin(t*2.2);
    // radiating recollection arcs sweeping UP into the ancestral field
    for(let k=0;k<4;k++){ const r=W*0.055+k*W*0.05+pulse*W*0.01*(k+1);
      g.strokeStyle=inkLevel(clamp(4-k,1,4)); g.lineWidth=lerp(3.2,1.4,k/4); g.lineCap="round";
      g.beginPath(); g.ellipse(S.x,S.y-nodeS*0.6,r,r*0.85,0,Math.PI*1.12,Math.PI*1.88); g.stroke(); }
    // the heroine — a crisp figure, larger, the diagram's anchor
    figure(g,S.x,S.y,nodeS*1.35,6,true);
  }

  // ---- TOKEN: walks the traced bloodline from speaker up to the god ----
  if(has("token") && traced && path.length>1){
    const seg=(path.length-1);
    const p=clamp01(t*0.35)%1;                        // loop the walk slowly
    const f=p*seg; const i=Math.min(Math.floor(f),seg-1); const k=f-i;
    const A=nodes[path[i]], B=nodes[path[i+1]];
    const mx=(A.x+B.x)/2, my=(A.y+B.y)/2 - Math.abs(A.x-B.x)*0.10;
    // quadratic point
    const u=1-k; const px=u*u*A.x+2*u*k*mx+k*k*B.x, py=u*u*A.y+2*u*k*my+k*k*B.y;
    g.fillStyle=inkLevel(0); g.beginPath(); g.arc(px,py,W*0.018,0,TAU); g.fill();
    g.fillStyle=INK; g.beginPath(); g.arc(px,py,W*0.011,0,TAU); g.fill();
  }

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.genealogy-field",
  type:"DIVINE_FX",
  name:"Genealogy field",
  statusWord:"DESCENDED",
  scene:"OD-B11-S05",

  params,
  // back -> front draw order the effect honors; scene state can pass a subset
  layers:["field","edges","figures","glyphs","highlight","source","token"],
  // normalized 0..1 source / field-register / ancestor anchors
  anchors:{
    "source:speaker":{ x:0.50, y:0.905 },   // the reciting heroine (source)
    "field:gods":{     x:0.50, y:0.135 },    // divine ancestors register (top)
    "field:elders":{   x:0.50, y:0.335 },
    "field:parents":{  x:0.50, y:0.535 },
    "field:kin":{      x:0.50, y:0.735 },
    "node:divine-a":{  x:0.20, y:0.135 },    // a god crossing the mortal line
    "node:divine-b":{  x:0.80, y:0.135 },
    "camera:wide":{    x:0.50, y:0.50 },
  },
  // registers of the graph (for scene placement / occlusion)
  zones:{
    ancestral:{ x0:0.06,y0:0.06,x1:0.94,y1:0.44 },
    mortal:{    x0:0.06,y0:0.44,x1:0.94,y1:0.84 },
    speaker:{   x0:0.34,y0:0.84,x1:0.66,y1:0.98 },
  },
  // DIVINE_FX state machine: source recites -> the field surfaces -> one line traced
  states:{
    initial:"field",
    nodes:{
      // source: only the speaker + her radiating recollection, network not yet up
      source:{ traced:false, preview:{ t:0.3, reveal:0.12, traced:false, status:"NAMING", progress:0.10,
        layers:["field","source"] } },
      // field: the whole kinship network surfaces, generations back to the gods
      field:{ preview:{ t:1.6, reveal:1.0, traced:false, status:"DESCENDED", progress:0.55,
        layers:["field","edges","figures","glyphs","source"] } },
      // traced: one bloodline from speaker to a divine ancestor lit + walked
      traced:{ preview:{ t:2.4, reveal:1.0, traced:true, status:"BLOODLINE", progress:1.0,
        layers:["field","edges","figures","glyphs","highlight","source","token"] } },
    },
    edges:[["source","field"],["field","traced"],["traced","field"],["field","source"]],
  },
  duration:6.0,
  // animation channels the runtime can drive over the scene clock
  channels:["t","reveal","traced","pulse"],

  // neutral preview: the full genealogy field surfaced, one bloodline traced.
  preview:()=>({ t:2.4, reveal:1.0, traced:true, status:"BLOODLINE", progress:0.6,
    layers:["field","edges","figures","glyphs","highlight","source","token"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
