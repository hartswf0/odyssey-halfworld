/* ============================================================================
   assets/character/_face.mjs — THE CLOSE-UP PUPPET.

   figure-hero draws a whole body and gives its head a radius of forty to
   seventy-five pixels. At the MESH pipeline's 3.4px dot pitch that is a mouth
   about twelve dots wide and, at full gape, eleven dots tall. Eleven dots is
   enough to say A MOUTH IS OPEN. It is not enough to say WHICH SHAPE, and the
   difference between those two is the difference between a face that is
   speaking and a face that is chewing.

   So this is a second head, built for one job: to be the only thing in the
   frame while someone says one sentence. At the CLOSE framing the head radius
   is about 300px — the mouth is sixty dots across and the aperture up to forty
   — and at that size the lattice can carry articulation. Everything below is
   an argument about what to spend those dots on.

   ---------------------------------------------------------------------------
   THE ONE ANATOMICAL FACT THIS FILE IS ORGANISED AROUND.

       THE UPPER LIP BELONGS TO THE SKULL.
       THE LOWER LIP RIDES THE JAW.

   Almost every bad lip-sync in the world draws a mouth as a single shape that
   grows and shrinks about its own centre. Real speech is not symmetrical: the
   maxilla does not move, ever, and the mandible swings about an axis through
   the ears. When you say "ah", your top lip stays exactly where it was and your
   chin travels. A mouth that opens symmetrically reads as a hole in a mask.

   Which means the JAW is not a mouth parameter here — it is a bone. It rotates
   a real mandible: the chin drops, the face lengthens, the jawline swings back,
   the cheek follows, and the lower lip and the chin move TOGETHER because they
   are attached to the same bone. The mouth aperture is a CONSEQUENCE of that
   rotation, not a drawing of it.

   The silhouette is therefore computed per frame as ONE closed path — cranium
   (fixed) joined to mandible (rotated) — and filled and contoured once. Two
   overlapping shapes would print a seam across the cheek, and in a world whose
   entire identity is hard contour, a spurious contour is not a small error.

   ---------------------------------------------------------------------------
   WHAT GETS DOTS, AND WHAT DOES NOT.

   BUILD-BRIEF trap 5 is the dot floor: detail finer than the lattice does not
   become subtle, it becomes noise, and then it becomes nothing. At R=300 the
   floor is roughly 12px — anything thinner than that is a gamble. So:

     SPENT ON     the mouth (60 dots wide), the eyes and their lids, the brows,
                  the jawline, and for Iona the four deep lines the text names.
     NOT DRAWN    skin texture, eyelashes, individual hair strands, iris detail
                  beyond a pupil and one catchlight, lip vermilion borders as
                  separate strokes from the lip mass.

   BUILD-BRIEF trap 1 is that everything comes out two to three levels too dark.
   A face is mostly paper. The skin plane is a light tone, the contour does the
   work, and the only near-black in the frame is the inside of the mouth — which
   is correct, and useful, because it means the aperture is the darkest thing on
   screen and the eye goes straight to it.

   ---------------------------------------------------------------------------
   PURE. drawCloseup() is a function of (spec, state) and nothing else.
   ========================================================================= */

import { INK, PAPER, gray, inkLevel, clamp, clamp01, lerp, shade } from "../../../engine/halfworld-engine.mjs";

/* ── PORTED WHOLE FROM THE SIBLING FILM ────────────────────────────────────
   This file and engine/speech.mjs are 1,043 lines that already exist, already
   work, and are already the reason that film's close-ups have mouths that
   move. Nothing in them is Odyssey-specific, so nothing in them was rewritten.

   What a new cast actually costs is the table at the bottom of this file:
   EIGHT LINES OF PARAMETERS PER FACE. Twelve faces is about a hundred lines.
   The expensive-sounding part of "give the film real close-ups" was never the
   engine — it was believing it had to be written.
─────────────────────────────────────────────────────────────────────────── */
export const SURFACE = {
  // skin. Two values only: a working adult under fluorescent tube, and Niko's
  // "cruelly healthy complexion of someone whose body had not yet begun
  // keeping a public account of every private mistake" — which in a world of
  // eight ink levels is one step lighter and nothing else.
  skin: "#e0dacd",
  skinYoung: "#e9e3d8",
  skinOld: "#ded9cf",
  // laboratory clothing. The text never describes what Mara or Niko wear; the
  // rig requires a value, so they get the lightest closed garment the palette
  // has ("dress" -> #9a9a92) and the choice is flagged in both modules rather
  // than dressed up as characterisation.
  lab: "dress",
  // the one dark garment in the cast, and the only one the text names
  navy: gray(0x4a),
  navyDeep: gray(0x33),
  // hair
  hairDark: "#2a2a28",
  // PASS 2: the rig paints hair as one solid mass, so a "dark" hair colour
  // prints as a level-7 slab on top of the head. Dark hair in this world is a
  // level 5; the ink contour is what makes it hair.
  hairMid: "#4e4b46",
  hairWhite: "#e2e0da",
  // hardware and objects: acrylic, steel, waxed paper, ceramic, rust
  acrylic: gray(0xe8),
  steel: gray(0xa6),
  waxed: gray(0xdc),
  rust: gray(0x8c),
  shoeLab: "#3a3a36",
};

const TAU = Math.PI * 2;
const sm = (t) => { t = clamp01(t); return t * t * (3 - 2 * t); };

/* ============================================================================
   THE FACES.

   Five heads that must be told apart at a glance, in silhouette, in eight ink
   levels, with no colour. Every value below is either taken from the character
   module's own BASE spec (skin, hair, colour, age) or is a proportion invented
   here — and the invented ones are marked, because a close-up is the first
   thing in this world that has ever needed a cheekbone.

   The proportions are a small budget deliberately: `faceW`, `jawW`, `chin`,
   `brow`, `eyeGap` and `nose`. Six numbers is enough to separate five people
   and few enough that no one of them can be tuned into a caricature. The
   distinguishing marks that actually carry recognition at contact-sheet size
   are the HAIR MASS and the JAW WIDTH, which is why those two are the widest
   spread in the table.
   ========================================================================= */

/* ── HAIR IS NOT A SMOOTH SHAPE ────────────────────────────────────────────
   The first cut drew every beard as one black spade with a clean quadratic
   edge, and every head as the same clean cap. Twelve characters came out
   wearing the same two objects in different sizes, and a smooth-edged mass on
   a chin does not read as a beard — it reads as a bib.

   What separates hair from a shape in a hard-contour world is that its EDGE is
   broken. So a hair silhouette is built as a ring of points and each one is
   pushed out along its own normal by a seeded amount: the contour stays one
   closed path, obeying the dot law, but its boundary is ragged at the scale of
   a few dots. Same trick the world already uses for a broken floor line.

   The seed is the character's own name, so a beard is stable across every
   frame of the film and different from every other beard in it.
──────────────────────────────────────────────────────────────────────────── */
function seedOf(str){ let h=2166136261>>>0;
  for(let i=0;i<String(str).length;i++){ h^=String(str).charCodeAt(i); h=Math.imul(h,16777619)>>>0; }
  return h; }
function rnd2(seed, i){ const s=Math.sin((seed%9973)*0.017 + i*12.9898)*43758.5453; return s-Math.floor(s); }

/** Close a ragged path through pts (array of [x,y]), roughening each vertex
 *  along its outward normal. amp is in the same units as the points. */
function raggedPath(g, pts, seed, amp, closed=true){
  const n=pts.length;
  const out=[];
  for(let i=0;i<n;i++){
    const [x,y]=pts[i];
    const [px,py]=pts[(i-1+n)%n], [nx,ny]=pts[(i+1)%n];
    let tx=nx-px, ty=ny-py; const L=Math.hypot(tx,ty)||1; tx/=L; ty/=L;
    const ox=ty, oy=-tx;                       // outward normal
    const j=(rnd2(seed,i)-0.35)*amp;
    out.push([x+ox*j, y+oy*j]);
  }
  g.beginPath();
  g.moveTo(out[0][0], out[0][1]);
  for(let i=1;i<n;i++){
    const [ax,ay]=out[i-1], [bx,by]=out[i];
    g.quadraticCurveTo(ax+(bx-ax)*0.5+(rnd2(seed,i+400)-0.5)*amp*0.7,
                       ay+(by-ay)*0.5+(rnd2(seed,i+800)-0.5)*amp*0.7, bx, by);
  }
  if(closed) g.closePath();
}

/* Five beards, because there are five bearded men and they are not the same
   man. The profile is [halfWidth, topAtCentre, bottomAtCentre, sideTop, amp]
   in R units — a groomed court beard and a matted giant's beard differ in
   exactly those numbers plus how ragged the edge is allowed to be. */
const BEARDS = {
/* `side` is where the beard meets the face at its widest, and it was set at
   0.20–0.34 — down around the nose. A beard that starts there leaves the whole
   cheek bare and reads as a chin-strap with an empty face above it. A full
   beard climbs the cheek and JOINS THE HAIRLINE at the sideburn; that junction
   is most of what makes it look attached rather than stuck on. `w` was also
   under the width of the face itself, so the beard did not reach the jaw's own
   edge. Both widened. `burn` is how far the sideburn runs up to meet the hair. */
  /* Odysseus wears `full` and plays it WITHOUT a moustache. At this dot pitch
     the tache is a solid bar across the aperture, and he is the one man in the
     cast whose mouth has to be read on every close-up in the film — he holds
     512 seconds of key-beat time, more than twice anyone else. The beard keeps
     the jaw; the mouth stays legible. */
  full:    { w:1.02, top:0.26, bot:0.34, side:-0.06, burn:0.95, amp:0.055, tache:0 },
  long:    { w:0.94, top:0.30, bot:0.86, side:0.04, burn:0.90, amp:0.070, tache:1 },
  short:   { w:0.98, top:0.20, bot:0.10, side:0.06, burn:0.85, amp:0.048, tache:1 },
  groomed: { w:0.92, top:0.24, bot:0.22, side:0.10, burn:0.80, amp:0.026, tache:1 },
  wild:    { w:1.14, top:0.34, bot:0.62, side:-0.22, burn:1.05, amp:0.135, tache:0 },
};

export const FACES = {
  /* ── THE ODYSSEY, TWELVE FACES ────────────────────────────────────────────
     Not eighty-seven. Measured over the film's own key beats, twelve speakers
     hold 75% of everything said on screen once the narrator — a voice with no
     body, and the single most wasted face available — is taken out.

     Homer is close to silent on faces. He gives epithets, and an epithet is a
     claim about BEARING, not features: πολύμητις is not a nose. So each face
     below spends its parameters on the one thing the poem actually asserts,
     and says which line it is spending.
  ─────────────────────────────────────────────────────────────────────────── */

  /* ODYSSEUS. πολύτροπος — of many turns. The poem's claims are that he is
     weathered, broad, and shorter than he looks until he speaks. The scar is
     drawn by his own module, not here; a face table has no business owning the
     one mark that proves identity. Widest jaw in the cast, heaviest brow: this
     is a face built to hold still while its owner lies. */
  odysseus: { hairDrop: -0.06, recede: 0.30, skin: SURFACE.skin, hair: "short", beard: "full", hairColor: SURFACE.hairDark, hairMass: 1.06,
    faceW: 1.06, jawW: 1.10, chin: 1.08, brow: 1.22, eyeGap: 0.96, nose: 1.10,
    lip: 0.94, age: 45, lines: 0.55, glasses: false, collar: "coat" },

  /* ATHENA. γλαυκῶπις — bright-eyed, grey-eyed, owl-eyed; the one physical
     epithet the poem repeats about her, and it is entirely about the eyes. So
     hers are the widest-set and largest in the table and everything else is
     held at neutral. She wears the cast's only ageless face. */
  athena: { hairDrop: -0.10, fillet: true, skin: SURFACE.skinYoung, hair: "short", hairColor: SURFACE.hairMid, hairMass: 1.00,
    faceW: 0.94, jawW: 0.82, chin: 0.94, brow: 0.90, eyeGap: 1.16, nose: 0.92,
    lip: 0.96, age: 30, lines: 0.00, glasses: false, collar: "coat" },

  /* PENELOPE. περίφρων — circumspect, of surrounding mind. Twenty years of
     holding a room by saying almost nothing. A still face with a mobile brow:
     the intelligence has to be visible somewhere and the poem puts it in what
     she withholds, so she gets the narrowest lip and the most brow. */
  penelope: { hairDrop: 0.00, part: -1, skin: SURFACE.skin, hair: "long", hairColor: SURFACE.hairDark, hairMass: 1.08,
    faceW: 0.93, jawW: 0.80, chin: 0.96, brow: 1.10, eyeGap: 1.04, nose: 0.94,
    lip: 0.84, age: 42, lines: 0.34, glasses: false, collar: "coat" },

  /* TELEMACHUS. A boy in the first four books who has to be read as his
     father's son by Book 16 without being told. He is Odysseus's jaw and brow
     at two-thirds strength, on a face with nothing written on it yet. */
  telemachus: { hairDrop: 0.07, skin: SURFACE.skinYoung, hair: "short", hairColor: SURFACE.hairDark, hairMass: 1.10,
    faceW: 0.97, jawW: 1.02, chin: 1.04, brow: 1.12, eyeGap: 0.98, nose: 1.04,
    lip: 0.92, age: 20, lines: 0.00, glasses: false, collar: "lab" },

  /* NESTOR. γερήνιος ἱππότα — the old horseman. The poem's joke about him is
     that he talks longest, and he holds five key beats over 161 seconds to
     prove it. Kyphosis and a short neck are the rig's real instruments for
     age; the face carries the rest. */
  nestor: { hairDrop: -0.20, recede: 0.72, skin: SURFACE.skinOld, hair: "curly", beard: "long", hairColor: SURFACE.hairWhite, hairMass: 0.86,
    faceW: 0.92, jawW: 0.78, chin: 0.90, brow: 0.86, eyeGap: 1.02, nose: 1.14,
    lip: 0.80, age: 78, lines: 1.00, glasses: false, collar: "coat" },

  /* EUMAEUS. δῖος ὑφορβός — the noble swineherd, the poem's warmest character
     and the only one who feeds a stranger without asking who he is. Broad,
     outdoor, unguarded: the widest lip in the table, because he is the one
     man in Ithaca who says what he thinks. */
  eumaeus: { hairDrop: 0.02, part: 1, skin: SURFACE.skin, hair: "short", beard: "short", hairColor: SURFACE.hairMid, hairMass: 1.02,
    faceW: 1.04, jawW: 1.00, chin: 1.00, brow: 0.94, eyeGap: 1.02, nose: 1.08,
    lip: 1.14, age: 52, lines: 0.62, glasses: false, collar: "coat" },

  /* CIRCE. πολυφάρμακος — of many drugs. She is never described; she is only
     ever what she does to other people. So the face is deliberately the most
     regular in the table — nothing to read, which is the point of her. */
  circe: { hairDrop: -0.02, fillet: true, part: 1, part: 1, skin: SURFACE.skinYoung, hair: "long", hairColor: SURFACE.hairDark, hairMass: 1.14,
    faceW: 0.96, jawW: 0.86, chin: 0.98, brow: 1.00, eyeGap: 1.06, nose: 0.96,
    lip: 1.02, age: 34, lines: 0.00, glasses: false, collar: "coat" },

  /* NAUSICAA. The girl on the beach, and the one comparison Homer makes is to
     Artemis among her nymphs — height and bearing, not features. Youngest
     face in the table and the only one with no line in it at all. */
  nausicaa: { hairDrop: 0.05, part: -1, skin: SURFACE.skinYoung, hair: "long", hairColor: SURFACE.hairMid, hairMass: 1.06,
    faceW: 0.92, jawW: 0.80, chin: 0.92, brow: 0.92, eyeGap: 1.08, nose: 0.90,
    lip: 1.00, age: 17, lines: 0.00, glasses: false, collar: "lab" },

  /* HELEN. The most consequential face in Greek literature, and Homer refuses
     to describe it — the old men on the wall say only that no one could blame
     anyone. So this table refuses too. Every parameter sits at exactly 1.00
     except age. The neutral is the characterisation. */
  helen: { hairDrop: -0.01, fillet: true, skin: SURFACE.skin, hair: "long", hairColor: SURFACE.hairMid, hairMass: 1.00,
    faceW: 1.00, jawW: 1.00, chin: 1.00, brow: 1.00, eyeGap: 1.00, nose: 1.00,
    lip: 1.00, age: 38, lines: 0.12, glasses: false, collar: "coat" },

  /* EURYCLEIA. The nurse who knows him by the scar before anyone else, because
     she is the one who washes his feet — recognition through service. Oldest
     working face in the cast: lined, narrow, and still sharp-eyed. */
  eurycleia: { hairDrop: -0.12, recede: 0.34, skin: SURFACE.skinOld, hair: "short", hairColor: SURFACE.hairWhite, hairMass: 0.94,
    faceW: 0.90, jawW: 0.76, chin: 0.90, brow: 0.88, eyeGap: 1.06, nose: 1.06,
    lip: 0.82, age: 72, lines: 0.94, glasses: false, collar: "lab" },

  /* ALCINOUS. The host who listens to four books of the Apologoi and never
     once asks whether any of it is true. An open, comfortable, unsuspicious
     face — the audience Odysseus needs. */
  alcinous: { hairDrop: -0.08, recede: 0.26, fillet: true, skin: SURFACE.skin, hair: "curly", beard: "groomed", hairColor: SURFACE.hairMid, hairMass: 0.96,
    faceW: 1.06, jawW: 0.94, chin: 0.96, brow: 0.92, eyeGap: 1.04, nose: 1.02,
    lip: 1.06, age: 58, lines: 0.58, glasses: false, collar: "coat" },

  /* POLYPHEMUS. One eye, and the man who blinds it does so by giving him a
     name that means nobody. eyeGap collapses to zero — the engine reads that
     as a single centred eye — and everything else is scaled past the top of
     the table's range, because he is not a man with unusual features, he is
     the wrong size for the frame. */
  polyphemus: { hairDrop: 0.12, skin: SURFACE.skinOld, hair: "curly", beard: "wild", hairColor: SURFACE.hairDark, hairMass: 1.30,
    faceW: 1.30, jawW: 1.26, chin: 1.20, brow: 1.44, eyeGap: 0.00, nose: 1.24,
    lip: 1.18, age: 40, lines: 0.70, glasses: false, collar: "coat" },
};


/* Which face speaks a given script cue. The script's speaker labels carry
   parentheticals the cast list does not — "IONA (V.O.)", "PROJECTED MARA" —
   and two of them are deliberately NOT faces. See FACELESS below. */
export const SPEAKER_FACE = {
  "MARA": "mara", "NIKO": "niko", "IONA": "iona", "ELISE": "elise", "THE GIRL": "thegirl",
  "PROJECTED MARA": "mara",
};
/* A close-up is a claim that a body is in the room making this sound. Three
   speakers in this film are not: VO is the butterfly, and (V.O.)/(O.S.) are
   by definition somewhere the camera is not. Cutting to a face for those would
   be a lie about where the voice is coming from, and the film's whole subject
   is testimony from a witness that cannot be checked. They keep the wide loop. */
export const FACELESS = (who) => /^VO$/.test(who) || /\((V\.O\.|O\.S\.)\)/.test(who);

/* ============================================================================
   THE HEAD
   ========================================================================= */

/* ---- the mandible ------------------------------------------------------
   One rotation, applied to every point below the condyle line. Points above it
   are the cranium and do not move — that is the whole content of the function.

   The excursion: at jaw=1 the chin travels 0.52R, which on a head whose nasion
   -to-chin distance is about 1.5R works out near a 35% gape. That is a wide but
   real "ah"; anything past it is a yawn, and the sampler never asks for it
   because VISEMES.AH tops out at 0.92. */
const CONDYLE_Y = 0.20;                 // where the hinge sits, in R, below centre
function hinge(p, jaw) {
  if (p.y <= CONDYLE_Y) return p;
  const d = p.y - CONDYLE_Y;
  return {
    x: p.x * (1 - 0.11 * jaw),          // the jaw narrows a little as it drops
    y: CONDYLE_Y + d * (1 + 0.52 * jaw),
  };
}

/* ---- the canon of proportion --------------------------------------------
   PASS 2. The first head put the eyes at -0.10R on a silhouette spanning
   -1.05R to +1.26R — a fifth of a head radius ABOVE the true middle. Every
   drawing manual since Dürer says the same thing and it is not a convention,
   it is a measurement: THE EYES SIT HALFWAY DOWN THE HEAD. People
   systematically place them too high because the cranium above them is hidden
   under hair and the brain discounts what it cannot see.

   The cost was not subtle. Putting the eyes high lengthens everything below
   them, so the first contact sheet came back with five long-jawed mannequins
   and I read it as "the jaw is too long" — which it was not. The jaw was
   right; the eyes were wrong. These five numbers are the fix, and every
   feature below is placed off them rather than off the frame. */
const EYE_Y = 0.02;      // halfway down a silhouette spanning -1.10 .. +1.16
const NOSE_Y = 0.46;     // brow-to-chin thirds: eyes, nose base, chin
const MOUTH_Y = 0.70;    // a third of the way from nose base to chin
const HAIRLINE = -0.56;
const CHIN_Y = 1.16;

/* ---- the silhouette ----------------------------------------------------
   Returned as one array of points, in R units, centred on the skull. Built
   left temple -> over the crown -> right temple -> down the right mandible ->
   chin -> back up the left. Filled once, contoured once.  */
function silhouette(F, jaw) {
  const w = F.faceW, jw = F.jawW, ch = F.chin;
  const child = F.child ? 1 : 0;
  const cr = 1.06 + 0.10 * child;                       // cranium height
  /* PASS 5. jawW was an absolute multiplier, so a narrow jaw (The Girl at 0.70)
     put the gonion 0.43R inside the cheekbone across only 0.32R of drop. The
     curve through those two points overshoots and the head comes out as an
     ANVIL — a bulging cheek with a step under it — which on the contact sheet
     read as hair, and sent me twice into the hair code. It was never the hair.
     It was a cliff in the silhouette, and it only appeared on the three faces
     whose jaws are narrow, which is exactly the pattern I misread as a styling
     bug.

     So the jaw is now a PROPORTION OF THE FACE (0.55..0.95 of the cheekbone),
     the taper gets an intermediate point to travel through, and no face can
     express a jaw the curve cannot round. Five heads still separate; none of
     them can produce a cliff. */
  const gon = w * (0.55 + 0.40 * jw);                    // gonion, as a share of the cheek
  const man = w * (0.40 + 0.38 * jw);                    // mandible body
  const jut = w * (0.18 + 0.28 * jw);                    // the chin's own width
  const raw = [
    { x: -0.98 * w, y: -0.16 },                          // left temple
    { x: -0.92 * w, y: -0.60 },
    { x: -0.62 * w, y: -1.00 * cr },
    { x: 0.00, y: -1.10 * cr },                          // crown
    { x: 0.62 * w, y: -1.00 * cr },
    { x: 0.92 * w, y: -0.60 },
    { x: 0.98 * w, y: -0.16 },                           // right temple
    { x: 0.99 * w, y: 0.16 },                            // right zygoma
    { x: (0.99 * w + gon) / 2, y: 0.38 },                // the taper's own point
    { x: gon, y: 0.62 },                                 // right gonion
    { x: man, y: 0.92 },                                 // right mandible body
    { x: jut, y: 1.08 * ch },
    { x: 0.00, y: CHIN_Y * ch },                         // chin
    { x: -jut, y: 1.08 * ch },
    { x: -man, y: 0.92 },
    { x: -gon, y: 0.62 },
    { x: -(0.99 * w + gon) / 2, y: 0.38 },
    { x: -0.99 * w, y: 0.16 },
  ];
  return raw.map((p) => hinge(p, jaw));
}

/* smooth closed path through points (Catmull-Rom -> bezier). A polygon here
   would print sixteen corners on a face; a face has none. */
function closedCurve(g, pts, S) {
  const n = pts.length, P = (i) => pts[(i % n + n) % n];
  g.beginPath();
  g.moveTo(P(0).x * S.x, P(0).y * S.y);
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    g.bezierCurveTo(
      (p1.x + (p2.x - p0.x) / 6) * S.x, (p1.y + (p2.y - p0.y) / 6) * S.y,
      (p2.x - (p3.x - p1.x) / 6) * S.x, (p2.y - (p3.y - p1.y) / 6) * S.y,
      p2.x * S.x, p2.y * S.y);
  }
  g.closePath();
}

/* ============================================================================
   drawCloseup(g, spec, st, geom)

   g     stage-space context (the scene has already scaled W/NW)
   spec  one entry of FACES
   st    { jaw, wide, press, teeth, tongue,            <- from engine/speech
           blink, gazeX, gazeY, browUp, browKnit,
           headYaw, headPitch, headRoll, chest, smile, frown }
   geom  { cx, cy, R }   R is the head half-width in stage pixels
   ========================================================================= */
export function drawCloseup(g, spec, st, { cx, cy, R }) {
  const F = spec;
  const jaw = clamp01(st.jaw || 0);
  const wide = clamp(st.wide || 0, -1, 1);
  const press = clamp01(st.press || 0);
  const yaw = clamp(st.headYaw || 0, -0.9, 0.9);
  const pitch = clamp(st.headPitch || 0, -0.5, 0.5);

  /* tones. Light planes, dark accents, plenty of paper — trap 1. */
  const SKIN = F.skin;
  const SKIN_D = shade(F.skin, -44);              // the one shading plane: under the jaw
  const HAIR = F.hairColor;
  const LIP = shade(F.skin, -46);
  const MOUTH = inkLevel(7);
  const TEETH = inkLevel(0);
  const TONGUE = inkLevel(4);
  const GARMENT = F.collar === "coat" ? SURFACE.navy
    : F.collar === "period" ? gray(0x9e) : F.collar === "dress" ? gray(0xb6) : gray(0x9a);

  /* contour weights, held ABOVE the dot floor. At R=300 the MESH lattice is
     ~3.4px; a 4px line (figure-hero's default) is one dot and prints as a
     dotted line. These are 2-3 dots and hold. */
  const LWa = Math.max(5, R * 0.026);             // silhouette
  const LWb = Math.max(4, R * 0.018);             // features
  const LWc = Math.max(3, R * 0.011);             // age lines, creases

  const sx = 0.80 + 0.20 * Math.cos(yaw);          // foreshortening
  const fx = Math.sin(yaw) * R * 0.26;             // features shift with the turn
  const S = { x: R * sx, y: R };
  const py = pitch * R * 0.10;

  g.save();
  g.translate(cx, cy);
  g.rotate(st.headRoll || 0);
  /* ── A HEAD IS NOT A CIRCLE ───────────────────────────────────────────────
     Measured: this file draws 2.22R tall by 2.00R wide, a ratio of 1.11 : 1.
     A human head is about 1.4 : 1. Every face in the cast was therefore a
     sphere with features on it, which is most of what reads as cartoon before
     a single stroke is judged. Narrowing on x rather than lengthening on y
     keeps the whole feature canon — EYE_Y, NOSE_Y, MOUTH_Y, CHIN_Y — exactly
     where it is, and takes the silhouette to 1.35 : 1. */
  g.scale(0.82, 1);
  g.lineJoin = "round"; g.lineCap = "round";

  /* ---- 1. hair behind the head, AND behind the neck ---------------------
     THIS USED TO RUN SECOND, after the shoulders. "Behind the head" was true
     and "behind the neck" was not, so every long-haired woman had her hair
     hanging down the FRONT of her throat like a scarf. Hair falls behind a
     neck. It is drawn first now, before anything else in the figure.
     PASS 2. The first version drew the back mass as an ellipse sitting on top
     of the skull and the front as a strip along the hairline, and the two of
     them together printed a BERET. The fault was that neither piece went down
     PAST THE EARS: hair that stops at temple height is a hat, whatever shape
     you give it, because the eye reads the boundary between hair and skin at
     the side of the head, not the one across the forehead.

     So the back mass now descends to at least the ear on every style, and the
     three styles differ by how far past it they go — which is also the only
     thing the text ever says about anyone's hair ("cut bluntly below the
     ears"). */
  const hm = F.hairMass;
  /* "curly" is the fourth style, and it exists because the BODIES already use
     it — Nestor, Alcinous and Polyphemus are drawn curly-headed at full length
     by figure-hero, so a close-up that gave them the same flat cap as everyone
     else would be a continuity error, not a style choice. It drops like a
     short bob and is broken into lobes at the crown below.

     `long` came over from the sibling film at 1.90 and at portrait scale it
     swallowed the whole face — four women in identical black hoods with
     features cut out. The mass is authored at skull width, so on a head this
     size every extra tenth of drop wraps around the jaw instead of hanging
     past it. 1.34 hangs below the ear and leaves a face. */
  const drop = F.hair === "bob" ? 0.94 : F.hair === "long" ? 1.34
             : F.hair === "curly" ? 0.66 : 0.30;
  if (F.hair !== "bald") {
    /* PASS 3. Drawing this as two side pieces put a contoured shape OUTSIDE the
       skull on each cheek — earmuffs on Iona, a scalloped chin-strap on the
       others — because a piece of hair authored beside a head has an edge on
       the inside as well as the outside, and the inside one lands on the face.

       One mass, behind everything, with no inside edge at all: the head is
       drawn over it and decides for itself how much hair shows. The only
       parameter is how far down it descends, which is also the only thing the
       text ever says about hair — "cut bluntly below the ears". */
    /* PASS 4. Even as one mass it kept printing a contour on the cheek — but
       only on the three faces with a NARROW jaw (Iona 0.76, The Girl 0.70,
       Mara 0.86) and never on Niko at 0.98. That is the whole diagnosis: the
       mass was authored at skull width and the skull is at its widest at the
       temple, so on a face that tapers below the cheekbone a sliver of hair
       protrudes past the jaw and gets stroked. It looked like a hairstyle
       decision. It was a jaw width.

       Short hair therefore draws NO back mass at all — the crown in step 9
       already covers the skull down past the temple, and anything more can
       only stick out. Hair that hangs (bob, long) keeps its mass, reshaped so
       the widest point is high and the hem tucks inward. */
    if (drop > 0.4) {
      /* ENGRAVED LIKE THE CROWN. This mass was left as a flat black fill while
         the crown was rebuilt, so every long-haired woman wore a drawn top on
         a solid hood — the seam was visible and it was the loudest remaining
         thing making them read as the same person. */
      const bgm = g.createLinearGradient(-R * 1.0 * sx, -R * 0.6, R * 0.8 * sx, R * drop);
      bgm.addColorStop(0.00, shade(HAIR, 74));
      bgm.addColorStop(0.42, shade(HAIR, 44));
      bgm.addColorStop(1.00, shade(HAIR, 6));
      g.fillStyle = bgm; g.strokeStyle = INK; g.lineWidth = LWa;
      g.beginPath();
      g.moveTo(-R * 1.04 * hm * sx, -R * 0.50);
      g.bezierCurveTo(-R * 1.14 * hm * sx, -R * 0.06, -R * 1.02 * hm * sx, R * (drop * 0.72),
        -R * 0.72 * sx, R * drop);
      g.lineTo(R * 0.72 * sx, R * drop);
      g.bezierCurveTo(R * 1.02 * hm * sx, R * (drop * 0.72), R * 1.14 * hm * sx, -R * 0.06,
        R * 1.04 * hm * sx, -R * 0.50);
      g.bezierCurveTo(R * 1.10 * hm * sx, -R * 1.26, -R * 1.10 * hm * sx, -R * 1.26,
        -R * 1.04 * hm * sx, -R * 0.50);
      g.closePath(); g.fill(); g.stroke();
    /* locks down the hanging mass, following its fall */
    {
      const sdb = seedOf("back" + (F.hairColor || "") + drop);
      g.save();
      g.beginPath();
      g.moveTo(-R * 1.04 * hm * sx, -R * 0.50);
      g.bezierCurveTo(-R * 1.14 * hm * sx, -R * 0.06, -R * 1.02 * hm * sx, R * (drop * 0.72),
        -R * 0.72 * hm * sx, R * (drop * 1.02));
      g.lineTo(R * 0.72 * hm * sx, R * (drop * 1.02));
      g.bezierCurveTo(R * 1.02 * hm * sx, R * (drop * 0.72), R * 1.14 * hm * sx, -R * 0.06,
        R * 1.04 * hm * sx, -R * 0.50);
      g.closePath(); g.clip();
      const wav = F.hair === "curly" ? 1.5 : 0.75;
      for (let i2 = 0; i2 < 150; i2++) {
        const b1 = rnd2(sdb, i2), b2 = rnd2(sdb + 17, i2), b3 = rnd2(sdb + 41, i2);
        const ox = (b1 - 0.5) * 2 * R * 1.10 * hm * sx;
        const oy = -R * 0.55 + b2 * R * (drop * 1.6);
        const len = R * (0.16 + b3 * 0.20);
        const side = Math.sign(ox) || 1;
        const lit = clamp01(0.55 - (ox / (R * 1.7)) * 0.85 - b2 * 0.35);
        g.strokeStyle = shade(HAIR, Math.round(-14 + lit * 42));
        g.lineWidth = R * 0.019 * (0.65 + b3 * 0.8);
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(ox, oy);
        g.bezierCurveTo(ox + side * len * 0.22 * wav, oy + len * 0.36,
                        ox - side * len * 0.20 * wav, oy + len * 0.70,
                        ox + side * len * 0.10, oy + len);
        g.stroke();
      }
      g.restore();
    }
    }
  }

  /* ---- 2. shoulders and neck -------------------------------------------- */
  const chest = (st.chest || 0.3);
  const NKW = 0.26 + 0.14 * F.jawW;      // a neck under a narrow jaw is a narrow neck
  const shY = R * (1.72 - 0.05 * chest);
  g.fillStyle = SKIN;
  g.strokeStyle = INK; g.lineWidth = LWa;
  g.beginPath();                                  // neck: a column, not a stalk
  g.moveTo(-R * NKW * sx, R * 0.62);
  g.bezierCurveTo(-R * (NKW + .02) * sx, R * 1.16, -R * (NKW + .06) * sx, R * 1.40, -R * (NKW + .10) * sx, shY);
  g.lineTo(R * (NKW + .10) * sx, shY);
  g.bezierCurveTo(R * (NKW + .06) * sx, R * 1.40, R * (NKW + .02) * sx, R * 1.16, R * NKW * sx, R * 0.62);
  g.closePath(); g.fill(); g.stroke();
  // the shadow the jaw casts on the neck: the single tone step that tells you
  // the head is in front of the body rather than pasted onto it
  g.fillStyle = SKIN_D;
  g.beginPath();
  g.moveTo(-R * (NKW + .01) * sx, R * 0.70);
  g.bezierCurveTo(-R * 0.18, R * (1.14 + jaw * 0.46), R * 0.18, R * (1.14 + jaw * 0.46), R * (NKW + .01) * sx, R * 0.70);
  g.lineTo(R * (NKW + .07) * sx, R * 1.62); g.lineTo(-R * (NKW + .07) * sx, R * 1.62);
  g.closePath(); g.fill();

  g.fillStyle = GARMENT; g.strokeStyle = INK; g.lineWidth = LWa;
  g.beginPath();
  g.moveTo(-R * 2.4, R * 2.6);
  g.bezierCurveTo(-R * 1.5, shY - R * 0.06, -R * 0.86, shY + R * 0.10, -R * 0.50 * sx, shY);
  g.lineTo(R * 0.50 * sx, shY);
  g.bezierCurveTo(R * 0.86, shY + R * 0.10, R * 1.5, shY - R * 0.06, R * 2.4, R * 2.6);
  g.closePath(); g.fill(); g.stroke();
  if (F.collar === "coat") {                       // the flattened fur collar, BF-17
    g.strokeStyle = INK; g.lineWidth = LWb;
    g.beginPath();
    g.moveTo(-R * 1.22, shY + R * 0.30); g.bezierCurveTo(-R * 0.70, shY + R * 0.02,
      -R * 0.56, shY + R * 0.02, -R * 0.50 * sx, shY + R * 0.16);
    g.moveTo(R * 1.22, shY + R * 0.30); g.bezierCurveTo(R * 0.70, shY + R * 0.02,
      R * 0.56, shY + R * 0.02, R * 0.50 * sx, shY + R * 0.16);
    g.stroke();
  } else if (F.collar === "lab" || F.collar === "period") {
    g.strokeStyle = INK; g.lineWidth = LWb;
    g.beginPath();
    g.moveTo(-R * 0.52 * sx, shY + R * 0.06); g.lineTo(-R * 0.16, shY + R * 0.62);
    g.moveTo(R * 0.52 * sx, shY + R * 0.06); g.lineTo(R * 0.16, shY + R * 0.62);
    g.stroke();
  }

  /* ---- 3. ears ----------------------------------------------------------- */
  for (const es of [-1, 1]) {
    if (Math.abs(yaw) > 0.55 && es * Math.sin(yaw) < 0) continue;
    g.fillStyle = SKIN; g.strokeStyle = INK; g.lineWidth = LWb;
    g.beginPath();
    g.ellipse(es * R * 0.95 * F.faceW * sx + fx * 0.2, R * 0.04, R * 0.115, R * 0.205, 0, 0, TAU);
    g.fill(); g.stroke();
  }

  /* ---- 4. the head: cranium + mandible as ONE contour -------------------- */
  const sil = silhouette(F, jaw);
  g.fillStyle = SKIN; g.strokeStyle = INK; g.lineWidth = LWa;
  closedCurve(g, sil, S); g.fill(); g.stroke();

  /* the jaw's own shading plane — under the mandible, and it GROWS as the jaw
     drops, which is the cue that reads at contact-sheet size even when the
     mouth itself is too small to parse */
  if (jaw > 0.08) {
    g.save(); closedCurve(g, sil, S); g.clip();
    g.fillStyle = SKIN_D;
    g.beginPath();
    g.moveTo(-R * 0.84 * sx, R * (0.62 + 0.30 * jaw));
    g.bezierCurveTo(-R * 0.40, R * (1.30 + 0.44 * jaw), R * 0.40, R * (1.30 + 0.44 * jaw),
      R * 0.84 * sx, R * (0.62 + 0.30 * jaw));
    g.lineTo(R * 0.84 * sx, R * 2.4); g.lineTo(-R * 0.84 * sx, R * 2.4);
    g.closePath(); g.globalAlpha = 0.9; g.fill(); g.globalAlpha = 1;
    g.restore();
  }

  /* ---- 4b. MODELLING ------------------------------------------------------
     THE DOT PASS IS THE GRADIENT. This world forbids gradients in a DRAWING —
     no soft edge, no blur, no alpha at the contour — and that law is about the
     line. It was never about tone. dotifyField samples the source canvas and
     converts luminance into DOT SIZE, which is precisely how a halftone
     portrait has worked since 1880: continuous tone in, quantized dots out.

     Every face here was flat fill and hard line, so nothing was modelled and
     twelve heads read as twelve stickers. Put form shading into the source and
     the printer resolves it into dots of graded size — the same mechanism a
     newspaper photograph uses, running on the same eight levels.

     One light, upper-left, because a face has to be lit from somewhere and a
     film that changes its key light per shot has no key light. What follows is
     just the planes of a head under it: the temple turns away, the cheekbone
     catches, the plane under the zygomatic falls off, the jaw underside is
     shadow, the neck is in the head's own shadow.
  ------------------------------------------------------------------------ */
  {
    g.save(); closedCurve(g, sil, S); g.clip();
    const L = -0.42, LY = -0.55;                    // the key, in R units

    /* the broad form: light where the light is, falling off across the head */
    const form = g.createRadialGradient(R * L, R * LY, R * 0.10, R * L, R * LY, R * 2.35);
    /* A FACE IS MOSTLY PAPER. First pass stacked four shadow layers and drove
       the whole head to mid-gray — the same mush this film was rebuilt to get
       rid of, reintroduced in the name of modelling. Shading is a MINORITY of
       the surface: the light plane holds most of the face and the shadow does
       its work in the last third. */
    form.addColorStop(0.00, shade(SKIN, 14));
    form.addColorStop(0.62, SKIN);
    form.addColorStop(0.88, shade(SKIN, -14));
    form.addColorStop(1.00, shade(SKIN, -26));
    g.fillStyle = form; g.fillRect(-R * 2, -R * 2.4, R * 4, R * 4.4);

    /* BLENDING. One radial and three hard-edged overlays gave a face two
       zones with a visible boundary between them. Skin does not have a
       boundary — it turns. A second, wider and much weaker radial offset from
       the first breaks the first one's ring, which is the cheapest way to make
       a falloff read as a surface rather than a spotlight. */
    const soft = g.createRadialGradient(R * (L + 0.55), R * (LY + 0.75), R * 0.20,
                                        R * (L + 0.35), R * (LY + 0.55), R * 1.95);
    soft.addColorStop(0.00, "rgba(0,0,0,0)");
    soft.addColorStop(0.58, "rgba(0,0,0,0.035)");
    soft.addColorStop(1.00, "rgba(0,0,0,0.085)");
    g.fillStyle = soft; g.fillRect(-R * 2, -R * 2.4, R * 4, R * 4.4);

    /* the far temple turns away hardest — the single strongest plane on a head */
    const tmp = g.createLinearGradient(R * 0.30 * sx, 0, R * 1.05 * sx, 0);
    tmp.addColorStop(0, "rgba(0,0,0,0)");
    tmp.addColorStop(1, "rgba(0,0,0,0.11)");
    g.fillStyle = tmp; g.fillRect(-R * 2, -R * 2.4, R * 4, R * 4.4);

    /* under the cheekbone: the plane change that makes a face a face rather
       than an oval. Placed off the canon — zygomatic sits between eye and nose. */
    for (const es of [-1, 1]) {
      const cxk = es * R * 0.52 * sx, cyk = R * ((EYE_Y + NOSE_Y) / 2 + 0.20);
      const ck = g.createRadialGradient(cxk, cyk + R * 0.30, R * 0.04, cxk, cyk + R * 0.22, R * 0.62);
      ck.addColorStop(0, "rgba(0,0,0,0.10)");
      ck.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = ck; g.fillRect(-R * 2, -R * 2.4, R * 4, R * 4.4);
    }

    /* the jaw underside, and it deepens as the jaw drops */
    const jl = g.createLinearGradient(0, R * (0.74 + 0.26 * jaw), 0, R * (CHIN_Y + 0.34 + 0.40 * jaw));
    jl.addColorStop(0, "rgba(0,0,0,0)");
    jl.addColorStop(1, `rgba(0,0,0,${(0.13 + 0.16 * jaw).toFixed(3)})`);
    g.fillStyle = jl; g.fillRect(-R * 2, 0, R * 4, R * 3);

    /* the brow's own shadow, which is what makes a skull read under a face */
    const bl = g.createLinearGradient(0, R * (EYE_Y - 0.46), 0, R * (EYE_Y + 0.06));
    bl.addColorStop(0, "rgba(0,0,0,0.08)");
    bl.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = bl; g.fillRect(-R * 2, R * (EYE_Y - 0.5), R * 4, R * 0.6);
    g.restore();
  }

  /* ---- 5. eyes and brows -------------------------------------------------
     Placed on the SKULL, so they do not move with the jaw. */
  const eyeY = R * EYE_Y + py;
  const eyeDx = R * 0.37 * F.eyeGap * sx;
  const blink = clamp01(st.blink || 0);
  const open = clamp(1 - blink * 1.35 + (st.eyeWide || 0) * 0.4 - (st.eyeNarrow || 0) * 0.6, 0.04, 1.4);
  const browUp = st.browUp || 0, browKnit = st.browKnit || 0;

  for (const es of [-1, 1]) {
    if (Math.abs(yaw) > 0.7 && es * Math.sin(yaw) < 0) continue;
    const ex = fx + es * eyeDx;
    const ew = R * 0.245 * (F.child ? 1.08 : 1), eh = R * 0.175 * open;
    // white almond
    g.fillStyle = inkLevel(0); g.strokeStyle = INK; g.lineWidth = LWc;
    g.beginPath();
    g.moveTo(ex - ew, eyeY);
    g.quadraticCurveTo(ex - ew * 0.12, eyeY - eh * 1.25, ex + ew, eyeY);
    g.quadraticCurveTo(ex + ew * 0.14, eyeY + eh * 0.90, ex - ew, eyeY);
    g.closePath(); g.fill();
    if (open > 0.14) {
      g.save(); g.clip();
      g.fillStyle = INK;
      const px = ex + (st.gazeX || 0) * R * 0.075 + Math.sin(yaw) * R * 0.045;
      const pyy = eyeY + (st.gazeY || 0) * R * 0.060 + R * 0.012;
      /* AN EYE IS NOT A DOT. One black disc on white reads as beady at any
         size, and it is the feature a viewer checks first for a person. A real
         eye carries four values and the halftone can hold all four: an IRIS in
         mid tone, a PUPIL near black inside it, a CATCHLIGHT, and the upper
         lid's shadow across the top of the globe — that last one is what stops
         an eye from looking pasted on. */
      const ir = R * 0.086;
      const irg = g.createRadialGradient(px - ir * 0.30, pyy - ir * 0.34, ir * 0.10, px, pyy, ir);
      irg.addColorStop(0.00, inkLevel(3));
      irg.addColorStop(0.62, inkLevel(5));
      irg.addColorStop(1.00, INK);
      g.fillStyle = irg;
      g.beginPath(); g.arc(px, pyy, ir, 0, TAU); g.fill();
      g.strokeStyle = INK; g.lineWidth = LWc * 0.75;
      g.beginPath(); g.arc(px, pyy, ir, 0, TAU); g.stroke();
      g.fillStyle = INK;
      g.beginPath(); g.arc(px, pyy, ir * 0.46, 0, TAU); g.fill();
      g.fillStyle = inkLevel(0);
      g.beginPath(); g.arc(px - ir * 0.34, pyy - ir * 0.38, ir * 0.27, 0, TAU); g.fill();
      const lg = g.createLinearGradient(0, pyy - R * 0.16, 0, pyy + R * 0.02);
      lg.addColorStop(0, "rgba(0,0,0,0.32)");
      lg.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = lg; g.fillRect(px - R * 0.3, pyy - R * 0.22, R * 0.6, R * 0.42);
      g.restore();
    }
    // the upper lid: the heaviest stroke on the face after the silhouette
    g.strokeStyle = INK; g.lineWidth = LWb * 1.15;
    g.beginPath();
    g.moveTo(ex - ew, eyeY);
    g.quadraticCurveTo(ex - ew * 0.12, eyeY - eh * 1.25, ex + ew, eyeY);
    g.stroke();
    // the socket. One line above the lid, following it at a distance. Without
    // it the eye is a shape lying ON the face; with it the eye is set INTO a
    // skull, and that is the whole difference between a mask and a head.
    if (!F.child) {
      g.lineWidth = LWc;
      g.beginPath();
      g.moveTo(ex - ew * 0.86, eyeY - eh * 0.55 - R * 0.055);
      g.quadraticCurveTo(ex - ew * 0.05, eyeY - eh * 1.35 - R * 0.070,
        ex + ew * 0.92, eyeY - eh * 0.30 - R * 0.040);
      g.stroke();
    }
    // a lower lid line only on the old face; on a young one it reads as fatigue
    if (F.lines > 0.4) {
      g.lineWidth = LWc;
      g.beginPath();
      g.moveTo(ex - ew * 0.8, eyeY + eh * 0.9);
      g.quadraticCurveTo(ex, eyeY + eh * 1.5, ex + ew * 0.85, eyeY + eh * 0.7);
      g.stroke();
    }
    // brow
    const inner = ex + es * ew * 0.92, outer = ex - es * ew * 1.02;
    const base = eyeY - R * 0.31 * F.brow - browUp * R * 0.15;
    g.lineWidth = Math.max(LWb, R * 0.075 * (F.lines > 0.4 ? 0.62 : 1));
    g.strokeStyle = INK;
    g.beginPath();
    g.moveTo(inner, base + browKnit * R * 0.11);
    g.quadraticCurveTo(ex, base - R * 0.055 - browUp * R * 0.02, outer, base + R * 0.012);
    g.stroke();
  }

  /* ---- 6. nose ------------------------------------------------------------
     PASS 2. The first nose was a full-length centre line from the brow to the
     tip with two dots under it — a stick with nostrils. A nose has no line down
     its middle; what it has is a SHADOW down one side and a lit tip, and in a
     world with one shading plane and no gradients the only honest version is a
     short stroke that starts where the bridge actually turns (below the eyes,
     not between them) and resolves into the tip.

     So: no bridge above the eye line, a wing on one side only, and the nostrils
     as short arcs rather than dots — a dot is a hole, an arc is a nostril. */
  const nx = fx + Math.sin(yaw) * R * 0.10;
  const ntip = R * (EYE_Y + (NOSE_Y - EYE_Y) * F.nose) + py;
  const shadeSide = yaw >= 0 ? -1 : 1;
  g.strokeStyle = INK; g.lineWidth = LWb * 0.9;
  g.beginPath();
  g.moveTo(nx + shadeSide * R * 0.048 * sx, eyeY + R * 0.09);
  g.quadraticCurveTo(nx + shadeSide * R * 0.085 * sx, ntip - R * 0.10,
    nx + shadeSide * R * 0.030 * sx, ntip - R * 0.010);
  g.stroke();
  g.lineWidth = LWb;
  g.beginPath();                                   // the underside of the tip
  g.moveTo(nx - R * 0.075 * sx, ntip - R * 0.020);
  g.quadraticCurveTo(nx, ntip + R * 0.055, nx + R * 0.075 * sx, ntip - R * 0.020);
  g.stroke();
  g.lineWidth = LWb * 0.85;
  for (const es of [-1, 1]) {                      // nostril wings
    if (Math.abs(yaw) > 0.62 && es * Math.sin(yaw) < 0) continue;
    g.beginPath();
    g.moveTo(nx + es * R * 0.075 * sx, ntip - R * 0.030);
    g.quadraticCurveTo(nx + es * R * 0.130 * sx, ntip - R * 0.045,
      nx + es * R * 0.115 * sx, ntip + R * 0.005);
    g.stroke();
  }

  /* ---- 7. THE MOUTH ------------------------------------------------------
     Upper lip anchored to the maxilla at `upperY`. Lower lip carried by the
     mandible, so its travel is EXACTLY the hinge's travel at the lip's own
     height — not an independent number, or the chin and the lip would disagree
     and the face would come apart at speed. */
  const upperY = R * MOUTH_Y + py;
  const lipAnchor = hinge({ x: 0, y: MOUTH_Y }, jaw);
  const lowerY = R * lipAnchor.y + py + R * 0.06;
  const aperture = Math.max(0, lowerY - upperY - R * 0.03);

  const mw = R * clamp(0.30 + 0.115 * wide - press * 0.02, 0.17, 0.45) * F.lip * sx;
  const mx = fx + Math.sin(yaw) * R * 0.06;
  const smile = (st.smile || 0) - (st.frown || 0);
  const corner = smile * R * 0.10;
  const round = clamp01(-wide);                      // OO/OH: the lips protrude

  g.save(); g.translate(mx, 0);

  if (aperture < R * 0.045) {
    /* CLOSED. Not "a line": two lips pressed, with a seam between them. press
       flattens them and adds the compression that makes /m/ read as a held
       consonant rather than as a pause. */
    const fl = 1 - press * 0.45;
    g.fillStyle = LIP; g.strokeStyle = INK; g.lineWidth = LWb;
    g.beginPath();
    g.moveTo(-mw, upperY - corner);
    g.bezierCurveTo(-mw * 0.5, upperY - R * 0.075 * fl - corner, -mw * 0.14, upperY - R * 0.045 * fl, 0, upperY - R * 0.022 * fl);
    g.bezierCurveTo(mw * 0.14, upperY - R * 0.045 * fl, mw * 0.5, upperY - R * 0.075 * fl - corner, mw, upperY - corner);
    g.bezierCurveTo(mw * 0.55, upperY + R * 0.085 * fl, -mw * 0.55, upperY + R * 0.085 * fl, -mw, upperY - corner);
    g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = INK; g.lineWidth = LWb * 1.1;    // the seam
    g.beginPath();
    g.moveTo(-mw, upperY - corner);
    g.quadraticCurveTo(0, upperY + R * 0.012 - corner * 0.5, mw, upperY - corner);
    g.stroke();
    if (press > 0.55) {                              // compression crease above
      g.lineWidth = LWc;
      g.beginPath();
      g.moveTo(-mw * 0.6, upperY - R * 0.115);
      g.quadraticCurveTo(0, upperY - R * 0.145, mw * 0.6, upperY - R * 0.115);
      g.stroke();
    }
  } else {
    /* OPEN. The dark interior first — this is the darkest plane in the frame
       and the eye finds it before anything else, which is the point. Then the
       teeth band hung from the upper lip (teeth belong to the skull too), then
       the tongue at the floor, then the two lips over the top of all of it. */
    const rw = mw * (1 - round * 0.30);              // rounding narrows the aperture
    g.fillStyle = MOUTH; g.strokeStyle = INK; g.lineWidth = LWb;
    g.beginPath();
    g.moveTo(-rw, upperY - corner * 0.5);
    g.quadraticCurveTo(0, upperY - aperture * 0.12, rw, upperY - corner * 0.5);
    g.quadraticCurveTo(rw * (0.72 + round * 0.2), lowerY - R * 0.02, 0, lowerY);
    g.quadraticCurveTo(-rw * (0.72 + round * 0.2), lowerY - R * 0.02, -rw, upperY - corner * 0.5);
    g.closePath(); g.fill();

    g.save(); g.clip();
    if ((st.teeth || 0) > 0.05) {
      g.fillStyle = TEETH;
      const th = aperture * clamp01(st.teeth) * 0.40;
      g.fillRect(-rw, upperY - corner * 0.5 - R * 0.01, rw * 2, th);
      g.strokeStyle = INK; g.lineWidth = LWc * 0.8;
      g.beginPath(); g.moveTo(-rw, upperY - corner * 0.5 + th); g.lineTo(rw, upperY - corner * 0.5 + th); g.stroke();
    }
    if ((st.tongue || 0) > 0.08 && aperture > R * 0.10) {
      g.fillStyle = TONGUE;
      g.beginPath();
      g.ellipse(0, lowerY - aperture * 0.10, rw * 0.66, aperture * 0.30 * clamp01(st.tongue) + R * 0.02, 0, 0, TAU);
      g.fill();
    }
    g.restore();
    g.strokeStyle = INK; g.lineWidth = LWb;
    g.beginPath();
    g.moveTo(-rw, upperY - corner * 0.5);
    g.quadraticCurveTo(0, upperY - aperture * 0.12, rw, upperY - corner * 0.5);
    g.quadraticCurveTo(rw * (0.72 + round * 0.2), lowerY - R * 0.02, 0, lowerY);
    g.quadraticCurveTo(-rw * (0.72 + round * 0.2), lowerY - R * 0.02, -rw, upperY - corner * 0.5);
    g.closePath(); g.stroke();

    // upper lip: a band above the aperture, fixed to the skull
    g.fillStyle = LIP; g.strokeStyle = INK; g.lineWidth = LWb * 0.85;
    const ut = R * 0.055 * (1 + round * 0.5);
    g.beginPath();
    g.moveTo(-mw, upperY - corner);
    g.bezierCurveTo(-mw * 0.5, upperY - ut - corner, -mw * 0.14, upperY - ut * 0.55, 0, upperY - ut * 0.3);
    g.bezierCurveTo(mw * 0.14, upperY - ut * 0.55, mw * 0.5, upperY - ut - corner, mw, upperY - corner);
    g.quadraticCurveTo(0, upperY - aperture * 0.12, -mw, upperY - corner);
    g.closePath(); g.fill(); g.stroke();
    // lower lip: a band below the aperture, riding the jaw
    const lt = R * 0.070 * (1 + round * 0.45);
    g.beginPath();
    g.moveTo(-mw, upperY - corner);
    g.quadraticCurveTo(-rw * 0.72, lowerY - R * 0.02, 0, lowerY);
    g.quadraticCurveTo(rw * 0.72, lowerY - R * 0.02, mw, upperY - corner);
    g.bezierCurveTo(mw * 0.55, lowerY + lt, -mw * 0.55, lowerY + lt, -mw, upperY - corner);
    g.closePath(); g.fill(); g.stroke();
  }
  /* ── CURLS AND BEARD ──────────────────────────────────────────────────────
     Drawn HERE, inside the g.translate(cx,cy) that opens step 3, because every
     other feature in this function is authored around the origin in R units.
     The first version placed them at (cx,cy) as well, which added the face's
     centre a second time and hung every beard off the right-hand side of the
     head like a bib on a hook. Same coordinate space as the jaw, or it is not
     on the jaw.

     Five of this cast are drawn bearded by figure-hero — Odysseus, Nestor,
     Eumaeus, Alcinous, Polyphemus — and the ported engine had no beard at all,
     because its own cast has none. A clean-shaven close-up of a bearded body
     is not a style difference, it is a different man in the next shot.
  ───────────────────────────────────────────────────────────────────────── */
  if (F.hair === "curly") {
    g.fillStyle = HAIR; g.strokeStyle = INK; g.lineWidth = LWa * 0.8;
    for (let i = -4; i <= 4; i++) {
      const a2 = i / 4;
      const sdc = seedOf(String(F.hairColor) + F.hairMass);
      const lx = a2 * R * 0.86 * F.hairMass + (rnd2(sdc, i + 3) - 0.5) * R * 0.06;
      const ly = -R * (0.60 - Math.abs(a2) * 0.26) + (rnd2(sdc, i + 9) - 0.5) * R * 0.05;
      const rr = R * (0.19 + rnd2(sdc, i) * 0.09 - Math.abs(a2) * 0.045) * F.hairMass;
      g.beginPath(); g.arc(lx, ly, rr, 0, Math.PI * 2); g.fill(); g.stroke();
    }
  }
  if (F.beard) {
    /* PLACED OFF THE CANON, NOT BY EYE. MOUTH_Y is 0.70 and CHIN_Y is 1.16, so
       an upper edge at 0.70 lands ON the mouth — which is what the first
       version did, swallowing the aperture and turning every bearded man into
       a grin. It has to clear the LOWER lip.
       It hinges: a beard grows on the mandible, so it drops with the jaw. The
       moustache does not — that grows on the upper lip, which is skull. */
    const B = BEARDS[F.beard] || BEARDS.full;
    const bw = B.w * (0.86 + (F.jawW - 1) * 0.6);
    const sd = seedOf(F.beard + (F.hairColor || "") + F.jawW);
    /* the ring: down the left jaw, round the chin, up the right, then back
       across an upper edge that clears the lower lip */
    const ring = [];
    /* ── THE BEARD'S OUTER EDGE IS THE FACE'S OWN EDGE ──────────────────────
       Every version until now drew the outer boundary as its own arc at some
       multiple of the jaw's width, and an arc that merely resembles the
       silhouette leaves a rind of bare skin outside it in places and overhangs
       in others. There is no face outside a beard. So the outer boundary is
       not approximated — it IS the silhouette, the same point list the head
       was filled from, walked from the right temple round the mandible and the
       chin and back up to the left. The jaw cannot be uncovered, because the
       jaw is the boundary.

       And it covers LESS IN THE MIDDLE. A beard is deep along the jaw and
       shallow under the mouth, because that is where it grows from: the
       mandible carries it and the chin only catches the end of it. The inner
       edge runs from the temple down the beard line to the mouth corner, then
       across just under the lower lip — a thin band centrally, a thick one at
       the sides.

       sil is already hinged, so the beard follows the jaw when it drops
       without a second hinge being applied.
    ───────────────────────────────────────────────────────────────────────── */
    const P = (i) => [sil[i].x * S.x, sil[i].y * S.y];
    /* 7..17 is right zygoma -> gonion -> mandible -> chin -> and back up left */
    for (let i = 7; i <= 17; i++) ring.push(P(i));

    const cornerX = 0.42, cornerY = MOUTH_Y + 0.02;
    const zyg = sil[7], zygL = sil[17];
    /* left cheek: up the beard line from under the lip out to the temple */
    ring.push([lerp(zygL.x, -cornerX, 0.55) * S.x, lerp(zygL.y, cornerY, 0.62) * S.y]);
    ring.push([-cornerX * S.x, cornerY * S.y]);
    /* across, shallow — the chin only catches the end of it */
    for (let i = 0; i <= 6; i++) {
      const u = i / 6;
      ring.push([lerp(-cornerX, cornerX, u) * S.x,
                 (MOUTH_Y + B.top + 0.07 * Math.sin(u * Math.PI)) * S.y]);
    }
    ring.push([cornerX * S.x, cornerY * S.y]);
    ring.push([lerp(zyg.x, cornerX, 0.55) * S.x, lerp(zyg.y, cornerY, 0.62) * S.y]);
    /* the beard lights from the same key and goes darkest under the chin,
       where it is in the jaw's own shadow */
    const bg = g.createLinearGradient(-R * 0.5, R * MOUTH_Y, R * 0.35, R * (CHIN_Y + 0.5));
    /* +122 put the beard a step off paper and it printed as an outline with
       nothing inside. A beard is a DARK mass carrying light strokes, the same
       as the hair on the head — the ground moves, the relationship does not. */
    bg.addColorStop(0.00, shade(HAIR, 68));
    bg.addColorStop(0.45, shade(HAIR, 40));
    bg.addColorStop(1.00, shade(HAIR, 6));
    g.fillStyle = bg; g.strokeStyle = INK; g.lineWidth = LWa;
    raggedPath(g, ring, sd, R * B.amp);
    g.fill(); g.stroke();
    /* and the beard is hair too: strokes that fall from the jawline down,
       clipped inside its own contour */
    g.save(); raggedPath(g, ring, sd, R * B.amp); g.clip();
    for (let i = 0; i < 200; i++) {
      const a1 = rnd2(sd + 71, i), a2 = rnd2(sd + 97, i), a3 = rnd2(sd + 131, i);
      const ox = (a1 - 0.5) * 2 * R * 1.02 * sx;
      const oy = R * (0.10 + a2 * (CHIN_Y + 0.18));
      const len = R * (0.10 + a3 * 0.16);
      const lean = -(ox / (R * bw)) * 0.42;
      const lit = clamp01(0.55 - (ox / (R * 1.4)) * 0.8 - (a2 * 0.5));
      g.strokeStyle = shade(HAIR, Math.round(-14 + lit * 36));
      g.lineWidth = R * 0.020 * (0.7 + a3 * 0.7);
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(ox, oy);
      g.quadraticCurveTo(ox + lean * len * 0.8, oy + len * 0.6, ox + lean * len * 0.4, oy + len);
      g.stroke();
    }
    g.restore();

    if (B.tache) {
      /* A MOUSTACHE IS NARROW. It grows on the upper lip and NOTHING ELSE —
         it cannot be wider than the mouth it sits on, and the slab version was
         spanning most of the face. Width comes off the mouth, not the beard. */
      const mu = R * 0.575 + py, md = R * 0.672 + py, mwv = R * 0.225 * (0.9 + (F.lip - 1) * 0.5);
      const t = [];
      for (let i = 0; i <= 7; i++) { const u = i / 7;
        t.push([lerp(-mwv, mwv, u), mu + Math.sin(u * Math.PI) * -R * 0.045]); }
      for (let i = 0; i <= 5; i++) { const u = 1 - i / 5;
        t.push([lerp(-mwv, mwv, u), md - Math.sin(u * Math.PI) * R * 0.012]); }
      raggedPath(g, t, sd + 7, R * 0.014);
      g.fill(); g.stroke();
    }
  }
  g.restore();


  /* ---- 8. the creases that a face actually has --------------------------
     Philtrum always; nasolabial folds only when the mouth is doing something
     that would make them; and for Iona the four the text pays for. */
  g.strokeStyle = INK; g.lineWidth = LWc;
  g.beginPath();
  g.moveTo(nx - R * 0.012, ntip + R * 0.030);
  g.lineTo(mx, upperY - R * 0.085);
  g.stroke();

  const fold = clamp01(Math.max(jaw * 0.7, Math.abs(smile), clamp01(wide) * 0.6));
  if (fold > 0.24) {
    g.lineWidth = LWc * (0.8 + fold * 0.6);
    for (const es of [-1, 1]) {
      if (Math.abs(yaw) > 0.6 && es * Math.sin(yaw) < 0) continue;
      g.beginPath();
      g.moveTo(nx + es * R * 0.125 * sx, ntip - R * 0.02);
      g.quadraticCurveTo(mx + es * R * 0.30 * sx, upperY - R * 0.14,
        mx + es * mw * 1.08, upperY + aperture * 0.35 - corner);
      g.stroke();
    }
  }

  if (F.lines > 0.3) {
    /* "the skin deeply lined". Four lines, at three dots' width, because a
       fifth would start to read as texture and texture is what the lattice
       cannot hold. Forehead, crow's feet, marionette, neck. */
    const a = F.lines;
    g.strokeStyle = INK; g.lineWidth = LWc;
    g.globalAlpha = 0.85;
    for (let i = 0; i < 2; i++) {
      const yy = eyeY - R * (0.52 + i * 0.15) - browUp * R * 0.10;
      g.beginPath();
      g.moveTo(-R * 0.52 * sx + fx, yy + R * 0.02);
      g.quadraticCurveTo(fx, yy - R * 0.035, R * 0.52 * sx + fx, yy + R * 0.02);
      g.stroke();
    }
    for (const es of [-1, 1]) {
      if (Math.abs(yaw) > 0.7 && es * Math.sin(yaw) < 0) continue;
      const ex = fx + es * eyeDx;
      for (let i = 0; i < 2; i++) {
        g.beginPath();
        g.moveTo(ex + es * R * 0.215, eyeY - R * 0.02 + i * R * 0.055);
        g.lineTo(ex + es * R * (0.30 + 0.02 * i), eyeY - R * 0.05 + i * R * 0.075);
        g.stroke();
      }
      g.beginPath();                                 // marionette
      g.moveTo(mx + es * mw * 1.10, upperY + aperture * 0.5 - corner);
      g.quadraticCurveTo(mx + es * mw * 1.22, R * 0.86 + aperture * 0.5,
        mx + es * mw * 0.96, R * 1.02 + aperture * 0.6);
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  /* ---- 9. the crown ------------------------------------------------------
     REBUILT. It was one fixed bezier for all twelve heads, scaled by hairMass,
     which is why the sheet came back as twelve people wearing the same cap.
     A hairstyle is not a size.

     Four parameters now, and they are the four things you actually see across
     a room: how LOW the hair sits on the forehead, how far it has RECEDED at
     the temples, whether there is a PART, and whether it is bound by a FILLET
     — which is the one hair ornament this period actually has, and the only
     structural difference available between four long-haired women the poem
     declines to describe.

     The outer edge is ragged, for the same reason the beards are: a smooth
     contour on a mass of hair reads as a helmet. */
  if (F.hair !== "bald") {
    /* HAIRLINE is -0.56 in the canon — an ABSOLUTE position, not an offset.
       Treating it as one and passing values near zero put every hairline down
       at brow level and the whole cast came out in helmets pulled over their
       eyes. `hairDrop` is the offset: positive is lower on the forehead. */
    const hl = HAIRLINE + (F.hairDrop || 0) + (F.child ? 0.06 : 0);
    const rec = F.recede || 0;                 // temples pull back and up
    const part = F.part || 0;                  // -1 left, +1 right, 0 none
    const sd = seedOf((F.hairColor || "") + F.hair + hl + rec);
    const ring = [];
    /* outward, left temple over the crown to the right temple */
    for (let i = 0; i <= 14; i++) {
      const u = i / 14, th = Math.PI * (1 - u);
      const rx = 1.04 + 0.09 * Math.sin(u * Math.PI);
      const ry = 1.26 + 0.04 * Math.sin(u * Math.PI);
      ring.push([Math.cos(th) * R * rx * hm * sx,
                 R * 0.06 - Math.sin(th) * R * ry * hm]);
    }
    /* back along the hairline, right temple to left. Recession lifts the
       corners and leaves the centre widow's peak behind — which is what
       receding actually looks like, and why an old man is not just "less hair". */
    for (let i = 0; i <= 10; i++) {
      const u = i / 10, x = 1 - u * 2;               // +1 .. -1
      const temple = Math.pow(Math.abs(x), 2.2);      // 1 at temples, 0 centre
      let y = hl + 0.10 * temple - 0.06 * (1 - temple);
      y -= rec * (0.46 * temple);                     // corners climb
      if (part) {                                     // a parting is a notch
        const d = Math.abs(x - part * 0.42);
        if (d < 0.30) y -= (0.30 - d) * 0.52;
      }
      ring.push([x * R * (0.96 - rec * 0.06) * sx, R * y]);
    }
    /* HAIR IS NOT A SLAB. A single flat black mass is the other half of why
       these read as stickers: real hair has a sheen band where the light
       crosses the crown and goes near-black at the roots and the nape. Two
       stops and the halftone does the rest. */
    /* ENGRAVED, NOT FILLED. First pass put light strokes on a dark mass and
       they vanished — two tones a few steps apart, printing as one. The
       reference works the other way round and so does every wood engraving:
       the mass is a LIGHT ground and the drawing is done in near-black line
       work on top of it. Same reason a face is mostly paper. */
    const hg = g.createLinearGradient(-R * 0.9 * sx, -R * 1.30, R * 0.7 * sx, R * 0.40);
    hg.addColorStop(0.00, shade(HAIR, 72));
    hg.addColorStop(0.34, shade(HAIR, 52));
    hg.addColorStop(0.70, shade(HAIR, 30));
    hg.addColorStop(1.00, shade(HAIR, 8));
    g.fillStyle = hg; g.strokeStyle = INK; g.lineWidth = LWa;
    raggedPath(g, ring, sd, R * (F.hair === "curly" ? 0.052 : 0.030));
    g.fill(); g.stroke();

    /* ── HAIR IS STRANDS, NOT A SHAPE ────────────────────────────────────────
       The mass is only the ground. What separates drawn hair from a filled
       silhouette is the LOCKS on top of it: overlapping comma strokes that
       follow the skull, lighter where the key crosses the crown and near-black
       at the roots. Curly hair gets tight commas, straight hair gets long ones
       that travel further before they close.

       Drawn INSIDE the mass by clipping to it, so the outer contour stays the
       single hard edge this world requires and nothing frizzes past it. */
    g.save();
    raggedPath(g, ring, sd, R * (F.hair === "curly" ? 0.052 : 0.030));
    g.clip();
    const curly = F.hair === "curly";
    /* ── HAIR FLOWS FROM A CROWN ─────────────────────────────────────────────
       Second pass made the locks visible and they read as scratches, because
       every one of them fell straight down. Hair does not fall down; it grows
       OUT of a whorl and follows the skull, so the direction of a lock is the
       direction away from the crown at the point it sits. Compute that and the
       same strokes stop being hatching and start being hair.  */
    const CX0 = -R * 0.22 * (F.part || 0.4), CY0 = -R * 1.16;   // the whorl
    const NLOCK = curly ? 190 : 140;
    for (let i = 0; i < NLOCK; i++) {
      const a1 = rnd2(sd + 11, i), a2 = rnd2(sd + 29, i), a3 = rnd2(sd + 53, i);
      const th = Math.PI * (-0.06 + 1.12 * a1);
      const rr = (0.34 + 0.70 * a2) * hm;
      const ox = -Math.cos(th) * R * 1.06 * rr;
      const oy = R * 0.10 - Math.sin(th) * R * 1.22 * rr;
      /* the flow direction: away from the whorl, along the skull */
      let dx = ox - CX0, dy = oy - CY0;
      const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
      const len = R * (curly ? 0.11 + a3 * 0.09 : 0.19 + a3 * 0.17);
      /* a lock curls across its own direction; the normal gives the sideways */
      const nx = -dy, ny = dx;
      const curl = (a3 - 0.5) * (curly ? 2.1 : 0.85);
      const lit = clamp01(0.52 - (ox / (R * 1.6)) * 0.85 - (oy / (R * 2.2)) * 0.45);
      g.strokeStyle = shade(HAIR, Math.round(-16 + lit * 44));
      g.lineWidth = R * (curly ? 0.023 : 0.018) * (0.65 + a2 * 0.75);
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(ox, oy);
      if (curly) {
        g.bezierCurveTo(ox + dx * len * 0.4 + nx * len * curl,
                        oy + dy * len * 0.4 + ny * len * curl,
                        ox + dx * len * 0.7 - nx * len * curl,
                        oy + dy * len * 0.7 - ny * len * curl,
                        ox + dx * len, oy + dy * len);
      } else {
        g.quadraticCurveTo(ox + dx * len * 0.55 + nx * len * curl * 0.5,
                           oy + dy * len * 0.55 + ny * len * curl * 0.5,
                           ox + dx * len, oy + dy * len);
      }
      g.stroke();
    }
    g.restore();

    /* the fillet: a bound band across the head, drawn over the hair */
    if (F.fillet) {
      g.strokeStyle = INK; g.lineWidth = LWa * 1.5;
      g.beginPath();
      g.moveTo(-R * 1.02 * hm * sx, -R * 0.42);
      g.quadraticCurveTo(0, -R * (0.86 + 0.06 * hm), R * 1.02 * hm * sx, -R * 0.42);
      g.stroke();
      g.strokeStyle = PAPER; g.lineWidth = LWa * 0.55;
      g.beginPath();
      g.moveTo(-R * 1.00 * hm * sx, -R * 0.44);
      g.quadraticCurveTo(0, -R * (0.85 + 0.06 * hm), R * 1.00 * hm * sx, -R * 0.44);
      g.stroke();
    }
  }
  if (F.glasses) {
    g.strokeStyle = INK; g.lineWidth = LWb;
    for (const es of [-1, 1]) {
      g.beginPath(); g.ellipse(fx + es * eyeDx, eyeY, R * 0.27 * sx, R * 0.22, 0, 0, TAU); g.stroke();
    }
    g.beginPath();
    g.moveTo(fx - eyeDx + R * 0.27 * sx, eyeY); g.lineTo(fx + eyeDx - R * 0.27 * sx, eyeY);
    g.stroke();
  }

  g.restore();
}

/* ---- the CLOSE framing --------------------------------------------------
   One framing, shared by every close-up in the film, so that ninety cuts
   between five faces never move the eye line. That is not tidiness — a cut
   between two shots whose eye lines differ reads as a jump, and this film cuts
   between two faces every few seconds.

   R = 0.30 of frame height puts the head 2.4R tall in a 760px frame: the crown
   sits 32px down, the chin at 583, the collar enters at 711. It is a MEDIUM
   CLOSE-UP, not a tight one — the tight version crops the crown, and cropping
   is the one thing this world's ink-measured layout has never done. */
export const CLOSE = { cx: 0.500, cy: 0.420, R: 0.300 };
export const closeGeom = (NW, NH) => ({ cx: NW * CLOSE.cx, cy: NH * CLOSE.cy, R: NH * CLOSE.R });

/* ---- idle physiology ----------------------------------------------------
   A blink schedule and a gaze wander that are PURE functions of t. No random
   number generator, no accumulated state: two different renders of the same
   second must produce the same blink, or the loop-closure instrument in
   render-motion.mjs measures the blink instead of the motion.

   The blink is quantised to the frame grid on purpose. A 12fps blink that
   lands between frames is a half-closed eye held for 83ms, which reads as a
   flinch. Better to lose it or to land it square. */
export function idleFace(t, seed = 0, { rate = 4.2 } = {}) {
  const phase = (t / rate + seed * 0.37) % 1;
  const b = phase < 0.055 ? Math.sin((phase / 0.055) * Math.PI) : 0;
  return {
    blink: b > 0.15 ? b : 0,
    gazeX: Math.sin(t * 0.41 + seed * 2.1) * 0.30 + Math.sin(t * 1.9 + seed) * 0.05,
    gazeY: Math.sin(t * 0.33 + seed * 1.3) * 0.16,
  };
}

export const FACE_VERSION = "closeup-face/1.0.0";
