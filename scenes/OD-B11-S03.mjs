/* ============================================================
   SCENE  OD-B11-S03 — Tiresias Names the Cost
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Tiresias drinks the blood and recognizes Odysseus.
     2. He warns that Poseidon pursues him for blinding Polyphemus.
     3. He orders the crew to spare the Sun's cattle or face shipwreck and total loss.
     4. He foretells Odysseus's lone return, the suitors' punishment, and a final
        inland journey carrying an oar.
     5. After a distant sacrifice to Poseidon, death will come gently in old age.

   Stage layout (back -> front, one master clock):
     CIMMERIAN SHORE + UNDERWORLD PIT fills the whole field — the sunless land,
     the trench at the world's edge where the dead are summoned.
       -> the BLOOD-PIT BOUNDARY low-centre, the dark blood the prophet drinks:
          it drains from FILLED to DRAINED as Tiresias takes his fill and speaks.
       -> the PROPHECY PATH as a routing vision panel on the upper right: the fork
          keyed to the Sun's cattle (SPARED -> ship safe home + the inland oar;
          KILLED -> a wreck) — the branching future he lays out, resolving to the
          spared road (lone return) as he names the cost.
       -> TIRESIAS'S SHADE left-of-centre, faint but clearing as the blood gives
          him sight: leaning, then clarity, then prophesying with an arm flung up.
       -> the GOLDEN STAFF OF TIRESIAS planted between prophet and king, the
          underworld authority object, lifting from planted to prophecy-glint.
       -> ODYSSEUS right-foreground, turned to the shade, listening — his open
          petition darkening to grief as the cost is named.
   The recognition, Poseidon's pursuit, the cattle-order, the lone return with the
   oar, and the gentle death after the far sacrifice — all held on one clock.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import shore from "../assets/location/cimmerian-shore-and-underworld-pit.mjs";
import bloodpit from "../assets/set_piece/blood-pit-boundary.mjs";
import prophecy from "../assets/divine_fx/prophecy-path.mjs";
import tiresias from "../assets/character/tiresiass-shade.mjs";
import staff from "../assets/prop/golden-staff-of-tiresias.mjs";
import odysseus from "../assets/character/odysseus.mjs";

export const scene = {
  id:"OD-B11-S03",
  title:"Tiresias Names the Cost",
  book:1,
  beats:[
    "Tiresias drinks the blood and recognizes Odysseus.",
    "He warns that Poseidon pursues him for blinding Polyphemus.",
    "He orders the crew to spare the Sun's cattle or face shipwreck and total loss.",
    "He foretells Odysseus's lone return, the suitors' punishment, and a final inland journey carrying an oar.",
    "After a distant sacrifice to Poseidon, death will come gently in old age.",
  ],
  exitState:"After a distant sacrifice to Poseidon, death will come gently in old age.",
  duration:34,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // CIMMERIAN SHORE + UNDERWORLD PIT — the full sunless backdrop: sky, sea,
    // grove, the trench at the world's edge. No characters baked in.
    { asset:"location.cimmerian-shore-and-underworld-pit", instance:"shore_01",
      anchor:{x:.50,y:1.00}, scale:1.00 },

    // BLOOD-PIT BOUNDARY — the dark blood low-centre the prophet drinks; it
    // drains as he takes his fill and gains sight.
    { asset:"set_piece.blood-pit-boundary", instance:"pit_01",
      anchor:{x:.45,y:1.00}, scale:.34 },

    // PROPHECY PATH — the branching future as a routing vision panel, upper-right:
    // the cattle fork, resolving to the spared road (lone return + inland oar).
    { asset:"divine_fx.prophecy-path", instance:"path_01",
      anchor:{x:.85,y:.82}, scale:.46 },

    // TIRESIAS'S SHADE — left-of-centre, faint then clearing: leaning -> clarity
    // -> prophesying with the arm flung up, gaze across to Odysseus.
    { asset:"character.tiresiass-shade", instance:"tiresias_01",
      anchor:{x:.30,y:1.00}, scale:.56, pose:"tir_lean", band:"threeq",
      gaze:{x:.34,y:0} },

    // GOLDEN STAFF OF TIRESIAS — planted between prophet and king, the underworld
    // authority object; lifts from planted to prophecy-glint as he speaks.
    { asset:"prop.golden-staff-of-tiresias", instance:"staff_01",
      anchor:{x:.49,y:1.00}, scale:.50 },

    // ODYSSEUS — right-foreground, turned to the shade, listening; his open
    // petition darkening to grief as the cost is named.
    { asset:"character.odysseus", instance:"odysseus_01",
      anchor:{x:.70,y:1.00}, scale:.48, pose:"three_quarter_left", band:"threeq",
      gaze:{x:-.36,y:.02} },
  ],

  // ordered ops on ONE clock (the render is sampled at --t)
  timeline:[
    // beat 1: Tiresias drinks the blood and recognizes Odysseus — the stooped,
    // sightless hush lifts into the surge of clarity.
    { op:"actor.pose", target:"tiresias_01", at:0.0,  args:{ pose:"tir_lean" } },
    { op:"actor.pose", target:"tiresias_01", at:4.0,  args:{ pose:"tir_clarity" } },
    { op:"actor.gaze", target:"odysseus_01", at:0.0,  args:{ gaze:{x:-.36,y:.02} } },
    // beat 2: he warns Poseidon pursues him — the prophecy proper begins, arm up.
    { op:"actor.pose", target:"tiresias_01", at:8.0,  args:{ pose:"tir_prophesy" } },
    { op:"actor.gaze", target:"tiresias_01", at:8.0,  args:{ gaze:{x:.30,y:-.04} } },
    // beat 3: the cattle-order — spare the Sun's herds or face shipwreck; the
    // fork of futures is laid out and the staff points the warning.
    { op:"fx.play",    target:"path_01",     at:12.0, args:{} },
    // beat 4: the lone return, the suitors' punishment, the inland oar — the
    // spared road resolves; Odysseus turns from petition toward grief.
    { op:"actor.gaze", target:"odysseus_01", at:20.0, args:{ gaze:{x:-.14,y:.14} } },
    // beat 5 (exit): after the far sacrifice to Poseidon, a gentle death in age.
    { op:"timeline.capture", target:"OD-B11-S03", at:33.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: the sunless shore, the blood pit, the prophecy vision panel,
     then Tiresias, his golden staff, and Odysseus in the foreground. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    for (const c of scene.cast){
      const s = st[c.instance] || {};
      const anchor = s.anchor || c.anchor;
      let mod, state;

      if (c.instance === "shore_01"){
        mod = shore;
        // the sunless world's-edge backdrop, held across the whole scene.
        state = { t, status:"SUNLESS", progress:.2,
                  layers:["sky","sea","grove","shore","rivers","ship","ghostring","trench","sacrifice"] };

      } else if (c.instance === "pit_01"){
        mod = bloodpit;
        // the blood drains from FILLED to DRAINED as the prophet drinks his fill.
        const phase = t < 4 ? "filled" : "drained";
        state = { t, phase,
                  layers:["ground","deadside","trench","blood","boundary"],
                  status: phase==="filled" ? "WARDED" : "DRAINED",
                  progress: phase==="filled" ? .55 : .90 };

      } else if (c.instance === "path_01"){
        mod = prophecy;
        // the cattle fork: laid out as both futures once he gives the order
        // (fx.play at 12), then resolving to the SPARED road (lone return + the
        // inland oar) as he foretells the homecoming.
        const pt = (s.fxT != null) ? s.fxT : Math.max(0, t - 12.0);
        const branch = t >= 20 ? "spared" : "none";
        state = { t: Math.min(1, pt / 8),
                  branch,
                  status: branch==="spared" ? "SPARED" : "FORESEEN",
                  progress: branch==="spared" ? 1.0 : .5,
                  layers:["taxis","routes","source","fork","outcomes","token"] };

      } else if (c.instance === "staff_01"){
        mod = staff;
        // the authority object: planted upright while he drinks, then rising to
        // prophecy-glint as he speaks the whole future — a clear vertical staff.
        const mode = t < 4 ? "ground" : "prophecy";
        state = { mode, t,
                  status: mode.toUpperCase(),
                  progress: mode==="prophecy" ? 1.0 : mode==="point" ? .62 : .10 };

      } else {
        // characters: fold pose/gaze/band from the timeline; placeInstance owns
        // the anchor/scale. Emotion channels ride on the pose so each reads clearly.
        state = { t:0.5, band:s.band || c.band,
                  pose:s.pose || c.pose, gaze:s.gaze || c.gaze };

        if (c.instance === "tiresias_01"){
          mod = tiresias;
          // faint at first (leaning, sightless), clearing as the blood gives him
          // sight, and clearest of all once he prophesies the cost.
          const clear = (s.pose === "tir_clarity" || s.pose === "tir_prophesy");
          state.clarity = clear;
          state.blink = .92;

        } else { // odysseus_01
          mod = odysseus;
          // turned to the shade, listening: open petition darkening to grief as
          // the lone return and the long cost are named.
          const grieved = t >= 20;
          state.pose = grieved ? "grief" : c.pose;
          state.browUp = grieved ? .42 : .22;
          state.browKnit = grieved ? .5 : .08;
          state.smile = grieved ? 0 : .12;
          state.eyeNarrow = grieved ? .2 : 0;
        }
      }

      placeInstance(offctx, W, H, mod, { anchor, scale:c.scale, state });
    }
  },
};
export default scene;
