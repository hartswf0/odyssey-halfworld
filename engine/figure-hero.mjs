/* ============================================================
   figure-hero.mjs  ·  odyssey-halfworld
   The HALFTRACK full-body hero rig, ported from
   HALFTRACK_Full_Body_Hero_Rig.html into a reusable, instanceable
   figure factory. Dropped: MediaPipe capture, camera view, DOM/lab UI.
   Kept: the matrix skeleton, the 60-pose library, spring animation,
   action mods, capsule limbs, fingered hands, torso/neck/head/face.
   Adapted: flat dark palette -> grayscale-on-white so the engine's
   dotify POST pass produces the atlas halftone look.

   Every CHARACTER (and skeletal CREATURE) asset composes this.
   ============================================================ */

const TAU = Math.PI*2;
const clamp = (v,a,b)=> v<a?a:(v>b?b:v);
const lerp  = (a,b,t)=> a+(b-a)*t;
const smoothstep = t => { t=clamp(t,0,1); return t*t*(3-2*t); };
const normAngle = a => { while(a>Math.PI)a-=TAU; while(a<-Math.PI)a+=TAU; return a; };
const safe = (v,f=0)=> Number.isFinite(v)?v:f;
function hex2(n){ return clamp(Math.round(n),0,255).toString(16).padStart(2,"0"); }
function shade(hex,d){
  const n=parseInt(String(hex||"#808080").replace("#","").padEnd(6,"0").slice(0,6),16);
  return "#"+hex2((n>>16)+d)+hex2(((n>>8)&255)+d)+hex2((n&255)+d);
}

/* ---- grayscale palette from a spec, on white paper ---- */
function paletteFor(spec){
  const skin = spec.skin || "#d9d4c8";
  const hair = spec.hairColor || "#1d1d1d";
  const gar  = garmentGray(spec.garment);
  return {
    ink:"#141414",
    skin, skinDeep: shade(skin,-26),
    hair, hairDeep: shade(hair,-14),
    shirt: gar, shirtDeep: shade(gar,-30),
    pants: shade(gar,-18), pantsDeep: shade(gar,-40),
    shoe:"#171717",
    eye:"#f4f4f0", mouth:"#241f1c", teeth:"#efeee9",
  };
}
function garmentGray(g){
  switch(g){
    case "robe":   return "#565651";
    case "cloak":  return "#3f3f3b";
    case "armor":  return "#6d6d66";
    case "dress":  return "#9a9a92";
    case "tunic":  return "#8a8a83";
    case "rags":   return "#6a6862";
    case "bare":   return "#c8c2b6";
    default:       return "#7f7f78";
  }
}

/* ---- channel base + pose library (verbatim structure from the rig) ---- */
const base={
  rootX:0,rootY:0,rootScale:1,pelvisX:0,pelvisY:0,pelvisRot:0,spineLean:0,spineTwist:0,bodyYaw:0,chestOpen:0,chestLift:0,shoulderTilt:0,shoulderLiftL:0,shoulderLiftR:0,
  neckYaw:0,neckPitch:0,neckRoll:0,headYaw:0,headPitch:0,headRoll:0,headX:0,headY:0,gazeX:0,gazeY:0,
  jaw:0,smile:0,frown:0,browUp:0,browKnit:0,blinkL:0,blinkR:0,eyeWide:0,eyeNarrow:0,mouthAsym:0,mouthPucker:0,cheek:0,
  armLUpper:.18,armLLower:-.08,armRUpper:-.18,armRLower:.08,handRotL:0,handRotR:0,
  hipL:.03,kneeL:.05,ankleL:-.03,hipR:-.03,kneeR:.05,ankleR:.03,footRotL:0,footRotR:0,
  weightShift:0,crouch:0,distance:0,walkSpeed:0,voiceEnergy:0
};
const CHANNELS=Object.keys(base);
const P=(id,label,group,n={},opt={})=>({id,label,group,n,opt});
const poseGroups=[
 {name:"neutral",items:[
  P("neutral_front","neutral front idle","neutral"),
  P("three_quarter_left","three-quarter left","neutral",{bodyYaw:-.62,headYaw:-.48,gazeX:-.25}),
  P("three_quarter_right","three-quarter right","neutral",{bodyYaw:.62,headYaw:.48,gazeX:.25}),
  P("profile_left","profile left","neutral",{bodyYaw:-1.35,headYaw:-1.25,gazeX:-.5}),
  P("profile_right","profile right","neutral",{bodyYaw:1.35,headYaw:1.25,gazeX:.5}),
  P("back_view","back view","neutral",{bodyYaw:Math.PI,headYaw:Math.PI}),
  P("breathing_idle","breathing idle","neutral",{},{action:"breath"}),
  P("walk_neutral","walk","neutral",{walkSpeed:1},{action:"walk",loop:true}),
 ]},
 {name:"attention",items:[
  P("head_left","head left","attention",{headYaw:-.78,neckYaw:-.42,gazeX:-.7}),
  P("head_right","head right","attention",{headYaw:.78,neckYaw:.42,gazeX:.7}),
  P("head_lowered","head lowered","attention",{headPitch:.58,neckPitch:.28,headY:.12,browKnit:.15}),
  P("repeated_nod","nod","attention",{},{action:"nod"}),
  P("rapid_head_shake","shake","attention",{},{action:"shake"}),
 ]},
 {name:"torso",items:[
  P("lean_forward","lean forward","torso",{spineLean:-.38,headPitch:-.1,armLUpper:.34,armRUpper:-.34}),
  P("lean_backward","lean backward","torso",{spineLean:.42,headPitch:.12}),
  P("torso_open","torso opened","torso",{chestOpen:1,armLUpper:.95,armRUpper:-.95,armLLower:-.55,armRLower:.55,handRotL:-.25,handRotR:.25},{hands:["open_palm","open_palm"]}),
  P("step_closer","step closer","torso",{distance:1,rootScale:1.12,rootY:.05,walkSpeed:.55},{action:"step_forward"}),
  P("step_away","step away","torso",{distance:-1,rootScale:.9,rootY:-.03,bodyYaw:-.2},{action:"step_back"}),
  P("weight_shift","weight shift","torso",{weightShift:.75,pelvisX:.28,pelvisRot:.08,hipL:.18,hipR:-.04},{action:"weight"}),
  P("crouch","crouch","torso",{crouch:.9,kneeL:.92,kneeR:.92,hipL:-.42,hipR:.42,spineLean:-.18,armLUpper:.55,armRUpper:-.55,armLLower:-.5,armRLower:.5}),
  P("kneel","kneel","torso",{crouch:1,kneeL:1.7,hipL:-.9,kneeR:.6,hipR:.3,spineLean:-.05,rootY:.14}),
 ]},
 {name:"arms",items:[
  P("arms_crossed","arms crossed","arms",{armLUpper:-1.02,armLLower:-1.32,armRUpper:1.02,armRLower:1.32,handRotL:-.4,handRotR:.4}),
  P("arms_open","arms open wide","arms",{armLUpper:1.34,armLLower:-.22,armRUpper:-1.34,armRLower:.22,handRotL:-.22,handRotR:.22},{hands:["open_palm","open_palm"]}),
  P("one_arm_raised","one arm raised","arms",{armLUpper:2.72,armLLower:-.18,shoulderLiftL:.7},{hands:["open_palm","relaxed"]}),
  P("both_hands_raised","both hands raised","arms",{armLUpper:2.58,armRUpper:-2.58,armLLower:-.24,armRLower:.24,shoulderLiftL:.7,shoulderLiftR:.7},{hands:["open_palm","open_palm"]}),
  P("shrug","shrug","arms",{shoulderLiftL:1,shoulderLiftR:1,armLUpper:.9,armRUpper:-.9,armLLower:-.85,armRLower:.85,headY:-.16,browUp:.4},{hands:["palm_up","palm_up"],action:"shrug"}),
  P("reach_forward","reach forward","arms",{bodyYaw:-.25,spineLean:-.22,armRUpper:-1.55,armRLower:.18,handRotR:.15},{hands:["relaxed","offering"]}),
  P("pointing_arm","pointing arm","arms",{armRUpper:-1.48,armRLower:.1,bodyYaw:-.18,headYaw:-.3,gazeX:-.55},{hands:["relaxed","point"]}),
  P("protective_block","blocking arm","arms",{spineLean:.2,armRUpper:-1.18,armRLower:-.75,armLUpper:.55,armLLower:-1.1},{hands:["fist","stop"]}),
  P("hands_near_face","hands near face","arms",{armLUpper:-.58,armLLower:-1.8,armRUpper:.58,armRLower:1.8,shoulderLiftL:.35,shoulderLiftR:.35,eyeWide:.25},{hands:["open_palm","open_palm"]}),
 ]},
 {name:"hands",items:[
  P("open_palm","open palm","hands",{armLUpper:.96,armLLower:-.72},{hands:["open_palm","relaxed"]}),
  P("hand_point","point","hands",{armRUpper:-1.25,armRLower:.2},{hands:["relaxed","point"]}),
  P("wave","wave","hands",{armLUpper:2.25,armLLower:-.75},{hands:["open_palm","relaxed"],action:"wave"}),
  P("offering_hand","offering","hands",{armRUpper:-1.0,armRLower:.62,spineLean:-.08},{hands:["relaxed","offering"]}),
  P("palm_up_question","palm-up question","hands",{armRUpper:-.88,armRLower:.82,headRoll:.16,browUp:.28},{hands:["relaxed","palm_up"]}),
 ]},
 {name:"emotion",items:[
  P("enthusiasm","enthusiasm","emotion",{smile:1,browUp:.45,eyeWide:.2,chestOpen:1,spineLean:-.08,armLUpper:1.35,armRUpper:-1.35,armLLower:-.25,armRLower:.25,rootY:-.03},{hands:["open_palm","open_palm"]}),
  P("skepticism","skepticism","emotion",{browUp:.16,browKnit:.36,eyeNarrow:.4,mouthAsym:.65,headRoll:-.22,headYaw:-.18,spineLean:.12,bodyYaw:.12,armRUpper:.35,armRLower:1.42}),
  P("confrontation","confrontation","emotion",{browKnit:.7,eyeNarrow:.35,frown:.45,spineLean:-.17,armRUpper:-1.42,armRLower:.18,rootScale:1.06},{hands:["fist","point"]}),
  P("guarded_withdrawal","guarded","emotion",{bodyYaw:.45,headYaw:-.72,gazeX:-.65,spineLean:.14,armLUpper:-1,armLLower:-1.28,armRUpper:1,armRLower:1.28,rootScale:.95}),
  P("grief","grief","emotion",{browUp:.5,browKnit:.5,frown:.5,headPitch:.4,headY:.12,spineLean:.1,gazeY:.4,armRUpper:.5,armRLower:1.3}),
  P("desperation","desperation","emotion",{browUp:.95,browKnit:.22,eyeWide:.65,jaw:.5,frown:.4,spineLean:-.4,armLUpper:.82,armRUpper:-.82,armLLower:-.82,armRLower:.82,rootScale:1.04},{hands:["offering","offering"]}),
  P("laughter","laughter","emotion",{smile:1,jaw:.8,eyeNarrow:.75,cheek:.6,spineLean:.18,shoulderLiftL:.5,shoulderLiftR:.5,armLUpper:-.62,armRUpper:.62,armLLower:-1.25,armRLower:1.25},{hands:["open_palm","open_palm"],action:"laugh"}),
 ]},
];
export const POSES={}; poseGroups.forEach(g=>g.items.forEach(p=>POSES[p.id]=p));
export const POSE_IDS = Object.keys(POSES);

/* semantic alias map: atlas/scene pose words -> rig pose ids */
export const POSE_ALIAS = {
  neutral:"neutral_front", idle:"breathing_idle", front:"neutral_front",
  threeq:"three_quarter_left", "three-quarter":"three_quarter_left",
  profile:"profile_left", back:"back_view",
  "open-palm":"open_palm", gesture:"torso_open", speaking:"torso_open",
  raise:"one_arm_raised", hail:"one_arm_raised", wave:"wave",
  reach:"reach_forward", point:"pointing_arm", cross:"arms_crossed",
  walk:"walk_neutral", stride:"walk_neutral", crouch:"crouch", kneel:"kneel",
  grieving:"grief", grief:"grief", command:"confrontation", authority:"confrontation",
  bow:"head_lowered", listen:"lean_forward", offer:"offering_hand",
};

function mirrorNumeric(n){
  const o={...n};
  for(const k of ["rootX","pelvisX","pelvisRot","spineTwist","bodyYaw","shoulderTilt","neckYaw","neckRoll","headYaw","headRoll","headX","gazeX","mouthAsym","weightShift"]) if(k in o)o[k]=-o[k];
  const pairs=[["armLUpper","armRUpper",-1],["armLLower","armRLower",-1],["handRotL","handRotR",-1],["shoulderLiftL","shoulderLiftR",1],["hipL","hipR",-1],["kneeL","kneeR",1],["ankleL","ankleR",-1],["footRotL","footRotR",-1]];
  for(const [a,b,sgn] of pairs) if(a in o||b in o){ const av=o[a]??base[a],bv=o[b]??base[b]; o[a]=bv*sgn; o[b]=av*sgn; }
  return o;
}
function actionMods(action, t){
  const m={}, phase=t*TAU;
  switch(action){
    case"breath":m.chestLift=.34*(.5+.5*Math.sin(t*2.2));m.headY=.05*Math.sin(t*2.2+.6);break;
    case"walk":{const q=t*5.2;m.hipL=.48*Math.sin(q);m.hipR=-.48*Math.sin(q);m.kneeL=.52*Math.max(0,-Math.sin(q));m.kneeR=.52*Math.max(0,Math.sin(q));m.armLUpper=.18-.34*Math.sin(q);m.armRUpper=-.18+.34*Math.sin(q);m.rootY=-.035*Math.abs(Math.sin(q));m.pelvisRot=.05*Math.sin(q);break;}
    case"step_forward":{const q=smoothstep(clamp(t/1.1,0,1));m.rootScale=1+.12*q;m.rootY=.05*q;m.hipL=.42*Math.sin(Math.PI*q);m.kneeL=.5*Math.sin(Math.PI*q);break;}
    case"step_back":{const q=smoothstep(clamp(t/1.1,0,1));m.rootScale=1-.1*q;m.hipR=-.36*Math.sin(Math.PI*q);m.kneeR=.45*Math.sin(Math.PI*q);break;}
    case"weight":m.pelvisX=.3+.08*Math.sin(t*2.2);m.headX=-.06*Math.sin(t*2.2);break;
    case"nod":m.headPitch=.38*(.5+.5*Math.sin(t*9-.8));break;
    case"shake":m.headYaw=.58*Math.sin(t*12)*Math.exp(-t*.45);break;
    case"wave":m.handRotL=.55*Math.sin(t*9);m.armLLower=-.75+.2*Math.sin(t*4.5);break;
    case"shrug":m.shoulderLiftL=.8+.2*Math.sin(t*4);m.shoulderLiftR=.8+.2*Math.sin(t*4+.2);break;
    case"laugh":m.jaw=.58+.28*Math.abs(Math.sin(t*6));m.shoulderLiftL=.35+.22*Math.abs(Math.sin(t*6));m.spineLean=.12+.1*Math.sin(t*6);break;
  }
  return m;
}
function composeStatic(poseId, t, mirror){
  const def=POSES[poseId]||POSES.neutral_front;
  const authored=mirror?mirrorNumeric(def.n):def.n;
  const out={...base};
  for(const k in authored)out[k]=authored[k];
  const act=actionMods(def.opt.action, t);
  for(const k in act)out[k]=lerp(out[k]??0,act[k],1);
  // gentle idle so static frames still breathe a touch
  out.chestLift=(out.chestLift||0)+.05*Math.sin(t*1.8);
  return { state:out, hands:(mirror?[...(def.opt.hands||["relaxed","relaxed"])].reverse():(def.opt.hands||["relaxed","relaxed"])) };
}

/* ---- matrix skeleton ---- */
class RigNode{
  constructor(name,parent){ this.name=name;this.parent=parent||null;this.children=[];if(parent)parent.children.push(this);
    this.x=0;this.y=0;this.r=0;this.sx=1;this.sy=1;this.w={a:1,b:0,c:0,d:1,e:0,f:0,r:0}; }
  update(){
    const cr=Math.cos(this.r),sr=Math.sin(this.r),a=cr*this.sx,b=sr*this.sx,c=-sr*this.sy,d=cr*this.sy;
    if(this.parent){const p=this.parent.w;this.w.a=p.a*a+p.c*b;this.w.b=p.b*a+p.d*b;this.w.c=p.a*c+p.c*d;this.w.d=p.b*c+p.d*d;this.w.e=p.a*this.x+p.c*this.y+p.e;this.w.f=p.b*this.x+p.d*this.y+p.f;this.w.r=p.r+this.r;}
    else Object.assign(this.w,{a,b,c,d,e:this.x,f:this.y,r:this.r});
    for(const ch of this.children)ch.update();
  }
  point(x=0,y=0){return{x:this.w.a*x+this.w.c*y+this.w.e,y:this.w.b*x+this.w.d*y+this.w.f};}
}
class HeroRig{
  constructor(){
    this.root=new RigNode("root");
    this.pelvis=new RigNode("pelvis",this.root);this.spineLower=new RigNode("spineLower",this.pelvis);this.spineMid=new RigNode("spineMid",this.spineLower);this.chest=new RigNode("chest",this.spineMid);
    this.clavL=new RigNode("clavL",this.chest);this.clavR=new RigNode("clavR",this.chest);this.shL=new RigNode("shL",this.clavL);this.shR=new RigNode("shR",this.clavR);
    this.upL=new RigNode("upL",this.shL);this.foL=new RigNode("foL",this.upL);this.wrL=new RigNode("wrL",this.foL);this.haL=new RigNode("haL",this.wrL);
    this.upR=new RigNode("upR",this.shR);this.foR=new RigNode("foR",this.upR);this.wrR=new RigNode("wrR",this.foR);this.haR=new RigNode("haR",this.wrR);
    this.neckLower=new RigNode("neckLower",this.chest);this.neckUpper=new RigNode("neckUpper",this.neckLower);this.skull=new RigNode("skull",this.neckUpper);
    this.hipL=new RigNode("hipL",this.pelvis);this.shinL=new RigNode("shinL",this.hipL);this.ankL=new RigNode("ankL",this.shinL);this.footL=new RigNode("footL",this.ankL);this.toeL=new RigNode("toeL",this.footL);
    this.hipR=new RigNode("hipR",this.pelvis);this.shinR=new RigNode("shinR",this.hipR);this.ankR=new RigNode("ankR",this.shinR);this.footR=new RigNode("footR",this.ankR);this.toeR=new RigNode("toeR",this.footR);
    this.nodes=[];(function walk(n,a){a.push(n);n.children.forEach(c=>walk(c,a));})(this.root,this.nodes);
    this.dim={};
  }
  configure(H){const d=this.dim;d.headR=H*.105;d.neck=H*.054;d.rib=H*.19;d.pelvis=H*.085;d.shoulders=H*.23;d.upperArm=H*.142;d.forearm=H*.13;d.hand=H*.075;d.thigh=H*.17;d.shin=H*.165;d.foot=H*.075;}
  apply(s,W,H){
    const d=this.dim,scale=s.rootScale;
    this.root.x=W*.5+s.rootX*W*.18;this.root.y=H*.72+s.rootY*H*.12;this.root.r=0;this.root.sx=this.root.sy=scale;
    this.pelvis.x=s.pelvisX*d.shoulders*.3;this.pelvis.y=s.pelvisY*d.rib*.5;this.pelvis.r=s.pelvisRot;
    this.spineLower.x=0;this.spineLower.y=-d.pelvis*.7;this.spineLower.r=s.spineLean*.45;
    this.spineMid.x=0;this.spineMid.y=-d.rib*.42;this.spineMid.r=s.spineLean*.35+s.spineTwist*.1;
    this.chest.x=0;this.chest.y=-d.rib*.48-s.chestLift*d.rib*.08;this.chest.r=s.spineLean*.2+s.shoulderTilt*.2;
    const yawNarrow=.42+.58*Math.abs(Math.cos(s.bodyYaw));
    this.clavL.x=-d.shoulders*.5*yawNarrow;this.clavR.x=d.shoulders*.5*yawNarrow;this.clavL.y=this.clavR.y=-d.rib*.08;
    this.clavL.r=s.shoulderTilt*.5;this.clavR.r=s.shoulderTilt*.5;
    this.shL.y=-s.shoulderLiftL*d.headR*.17;this.shR.y=-s.shoulderLiftR*d.headR*.17;
    this.upL.r=s.armLUpper;this.foL.x=0;this.foL.y=d.upperArm;this.foL.r=s.armLLower;this.wrL.y=d.forearm;this.haL.r=s.handRotL;
    this.upR.r=s.armRUpper;this.foR.x=0;this.foR.y=d.upperArm;this.foR.r=s.armRLower;this.wrR.y=d.forearm;this.haR.r=s.handRotR;
    this.neckLower.x=s.headX*d.headR*.12;this.neckLower.y=-d.neck*.12;this.neckLower.r=s.neckYaw*.13+s.neckRoll*.28;
    this.neckUpper.x=s.headX*d.headR*.18;this.neckUpper.y=-d.neck*.46;this.neckUpper.r=s.neckYaw*.2+s.neckRoll*.28;
    this.skull.x=s.headX*d.headR*.25;this.skull.y=-d.neck*.56-d.headR*.72+s.headY*d.headR*.18;this.skull.r=s.headRoll+s.headYaw*.045;
    const hipNarrow=.45+.55*Math.abs(Math.cos(s.bodyYaw));
    this.hipL.x=-d.pelvis*.36*hipNarrow;this.hipR.x=d.pelvis*.36*hipNarrow;this.hipL.r=s.hipL;this.hipR.r=s.hipR;
    this.shinL.y=d.thigh;this.shinL.r=s.kneeL;this.ankL.y=d.shin;this.ankL.r=s.ankleL;this.footL.r=-Math.PI/2+s.footRotL;this.toeL.x=d.foot;
    this.shinR.y=d.thigh;this.shinR.r=s.kneeR;this.ankR.y=d.shin;this.ankR.r=s.ankleR;this.footR.r=-Math.PI/2+s.footRotR;this.toeR.x=d.foot;
    this.root.update();
    const aL=this.ankL.point(),aR=this.ankR.point(),floor=H*.90;
    const correction=floor-Math.max(aL.y,aR.y);
    this.root.y+=clamp(correction,-H*.18,H*.18);this.root.update();
  }
}

/* ============================================================
   makeHeroFigure(spec) -> { draw(ctx,W,H,state), rig, anchorsAt() }
   state: { pose|band, mirror, gaze:{x,y}, mouth, t, blink }
   ============================================================ */
export function makeHeroFigure(spec={}){
  spec = { skin:"#d9d4c8", garment:"tunic", hairColor:"#1d1d1d",
           hair:"short", beard:false, glasses:false, scale:1.0, ...spec };
  const rig = new HeroRig();

  function draw(ctx, W, H, st={}){
    const C = paletteFor(spec);
    // resolve pose
    let poseId = st.pose || st.band || "neutral_front";
    poseId = POSE_ALIAS[poseId] || (POSES[poseId] ? poseId : "neutral_front");
    const t = st.t ?? 0.5;
    const comp = composeStatic(poseId, t, !!st.mirror);
    const state = comp.state;
    // overlay explicit facial channels from scene state
    if (st.gaze){ state.gazeX=st.gaze.x; state.gazeY=st.gaze.y; }
    if (typeof st.mouth==="number"){ state.smile=Math.max(0,st.mouth); state.frown=Math.max(0,-st.mouth); state.jaw=Math.max(state.jaw, st.mouth>0.6?0.35:0); }
    if (typeof st.blink==="number"){ state.blinkL=state.blinkR=st.blink; }
    // explicit expressive facial channels — a scene/state can drive the face
    // directly (brows knit/raise, eyes widen/narrow, jaw opens for speech,
    // mouth curves/skews) on top of whatever the pose authored.
    for (const k of ["smile","frown","browUp","browKnit","eyeWide","eyeNarrow","jaw","mouthAsym","mouthPucker","cheek"]){
      if (typeof st[k]==="number") state[k]=st[k];
    }
    let handL=comp.hands[0], handR=comp.hands[1];

    const Hh = Math.min(H*0.9, W*1.26) * (spec.scale||1);
    rig.configure(Hh);
    rig.apply(state, W, H);

    // ---- render primitives (bound to this ctx) ----
    const pathCapsule=(a,b,w,fill)=>{ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=C.ink;ctx.lineWidth=w+5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.strokeStyle=fill;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();};
    const ellipseAt=(node,rx,ry,fill,rot=0)=>{const p=node.point();ctx.save();ctx.translate(p.x,p.y);ctx.rotate(node.w.r+rot);ctx.fillStyle=fill;ctx.strokeStyle=C.ink;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,TAU);ctx.fill();ctx.stroke();ctx.restore();};
    const polygon=(pts,fill,lw=4)=>{ctx.fillStyle=fill;ctx.strokeStyle=C.ink;ctx.lineWidth=lw;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.closePath();ctx.fill();ctx.stroke();};
    const fingerPath=(points,w)=>{ctx.strokeStyle=C.ink;ctx.lineWidth=w+3;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.stroke();ctx.strokeStyle=C.skin;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.stroke();};
    const d=rig.dim;

    function drawShadow(){const p=rig.pelvis.point();ctx.save();ctx.globalAlpha=.28;ctx.fillStyle="#000";ctx.beginPath();ctx.ellipse(p.x,H*.905,d.shoulders*.72,d.headR*.2,0,0,TAU);ctx.fill();ctx.restore();}
    function drawLeg(side){const hip=side==="L"?rig.hipL:rig.hipR,shin=side==="L"?rig.shinL:rig.shinR,ank=side==="L"?rig.ankL:rig.ankR,toe=side==="L"?rig.toeL:rig.toeR;const h=hip.point(),k=shin.point(),a=ank.point(),tp=toe.point();
      // Greek dress: bare shins + sandals below a tunic/robe hem. bareLegs=true
      // draws thighs (upper, under hem) darker and shins in skin.
      const bare = spec.bareLegs!==false && (spec.garment==="tunic"||spec.garment==="bare"||spec.garment==="rags"||spec.garment==="armor");
      const thighC = bare?C.skinDeep:C.pants, shinC = bare?C.skin:C.pantsDeep;
      pathCapsule(h,k,d.pelvis*.42,thighC);pathCapsule(k,a,d.pelvis*.34,shinC);pathCapsule(a,tp,d.pelvis*.3,C.shoe);
      ellipseAt(hip,d.pelvis*.25,d.pelvis*.32,thighC);ellipseAt(shin,d.pelvis*.19,d.pelvis*.2,shinC);
      // sandal strap ink on a bare shin
      if(bare){ctx.strokeStyle=C.ink;ctx.lineWidth=2.5;for(let i=1;i<=2;i++){const t=i/3,cx=k.x+(a.x-k.x)*t,cy=k.y+(a.y-k.y)*t;ctx.beginPath();ctx.moveTo(cx-d.pelvis*.16,cy-d.pelvis*.05);ctx.lineTo(cx+d.pelvis*.16,cy+d.pelvis*.05);ctx.stroke();}}
    }
    function drawHand(side,pose,node){const p=node.point(),flip=side==="L"?-1:1;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(node.w.r);ctx.scale(flip,1);const S=d.hand;ctx.fillStyle=C.skin;ctx.strokeStyle=C.ink;ctx.lineWidth=3.5;ctx.beginPath();ctx.ellipse(0,S*.1,S*.31,S*.38,0,0,TAU);ctx.fill();ctx.stroke();const f=(x,y1,y2,bend=0)=>fingerPath([[x,S*.02],[x+bend,y1],[x+bend*.6,y2]],S*.1);
      if(pose==="fist"){ctx.beginPath();ctx.roundRect(-S*.31,-S*.18,S*.62,S*.48,S*.18);ctx.fill();ctx.stroke();for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*S*.16,-S*.12);ctx.lineTo(i*S*.16,S*.1);ctx.stroke();}}
      else if(pose==="point"){f(-S*.12,-S*.42,-S*.95);f(S*.06,-S*.18,-S*.3,.06);f(S*.19,-S*.12,-S*.22,.08);fingerPath([[-S*.25,S*.1],[-S*.48,-S*.05]],S*.1);}
      else if(pose==="offering"||pose==="palm_up"){for(let i=-2;i<=2;i++){const x=i*S*.13;f(x,-S*(.3-Math.abs(i)*.02),-S*(.55-Math.abs(i)*.06),i*S*.13);}fingerPath([[-S*.28,S*.08],[-S*.46,-S*.02],[-S*.5,-S*.28]],S*.11);}
      else{const spread=pose==="open_palm"||pose==="stop"?.16:.09;for(let i=-2;i<=2;i++){const x=i*S*.13;f(x,-S*(.35-Math.abs(i)*.03),-S*(.72-Math.abs(i)*.08),i*S*spread);}fingerPath([[-S*.28,S*.08],[-S*.5,-S*.12],[-S*.62,-S*.42]],S*.11);}
      ctx.restore();}
    function drawArm(side){const sh=side==="L"?rig.shL:rig.shR,fo=side==="L"?rig.foL:rig.foR,wr=side==="L"?rig.wrL:rig.wrR;const a=sh.point(),b=fo.point(),c=wr.point();
      const sleeveDeep = spec.garment==="bare"?C.skinDeep:C.shirtDeep;
      pathCapsule(a,b,d.headR*.34,sleeveDeep);pathCapsule(b,c,d.headR*.27,C.skin);ellipseAt(sh,d.headR*.26,d.headR*.31,spec.garment==="bare"?C.skin:C.shirt);drawHand(side,side==="L"?handL:handR,side==="L"?rig.haL:rig.haR);}
    function drawTorso(){const pel=rig.pelvis.point(),ch=rig.chest.point(),yaw=state.bodyYaw,front=.42+.58*Math.abs(Math.cos(yaw)),sw=d.shoulders*front,pw=d.pelvis*.86*front;const angle=Math.atan2(ch.y-pel.y,ch.x-pel.x)-Math.PI/2,cs=Math.cos(angle),sn=Math.sin(angle);const off=(p,w)=>({x:p.x+cs*w,y:p.y+sn*w});const shirt=spec.garment==="bare"?C.skin:C.shirt;polygon([off(ch,-sw*.46),off(ch,sw*.46),off(pel,pw*.48),off(pel,-pw*.48)],shirt);ellipseAt(rig.spineMid,sw*.39,d.rib*.42,shirt,0);ellipseAt(rig.pelvis,pw*.52,d.pelvis*.42,spec.garment==="bare"?C.skinDeep:C.pants,0);const l=rig.clavL.point(),r=rig.clavR.point();ctx.strokeStyle=spec.garment==="bare"?C.skinDeep:C.shirtDeep;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(l.x,l.y);ctx.quadraticCurveTo(ch.x,ch.y-d.rib*.1,r.x,r.y);ctx.stroke();
      // optional cloak/robe drape behind one shoulder
      if(spec.cloak||spec.garment==="cloak"||spec.garment==="robe"){ctx.fillStyle=C.shirtDeep;ctx.strokeStyle=C.ink;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(l.x-sw*.1,l.y);ctx.quadraticCurveTo(pel.x-pw*1.1,pel.y+d.thigh*.5,off(pel,-pw*.5).x-sw*.2,pel.y+d.thigh);ctx.lineTo(off(pel,-pw*.48).x,pel.y);ctx.closePath();ctx.fill();ctx.stroke();}
    }
    function drawNeck(){const ch=rig.chest.point(),sk=rig.skull.point(),w0=d.headR*.31,w1=d.headR*.23;const dx=sk.x-ch.x,dy=sk.y-ch.y,n=Math.hypot(dx,dy)||1,px=-dy/n,py=dx/n;const top={x:sk.x-dx*.12,y:sk.y-dy*.12},bot={x:ch.x+dx*.1,y:ch.y+dy*.1};polygon([{x:top.x+px*w1,y:top.y+py*w1},{x:top.x-px*w1,y:top.y-py*w1},{x:bot.x-px*w0,y:bot.y-py*w0},{x:bot.x+px*w0,y:bot.y+py*w0}],C.skin);}
    function drawHead(){const c=rig.skull.point(),R=d.headR,yaw=normAngle(state.headYaw+state.bodyYaw*.14),front=Math.cos(yaw),side=Math.sin(yaw),back=front<-.42,profile=Math.abs(side)>.72;ctx.save();ctx.translate(c.x,c.y);ctx.rotate(rig.skull.w.r);const sx=.72+.28*Math.abs(front),featureX=side*R*.3;
      const hairShown = spec.hair!=="bald";
      // back hair mass
      ctx.fillStyle=hairShown?C.hair:C.skin;ctx.strokeStyle=C.ink;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(-side*R*.08,-R*.05,R*1.04*sx,R*1.02,0,0,TAU);ctx.fill();ctx.stroke();
      // ears
      for(const es of [-1,1]){if(profile&&es*side<0)continue;ctx.fillStyle=C.skin;ctx.beginPath();ctx.ellipse(es*R*.93*sx+featureX*.18,R*.02,R*.15,R*.23,0,0,TAU);ctx.fill();ctx.stroke();}
      // face oval
      ctx.fillStyle=C.skin;ctx.beginPath();ctx.ellipse(0,0,R*.92*sx,R,0,0,TAU);ctx.fill();ctx.stroke();
      // crown hair
      if(hairShown){ctx.fillStyle=C.hair;ctx.beginPath();ctx.moveTo(-R*.92*sx,-R*.16);ctx.quadraticCurveTo(-R*.7*sx,-R*1.05,0,-R*1.04);ctx.quadraticCurveTo(R*.72*sx,-R*1.04,R*.94*sx,-R*.17);ctx.quadraticCurveTo(R*.38*sx,-R*.5,-side*R*.12,-R*.54);ctx.quadraticCurveTo(-R*.5*sx,-R*.58,-R*.92*sx,-R*.16);ctx.closePath();ctx.fill();ctx.stroke();}
      if(spec.hair==="curly"&&hairShown){ctx.fillStyle=C.hair;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.arc(i*R*.34,-R*.75,R*.24,0,TAU);ctx.fill();}}
      if(!back){
        // ---------- EXPRESSIVE FACE ----------
        // Channels used: blinkL/R, eyeWide, eyeNarrow, gazeX/Y, browUp, browKnit,
        // smile, frown, jaw, mouthAsym, mouthPucker, voiceEnergy, headPitch.
        const eyeY=-R*.10+state.headPitch*R*.08, eyeDx=R*.34*sx;
        const smile=state.smile||0, frown=state.frown||0, jaw=state.jaw||0;
        const browUp=state.browUp||0, browKnit=state.browKnit||0, asym=state.mouthAsym||0;
        // ---- eyes: almond lid + pupil + expressive brow ----
        for(const [es,blink] of [[-1,state.blinkL||0],[1,state.blinkR||0]]){
          if(profile&&es*side<0)continue;
          const ex=featureX+es*eyeDx;
          const open=clamp(1-blink*1.4+(state.eyeWide||0)*.5-(state.eyeNarrow||0)*.7,.05,1.4);
          const ew=R*.185, eh=R*.15*open;
          // white almond (upper + lower lid arcs)
          ctx.fillStyle=C.eye;ctx.strokeStyle=C.ink;ctx.lineWidth=R*.028;
          ctx.beginPath();ctx.moveTo(ex-ew,eyeY);
          ctx.quadraticCurveTo(ex-ew*.15,eyeY-eh,ex+ew,eyeY);
          ctx.quadraticCurveTo(ex+ew*.15,eyeY+eh*.85,ex-ew,eyeY);
          ctx.closePath();ctx.fill();
          // iris + pupil, clipped to the eye
          ctx.save();ctx.clip();ctx.fillStyle=C.ink;
          const px=ex+(state.gazeX||0)*R*.07+side*R*.05, py=eyeY+(state.gazeY||0)*R*.06+R*.015;
          ctx.beginPath();ctx.arc(px,py,R*.078,0,TAU);ctx.fill();
          ctx.fillStyle=C.eye;ctx.beginPath();ctx.arc(px-R*.025,py-R*.025,R*.022,0,TAU);ctx.fill(); // catchlight
          ctx.restore();
          // heavier upper-lid line (the expressive stroke)
          ctx.strokeStyle=C.ink;ctx.lineWidth=R*.045;ctx.lineCap="round";
          ctx.beginPath();ctx.moveTo(ex-ew,eyeY);ctx.quadraticCurveTo(ex-ew*.15,eyeY-eh,ex+ew,eyeY);ctx.stroke();
          // brow: inner end drops with knit (anger/worry), whole brow rises with browUp
          const innerX=ex+es*ew*.9, outerX=ex-es*ew*.95;
          const base=eyeY-R*.28-browUp*R*.15;
          const innerY=base+browKnit*R*.11 - browUp*R*.02;
          const outerY=base-browUp*R*.02 + asym*es*R*.03;
          ctx.lineWidth=R*.085;ctx.lineCap="round";
          ctx.beginPath();ctx.moveTo(innerX,innerY);ctx.quadraticCurveTo(ex,base-R*.05,outerX,outerY);ctx.stroke();
        }
        // ---- nose: bridge + defined tip + nostrils ----
        const nx=featureX+side*R*.12, ntipY=eyeY+R*.44;
        ctx.strokeStyle=C.ink;ctx.lineWidth=R*.04;ctx.lineCap="round";ctx.lineJoin="round";
        ctx.beginPath();
        ctx.moveTo(featureX+side*R*.05, eyeY+R*.02);
        ctx.lineTo(nx, ntipY-R*.05);
        ctx.quadraticCurveTo(nx+side*R*.07, ntipY+R*.03, nx-R*.03+side*R*.04, ntipY);   // tip
        ctx.stroke();
        ctx.fillStyle=C.ink;
        for(const es of (profile?[side>0?1:-1]:[-1,1])){ ctx.beginPath();ctx.ellipse(nx+es*R*.085,ntipY-R*.01,R*.028,R*.019,0,0,TAU);ctx.fill(); }
        // ---- mouth: two lips, corner lift/drop, teeth, philtrum ----
        const my=R*.60+state.headPitch*R*.05;
        const mw=R*(.28+smile*.14-(state.mouthPucker||0)*.12);
        const corner=(smile-frown)*R*.14;
        const open=jaw*R*.5+(state.voiceEnergy||0)*R*.06;
        ctx.save();ctx.translate(featureX+asym*R*.06, my);ctx.strokeStyle=C.ink;ctx.lineWidth=R*.045;ctx.lineJoin="round";ctx.lineCap="round";
        if(open<R*.05){
          ctx.beginPath();ctx.moveTo(-mw,-corner);ctx.quadraticCurveTo(0,-corner-R*.015+frown*R*.05,mw,-corner);ctx.stroke();     // lip seam
          ctx.beginPath();ctx.moveTo(-mw*.82,-corner+R*.01);ctx.quadraticCurveTo(0,R*.09+frown*R*.05,mw*.82,-corner+R*.01);ctx.stroke(); // lower lip
        } else {
          ctx.fillStyle=C.mouth;ctx.beginPath();ctx.moveTo(-mw,-corner);
          ctx.quadraticCurveTo(0,-corner-open*.2,mw,-corner);
          ctx.quadraticCurveTo(mw*.6,open*.7,0,open);ctx.quadraticCurveTo(-mw*.6,open*.7,-mw,-corner);
          ctx.closePath();ctx.fill();ctx.stroke();
          ctx.save();ctx.clip();ctx.fillStyle=C.teeth;ctx.fillRect(-mw,-corner-open*.08,mw*2,open*.42);ctx.restore();
        }
        ctx.restore();
        // philtrum
        ctx.strokeStyle=C.ink;ctx.lineWidth=R*.028;ctx.beginPath();ctx.moveTo(nx-R*.01,ntipY+R*.02);ctx.lineTo(featureX+asym*R*.06,my-corner-R*.05);ctx.stroke();
        // nasolabial creases on strong smile/frown
        if(Math.abs(smile-frown)>.45){const s=Math.sign(smile-frown);ctx.lineWidth=R*.026;
          for(const es of [-1,1]){ if(profile&&es*side<0)continue; ctx.beginPath();ctx.moveTo(nx+es*R*.11,ntipY-R*.02);ctx.quadraticCurveTo(featureX+es*R*.24,my-R*.05,featureX+es*mw*1.15,my-corner+s*R*.02);ctx.stroke(); }}
        // beard — frames the jaw BELOW the mouth (mouth sits at ~R*.5), so it
        // never reads as a grin. Cheeks->chin, opening left for the mouth.
        if(spec.beard){ctx.fillStyle=C.hair;ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.beginPath();
          ctx.moveTo(-R*.66*sx,R*.28);
          ctx.quadraticCurveTo(-R*.6,R*1.18,0,R*1.26);
          ctx.quadraticCurveTo(R*.6,R*1.18,R*.66*sx,R*.28);
          ctx.quadraticCurveTo(R*.34,R*.72,0,R*.76);        // upper edge dips below the mouth
          ctx.quadraticCurveTo(-R*.34,R*.72,-R*.66*sx,R*.28);
          ctx.closePath();ctx.fill();ctx.stroke();
          // moustache strokes above the mouth line
          ctx.strokeStyle=C.ink;ctx.lineWidth=R*.05;ctx.beginPath();ctx.moveTo(featureX-R*.2,R*.42);ctx.quadraticCurveTo(featureX,R*.5,featureX-R*.02,R*.46);ctx.moveTo(featureX+R*.2,R*.42);ctx.quadraticCurveTo(featureX,R*.5,featureX+R*.02,R*.46);ctx.stroke();}
        // glasses
        if(spec.glasses){ctx.strokeStyle=C.ink;ctx.lineWidth=R*.045;for(const es of [-1,1]){if(profile&&es*side<0)continue;const ex=featureX+es*eyeDx;ctx.beginPath();ctx.ellipse(ex,eyeY,R*.24,R*.2,0,0,TAU);ctx.stroke();}ctx.beginPath();ctx.moveTo(featureX-eyeDx+R*.24,eyeY);ctx.lineTo(featureX+eyeDx-R*.24,eyeY);ctx.stroke();}
      }
      ctx.restore();}

    // ---- composite in depth order ----
    drawShadow();
    const frontL=Math.sin(state.bodyYaw)<=0;
    drawLeg(frontL?"R":"L"); drawLeg(frontL?"L":"R");
    drawArm(frontL?"R":"L"); drawTorso(); drawNeck(); drawHead(); drawArm(frontL?"L":"R");

    // report normalized anchors for scene attachment
    const norm=p=>({x:clamp(p.x/W,0,1),y:clamp(p.y/H,0,1)});
    return { anchors:{
      head:norm(rig.skull.point()), crown:norm(rig.skull.point(0,-d.headR)),
      neck:norm(rig.chest.point(0,-d.rib*.5)), hip:norm(rig.pelvis.point()),
      leftHand:norm(rig.haL.point()), rightHand:norm(rig.haR.point()),
      leftFoot:norm(rig.footL.point()), rightFoot:norm(rig.footR.point()),
    }};
  }

  return { draw, rig, spec, POSES, poseIds:POSE_IDS };
}
export const HERO_VERSION = "hero/1.0.0";
