/* divine_fx.cretan-life-story-field — the lying tale of "the Cretan", spun as a
   filmstrip of fabricated memories. DIVINE_FX asset.
   Scene function (OD-B14-S03): Odysseus, disguised, feeds Eumaeus a false
   autobiography — born on Crete, fought at Troy, a raid in Egypt, sold into
   slavery, sheltered in Thesprotia, then escaped. The recollection surfaces as
   a FILMSTRIP: a stacked strip of faint modular vignettes, each in a 'narrated'
   frame, every one marked CONSTRUCTED — a hollow flag badge, a dashed caption
   rule where the truth should be, and a ghost double-exposure echo so each scene
   reads as fabricated, unstable, half-invented.

   Procedural DIVINE_FX: SOURCE (the liar's voice, a crisp emitter at the head of
   the strip from which the film unspools) -> FIELD (six vignettes surface as a
   filmstrip, Crete/Troy/Egypt/Slavery/Thesprotia/Escape) -> TRANSFORM (a reading
   playhead sweeps the strip; the cell being narrated NOW brightens & its
   false-tinge pulses) -> visible CONSEQUENCE (constructed badges flag every cell;
   the active memory is asserted while the rest stay ghosted). Animate over t.

   Solid grays + contour into the offscreen ctx; the engine POST pass supplies the
   halftone (do NOT pre-dither). Vignettes are drawn at LOW ink so they read as
   invented recollection; only the source voice + the outer narrated frame carry a
   hard, crisp mark. */
import { makePen, toneSolid, inkLevel, INK, clamp, lerp } from "../../engine/halfworld-engine.mjs";

const TAU = Math.PI*2;
const clamp01 = x => clamp(x,0,1);
const frac = x => x - Math.floor(x);

/* ghost fill: flat gray body + a thin same-family contour so a silhouette holds
   an edge but stays faint under the halftone (never full-black INK). */
function ghost(g, pathFn, fillL, edgeL=fillL+2, lw=2){
  g.beginPath(); pathFn();
  g.fillStyle = inkLevel(clamp(fillL,0,7)); g.fill();
  g.strokeStyle = inkLevel(clamp(edgeL,1,7)); g.lineWidth = lw;
  g.lineJoin="round"; g.lineCap="round"; g.stroke();
}
function stroke(g, pathFn, inkL, lw=2){
  g.strokeStyle = inkLevel(clamp(inkL,1,7)); g.lineWidth = lw; g.lineCap="round"; g.lineJoin="round";
  g.beginPath(); pathFn(); g.stroke();
}

/* the six fabricated vignettes. Each draws a simple silhouette scene into the
   cell interior rect (X,Y,Wc,Hc) at ink base `b`. Kept bold + few-stroke so each
   still reads under the dot-matrix. */
const VIGNETTES = {
  // 1 · CRETE — island hill + a columned palace (Knossos), the claimed birthplace
  crete(g,X,Y,Wc,Hc,b){
    const gY = Y+Hc*0.74;
    ghost(g,()=>{ g.moveTo(X,gY); g.quadraticCurveTo(X+Wc*0.32,gY-Hc*0.34,X+Wc*0.60,gY-Hc*0.10);
      g.quadraticCurveTo(X+Wc*0.82,gY-Hc*0.30,X+Wc,gY); g.lineTo(X+Wc,Y+Hc); g.lineTo(X,Y+Hc); g.closePath(); }, b, b+2, 1.6);
    // palace platform + 3 columns + lintel
    const px=X+Wc*0.30, pw=Wc*0.34, plat=gY-Hc*0.14;
    ghost(g,()=>{ g.rect(px,plat,pw,Hc*0.10); }, b+1, b+2, 1.6);
    for(let i=0;i<3;i++){ const cx=px+pw*(0.18+i*0.32); ghost(g,()=>{ g.rect(cx,plat-Hc*0.22,pw*0.10,Hc*0.22); }, b+1, b+2, 1.4); }
    ghost(g,()=>{ g.rect(px+pw*0.04,plat-Hc*0.30,pw*0.92,Hc*0.09); }, b+1, b+2, 1.4);
    stroke(g,()=>{ g.moveTo(X,gY); g.lineTo(X+Wc,gY); }, b+1, 1.4);
  },
  // 2 · TROY — a crenellated wall + tower, and the wheeled horse outside it
  troy(g,X,Y,Wc,Hc,b){
    const gY=Y+Hc*0.80;
    // wall band (right 55%) with crenellations
    const wx=X+Wc*0.44, wtop=Y+Hc*0.34;
    ghost(g,()=>{ g.rect(wx,wtop,Wc*0.56,gY-wtop); }, b, b+2, 1.6);
    g.fillStyle=inkLevel(clamp(b+1,1,7));
    for(let i=0;i<5;i++){ g.fillRect(wx+Wc*0.03+i*Wc*0.105, wtop-Hc*0.07, Wc*0.055, Hc*0.07); }
    // tower
    ghost(g,()=>{ g.rect(X+Wc*0.80,Y+Hc*0.18,Wc*0.14,gY-(Y+Hc*0.18)); }, b+1, b+2, 1.6);
    // horse on a wheeled platform outside (left)
    const hx=X+Wc*0.16, hy=Y+Hc*0.50, hs=Hc*0.30;
    ghost(g,()=>{ // body
      g.moveTo(hx-hs*0.9,hy); g.quadraticCurveTo(hx-hs*0.9,hy-hs*0.7,hx,hy-hs*0.7);
      g.quadraticCurveTo(hx+hs*0.9,hy-hs*0.7,hx+hs*0.95,hy); g.closePath(); }, b, b+2, 1.5);
    ghost(g,()=>{ g.moveTo(hx+hs*0.8,hy-hs*0.55); g.lineTo(hx+hs*1.35,hy-hs*1.15);
      g.lineTo(hx+hs*1.05,hy-hs*0.45); g.closePath(); }, b, b+2, 1.4); // neck+head
    stroke(g,()=>{ for(let i=-1;i<=1;i+=2){ g.moveTo(hx+i*hs*0.5,hy); g.lineTo(hx+i*hs*0.5,hy+hs*0.5);} }, b+1, 1.6); // legs
    // platform + wheels
    ghost(g,()=>{ g.rect(hx-hs*1.1,hy+hs*0.5,hs*2.3,hs*0.18); }, b+1, b+2, 1.4);
    g.fillStyle=inkLevel(clamp(b+2,1,7));
    g.beginPath(); g.arc(hx-hs*0.7,hy+hs*0.78,hs*0.16,0,TAU); g.fill();
    g.beginPath(); g.arc(hx+hs*0.7,hy+hs*0.78,hs*0.16,0,TAU); g.fill();
    stroke(g,()=>{ g.moveTo(X,gY); g.lineTo(X+Wc,gY); }, b+1, 1.4);
  },
  // 3 · EGYPT — Nile band + reeds + pyramid + a raiding boat bristling with spears
  egypt(g,X,Y,Wc,Hc,b){
    // pyramid on the far bank (right)
    ghost(g,()=>{ g.moveTo(X+Wc*0.72,Y+Hc*0.58); g.lineTo(X+Wc*0.86,Y+Hc*0.22); g.lineTo(X+Wc,Y+Hc*0.58); g.closePath(); }, b, b+2, 1.5);
    // river band (kept light so the active cell never blooms into a solid blob)
    const rY=Y+Hc*0.58;
    g.fillStyle=inkLevel(clamp(b-2,1,7)); g.fillRect(X,rY,Wc,Y+Hc-rY);
    stroke(g,()=>{ for(let k=0;k<3;k++){ const yy=rY+Hc*(0.12+k*0.12); g.moveTo(X,yy);
      for(let x=0;x<=Wc;x+=Wc*0.12) g.lineTo(X+x, yy + Math.sin(x*0.06+k)*Hc*0.02); } }, b+1, 1.2);
    // reeds (left bank)
    stroke(g,()=>{ for(let i=0;i<4;i++){ const x=X+Wc*0.04+i*Wc*0.035; g.moveTo(x,rY); g.lineTo(x-Wc*0.01,rY-Hc*0.22); } }, b+1, 1.6);
    // raiding boat with spears
    const bx=X+Wc*0.34, by=rY+Hc*0.06, bw=Wc*0.30;
    ghost(g,()=>{ g.moveTo(bx,by); g.quadraticCurveTo(bx+bw*0.5,by+Hc*0.14,bx+bw,by);
      g.lineTo(bx+bw*0.86,by-Hc*0.02); g.lineTo(bx+bw*0.10,by-Hc*0.02); g.closePath(); }, b+1, b+2, 1.5);
    stroke(g,()=>{ for(let i=0;i<5;i++){ const x=bx+bw*(0.16+i*0.16); g.moveTo(x,by-Hc*0.02); g.lineTo(x+Hc*0.05,by-Hc*0.24);} }, b+1, 1.6); // spears
  },
  // 4 · SLAVERY — a coffle of bound figures roped at the neck under a driver's staff
  slavery(g,X,Y,Wc,Hc,b){
    const baseY=Y+Hc*0.86, hy=Y+Hc*0.30;
    stroke(g,()=>{ g.moveTo(X+Wc*0.14,hy); g.lineTo(X+Wc*0.70,hy); }, b+1, 1.8); // neck rope
    for(let i=0;i<3;i++){
      const cx=X+Wc*(0.22+i*0.22);
      ghost(g,()=>{ g.moveTo(cx-Wc*0.05,hy+Hc*0.06); g.quadraticCurveTo(cx-Wc*0.09,baseY,cx-Wc*0.10,baseY);
        g.lineTo(cx+Wc*0.10,baseY); g.quadraticCurveTo(cx+Wc*0.09,hy+Hc*0.06,cx+Wc*0.05,hy+Hc*0.06); g.closePath(); }, b, b+2, 1.5);
      ghost(g,()=> g.arc(cx,hy-Hc*0.02,Hc*0.10,0,TAU), b, b+2, 1.5); // bowed head
    }
    // driver's staff (diagonal, right)
    stroke(g,()=>{ g.moveTo(X+Wc*0.80,Y+Hc*0.16); g.lineTo(X+Wc*0.72,baseY); }, b+2, 2.0);
    stroke(g,()=>{ g.moveTo(X+Wc*0.80,Y+Hc*0.16); g.quadraticCurveTo(X+Wc*0.92,Y+Hc*0.20,X+Wc*0.88,Y+Hc*0.34); }, b+2, 1.6);
    stroke(g,()=>{ g.moveTo(X,baseY); g.lineTo(X+Wc,baseY); }, b+1, 1.4);
  },
  // 5 · THESPROTIA — a king's hall (pediment on columns) on a shore, a moored ship
  thesprotia(g,X,Y,Wc,Hc,b){
    const gY=Y+Hc*0.78;
    // hall (right): columns + entablature + pediment
    const hx=X+Wc*0.50, hw=Wc*0.44, top=Y+Hc*0.34;
    for(let i=0;i<4;i++){ const cx=hx+hw*(0.08+i*0.28); ghost(g,()=>{ g.rect(cx,top,hw*0.09,gY-top); }, b, b+2, 1.4); }
    ghost(g,()=>{ g.rect(hx,top-Hc*0.06,hw,Hc*0.06); }, b+1, b+2, 1.4);
    ghost(g,()=>{ g.moveTo(hx-hw*0.04,top-Hc*0.06); g.lineTo(hx+hw*0.5,top-Hc*0.26); g.lineTo(hx+hw*1.04,top-Hc*0.06); g.closePath(); }, b+1, b+2, 1.5);
    // moored ship (left) with furled sail on a raised mast
    const sx=X+Wc*0.10, sy=gY-Hc*0.04, sw=Wc*0.30;
    ghost(g,()=>{ g.moveTo(sx,sy-Hc*0.02); g.quadraticCurveTo(sx+sw*0.5,sy+Hc*0.12,sx+sw,sy-Hc*0.02);
      g.lineTo(sx+sw*0.86,sy-Hc*0.08); g.lineTo(sx+sw*0.12,sy-Hc*0.08); g.closePath(); }, b, b+2, 1.5);
    stroke(g,()=>{ g.moveTo(sx+sw*0.5,sy-Hc*0.08); g.lineTo(sx+sw*0.5,sy-Hc*0.42); }, b+1, 1.8); // mast
    stroke(g,()=>{ g.moveTo(sx+sw*0.30,sy-Hc*0.40); g.lineTo(sx+sw*0.70,sy-Hc*0.40); }, b+1, 1.6); // furled yard
    stroke(g,()=>{ g.moveTo(X,gY); g.lineTo(X+Wc,gY); }, b+1, 1.4); // shore
  },
  // 6 · ESCAPE — a running figure, a snapped rope, a ship departing under full sail
  escape(g,X,Y,Wc,Hc,b){
    const gY=Y+Hc*0.84;
    // running figure (left-of-centre)
    const fx=X+Wc*0.26, fhy=Y+Hc*0.30, fs=Hc*0.42;
    ghost(g,()=>{ g.moveTo(fx-fs*0.16,fhy+fs*0.16); g.lineTo(fx+fs*0.16,fhy+fs*0.16);
      g.lineTo(fx+fs*0.10,fhy+fs*0.62); g.lineTo(fx-fs*0.10,fhy+fs*0.62); g.closePath(); }, b, b+2, 1.5);
    ghost(g,()=> g.arc(fx,fhy,fs*0.20,0,TAU), b, b+2, 1.5); // head
    stroke(g,()=>{ g.moveTo(fx-fs*0.05,gY-fs*0.22); g.lineTo(fx-fs*0.45,gY); }, b+1, 2.0); // back leg
    stroke(g,()=>{ g.moveTo(fx+fs*0.05,gY-fs*0.22); g.lineTo(fx+fs*0.42,gY-fs*0.10); }, b+1, 2.0); // front leg
    stroke(g,()=>{ g.moveTo(fx,fhy+fs*0.28); g.lineTo(fx+fs*0.40,fhy+fs*0.12); }, b+1, 1.8); // arm reaching
    // snapped rope near the wrist (two dangling ends)
    stroke(g,()=>{ g.moveTo(fx-fs*0.16,fhy+fs*0.30); g.quadraticCurveTo(fx-fs*0.30,fhy+fs*0.45,fx-fs*0.22,fhy+fs*0.60); }, b+2, 1.6);
    stroke(g,()=>{ g.moveTo(fx-fs*0.02,fhy+fs*0.30); g.quadraticCurveTo(fx+fs*0.10,fhy+fs*0.46,fx+fs*0.02,fhy+fs*0.58); }, b+2, 1.6);
    // ship departing (right, full sail) + motion dashes
    const sx=X+Wc*0.72, sy=Y+Hc*0.52, sw=Wc*0.26;
    ghost(g,()=>{ g.moveTo(sx,sy); g.quadraticCurveTo(sx+sw*0.5,sy+Hc*0.14,sx+sw,sy);
      g.lineTo(sx+sw*0.84,sy-Hc*0.04); g.lineTo(sx+sw*0.14,sy-Hc*0.04); g.closePath(); }, b, b+2, 1.5);
    stroke(g,()=>{ g.moveTo(sx+sw*0.5,sy-Hc*0.04); g.lineTo(sx+sw*0.5,sy-Hc*0.40); }, b+1, 1.8);
    ghost(g,()=>{ g.moveTo(sx+sw*0.5,sy-Hc*0.38); g.quadraticCurveTo(sx+sw*0.92,sy-Hc*0.26,sx+sw*0.86,sy-Hc*0.06);
      g.quadraticCurveTo(sx+sw*0.66,sy-Hc*0.12,sx+sw*0.5,sy-Hc*0.06); g.closePath(); }, b+1, b+2, 1.4); // sail
    stroke(g,()=>{ for(let k=0;k<3;k++){ const yy=sy-Hc*0.06+k*Hc*0.08; g.moveTo(sx-Wc*0.10,yy); g.lineTo(sx-Wc*0.02,yy);} }, b+1, 1.4); // wake dashes
    stroke(g,()=>{ g.moveTo(X,gY); g.lineTo(X+Wc,gY); }, b+1, 1.4);
  },
};

const ORDER = ["crete","troy","egypt","slavery","thesprotia","escape"];

const params = {
  cells: 6,
  order: ORDER,
  strip: { x0:0.105, y0:0.100, x1:0.895, y1:0.962 }, // filmstrip bounds (frac)
  sprocket: 0.115,   // fraction of strip width reserved for each perforation gutter
  cellGap: 0.012,    // gap between frames (frac of H)
  duration: 8.0,
};

/* ---- FIELD wash so the strip sits on paper ---- */
function drawField(g,W,H){ g.fillStyle=inkLevel(1); g.fillRect(0,0,W,H); }

/* geometry of the filmstrip + its cells (deterministic) */
function layout(W,H){
  const S=params.strip;
  const sx=S.x0*W, sy=S.y0*H, sw=(S.x1-S.x0)*W, sh=(S.y1-S.y0)*H;
  const sprk=sw*params.sprocket;
  const inX=sx+sprk, inW=sw-sprk*2;
  const gap=params.cellGap*H;
  const cellH=(sh-gap*(params.cells+1))/params.cells;
  const cells=[];
  for(let i=0;i<params.cells;i++){
    const cy=sy+gap+i*(cellH+gap);
    cells.push({ x:inX, y:cy, w:inW, h:cellH, cx:inX+inW/2, cy:cy+cellH/2 });
  }
  return { sx,sy,sw,sh,sprk,inX,inW,gap,cellH,cells };
}

/* ---- STRIP: the film base + perforations + the crisp NARRATED outer frame ---- */
function drawStrip(g,W,H,L){
  // film base (mid tone) — the strip body between/around the frames
  g.fillStyle=inkLevel(3); g.fillRect(L.sx,L.sy,L.sw,L.sh);
  // perforations: two columns of light-punched holes down the gutters
  const holeW=L.sprk*0.5, holeH=L.cellH*0.16;
  const rows=params.cells*2;
  for(let r=0;r<rows;r++){
    const hy=L.sy+L.gap+ (r+0.5)*(L.sh-L.gap*2)/rows - holeH/2;
    for(const gx of [L.sx+L.sprk*0.25, L.sx+L.sw-L.sprk*0.75]){
      g.fillStyle=inkLevel(1); g.fillRect(gx,hy,holeW,holeH);
      g.strokeStyle=inkLevel(5); g.lineWidth=1.4; g.strokeRect(gx,hy,holeW,holeH);
    }
  }
  // the NARRATED outer frame — a hard, crisp, DASHED double border (dashed =
  // provisional / reported speech; the one structural anchor of the diagram)
  g.save();
  g.strokeStyle=INK; g.lineWidth=3; g.setLineDash([12,7]); g.lineJoin="miter";
  g.strokeRect(L.sx,L.sy,L.sw,L.sh);
  g.setLineDash([]); g.lineWidth=1.6; g.strokeRect(L.sx-5,L.sy-5,L.sw+10,L.sh+10);
  // corner quotation ticks — this whole account is spoken "in quotes"
  const q=W*0.02;
  for(const [qx,qy,dx,dy] of [[L.sx-5,L.sy-5,1,1],[L.sx+L.sw+5,L.sy-5,-1,1],
                              [L.sx-5,L.sy+L.sh+5,1,-1],[L.sx+L.sw+5,L.sy+L.sh+5,-1,-1]]){
    g.lineWidth=3; g.beginPath();
    g.moveTo(qx,qy+dy*q); g.lineTo(qx,qy); g.lineTo(qx+dx*q,qy); g.stroke();
  }
  g.restore();
}

/* ---- one CELL: light window, per-frame narrated border, and the constructed
   flags (hollow badge + dashed caption rule). `active` brightens; `reveal` gates. */
function drawCell(g,W,H,cell,name,idx,active,revealAmt,t){
  if(revealAmt<=0.02) return;
  const {x,y,w,h}=cell;
  // window interior (light so the vignette reads)
  g.fillStyle=inkLevel(1); g.fillRect(x,y,w,h);
  // per-frame narrated border (dashed = a told, unverified frame)
  g.save();
  g.strokeStyle=inkLevel(active?6:4); g.lineWidth=active?2.4:1.6;
  g.setLineDash(active?[]:[7,5]); g.strokeRect(x+2,y+2,w-4,h-4); g.setLineDash([]);
  g.restore();

  // draft hatch wash on non-active (constructed / not-yet-asserted) cells
  if(!active){
    g.save(); g.globalAlpha=0.5; g.strokeStyle=inkLevel(2); g.lineWidth=1;
    g.beginPath(); for(let d=-h;d<w;d+=Math.max(14,w*0.06)){ g.moveTo(x+d,y); g.lineTo(x+d+h,y+h); } g.stroke();
    g.restore();
  }

  const b = active ? 4 : 2;                       // ink base: asserted vs ghosted
  const draw = VIGNETTES[name] || (()=>{});
  const pad = w*0.03, iX=x+w*0.16, iY=y+h*0.06, iW=w*0.70, iH=h*0.82;

  g.save(); g.beginPath(); g.rect(x+2,y+2,w-4,h-4); g.clip();
  // GHOST double-exposure echo (fabricated / unstable) — a faint offset twin
  const wob = Math.sin(t*1.6+idx)*2;
  g.save(); g.globalAlpha=0.42; g.translate(3+wob*0.6, 2);
  draw(g,iX,iY,iW,iH, Math.max(1,b-2));
  g.restore();
  // the asserted vignette
  draw(g,iX,iY,iW,iH, b);
  g.restore();

  // constructed FLAG badge — a hollow tag with a slash (top-left corner)
  const bxs=x+w*0.045, bys=y+h*0.14, bs=Math.min(w,h)*0.14;
  g.strokeStyle=inkLevel(active?6:4); g.lineWidth=active?2.2:1.6; g.setLineDash([]);
  g.strokeRect(bxs,bys,bs,bs*0.72);
  stroke(g,()=>{ g.moveTo(bxs,bys+bs*0.72); g.lineTo(bxs+bs,bys); }, active?6:4, active?2.2:1.6);
  if(active){ // asserted-now marker: a filled asterisk pulse beside the badge
    const px=bxs+bs*1.5, py=bys+bs*0.36, pr=bs*0.42*(0.8+0.2*Math.sin(t*3));
    g.strokeStyle=INK; g.lineWidth=2;
    for(let k=0;k<4;k++){ const a=t*0.6+k/4*Math.PI; g.beginPath();
      g.moveTo(px-Math.cos(a)*pr,py-Math.sin(a)*pr); g.lineTo(px+Math.cos(a)*pr,py+Math.sin(a)*pr); g.stroke(); }
  }
  // dashed CAPTION rule along the cell base — where a true source would be named,
  // left blank & dashed: this memory is narrated, unattested.
  g.save(); g.strokeStyle=inkLevel(active?5:3); g.lineWidth=1.6; g.setLineDash([9,6]);
  g.beginPath(); g.moveTo(x+w*0.10,y+h*0.90); g.lineTo(x+w*0.90,y+h*0.90); g.stroke();
  g.restore();
}

/* ---- SOURCE: the liar's voice at the head of the strip. A crisp mouth glyph +
   radiating narration arcs + a thin spool thread feeding the film. ---- */
function drawSource(g,W,H,L,t){
  const sx=L.sx+L.sw*0.5, sy=L.sy-H*0.052;
  const pulse=0.5+0.5*Math.sin(t*2.2);
  for(let k=0;k<4;k++){
    const r=W*0.03+k*W*0.028+pulse*W*0.008*(k+1);
    g.strokeStyle=inkLevel(clamp(4-k,1,4)); g.lineWidth=lerp(3.2,1.4,k/4); g.lineCap="round";
    g.beginPath(); g.ellipse(sx,sy,r,r*0.9,0,Math.PI*0.15,Math.PI*0.85); g.stroke();
  }
  // spool thread unspooling down into the strip
  g.strokeStyle=inkLevel(3); g.lineWidth=2; g.setLineDash([5,5]); g.lineDashOffset=-t*14;
  g.beginPath(); g.moveTo(sx,sy+H*0.014); g.lineTo(sx,L.sy); g.stroke(); g.setLineDash([]);
  // crisp mouth/voice glyph — the anchor mark
  const pen=makePen(g,{outline:true});
  pen.paint(()=> g.ellipse(sx,sy,W*0.028,H*0.013,0,0,TAU), toneSolid(inkLevel(6)), 3);
  g.fillStyle=inkLevel(0); g.beginPath(); g.ellipse(sx,sy,W*0.011,H*0.005,0,0,TAU); g.fill();
}

/* ---- PLAYHEAD: a reading bar sweeping down the strip; a triangle index on the
   right gutter points at the cell being narrated NOW. ---- */
function drawPlayhead(g,W,H,L,pos){
  const i=clamp(Math.floor(pos),0,params.cells-1);
  const cell=L.cells[i];
  const y=cell.cy;
  g.save();
  g.strokeStyle=INK; g.lineWidth=2.4; g.setLineDash([3,4]);
  g.beginPath(); g.moveTo(L.sx,y); g.lineTo(L.sx+L.sw,y); g.stroke(); g.setLineDash([]);
  // index triangle on the right gutter
  const tx=L.sx+L.sw-L.sprk*0.5, ty=y;
  g.fillStyle=INK; g.beginPath();
  g.moveTo(tx+L.sprk*0.30,ty); g.lineTo(tx+L.sprk*0.62,ty-L.sprk*0.24); g.lineTo(tx+L.sprk*0.62,ty+L.sprk*0.24); g.closePath(); g.fill();
  g.restore();
}

function drawFX(ctx,W,H,st){
  const g=ctx;
  const t=st.t ?? 0;
  const layers=st.layers || ["field","strip","cells","tinge","playhead","source"];
  const has=l=>layers.includes(l);
  const revealT=clamp01(st.reveal ?? 1);              // 0..1 how much of the tale is told
  const playing = st.playing!==false && has("playhead");
  const pos = (st.playhead!=null) ? st.playhead : frac(t/params.duration)*params.cells;

  const L=layout(W,H);

  if(has("field")) drawField(g,W,H);
  if(has("strip")) drawStrip(g,W,H,L);

  if(has("cells")){
    const activeIdx = playing ? clamp(Math.floor(pos),0,params.cells-1) : -1;
    for(let i=0;i<params.cells;i++){
      // cells reveal top-to-bottom as the story unspools
      const rv = clamp01((revealT*params.cells) - i);
      const active = has("tinge") && (i===activeIdx);
      drawCell(g,W,H,L.cells[i], params.order[i], i, active, rv, t);
    }
  }
  if(playing) drawPlayhead(g,W,H,L,pos);
  if(has("source")) drawSource(g,W,H,L,t);

  return { anchors: asset.anchors };
}

export const asset = {
  id:"divine_fx.cretan-life-story-field",
  type:"DIVINE_FX",
  name:"Cretan life-story field",
  statusWord:"CONSTRUCTED",
  scene:"OD-B14-S03",

  params,
  // back -> front draw order the effect honors; scene state may pass a subset
  layers:["field","strip","cells","tinge","playhead","source"],
  // normalized 0..1 anchors: the liar's voice (source), each vignette cell,
  // and the strip head/foot the film runs between.
  anchors:{
    "source:liar-voice":{ x:0.50, y:0.048 },
    "cell:crete":       { x:0.50, y:0.170 },
    "cell:troy":        { x:0.50, y:0.312 },
    "cell:egypt":       { x:0.50, y:0.454 },
    "cell:slavery":     { x:0.50, y:0.596 },
    "cell:thesprotia":  { x:0.50, y:0.738 },
    "cell:escape":      { x:0.50, y:0.880 },
    "strip:head":       { x:0.50, y:0.100 },
    "strip:foot":       { x:0.50, y:0.962 },
    "camera:wide":      { x:0.50, y:0.520 },
  },
  // registers of the strip (for scene placement / occlusion)
  zones:{
    source:{ x0:0.34,y0:0.00,x1:0.66,y1:0.10 },
    filmstrip:{ x0:0.105,y0:0.10,x1:0.895,y1:0.962 },
    gutters:{ x0:0.105,y0:0.10,x1:0.895,y1:0.962 },
  },
  // DIVINE_FX state machine: source begins -> the constructed field surfaces ->
  // the playhead asserts one fabricated memory at a time.
  states:{
    initial:"field",
    nodes:{
      // unspooling: the voice starts, only the first cells revealed, no playhead
      unspooling:{ playing:false, preview:{ t:0.6, reveal:0.34, playing:false, playhead:0,
        status:"NARRATING", progress:0.14, layers:["field","strip","cells","source"] } },
      // field: the whole constructed filmstrip is up, every cell flagged false
      field:{ playing:false, preview:{ t:1.4, reveal:1.0, playing:false, playhead:0,
        status:"CONSTRUCTED", progress:0.5, layers:["field","strip","cells","tinge","source"] } },
      // narrating: the playhead sweeps, one memory asserted NOW, the rest ghosted
      narrating:{ preview:{ t:3.2, reveal:1.0, playing:true, playhead:2.5,
        status:"FALSE-TINGED", progress:0.85, layers:["field","strip","cells","tinge","playhead","source"] } },
    },
    edges:[["unspooling","field"],["field","narrating"],["narrating","field"],["field","unspooling"]],
  },
  duration: params.duration,
  // animation channels the runtime can drive over the scene clock
  channels:["t","reveal","playhead","playing","tinge"],

  // neutral preview: the constructed filmstrip up, the playhead asserting one cell.
  preview:()=>({ t:3.2, reveal:1.0, playing:true, playhead:2.5,
    status:"FALSE-TINGED", progress:0.6,
    layers:["field","strip","cells","tinge","playhead","source"] }),
  draw(ctx,W,H,state){ return drawFX(ctx,W,H,state||{}); },
};
export default asset;
