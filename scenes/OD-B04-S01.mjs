/* ============================================================
   SCENE  OD-B04-S01 — The Double Wedding at Sparta
   A thin Halfworld composition module. It COMPOSES existing atlas assets on
   one clock — it never redraws them. The engine runs ONE dotify + scene card
   over the whole stage, so every instance shares a single halftone.

   Beats (causal order):
     1. Telemachus and Pisistratus reach Menelaus's palace during a double
        wedding feast.
     2. Eteoneus asks whether strangers should be admitted; Menelaus rebukes
        the hesitation.
     3. Attendants unharness the horses, bathe the guests, and seat them at
        the feast.
     4. Telemachus marvels at the palace's brilliance while Menelaus speaks
        of the grief beneath wealth.

   Stage layout (back -> front):
     the luminous high-roofed hall of Menelaus (colonnades, gate, treasure,
     wedding-feast table — full frame)
       -> the wedding household mid-celebration across the feast floor
       -> Menelaus the host, arms opened in welcome that shades into grief
       -> Pisistratus, the gracious young companion
       -> Telemachus, marvelling up at the glittering hall (foreground).
   The palace supplies the whole set in one navigable interior; the household
   fills it with the double-wedding feast; the host receives the two princes.
   ============================================================ */
import { placeInstance } from "../engine/halfworld-engine.mjs";
import { stateAt } from "./_scene-contract.mjs";

// existing atlas assets — COMPOSE, do not redraw
import palace      from "../assets/location/menelauss-palace.mjs";
import household   from "../assets/ensemble/wedding-household.mjs";
import menelaus    from "../assets/character/menelaus.mjs";
import pisistratus from "../assets/character/pisistratus.mjs";
import telemachus  from "../assets/character/telemachus.mjs";

export const scene = {
  id:"OD-B04-S01",
  title:"The Double Wedding at Sparta",
  book:1,
  beats:[
    "Telemachus and Pisistratus reach Menelaus's palace during a double wedding feast.",
    "Eteoneus asks whether strangers should be admitted; Menelaus rebukes the hesitation.",
    "Attendants unharness the horses, bathe the guests, and seat them at the feast.",
    "Telemachus marvels at the palace's brilliance while Menelaus speaks of the grief beneath wealth.",
  ],
  exitState:"Telemachus marvels at the palace's brilliance while Menelaus speaks of the grief beneath wealth.",
  duration:44,

  // asset · instance · anchor(feet/base, normalized) · scale · pose
  cast:[
    // the luminous high-roofed Spartan hall: colonnades, gate to daylight,
    // gleaming treasure, guest seats, the double-wedding feast table — full set
    { asset:"location.menelauss-palace", instance:"palace_01",
      anchor:{x:.50,y:1.00}, scale:1.00, pose:"wedding-feast" },

    // the household mid-celebration across the feast floor: kinsmen, the wedded
    // pairs, a bard, tumblers, servants — the double wedding in full swing
    { asset:"ensemble.wedding-household", instance:"household_01",
      anchor:{x:.50,y:.845}, scale:.58, pose:"celebrating" },

    // the war-returned king, host of the hall — welcome that opens onto grief.
    // Largest foreground figure, left, turned toward the two arriving guests.
    { asset:"character.menelaus", instance:"menelaus_01",
      anchor:{x:.290,y:.985}, scale:.40, pose:"menelaus_hosting",
      gaze:{x:.24,y:.02}, band:"threeq" },

    // Nestor's son, the gracious young companion, outermost right
    { asset:"character.pisistratus", instance:"pisistratus_01",
      anchor:{x:.860,y:.995}, scale:.31, pose:"three_quarter_right",
      gaze:{x:-.24,y:.02}, band:"threeq" },

    // the young prince of Ithaca, marvelling up at the glittering hall
    { asset:"character.telemachus", instance:"telemachus_01",
      anchor:{x:.640,y:.995}, scale:.33, pose:"neutral",
      gaze:{x:-.10,y:-.16}, band:"threeq" },
  ],

  // ordered ops on ONE clock (render is sampled at --t)
  timeline:[
    // beat 2: Menelaus rebukes the hesitation — the lavish host, arms wide,
    // then the welcome shades into the sorrow beneath the wealth
    { op:"actor.pose", target:"menelaus_01",    at:5.0,  args:{ pose:"menelaus_welcome_grief" } },
    { op:"actor.gaze", target:"menelaus_01",    at:5.0,  args:{ gaze:{x:-.16,y:.20} } },
    // beat 3: Pisistratus, received and seated, turns an easy host's face inward
    { op:"actor.pose", target:"pisistratus_01", at:4.0,  args:{ pose:"three_quarter_right" } },
    // beat 4: Telemachus lifts his eyes and marvels at the palace's brilliance
    { op:"actor.pose", target:"telemachus_01",  at:6.0,  args:{ pose:"astonished" } },
    { op:"actor.gaze", target:"telemachus_01",  at:6.0,  args:{ gaze:{x:-.06,y:-.30} } },
    // beat 4 exit: the marvel of the hall over the grief beneath its wealth
    { op:"timeline.capture", target:"OD-B04-S01", at:43.0, args:{ label:"EXIT" } },
  ],

  /* stage(offctx, W, H, t): draw every cast instance in SOLID tones into the
     offscreen buffer at time t. The engine supplies the single dotify+card pass.
     Back -> front: palace set, wedding household, host, companion, marvelling
     prince. */
  stage(offctx, W, H, t){
    const st = stateAt(scene, t);

    // the feast warms over the clock: the household turns from busy celebration
    // to a toast that sweeps the hall as the guests are received and seated
    const toasting = t >= 4;

    for (const c of scene.cast){
      const s = st[c.instance] || {};

      if (c.instance === "palace_01"){
        placeInstance(offctx, W, H, palace, {
          anchor:c.anchor, scale:c.scale,
          state:{ layers:["roof","backwall","gate","floor","colonnade","tripods","seats","bath","stable","feast"] },
        });
        continue;
      }

      if (c.instance === "household_01"){
        placeInstance(offctx, W, H, household, {
          anchor:c.anchor, scale:c.scale,
          state:{ attention: toasting ? 0.9 : 0.5, spread:1.15, density:1.0,
                  reacting: toasting, wave: toasting ? 0.5 : 0,
                  garlands:true, focus:{ x:0.49, y:0.66 } },
        });
        continue;
      }

      // the three named figures: fold pose/gaze/band from the timeline
      const mod = c.instance === "menelaus_01"    ? menelaus
                : c.instance === "pisistratus_01" ? pisistratus
                : telemachus;
      const state = { t:0.42, band:c.band, gaze:c.gaze, ...s, anchor:undefined };
      placeInstance(offctx, W, H, mod, { anchor:c.anchor, scale:c.scale, state });
    }
  },
};
export default scene;
