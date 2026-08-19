/* ============================================================================
   _artifacts.mjs — THE THINGS, PERFORMING.

   The atlas draws four hundred and forty assets and almost none of them move:
   probed across a spread, only the ships and a fire animate at all. Everything
   else is a still drawing that the film pastes onto a stage. So the poem's
   objects — the ones the story actually turns on — have no performance, and a
   prop with no performance is set dressing no matter how well it is drawn.

   These eight do. Each is a pure function of u ∈ [0,1) in the sibling film's
   motion vocabulary, authored here rather than lifted off the atlas, because
   what an object DOES is not a property of its picture.

   ONE ARGUMENT PER ARTIFACT. The motion is not decoration and it is not a
   loop for the sake of a loop; it is the single thing that object does in the
   poem, and nothing else:

     THE SHROUD   woven by day, unwoven by night, for three years. A CYCLE that
                  returns exactly — the only true closed loop in the set, and
                  the reason Penelope survives the poem.
     THE SCAR     a TRACE: a line that gathers and stays. It is the one mark
                  that cannot be undone, which is why it identifies him.
     THE BOW      a CYCLE that does NOT close — drawn, released, and the arrow
                  is gone. The string returns; the shot does not.
     THE STAKE    a TRANSFER: heat moving into wood, then wood into an eye.
     THE OAR      an ADVANCE: carried inland, dwelling at each step, until it
                  stops being an oar and becomes a winnowing fan.
     THE WINDS    a BREAK: one bag, one cut, everything out at once.
     THE RAFT     a HOLD: it does not go anywhere. The sea moves under it.
     THE BED      a HOLD with no breath at all. It is rooted. It cannot move,
                  and that is the whole plot of Book 23.

   DOT LAW. Solid quantized tones, hard contours, no gradients, no alpha. The
   halftone is one pass run by the caller over the whole field.
========================================================================== */

import { cycle, trace, transfer, advance, hold, brk, sweep, dissolve, clamp01, TAU } from "../engine/motion.mjs";

const INK = "#141210";
const lvl = (l) => { const v = Math.round(255 - Math.max(0, Math.min(7, l)) * 255 / 7);
  const h = v.toString(16).padStart(2, "0"); return "#" + h + h + h; };
const rnd = (i) => { const s = Math.sin(i * 12.9898) * 43758.5453; return s - Math.floor(s); };

/* every artifact draws into a 1000x1000 field; the caller scales */
function field(g, W, H) {
  const S = Math.min(W, H) / 1000;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, W, H);
  g.translate((W - 1000 * S) / 2, (H - 1000 * S) / 2);
  g.scale(S, S);
  g.lineJoin = "round"; g.lineCap = "round";
  return S;
}

/* ── THE SHROUD ─────────────────────────────────────────────────────────────
   Woven by day, unwoven by night, three years running. The cycle closes
   exactly: at u=1 the cloth is where it was at u=0, which is the point — she
   is not making progress, she is buying time, and the loop is the lie. */
export const shroud = { id: "shroud", title: "The Shroud", scene: "OD-B02-S02",
  note: "woven by day, unwoven by night — the only closed loop in the poem",
  draw(g, W, H, u) {
    field(g, W, H);
    /* cycle() returns {beat, within, strike, breath, wear} — NOT a `phase`.
       Reading a field that does not exist gave NaN, every row rounded to zero,
       and the one artifact whose whole argument is that it goes out and comes
       back was the only one in the set that never moved. */
    const c = cycle(u, { beats: 2, closed: true });
    const woven = c.beat === 0 ? c.strike : 1 - c.strike;            // out, and back
    /* the frame */
    g.strokeStyle = INK; g.lineWidth = 14;
    g.beginPath(); g.moveTo(210, 150); g.lineTo(210, 850); g.moveTo(790, 150); g.lineTo(790, 850); g.stroke();
    g.lineWidth = 10;
    g.beginPath(); g.moveTo(190, 172); g.lineTo(810, 172); g.moveTo(190, 828); g.lineTo(810, 828); g.stroke();
    /* the warp: always there, always taut */
    g.strokeStyle = lvl(2); g.lineWidth = 3.4;
    g.beginPath();
    for (let i = 0; i <= 22; i++) { const x = 230 + i * (540 / 22); g.moveTo(x, 180); g.lineTo(x, 820); }
    g.stroke();
    /* the weft: this is what comes and goes */
    const rows = Math.round(woven * 30);
    for (let r = 0; r < rows; r++) {
      const y = 200 + r * 20;
      g.strokeStyle = r === rows - 1 ? INK : lvl(5);
      g.lineWidth = r === rows - 1 ? 9 : 7;
      g.beginPath();
      /* break every full-width span — the law against striping the frame */
      g.moveTo(230, y); g.lineTo(470, y); g.moveTo(500, y); g.lineTo(770, y);
      g.stroke();
    }
    /* the shuttle, travelling on the working row */
    if (rows > 0) {
      const y = 200 + (rows - 1) * 20;
      const x = 230 + ((u * 8) % 1) * 540;
      g.fillStyle = INK;
      g.beginPath(); g.ellipse(x, y, 34, 11, 0, 0, TAU); g.fill();
    }
  } };

/* ── THE SCAR ───────────────────────────────────────────────────────────────
   A trace: the line gathers and does not come back. Every other artifact here
   returns to where it started; this one cannot, which is exactly why it is the
   thing that proves who he is. */
export const scar = { id: "scar", title: "The Scar", scene: "OD-B19-S04",
  note: "a line that gathers and stays — the one mark that cannot be undone",
  draw(g, W, H, u) {
    field(g, W, H);
    /* the knee, stated */
    g.strokeStyle = lvl(2); g.lineWidth = 6;
    g.beginPath();
    g.moveTo(300, 120); g.quadraticCurveTo(250, 500, 320, 880);
    g.moveTo(700, 120); g.quadraticCurveTo(760, 500, 690, 880);
    g.stroke();
    /* the wound itself, drawn on */
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      pts.push({ x: 330 + t * 360 + Math.sin(t * 5.2) * 26,
                 y: 300 + t * 380 + Math.cos(t * 3.1) * 18 });
    }
    const drawn = trace(clamp01(u * 1.25), pts, { fade: 0.35 });
    g.lineCap = "round";
    for (let i = 1; i < drawn.length; i++) {
      const a = drawn[i - 1], b = drawn[i];
      g.strokeStyle = lvl(Math.round(3 + b.ink * 4));
      g.lineWidth = 9 + b.ink * 15;
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
    }
    /* the tusk that made it, withdrawing as the line completes */
    if (u < 0.45) {
      const k = 1 - clamp01(u / 0.45);
      g.fillStyle = INK;
      g.save(); g.translate(330 - k * 150, 300 - k * 190); g.rotate(0.72);
      g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(120, -40, 250, -10);
      g.quadraticCurveTo(130, 24, 0, 34); g.closePath(); g.fill(); g.restore();
    }
  } };

/* ── THE BOW ────────────────────────────────────────────────────────────────
   A cycle that does not close. The string comes back; the arrow does not. */
export const bow = { id: "bow", title: "The Bow", scene: "OD-B21-S07",
  note: "the string returns, the shot does not — a cycle with one thing missing",
  draw(g, W, H, u) {
    field(g, W, H);
    const c = cycle(u, { beats: 1, closed: false, drift: 0 });
    const pull = u < 0.62 ? Math.pow(u / 0.62, 0.7) : 0;         // draw, then loose
    const flown = u >= 0.62 ? clamp01((u - 0.62) / 0.38) : 0;
    /* the twelve axe heads, standing in a lane */
    g.strokeStyle = INK; g.lineWidth = 7;
    for (let i = 0; i < 12; i++) {
      const x = 250 + i * 46;
      g.beginPath(); g.moveTo(x, 620); g.lineTo(x, 760); g.stroke();
      g.beginPath(); g.arc(x, 600, 22, 0, TAU); g.stroke();
    }
    /* the stave */
    const bx = 200, tip = 120 + pull * 34;
    g.strokeStyle = INK; g.lineWidth = 16;
    g.beginPath();
    g.moveTo(bx, tip); g.quadraticCurveTo(bx - 110 - pull * 70, 460, bx, 900 - pull * 34);
    g.stroke();
    /* the string, and the nock coming back */
    g.lineWidth = 5;
    g.beginPath(); g.moveTo(bx, tip); g.lineTo(bx + pull * 250, 470); g.lineTo(bx, 900 - pull * 34); g.stroke();
    /* the arrow: on the string, then gone through the axes */
    g.strokeStyle = INK; g.lineWidth = 9;
    if (flown === 0) {
      g.beginPath(); g.moveTo(bx + pull * 250, 470); g.lineTo(bx + 300, 470); g.stroke();
    } else {
      const ax = 200 + flown * 900;
      g.beginPath(); g.moveTo(ax - 190, 600); g.lineTo(ax, 600); g.stroke();
      g.fillStyle = INK;
      g.beginPath(); g.moveTo(ax + 26, 600); g.lineTo(ax - 10, 588); g.lineTo(ax - 10, 612); g.closePath(); g.fill();
    }
  } };

/* ── THE STAKE ──────────────────────────────────────────────────────────────
   A transfer: heat into wood, then wood into an eye. */
export const stake = { id: "stake", title: "The Stake", scene: "OD-B09-S08",
  note: "heat moving into wood, then wood into an eye",
  draw(g, W, H, u) {
    field(g, W, H);
    const heat = clamp01(u * 2.1);
    const drive = u > 0.62 ? clamp01((u - 0.62) / 0.38) : 0;
    /* the eye, at the end of the lane */
    g.strokeStyle = INK; g.lineWidth = 10;
    const lid = 1 - drive * 0.86;
    g.beginPath();
    g.moveTo(700, 420); g.quadraticCurveTo(830, 420 - 120 * lid, 960, 420);
    g.quadraticCurveTo(830, 420 + 120 * lid, 700, 420); g.stroke();
    if (lid > 0.22) { g.fillStyle = INK; g.beginPath(); g.arc(830, 420, 46 * lid, 0, TAU); g.fill(); }
    /* the stake, heated along its length then driven */
    const x0 = 60 + drive * 520;
    const parts = transfer(clamp01(heat), 7, { stagger: 0.5, seed: 3 });
    for (let i = 0; i < 7; i++) {
      const seg = parts[i] || { u: 0 };
      const x = x0 + i * 78;
      g.strokeStyle = lvl(Math.round(2 + (seg.u || 0) * 5));
      g.lineWidth = 40 - i * 2.6;
      g.beginPath(); g.moveTo(x, 470); g.lineTo(x + 76, 456); g.stroke();
    }
    /* the point */
    g.fillStyle = INK;
    g.beginPath(); g.moveTo(x0 + 560, 448); g.lineTo(x0 + 640, 430); g.lineTo(x0 + 566, 476);
    g.closePath(); g.fill();
    /* the fire it came out of, at the near end, always burning */
    for (let i = 0; i < 9; i++) {
      const a = rnd(i + Math.floor(u * 6) * 9);
      g.fillStyle = lvl(3 + Math.round(a * 3));
      g.beginPath();
      g.ellipse(70 + a * 90, 640 - a * 70, 16 + a * 12, 34 + a * 26, a * 0.6, 0, TAU); g.fill();
    }
  } };

/* ── THE OAR ────────────────────────────────────────────────────────────────
   An advance: carried inland, dwelling at every step, until a man who has
   never seen the sea calls it a winnowing fan and it stops being an oar. */
export const oar = { id: "oar", title: "The Oar", scene: "OD-B11-S02",
  note: "carried inland until someone calls it a winnowing fan",
  draw(g, W, H, u) {
    field(g, W, H);
    /* advance() returns {index, shift, settled} — `shift` is how far through
       the step we are, and there is no `t` on it. */
    const a = advance(u, 6, { dwell: 0.72 });
    const step = a.index || 0, k = a.shift || 0;
    /* the ground: further from the sea at every step */
    g.strokeStyle = INK; g.lineWidth = 6;
    for (const [x0, x1] of [[40, 330], [370, 660], [700, 970]]) {
      g.beginPath(); g.moveTo(x0, 820); g.lineTo(x1, 820); g.stroke();
    }
    /* the sea, receding behind him */
    const sea = 1 - clamp01((step + k) / 6);
    g.strokeStyle = lvl(2); g.lineWidth = 4;
    for (let i = 0; i < 5; i++) {
      const y = 700 + i * 22;
      g.globalAlpha = 1;
      g.beginPath(); g.moveTo(20, y); g.lineTo(20 + sea * 300, y); g.stroke();
    }
    /* the figure, one step further each dwell */
    const x = 180 + (step + k) * 118;
    g.strokeStyle = INK; g.lineWidth = 15;
    g.beginPath(); g.moveTo(x, 820); g.lineTo(x, 600); g.stroke();          // body
    g.beginPath(); g.arc(x, 560, 42, 0, TAU); g.stroke();                    // head
    /* the oar on the shoulder — turning, over the whole journey, from a blade
       held like an oar to one held like a fan */
    const turn = clamp01((step + k) / 6) * 0.9;
    g.save(); g.translate(x, 610); g.rotate(-0.5 + turn);
    g.lineWidth = 14; g.strokeStyle = INK;
    g.beginPath(); g.moveTo(-240, 0); g.lineTo(210, 0); g.stroke();
    g.fillStyle = lvl(4);
    g.beginPath(); g.ellipse(250, 0, 62, 30, 0, 0, TAU); g.fill();
    g.strokeStyle = INK; g.lineWidth = 7;
    g.beginPath(); g.ellipse(250, 0, 62, 30, 0, 0, TAU); g.stroke();
    g.restore();
  } };

/* ── THE WINDS ──────────────────────────────────────────────────────────────
   A break: one bag, one cut, everything out at once and nothing recoverable. */
export const winds = { id: "winds", title: "The Bag of Winds", scene: "OD-B10-S08",
  note: "one cut, everything out at once — the poem's only irreversible mistake",
  draw(g, W, H, u) {
    field(g, W, H);
    const b = brk(u, 0.42);
    const open = b.after ? clamp01((u - 0.42) / 0.58) : 0;
    /* the bag */
    g.fillStyle = lvl(1); g.strokeStyle = INK; g.lineWidth = 12;
    g.beginPath();
    g.moveTo(500, 300 + open * 40);
    g.bezierCurveTo(760, 340, 780, 760, 500, 800);
    g.bezierCurveTo(220, 760, 240, 340, 500, 300 + open * 40);
    g.closePath(); g.fill(); g.stroke();
    /* the silver cord: whole, then cut */
    g.strokeStyle = INK; g.lineWidth = 10;
    if (!b.after) {
      g.beginPath(); g.moveTo(400, 320); g.quadraticCurveTo(500, 280, 600, 320); g.stroke();
    } else {
      g.beginPath(); g.moveTo(400, 320); g.lineTo(455 - open * 60, 300 - open * 40); g.stroke();
      g.beginPath(); g.moveTo(600, 320); g.lineTo(545 + open * 60, 300 - open * 40); g.stroke();
    }
    /* what leaves, and does not come back */
    if (open > 0) {
      for (let i = 0; i < 26; i++) {
        const a = rnd(i), a2 = rnd(i + 40);
        const th = a * TAU, r = open * (260 + a2 * 640);
        g.strokeStyle = lvl(Math.max(1, Math.round(6 - open * 4)));
        g.lineWidth = 3 + a2 * 5;
        const x = 500 + Math.cos(th) * r, y = 330 + Math.sin(th) * r * 0.72;
        g.beginPath();
        g.moveTo(x, y);
        g.quadraticCurveTo(x + Math.cos(th) * 70, y + Math.sin(th) * 40,
                           x + Math.cos(th) * 130, y + Math.sin(th) * 60);
        g.stroke();
      }
    }
  } };

/* ── THE RAFT ───────────────────────────────────────────────────────────────
   A hold. It does not go anywhere; the sea moves under it. */
export const raft = { id: "raft", title: "The Raft", scene: "OD-B05-S04",
  note: "it does not move — the sea moves under it",
  draw(g, W, H, u) {
    field(g, W, H);
    const h = hold(u, { breathSec: 4.1, dur: 6 });
    const lift = (h.breath ?? Math.sin(u * TAU)) * 16;
    /* the sea: the only thing with anywhere to be */
    g.strokeStyle = lvl(3); g.lineWidth = 6;
    for (let r = 0; r < 7; r++) {
      const y = 620 + r * 46;
      const ph = u * TAU + r * 0.9;
      g.beginPath();
      for (let x = -60; x <= 1060; x += 20) {
        const yy = y + Math.sin((x / 150) + ph) * (10 + r * 2);
        x === -60 ? g.moveTo(x, yy) : g.lineTo(x, yy);
      }
      g.stroke();
    }
    /* the raft: eight timbers, a mast, a man. None of it goes anywhere. */
    g.save(); g.translate(0, lift);
    g.strokeStyle = INK; g.lineWidth = 11;
    for (let i = 0; i < 8; i++) {
      const y = 560 + i * 13;
      g.beginPath(); g.moveTo(330, y); g.lineTo(670, y); g.stroke();
    }
    g.lineWidth = 14;
    g.beginPath(); g.moveTo(500, 556); g.lineTo(500, 300); g.stroke();
    g.fillStyle = lvl(1); g.strokeStyle = INK; g.lineWidth = 9;
    g.beginPath(); g.moveTo(505, 320); g.lineTo(640, 400); g.lineTo(505, 470);
    g.closePath(); g.fill(); g.stroke();
    g.lineWidth = 12; g.strokeStyle = INK;
    g.beginPath(); g.moveTo(410, 556); g.lineTo(410, 470); g.stroke();
    g.beginPath(); g.arc(410, 442, 26, 0, TAU); g.stroke();
    g.restore();
  } };

/* ── THE BED ────────────────────────────────────────────────────────────────
   A hold with no breath in it. Everything else in this set moves. This one
   cannot, and Book 23 is about exactly that. */
export const bed = { id: "bed", title: "The Bed", scene: "OD-B23-S04",
  note: "the one thing that cannot be moved, copied or faked",
  draw(g, W, H, u) {
    field(g, W, H);
    const FLOOR = 700, T = 520;
    /* soil, and the roots cut back into it — the only artifact with anything
       below its own ground line */
    g.fillStyle = lvl(2);
    g.beginPath(); g.moveTo(0, FLOOR); g.lineTo(1000, FLOOR); g.lineTo(1000, 1000); g.lineTo(0, 1000);
    g.closePath(); g.fill();
    for (const [col, w] of [["#ffffff", 16], [INK, 5]]) {
      g.strokeStyle = col;
      for (let i = 0; i < 9; i++) {
        const a = (i - 4) / 4;
        g.lineWidth = w - Math.abs(a) * (w * 0.5);
        g.beginPath(); g.moveTo(T + a * 26, FLOOR + 2);
        g.quadraticCurveTo(T + a * 120, FLOOR + 60, T + a * 230, FLOOR + 120);
        g.stroke();
      }
    }
    /* trunk, frame and crown as one closed path */
    const shape = () => {
      g.beginPath();
      g.moveTo(T - 46, FLOOR);
      g.quadraticCurveTo(T - 56, 420, T - 40, 300);
      g.quadraticCurveTo(T - 150, 260, T - 210, 190);
      g.quadraticCurveTo(T - 60, 110, T + 40, 176);
      g.quadraticCurveTo(T + 150, 214, T + 210, 268);
      g.quadraticCurveTo(T + 60, 300, T + 44, 320);
      g.quadraticCurveTo(T + 54, 430, T + 46, 470);
      g.lineTo(880, 470); g.lineTo(880, FLOOR); g.lineTo(846, FLOOR);
      g.lineTo(846, 520); g.lineTo(214, 520); g.lineTo(214, FLOOR);
      g.lineTo(180, FLOOR); g.lineTo(180, 470); g.lineTo(T - 46, 470);
      g.closePath();
    };
    g.fillStyle = "#ffffff"; shape(); g.fill();
    g.strokeStyle = INK; g.lineWidth = 9; shape(); g.stroke();
    g.fillStyle = lvl(1); g.fillRect(220, 476, 620, 40);
    g.strokeStyle = INK; g.lineWidth = 5; g.strokeRect(220, 476, 620, 40);
    /* the leaves are the ONLY thing here that moves */
    g.fillStyle = INK;
    for (let i = 0; i < 46; i++) {
      const a = rnd(i), b2 = rnd(i + 90), c2 = rnd(i + 300);
      const th = a * TAU, rad = 60 + b2 * 150;
      const stir = Math.sin(u * TAU + c2 * TAU) * (3 + b2 * 5);
      g.save();
      g.translate(T - 6 + Math.cos(th) * rad * 1.25 + stir, 216 - Math.abs(Math.sin(th)) * rad * 0.6 + stir * 0.4);
      g.rotate(th * 0.5);
      g.beginPath(); g.ellipse(0, 0, 15 + c2 * 8, 5 + c2 * 3, 0, 0, TAU); g.fill();
      g.restore();
    }
  } };


/* ═══ CREATURES, GODS AND WEATHER ═══════════════════════════════════════════
   Everything in this world needs a performance window, not just the objects a
   hand can pick up. The atlas has twenty-seven creatures, fifty-nine divine
   effects and a dozen weathers, and they were all still drawings — a storm
   that does not move is a picture of a storm.

   Same rule as the artifacts: ONE argument each, in the motion vocabulary, and
   the argument has to be the thing that matters about it in the poem. A dog
   that wags is a dog; a dog that holds its breath and then stops is Argos.
═════════════════════════════════════════════════════════════════════════ */

/* ARGOS. A hold that ENDS. He has waited twenty years, lifts his head when the
   beggar passes, and dies. The breath in this one runs out — which is the only
   time in the whole set that a hold is allowed to stop holding. */
export const argos = { id: "argos", title: "Argos", scene: "OD-B17-S05", kind: "creature",
  note: "twenty years of waiting, one lift of the head, and the breath stops",
  draw(g, W, H, u) {
    field(g, W, H);
    const alive = clamp01(1 - (u - 0.62) / 0.30);          // he goes at 0.62
    const h = hold(u, { breathSec: 3.6, dur: 6 });
    const br = (h.breath || 0) * 9 * alive;
    const lift = u > 0.34 && u < 0.72 ? Math.sin((u - 0.34) / 0.38 * Math.PI) : 0;
    /* the dungheap he was left on */
    g.fillStyle = lvl(2);
    g.beginPath(); g.moveTo(120, 760); g.quadraticCurveTo(500, 660, 880, 760);
    g.lineTo(880, 840); g.lineTo(120, 840); g.closePath(); g.fill();
    /* the body: ribs, and they stop moving */
    g.strokeStyle = INK; g.lineWidth = 13;
    g.beginPath();
    g.moveTo(300, 700 + br); g.quadraticCurveTo(500, 640 + br, 700, 700 + br);
    g.stroke();
    g.lineWidth = 6; g.strokeStyle = lvl(4);
    for (let i = 0; i < 5; i++) {
      const x = 360 + i * 66;
      g.beginPath(); g.moveTo(x, 690 + br); g.lineTo(x + 10, 736 + br * 0.6); g.stroke();
    }
    /* the head — the one movement he has left */
    g.save();
    g.translate(300, 700 + br); g.rotate(-lift * 0.42);
    g.strokeStyle = INK; g.lineWidth = 12;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(-120, -30); g.stroke();
    g.beginPath(); g.ellipse(-160, -40, 52, 32, -0.1, 0, TAU); g.stroke();
    /* the ear: drops when he does */
    g.lineWidth = 9;
    g.beginPath(); g.moveTo(-150, -66); g.quadraticCurveTo(-176, -100 + (1 - alive) * 60, -206, -70 + (1 - alive) * 54);
    g.stroke();
    /* the eye: open while he is */
    if (alive > 0.15) { g.fillStyle = INK; g.beginPath(); g.arc(-184, -46, 7 * alive, 0, TAU); g.fill(); }
    g.restore();
    /* the tail, and it is the last thing */
    g.strokeStyle = INK; g.lineWidth = 9;
    g.beginPath(); g.moveTo(700, 700 + br);
    g.quadraticCurveTo(770, 670 + br - lift * 26 * alive, 830, 700 + br - lift * 12 * alive);
    g.stroke();
  } };

/* THE SWINE. A dissolve: men into pigs, cell by cell, in the world's own
   ordered-dither matrix. Nothing crossfades in this film — a transformation
   here is a threshold moving across a Bayer grid, which is the only way one
   form is allowed to become another. */
export const swine = { id: "swine", title: "Circe's Swine", scene: "OD-B10-S04", kind: "creature",
  note: "men into pigs, cell by cell, on the dot law's own matrix",
  draw(g, W, H, u) {
    field(g, W, H);
    const k = u < 0.5 ? u * 2 : (1 - u) * 2;          // there and back — she reverses it
    const CELL = 40;
    for (let gy = 0; gy < 25; gy++) for (let gx = 0; gx < 25; gx++) {
      const x = gx * CELL, y = gy * CELL;
      const form = dissolve(k, gx, gy);               // "a" = man, "b" = pig
      /* the two bodies share a footprint; only the silhouette changes */
      const inMan = gy > 6 && gy < 20 && Math.abs(gx - 12) < 3 - Math.abs(gy - 13) * 0.10;
      const inPig = gy > 13 && gy < 20 && Math.abs(gx - 12) < 6 - Math.abs(gy - 16) * 0.30;
      const on = form === "a" ? inMan : inPig;
      if (!on) continue;
      g.fillStyle = form === "a" ? INK : lvl(5);
      g.fillRect(x + 3, y + 3, CELL - 6, CELL - 6);
    }
    /* the wand, held level across the whole change */
    g.strokeStyle = INK; g.lineWidth = 12;
    g.beginPath(); g.moveTo(700, 300); g.lineTo(940, 300); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.arc(700, 300, 20, 0, TAU); g.fill();
  } };

/* SCYLLA. A cycle with six heads that do NOT strike together. Six men, six
   snatches, and the ship cannot stop — the horror is the sequence, not the
   teeth. */
export const scylla = { id: "scylla", title: "Scylla", scene: "OD-B12-S03", kind: "creature",
  note: "six heads, six men, and the ship cannot stop for any of them",
  draw(g, W, H, u) {
    field(g, W, H);
    /* the cliff */
    g.fillStyle = lvl(3);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(300, 0); g.lineTo(250, 1000); g.lineTo(0, 1000);
    g.closePath(); g.fill();
    /* the ship, passing and not stopping */
    const sx = 300 + ((u * 0.7) % 1) * 700;
    g.strokeStyle = INK; g.lineWidth = 12;
    g.beginPath(); g.moveTo(sx - 150, 760); g.quadraticCurveTo(sx, 810, sx + 150, 760); g.stroke();
    g.beginPath(); g.moveTo(sx, 756); g.lineTo(sx, 560); g.stroke();
    /* six necks, each on its own phase */
    for (let i = 0; i < 6; i++) {
      const ph = (u * 6 + i * 0.61) % 1;
      const out = Math.sin(clamp01(ph / 0.42) * Math.PI);       // strike and withdraw
      const y = 180 + i * 118;
      const tip = 260 + out * 520;
      g.strokeStyle = INK; g.lineWidth = 16 - i * 0.9;
      g.beginPath();
      g.moveTo(250, y); g.quadraticCurveTo(250 + out * 260, y - 60 * out, tip, y + out * 40);
      g.stroke();
      /* the head, and a man in it at the top of the strike */
      g.fillStyle = INK;
      g.beginPath(); g.ellipse(tip, y + out * 40, 34, 20, out * 0.4, 0, TAU); g.fill();
      if (out > 0.72) {
        g.strokeStyle = lvl(1); g.lineWidth = 7;
        g.beginPath(); g.moveTo(tip + 20, y + out * 40); g.lineTo(tip + 66, y + out * 40 - 26); g.stroke();
      }
    }
  } };

/* ATHENA CHANGES. A dissolve, for the same reason the swine are one: this
   world has no crossfade. A god becoming a shepherd is a threshold crossing a
   grid, and the frames where both are half-present are the ones that matter. */
export const athenaShift = { id: "athenaShift", title: "Athena Changes", scene: "OD-B13-S05", kind: "divine",
  note: "no crossfade in this world — a god changes on a threshold",
  draw(g, W, H, u) {
    field(g, W, H);
    const k = u < 0.5 ? u * 2 : (1 - u) * 2;
    const CELL = 34;
    for (let gy = 0; gy < 30; gy++) for (let gx = 0; gx < 30; gx++) {
      const form = dissolve(k, gx, gy);
      const cx2 = (gx - 14.5) / 30, cy2 = (gy - 15) / 30;
      /* the goddess: tall, narrow, a helmet crest */
      const inGod = Math.abs(cx2) < 0.10 - Math.abs(cy2) * 0.06 && cy2 > -0.42 && cy2 < 0.46;
      const crest = form === "a" && cy2 < -0.34 && Math.abs(cx2) < 0.16;
      /* the old shepherd: bent, wide, a staff */
      const inMan = Math.abs(cx2 + cy2 * 0.20) < 0.13 - Math.abs(cy2) * 0.05 && cy2 > -0.26 && cy2 < 0.46;
      const on = form === "a" ? (inGod || crest) : inMan;
      if (!on) continue;
      g.fillStyle = form === "a" ? INK : lvl(4);
      g.fillRect(gx * CELL + 2, gy * CELL + 2, CELL - 4, CELL - 4);
    }
  } };

/* THE DAWN HELD BACK. A hold in which the thing being held is TIME. Athena
   keeps the sun under the rim for the length of one night, so the horizon
   breathes and the sun does not rise — and the moment the hold ends is the
   moment the poem lets them go. */
export const dawnHeld = { id: "dawnHeld", title: "The Dawn Held Back", scene: "OD-B23-S04", kind: "divine",
  note: "a night made longer — the one time a god stops the clock",
  draw(g, W, H, u) {
    field(g, W, H);
    /* A HOLD IS NOT A FREEZE. First draft made "time is stopped" literally
       static for 82% of the loop, and motion.mjs says exactly why that is
       wrong: a frozen frame reads as a crash, a held frame breathes. The night
       is being held against something. So the sun PRESSES — it rises a little
       and is pushed back, over and over — and the effort is the performance.
       The release at the end is only the last press that is not answered. */
    const h = hold(u, { breathSec: 5.2, dur: 8 });
    const press = Math.pow(Math.abs(Math.sin(u * TAU * 2.5)), 1.6);   // it keeps trying
    const held = u < 0.82 ? 0 : (u - 0.82) / 0.18;
    /* the sea, holding its own breath */
    g.strokeStyle = lvl(2); g.lineWidth = 5;
    for (let r = 0; r < 6; r++) {
      const y = 640 + r * 52 + (h.breath || 0) * 14 + press * 6;
      g.beginPath();
      for (let x = -40; x <= 1040; x += 24) {
        const yy = y + Math.sin(x / 190 + u * 1.2 + r) * 7;
        x === -40 ? g.moveTo(x, yy) : g.lineTo(x, yy);
      }
      g.stroke();
    }
    /* the horizon: broken, per the law */
    g.strokeStyle = INK; g.lineWidth = 8;
    for (const [a2, b2] of [[40, 380], [420, 700], [740, 960]]) {
      g.beginPath(); g.moveTo(a2, 620); g.lineTo(b2, 620); g.stroke();
    }
    /* the sun, under the rim, not rising */
    const sy = 700 - held * 190 - press * 46;              // pressing at the rim
    g.fillStyle = lvl(6);
    g.beginPath(); g.arc(500, sy, 120, 0, TAU); g.fill();
    g.strokeStyle = INK; g.lineWidth = 9;
    g.beginPath(); g.arc(500, sy, 120, 0, TAU); g.stroke();
    /* the hand over it, and it lifts only at the end */
    g.globalAlpha = 1;
    g.fillStyle = "#ffffff";
    g.fillRect(0, 620 - held * 210, 1000, 400);
    /* the light that gets past while it presses — the only thing that says
       something is being kept out rather than simply absent */
    if (press > 0.12 && held === 0) {
      g.strokeStyle = lvl(Math.round(1 + press * 3)); g.lineWidth = 3 + press * 5;
      for (let i = -3; i <= 3; i++) {
        const x = 500 + i * 96;
        g.beginPath(); g.moveTo(x, 620); g.lineTo(x + i * 22, 620 - press * (70 + Math.abs(i) * 18));
        g.stroke();
      }
    }
    g.strokeStyle = INK; g.lineWidth = 8;
    for (const [a2, b2] of [[40, 380], [420, 700], [740, 960]]) {
      g.beginPath(); g.moveTo(a2, 620 - held * 210 + 0); g.lineTo(b2, 620 - held * 210); g.stroke();
    }
  } };

/* THE STORM. A cycle that does not close, with WEAR — the one number that is
   the difference between weather and a disaster. Every turn of it costs a
   ship, and at the end of the loop the fleet is not where it started. */
export const storm = { id: "storm", title: "The Storm", scene: "OD-B12-S06", kind: "weather",
  note: "a cycle that never returns — every turn of it costs a ship",
  draw(g, W, H, u) {
    field(g, W, H);
    const c = cycle(u, { beats: 3, closed: false, drift: 1 });
    const lost = Math.floor(c.wear * 6);
    /* the sea, steepening */
    for (let r = 0; r < 9; r++) {
      const amp = 28 + r * 9 + c.strike * 26;
      const y = 420 + r * 62;
      g.strokeStyle = lvl(r < 4 ? 2 : 4); g.lineWidth = 5 + r * 0.7;
      g.beginPath();
      for (let x = -60; x <= 1060; x += 16) {
        const yy = y + Math.sin(x / 90 + u * TAU * 2 + r * 0.8) * amp;
        x === -60 ? g.moveTo(x, yy) : g.lineTo(x, yy);
      }
      g.stroke();
    }
    /* six ships; the ones already gone do not come back */
    for (let i = 0; i < 6; i++) {
      if (i < lost) continue;
      const x = 130 + i * 150;
      const y = 470 + Math.sin(x / 90 + u * TAU * 2) * 34;
      g.strokeStyle = INK; g.lineWidth = 9;
      g.beginPath(); g.moveTo(x - 46, y); g.quadraticCurveTo(x, y + 26, x + 46, y); g.stroke();
      g.beginPath(); g.moveTo(x, y - 2); g.lineTo(x + 8 * c.breath, y - 86); g.stroke();
    }
    /* the sky comes down */
    g.fillStyle = lvl(Math.round(2 + c.strike * 2));
    g.beginPath(); g.moveTo(0, 0); g.lineTo(1000, 0); g.lineTo(1000, 180 + c.strike * 90);
    for (let x = 1000; x >= 0; x -= 40) g.lineTo(x, 180 + Math.sin(x / 70 + u * 9) * 26 + c.strike * 90);
    g.closePath(); g.fill();
  } };

/* THE CALM. The opposite, and the worse one. A hold: the sail slack, the sea
   flat, and nothing to do about it. Becalmed is how the crew has time to eat
   the cattle. */
export const calm = { id: "calm", title: "The Calm", scene: "OD-B12-S06", kind: "weather",
  note: "becalmed — the sail slack, and time enough to make a mistake",
  draw(g, W, H, u) {
    field(g, W, H);
    const h = hold(u, { breathSec: 6.4, dur: 10 });
    const br = (h.breath || 0);
    g.strokeStyle = lvl(2); g.lineWidth = 4;
    for (let r = 0; r < 5; r++) {
      const y = 660 + r * 60;
      g.beginPath();
      for (let x = -40; x <= 1040; x += 30) {
        const yy = y + Math.sin(x / 260 + u * 0.8 + r) * (3 + r * 0.6);
        x === -40 ? g.moveTo(x, yy) : g.lineTo(x, yy);
      }
      g.stroke();
    }
    g.strokeStyle = INK; g.lineWidth = 11;
    g.beginPath(); g.moveTo(340, 700); g.quadraticCurveTo(500, 744, 660, 700); g.stroke();
    g.beginPath(); g.moveTo(500, 698); g.lineTo(500, 300); g.stroke();
    /* the sail: hanging, and the only motion in the frame is it not filling */
    g.fillStyle = lvl(1); g.strokeStyle = INK; g.lineWidth = 8;
    g.beginPath();
    g.moveTo(504, 320);
    g.quadraticCurveTo(504 + 34 + br * 16, 460, 504 + 10 + br * 8, 620);
    g.lineTo(504, 620); g.closePath(); g.fill(); g.stroke();
    /* the sun, flat and high and unhelpful */
    g.strokeStyle = INK; g.lineWidth = 7;
    g.beginPath(); g.arc(820, 190, 74, 0, TAU); g.stroke();
  } };


/* ═══ THE SIX NOBODY HAS LOOKED AT ══════════════════════════════════════════
   Fifty-nine divine effects and twenty-seven creatures sit in the atlas as
   still drawings. These are the six with the best arguments in them, and every
   one is a motion the set does not already have.
═════════════════════════════════════════════════════════════════════════ */

/* PROTEUS. The Old Man of the Sea becomes lion, serpent, leopard, boar, water,
   tree — and Menelaus has to hold on through every one of them. A TRANSFER
   through forms, with the grip as the only constant. The whole trick of the
   episode is that the man does not let go, so the hands are drawn in the same
   place in every frame while everything inside them changes. */
export const proteus = { id: "proteus", title: "Proteus", scene: "OD-B04-S04", kind: "divine",
  note: "lion, serpent, leopard, boar, water, tree — and the grip never moves",
  draw(g, W, H, u) {
    field(g, W, H);
    const FORMS = 6;
    const k = (u * FORMS) % 1, i = Math.floor(u * FORMS) % FORMS;
    const nx = (i + 1) % FORMS;
    /* the change happens on the dither, in the last third of each form */
    const mix = clamp01((k - 0.66) / 0.34);
    const CELL = 34;
    const shape = (f, cx2, cy2) => {
      switch (f) {
        case 0: return Math.abs(cy2) < 0.20 && cx2 > -0.34 && cx2 < 0.30            // lion: mass + mane
             || Math.hypot(cx2 + 0.34, cy2) < 0.22;
        case 1: return Math.abs(cy2 - Math.sin(cx2 * 12) * 0.13) < 0.05;            // serpent
        case 2: return Math.abs(cy2) < 0.14 && Math.abs(cx2) < 0.36                 // leopard
             && (Math.abs((cx2 * 9 % 1)) > 0.4 || Math.abs(cy2) < 0.05);
        case 3: return Math.abs(cy2 + 0.04) < 0.17 && cx2 > -0.30 && cx2 < 0.26;    // boar
        case 4: return cy2 > Math.sin(cx2 * 7 + 1) * 0.10 - 0.02;                   // water
        default: return Math.abs(cx2) < 0.05                                        // tree
             || (cy2 < -0.10 && Math.hypot(cx2, cy2 + 0.26) < 0.30);
      }
    };
    for (let gy = 0; gy < 30; gy++) for (let gx = 0; gx < 30; gx++) {
      const cx2 = (gx - 14.5) / 30, cy2 = (gy - 14.5) / 30;
      const f = dissolve(mix, gx, gy) === "a" ? i : nx;
      if (!shape(f, cx2, cy2)) continue;
      g.fillStyle = f % 2 ? lvl(5) : INK;
      g.fillRect(gx * CELL + 2, gy * CELL + 2, CELL - 4, CELL - 4);
    }
    /* THE GRIP. Same two hands, same place, every frame. */
    g.strokeStyle = INK; g.lineWidth = 22;
    g.beginPath(); g.moveTo(120, 500); g.lineTo(330, 500); g.stroke();
    g.beginPath(); g.moveTo(880, 500); g.lineTo(670, 500); g.stroke();
    g.fillStyle = "#ffffff"; g.strokeStyle = INK; g.lineWidth = 10;
    for (const hx of [360, 640]) {
      g.beginPath(); g.ellipse(hx, 500, 46, 62, 0, 0, TAU); g.fill(); g.stroke();
    }
  } };

/* CHARYBDIS. Swallows the sea three times a day and vomits it back. A CYCLE,
   and the terror is that it is on a schedule — you can time it, which is
   exactly why Odysseus survives it and his ship does not. */
export const charybdis = { id: "charybdis", title: "Charybdis", scene: "OD-B12-S05", kind: "weather",
  note: "on a schedule — you can time it, which is the only reason he lives",
  draw(g, W, H, u) {
    field(g, W, H);
    const c = cycle(u, { beats: 1, closed: true });
    const suck = Math.sin(u * TAU) * 0.5 + 0.5;         // down, then up
    /* the funnel */
    for (let r = 12; r >= 1; r--) {
      const k = r / 12;
      const rad = 60 + k * 420;
      const drop = (1 - k) * suck * 320;
      g.strokeStyle = lvl(Math.round(1 + (1 - k) * 5));
      g.lineWidth = 4 + (1 - k) * 8;
      g.beginPath();
      for (let a2 = 0; a2 <= TAU + 0.1; a2 += 0.16) {
        const wob = Math.sin(a2 * 5 + u * TAU * 3 + r) * (6 + (1 - k) * 16);
        const x = 500 + Math.cos(a2 + u * TAU * (0.4 + (1 - k) * 1.6)) * (rad + wob);
        const y = 470 + drop + Math.sin(a2 + u * TAU * (0.4 + (1 - k) * 1.6)) * (rad + wob) * 0.42;
        a2 === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      g.stroke();
    }
    /* the throat, opening and closing */
    g.fillStyle = INK;
    g.beginPath(); g.ellipse(500, 470 + suck * 300, 54 * suck + 10, (54 * suck + 10) * 0.42, 0, 0, TAU); g.fill();
    /* the fig tree on the rock above, and a man on it */
    g.strokeStyle = INK; g.lineWidth = 14;
    g.beginPath(); g.moveTo(60, 120); g.lineTo(210, 190); g.stroke();
    g.lineWidth = 9;
    g.beginPath(); g.moveTo(200, 186); g.lineTo(200, 250 + Math.sin(u * TAU) * 10); g.stroke();
    g.beginPath(); g.arc(200, 276 + Math.sin(u * TAU) * 10, 20, 0, TAU); g.stroke();
  } };

/* THE INTANGIBLE EMBRACE. He reaches for his mother's shade three times and
   three times his arms close on nothing. A cycle with WEAR: each attempt is
   the same and each one costs, which is what the drift number is for. This is
   the only performance in the set whose subject is a failure. */
export const embrace = { id: "embrace", title: "The Intangible Embrace", scene: "OD-B11-S04", kind: "divine",
  note: "three times he reaches, three times his arms close on nothing",
  draw(g, W, H, u) {
    field(g, W, H);
    const c = cycle(u, { beats: 3, closed: false, drift: 1 });
    const reach = c.strike;                                  // out, and closed
    const failed = c.beat;                                   // 0,1,2 — how many times
    /* the shade: present, and less present each time he tries */
    const there = 1 - failed * 0.26 - reach * 0.35;
    const CELL = 26;
    for (let gy = 0; gy < 39; gy++) for (let gx = 0; gx < 39; gx++) {
      const cx2 = (gx - 19) / 39, cy2 = (gy - 18) / 39;
      const inShade = Math.abs(cx2) < 0.13 - Math.abs(cy2) * 0.10 && cy2 > -0.30 && cy2 < 0.36;
      if (!inShade) continue;
      if (dissolve(clamp01(there), gx, gy) !== "a") continue;   // she thins on the matrix
      g.fillStyle = lvl(4);
      g.fillRect(gx * CELL + 2, gy * CELL + 2, CELL - 4, CELL - 4);
    }
    /* his arms: they close, and they close on nothing */
    const span = 300 - reach * 210;
    g.strokeStyle = INK; g.lineWidth = 20;
    g.beginPath(); g.moveTo(160, 760); g.quadraticCurveTo(500 - span, 520, 500 - span * 0.5, 470); g.stroke();
    g.beginPath(); g.moveTo(840, 760); g.quadraticCurveTo(500 + span, 520, 500 + span * 0.5, 470); g.stroke();
    /* the count, because the poem counts */
    g.fillStyle = INK;
    for (let i = 0; i <= failed; i++) { g.beginPath(); g.arc(80 + i * 34, 100, 11, 0, TAU); g.fill(); }
  } };

/* MELTING SNOW. Homer's own image: Penelope listening to a stranger describe
   her husband's clothes, and her face melts like snow off a mountain. A
   dissolve DOWNWARD — the only one in the set that runs one way and does not
   come back, because a face that has done this does not un-do it. */
export const meltingSnow = { id: "meltingSnow", title: "Melting Snow", scene: "OD-B19-S04", kind: "divine",
  note: "her face melted as snow melts on the mountains — Homer's own image",
  draw(g, W, H, u) {
    field(g, W, H);
    const CELL = 28;
    /* the mountain the simile is about, and the face it is about */
    for (let gy = 0; gy < 36; gy++) for (let gx = 0; gx < 36; gx++) {
      const cx2 = (gx - 17.5) / 36, cy2 = (gy - 17) / 36;
      const inFace = Math.hypot(cx2 * 1.25, cy2) < 0.30;
      if (!inFace) continue;
      /* melt from the top down: the threshold travels with y */
      const local = clamp01(u * 1.6 - (0.5 - cy2) * 0.9);
      if (dissolve(local, gx, gy) === "b") continue;      // gone
      g.fillStyle = lvl(cy2 < -0.10 ? 2 : 4);
      g.fillRect(gx * CELL + 2, gy * CELL + 2, CELL - 4, CELL - 4);
    }
    /* what runs off it */
    g.strokeStyle = lvl(3); g.lineWidth = 5;
    for (let i = 0; i < 9; i++) {
      const a = rnd(i);
      const x = 300 + a * 400;
      const y0 = 560 + a * 60, y1 = y0 + clamp01(u * 1.4 - a * 0.3) * 320;
      if (y1 <= y0) continue;
      g.beginPath(); g.moveTo(x, y0);
      g.quadraticCurveTo(x + Math.sin(a * 9) * 24, (y0 + y1) / 2, x + Math.sin(a * 9) * 12, y1);
      g.stroke();
    }
  } };

/* THE GOLDEN DOGS. Hephaestus made them, and they are deathless and ageless
   for ever. A HOLD WITH NO WEAR AT ALL — the only performance here that is
   allowed to be perfectly periodic, because they are machines and everything
   else in this poem is mortal. They are also the closest thing in the Odyssey
   to what this film is: made things that do not tire. */
export const goldenDogs = { id: "goldenDogs", title: "The Golden Dogs", scene: "OD-B07-S02", kind: "creature",
  note: "deathless and ageless for ever — the one loop allowed to be perfect",
  draw(g, W, H, u) {
    field(g, W, H);
    /* the doorway they flank */
    g.strokeStyle = INK; g.lineWidth = 16;
    g.beginPath(); g.moveTo(330, 820); g.lineTo(330, 240); g.lineTo(670, 240); g.lineTo(670, 820); g.stroke();
    for (const [side, x0] of [[-1, 250], [1, 750]]) {
      const ph = u * TAU;                       // identical phase: they are a pair
      const head = Math.sin(ph) * 5;            // a machine's idle, not a breath
      g.save(); g.translate(x0, 0); g.scale(side, 1);
      g.strokeStyle = INK; g.lineWidth = 13;
      g.beginPath(); g.moveTo(-70, 800); g.lineTo(-70, 660); g.moveTo(60, 800); g.lineTo(60, 660); g.stroke();
      g.beginPath(); g.moveTo(-80, 660); g.quadraticCurveTo(-10, 610, 70, 660); g.stroke();
      g.beginPath(); g.moveTo(66, 656); g.lineTo(110, 560 + head); g.stroke();
      g.beginPath(); g.ellipse(126, 534 + head, 40, 26, -0.25, 0, TAU); g.stroke();
      /* the gilding: hard chevrons, not a gradient */
      g.strokeStyle = lvl(3); g.lineWidth = 6;
      for (let i = 0; i < 4; i++) {
        g.beginPath(); g.moveTo(-56 + i * 32, 648); g.lineTo(-44 + i * 32, 624); g.stroke();
      }
      g.fillStyle = INK; g.beginPath(); g.arc(140, 528 + head, 6, 0, TAU); g.fill();
      g.restore();
    }
  } };

/* ZEUS'S THUNDERBOLT. A break, and the shortest performance in the set: it is
   whole, then it is not, and there is no third state. The frame before is
   worth as much as the frame after, which is why the hold before it is long. */
export const thunderbolt = { id: "thunderbolt", title: "Zeus's Thunderbolt", scene: "OD-B12-S07", kind: "divine",
  note: "whole, then not — and no third state",
  draw(g, W, H, u) {
    field(g, W, H);
    const b = brk(u, 0.68);                 // a long wait, then instantly
    const after = b.after ? clamp01(b.sinceBreak / 0.32) : 0;
    /* the ship, on a flat sea, waiting */
    g.strokeStyle = lvl(2); g.lineWidth = 5;
    for (let r = 0; r < 4; r++) {
      const y = 700 + r * 54;
      g.beginPath();
      for (let x = -40; x <= 1040; x += 26) g.lineTo(x, y + Math.sin(x / 200 + u) * 5);
      g.stroke();
    }
    if (after < 0.55) {
      g.strokeStyle = INK; g.lineWidth = 12;
      g.beginPath(); g.moveTo(360, 720); g.quadraticCurveTo(500, 764, 640, 720); g.stroke();
      g.beginPath(); g.moveTo(500, 716); g.lineTo(500, 420); g.stroke();
    }
    /* the bolt: one frame's worth, and then only what it left */
    if (b.after && after < 0.30) {
      g.strokeStyle = INK; g.lineWidth = 20 - after * 40;
      g.beginPath();
      g.moveTo(470, 0); g.lineTo(560, 250); g.lineTo(430, 300); g.lineTo(540, 690);
      g.stroke();
      g.fillStyle = "#ffffff"; g.globalAlpha = 1;
    }
    if (after >= 0.30) {
      /* timbers, and nothing else */
      g.strokeStyle = INK; g.lineWidth = 9;
      for (let i = 0; i < 7; i++) {
        const a = rnd(i);
        const x = 300 + a * 420, y = 700 + a * 60;
        const sp = (after - 0.30) * 260;
        g.save(); g.translate(x + Math.cos(a * 9) * sp, y + Math.sin(a * 9) * sp * 0.4);
        g.rotate(a * 3); g.beginPath(); g.moveTo(-46, 0); g.lineTo(46, 0); g.stroke(); g.restore();
      }
    }
  } };

/* the whole cast of things, in the order they are worth watching */
for (const a of [shroud, scar, bow, stake, oar, winds, raft, bed]) a.kind = a.kind || "thing";
export const ARTIFACTS = [shroud, scar, bow, stake, oar, winds, raft, bed,
                          argos, swine, scylla, goldenDogs,
                          athenaShift, dawnHeld, proteus, embrace, meltingSnow, thunderbolt,
                          storm, calm, charybdis];
export const KINDS = ["thing", "creature", "divine", "weather"];
export const ARTIFACTS_VERSION = "artifacts/1.0.0";
