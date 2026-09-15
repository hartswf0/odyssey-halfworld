
import {SLOTS,PREFIX,VOCAB,INITIAL,validScore,poem,recipe,cast,encode,decode,ASSETS} from "./house-of-dust-score.mjs";
const $=id=>document.getElementById(id),cv=$("world"),g=cv.getContext("2d",{willReadFrequently:true});
const raw=document.createElement("canvas"),rg=raw.getContext("2d",{willReadFrequently:true});
const PAPER="#f4f1e8",mods=new Map(),past=[];
let E,FACE=null,current=null,busy=false,serial=0,score={...INITIAL},held={},view="room",focus=null;
let t=0,playing=!matchMedia("(prefers-reduced-motion: reduce)").matches,last=0,paint=0,dirty=true,hits=[],pan=0,drag=null;
let lastAction="Change a line. Watch the dwelling change.",failure=null;
const limit=(x,a,b)=>Math.max(a,Math.min(b,x));
const wait=p=>{let timer;return Promise.race([p,new Promise((_,r)=>timer=setTimeout(()=>r(Error("The drawing took too long to load.")),18000))]).finally(()=>clearTimeout(timer));};
function status(s){lastAction=s;$("status").textContent=s;}
function sync(){
 document.body.dataset.ready=String(!!current&&!busy);
 document.body.dataset.recipe=JSON.stringify(current?.recipe||{});
 document.body.dataset.score=JSON.stringify(score);
 document.body.dataset.focus=focus?.id||"";
 document.body.dataset.time=t.toFixed(2);
 SLOTS.forEach(k=>{$(k).value=score[k];$("word-"+k).textContent=VOCAB[k][score[k]].label;$(k).disabled=busy;const b=$("hold-"+k);b.textContent=held[k]?"Held":"Hold";b.setAttribute("aria-pressed",String(!!held[k]));b.disabled=busy;});
 $("cast").disabled=busy||SLOTS.every(k=>held[k]);$("undo").disabled=busy||!past.length;
 $("play").textContent=playing?"Pause":"Play";$("play").setAttribute("aria-pressed",String(playing));
 $("retry").hidden=!failure;$("return").hidden=!focus;$("inspect").hidden=!focus;$("focusName").hidden=!focus;
 $("focusName").textContent=focus?.name||"";$("view").hidden=!!focus;$("view").textContent=view==="room"?"Near":view==="near"?"Whole":"Room";
 if(focus){$("atlas").href="./house-of-dust-atlas.html#scene="+(ASSETS[focus.id].scene||"OD-B01-S04")+"&object="+focus.id;}
 else $("atlas").href="./house-of-dust-atlas.html";
}
function shareState(){try{history.replaceState(null,"",encode(score,held,view));}catch{}}
async function moduleFor(id){
 if(mods.has(id))return mods.get(id);
 if(!ASSETS[id])throw Error("Unknown drawing: "+id);
 const p=wait(import("./"+ASSETS[id].path.replace(/^\//,""))).then(m=>{
  const a=m.default||m.asset;if(typeof a?.draw!=="function")throw Error("Missing drawing: "+id);
  return a;
 }).catch(e=>{mods.delete(id);throw e;});
 mods.set(id,p);return p;
}
function bgState(s,mod){
 const kind=VOCAB.light[s.light].kind;
 const nodes=E.normStateNodes(mod),keys=kind==="fire"?["fire_high","lamplit","night"]:kind==="moon"?["night","night-held"]:["day","dawn","closed"];
 const node=keys.map(k=>nodes.find(n=>n.key===k)).find(Boolean);
 const st={...(mod.preview?.()||{}),...(node?.prev()||{}),t:0,card:false};
 if(mod.layers)st.layers=mod.layers.filter(k=>!/(^loom$|^hearth$|^fire$|^smoke$|^seats$|^bedding$|^bed$|^trunk$|^lamp$|^chest$|^raft$|^light$)/.test(k));
 return st;
}
async function construct(next,{remember=true}={}){
 const ticket=++serial;busy=true;failure=null;sync();status("Composing the four lines…");
 const candidateScore=validScore(next),r=recipe(candidateScore);
 try{
  const ids=[r.setting,...r.objects,...r.inhabitants,...(r.lightAsset?[r.lightAsset]:[])];
  if(r.objects.includes("prop.laertess-shroud-and-loom")&&r.inhabitants.includes("character.penelope"))ids.push("character.penelope-at-the-loom");
  const loaded=await Promise.all(ids.map(async id=>[id,await moduleFor(id)]));
  if(ticket!==serial)return;
  const map=new Map(loaded);
  // Validate every drawing before committing either the poem or the world.
  const test=document.createElement("canvas");test.width=test.height=560;const c=test.getContext("2d");
  for(const [id,m]of loaded){c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,560,560);m.draw(c,560,560,id===r.setting?bgState(candidateScore,m):{...(m.preview?.()||{}),t:0,card:false});}
  if(remember&&current){past.push({score:{...score},held:{...held}});if(past.length>24)past.shift();}
  score=candidateScore;current={recipe:r,map};focus=null;t=0;pan=0;busy=false;dirty=true;
  shareState();sync();status(VOCAB.matter[score.matter].verb);
  render();
 }catch(e){if(ticket===serial){busy=false;failure=()=>construct(candidateScore,{remember});sync();status("Could not compose: "+e.message+" The previous poem and world are kept.");}}
}
function authored(id,key){
 const mod=current.map.get(id),nodes=E.normStateNodes(mod),node=nodes.find(n=>n.key===key);
 return {...(mod.preview?.()||{}),...(node?.prev()||{}),t,card:false};
}
function propState(id,i){
 const phase=(t%16)/16;
 if(id==="prop.laertess-shroud-and-loom")return {...authored(id,score.light===2?"unravel-track":"shuttle"),wovenFrac:score.light===2?.8-phase*.6:.18+phase*.6};
 if(id==="prop.demodocuss-lyre")return authored(id,phase<.15?"tune":phase<.8?"play":"pause");
 if(id==="prop.golden-pitcher-and-silver-basin"){
  const u=(1-Math.cos(phase*Math.PI*2))/2;
  return {...authored(id,"place"),tilt:u*.85,lift:u,fill:u*.75,stream:u>.55?1:0,hand:0};
 }
 if(id==="set-piece.royal-hearth")return {...authored(id,"lit"),layers:["drum","rim","ashbed","fire"],lit:true};
 return authored(id,null);
}
function performer(id,index){
 const part=Math.floor(t/4)%4;
 const key=VOCAB.people[score.people].beats[index][part];
 const state=authored(id,key);
 if(id==="character.penelope"&&score.matter===1)state.pose=score.light===2?"penelope_unweave":part===3?"penelope_pause":"penelope_weave_public";
 if(id.startsWith("character.")){
  state.gaze={x:index===0?.25:-.25,y:.08};
  state.breath=.5+.12*Math.sin(t*1.8+index);
  // Turns alternate, so a listener does not mouth the other person's speech.
  if(part%2!==index)state.jaw=0;
 }
 return state;
}
function sprite(id,st,x,y,maxW,maxH,kind){
 const mod=current.map.get(id);
 const sig=JSON.stringify(st);
 const cut=E.inkCutout(mod,st,sig);
 const s=Math.min(maxW/cut.w,maxH/cut.h),w=cut.w*s,h=cut.h*s;
 const px=x-w/2,py=y-h;
 rg.drawImage(cut.cv,cut.x,cut.y,cut.w,cut.h,px,py,w,h);
 hits.push({id,x:px,y:py,w,h,kind,state:st});
}
function room(){
 const W=raw.width,H=raw.height,r=current.recipe;
 rg.fillStyle=PAPER;rg.fillRect(0,0,W,H);
 const bg=current.map.get(r.setting);
 rg.save();rg.globalAlpha=.70;bg.draw(rg,W,H,bgState(score,bg));rg.restore();
 // All movable things share a floor. The setting supplies the architecture.
 const narrow=W/H<1;
 const stations=narrow?[.19,.81]:[.25,.75];
 const actors=r.inhabitants.map((id,i)=>({id,x:stations[i]+Math.sin(t*.35+i)*.012,y:i===0?.88:.86,h:Math.min(H*.55,W*.53),w:W*.25}));
 const primary=r.objects[0];
 // The principal object remains the spatial centre across every permutation.
 const pw=W*(narrow?.42:.29),ph=H*[.36,.56,.38,.34,.36][score.matter];
 for(const a of actors){
  rg.fillStyle="rgba(20,18,14,.10)";rg.beginPath();rg.ellipse(W*a.x,H*a.y,W*.068,H*.012,0,0,Math.PI*2);rg.fill();
 }
 sprite(primary,propState(primary,0),W*.5,H*.89,pw,ph,"object");
 actors.forEach((a,i)=>sprite(a.id,performer(a.id,i),W*a.x,H*a.y,a.id.startsWith("creature.")?W*.28:a.w,a.id.startsWith("creature.")?H*.18:a.h,"inhabitant"));
 sprite(r.objects[1],propState(r.objects[1],1),W*.16,H*.985,W*.24,H*.24,"object");
 sprite(r.objects[2],propState(r.objects[2],2),W*.84,H*.985,W*.24,H*.24,"object");
 if(r.lightAsset)sprite(r.lightAsset,propState(r.lightAsset,0),W*.52,H*.99,W*.23,H*.22,"light");
}
function focused(){
 const W=raw.width,H=raw.height,mod=current.map.get(focus.id);
 room();rg.fillStyle="rgba(244,241,232,.94)";rg.fillRect(0,0,W,H);hits=[];
 const st=authored(focus.id,focus.nodes[focus.index]?.key);
 if(focus.face&&FACE){
  const size=Math.min(W*.93,H-80),fc=document.createElement("canvas");fc.width=fc.height=800;const ctx=fc.getContext("2d");
  ctx.fillStyle=PAPER;ctx.fillRect(0,0,800,800);
  const face={...FACE.idleFace(t,focus.id.length),...st};
  FACE.drawCloseup(ctx,FACE.FACES[focus.face],face,{cx:400,cy:376,R:320});
  rg.drawImage(fc,(W-size)/2,55+(H-80-size)/2,size,size);
 }else{
  sprite(focus.id,st,W*.5,H-32,W*.88,H-100,"object");
 }
}
function print(){
 const W=raw.width,H=raw.height,d=rg.getImageData(0,0,W,H).data;
 const kind=focus?"day":current.recipe.light,night=kind==="moon"||kind==="fire";
 g.fillStyle=night?(kind==="moon"?"#19232b":"#25221d"):PAPER;g.fillRect(0,0,W,H);
 g.fillStyle=night?(kind==="moon"?"#c9d2d4":"#e4d2af"):"#201f1b";
 const cell=Math.max(1.6,W/700),buckets=Array.from({length:9},()=>[]);
 for(let y=cell/2;y<H;y+=cell)for(let x=cell/2;x<W;x+=cell){
  const j=(Math.floor(y)*W+Math.floor(x))*4;let darkness=1-(d[j]*.299+d[j+1]*.587+d[j+2]*.114)/255;
  // Light grades the existing surfaces. It never adds a sun disc or glow overlay.
  if(kind==="door")darkness*=x/W>.32+y/H*.3?.92:.42;
  if(kind==="fire")darkness*=Math.abs(x/W-.52)<.28&&y/H>.45?1:.42;
  if(kind==="moon")darkness*=.72;
  if(darkness<.08)continue;
  buckets[Math.min(8,Math.floor(darkness*9))].push(x,y);
 }
 buckets.forEach((points,i)=>{const radius=cell*.62*(i+.6)/9;g.beginPath();for(let n=0;n<points.length;n+=2){g.moveTo(points[n]+radius,points[n+1]);g.arc(points[n],points[n+1],radius,0,Math.PI*2);}g.fill();});
}
function render(){
 if(!current||!raw.width)return;
 hits=[];rg.setTransform(1,0,0,1,0,0);rg.globalAlpha=1;
 if(focus)focused();else{
  const W=raw.width,H=raw.height,z=view==="near"?1.35:view==="wide"?.85:1;
  rg.fillStyle=PAPER;rg.fillRect(0,0,W,H);rg.save();rg.translate(W*.5+pan,H*(1-z)*.66);rg.scale(z,z);rg.translate(-W*.5,0);room();rg.restore();
  hits=hits.map(a=>({...a,x:(a.x-W*.5)*z+W*.5+pan,y:a.y*z+H*(1-z)*.66,w:a.w*z,h:a.h*z}));
 }
 print();dirty=false;document.body.dataset.time=t.toFixed(2);
}
async function inspect(id){
 if(busy||!current?.map.has(id))return;
 const mod=current.map.get(id),token=serial;
 const f={id,name:ASSETS[id].name,nodes:E.normStateNodes(mod),index:0,face:null};
 if(!f.nodes.length)f.nodes=[{key:"preview",prev:()=>mod.preview?.()||{}}];
 focus=f;$("inspect").replaceChildren(...f.nodes.map((n,i)=>new Option(n.key.replace(/[-_]/g," "),i)));
 dirty=true;sync();status("This drawing belongs to the current poem. Return to see it in the dwelling.");
 if(id.startsWith("character.")){
  try{FACE||=await wait(import("./assets/character/_close/face.mjs"));if(serial!==token||focus!==f)return;
   const key=id.split(".")[1].split("-")[0];if(FACE.FACES[key])f.face=key;dirty=true;
  }catch{}
 }
}
function resize(){const r=$("stage").getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);cv.width=raw.width=Math.max(2,Math.round(r.width*d));cv.height=raw.height=Math.max(2,Math.round(r.height*d));dirty=true;}
new ResizeObserver(resize).observe($("stage"));
function tick(now){
 const dt=Math.min(.06,(now-last)/1000||0);last=now;
 if(!document.hidden&&current&&!busy){
  if(playing){t+=dt;dirty=true;}
  if(dirty&&now-paint>110){try{render();paint=now;}catch(e){playing=false;status("Drawing stopped: "+e.message);sync();}}
 }
 requestAnimationFrame(tick);
}
SLOTS.forEach(k=>{
 const s=$(k);s.replaceChildren(...VOCAB[k].map((v,i)=>new Option(v.label,i)));
 s.onchange=()=>construct({...score,[k]:+s.value});
 $("hold-"+k).onclick=()=>{held[k]=!held[k];shareState();sync();status(held[k]?"This line will stay when you cast.":"This line can change on the next cast.");};
});
$("cast").onclick=()=>construct(cast(score,held));
$("undo").onclick=()=>{const prev=past.pop();if(prev){held=prev.held;construct(prev.score,{remember:false});}};
$("play").onclick=()=>{playing=!playing;sync();dirty=true;};
$("return").onclick=()=>{focus=null;dirty=true;sync();status(VOCAB.matter[score.matter].verb);};
$("inspect").onchange=()=>{focus.index=+$("inspect").value;dirty=true;};
$("view").onclick=()=>{view=view==="room"?"near":view==="near"?"wide":"room";pan=0;dirty=true;sync();shareState();};
$("things").onclick=()=>{
 if(!current)return;const ids=[...current.recipe.objects,...current.recipe.inhabitants];const i=focus?ids.indexOf(focus.id):-1;inspect(ids[(i+1)%ids.length]);
};
$("share").onclick=async()=>{shareState();try{await navigator.clipboard.writeText(location.href);status("Link copied. It restores these four lines and their holds.");}catch{status("The address bar contains this poem's permanent link.");}};
$("retry").onclick=()=>failure?.();
cv.onpointerdown=e=>{if(busy)return;cv.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,pan};};
cv.onpointermove=e=>{if(!drag||focus)return;pan=limit(drag.pan+(e.clientX-drag.x)*cv.width/cv.clientWidth,-cv.width*.45,cv.width*.45);dirty=true;};
cv.onpointerup=e=>{
 if(!drag)return;const dist=Math.hypot(e.clientX-drag.x,e.clientY-drag.y);drag=null;if(dist>9||focus)return;
 const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)*cv.width/r.width,y=(e.clientY-r.top)*cv.height/r.height;
 const hit=hits.filter(a=>x>=a.x&&x<a.x+a.w&&y>=a.y&&y<a.y+a.h).reverse()[0];if(hit)inspect(hit.id);
};
cv.onpointercancel=()=>{drag=null;};
addEventListener("keydown",e=>{if(e.key==="Escape"&&focus)$("return").click();});
addEventListener("hashchange",()=>{const d=decode(location.hash);held=d.held;view=d.view;construct(d.score);});
async function boot(){
 try{E=await wait(import("./engine/halfworld-engine.mjs"));const d=decode(location.hash);held=d.held;view=d.view;await construct(d.score,{remember:false});}
 catch(e){failure=boot;status("Could not open the drawings: "+e.message);sync();}
}
requestAnimationFrame(tick);boot();
