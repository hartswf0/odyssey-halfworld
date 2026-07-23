/* ============================================================
   SCENE CONTRACT  ·  odyssey-halfworld
   A scene module COMPOSES existing assets on one clock. It must NOT redefine
   any asset's appearance. Shape:

   export const scene = {
     id:"OD-B01-S01", title:"The Gods Consider Odysseus", book:1,
     beats:[ "...", ... ],                 // View-1 timeline, causal order
     exitState:"...",                       // serialized continuity for next scene
     duration: 42,                          // seconds on the master clock

     cast:[                                 // which assets, where, initial pose
       { asset:"character.zeus", instance:"zeus_01", anchor:{x:.5,y:.72}, scale:.42, pose:"neutral_front" },
       ...
     ],
     timeline:[                             // ordered ops on ONE clock
       { op:"actor.pose", target:"zeus_01", at:8.0, args:{ pose:"speaking" } },
       { op:"fx.play",    target:"absence_01", at:2.0, args:{} },
       { op:"timeline.capture", target:"OD-B01-S01", at:41.0, args:{ label:"EXIT" } },
     ],

     // stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     // offscreen buffer at time t (evaluate timeline -> per-instance state).
     // The engine runs ONE dotify+card pass over the whole stage (renderScene).
     stage(offctx, W, H, t){ ... placeInstance(...) per cast member ... },
   };

   Verify with:  node harness/render-scene.mjs scenes/<ID>.mjs [--t 8]
   ============================================================ */
export const SCENE_CONTRACT_VERSION = "hw-scene/1.0.0";

/* stateAt: fold the timeline up to time t into a per-instance state map.
   Scene modules may import and use this to drive stage(). */
export function stateAt(scene, t){
  const st = {};
  for (const c of scene.cast||[]) st[c.instance] = { pose:c.pose, band:c.band, gaze:c.gaze, visible:true };
  for (const op of (scene.timeline||[]).slice().sort((a,b)=>a.at-b.at)){
    if (op.at>t) break;
    const s = st[op.target]; if(!s) continue;
    if (op.op==="actor.pose") s.pose = op.args.pose;
    else if (op.op==="actor.gaze") s.gaze = op.args.gaze;
    else if (op.op==="actor.move") { s.anchor = op.args.anchor; }
    else if (op.op==="fx.play") s.fxT = t - op.at;
    else if (op.op==="actor.hide") s.visible = false;
  }
  return st;
}
export function validateScene(s){
  const errors=[], warnings=[];
  if(!s||typeof s!=="object") return {ok:false,errors:["no scene export"],warnings};
  if(typeof s.id!=="string") errors.push("id required");
  if(!Array.isArray(s.cast)||!s.cast.length) errors.push("cast[] required");
  if(typeof s.stage!=="function") errors.push("stage(ctx,W,H,t) required");
  if(!Array.isArray(s.timeline)) warnings.push("timeline[] recommended");
  return {ok:errors.length===0,errors,warnings};
}
