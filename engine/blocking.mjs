/* ============================================================
   engine/blocking.mjs — ADDITIVE. Book XVI+ only.

   WHY. Scenes I–XV are collages: each one invents its own anchors, so the
   same room is a different room every time. That survives episodic travel
   books. It cannot survive Book XXI–XXII, where the axe line, the two doors,
   and the position of every body are PLOT, sustained across dozens of shots.
   You cannot re-improvise the hall each scene and have an arrow fly straight.

   WHAT. A PLAN is a room, authored once, in top-down plan space:
     x  0..1  left..right
     z  0..1  far..near   (this is the depth d of README §5)
   Stations are named points. Scenes reference stations BY NAME and never
   compute anchors. Blocking is then a table of moves between stations over
   time, and occupancy hands off between scenes as structured state.

     import { megaron } from "../_plans/megaron.mjs";
     const at = blockingAt(megaron, MOVES, t);      // { odysseus:{x,y,scale,d}, ... }

   The projection is the SAME depth model makeRestage already uses, so a plan
   scene and a restaged scene sit on one floor and can be intercut.
   ============================================================ */
import { clamp, clamp01, lerp, smooth } from "./halfworld-engine.mjs";

/* README §5: y = H(0.50 + 0.46 d^1.08), h = H s (0.60 + 0.50 d) k
   x converges toward centre with depth — a far door is nearer the spine. */
export const SPREAD_FAR = 0.42;

export function project(station, opts = {}){
  const d = clamp(station.z, 0.08, 1);
  const k = opts.kind === "prop" ? 0.92 : 1.08;
  const spread = SPREAD_FAR + (1 - SPREAD_FAR) * d;
  return {
    d,
    x: 0.5 + (station.x - 0.5) * spread,
    y: 0.50 + 0.46 * Math.pow(d, 1.08),
    scale: (opts.scale ?? 1) * (0.60 + 0.50 * d) * k,
  };
}

export function makePlan({ id, name, stations = {}, fixtures = [], notes = "" }){
  const plan = {
    id, name, notes, stations, fixtures,
    at(nameOrPoint, opts){
      const s = typeof nameOrPoint === "string" ? stations[nameOrPoint] : nameOrPoint;
      if (!s) throw new Error(`[plan:${id}] unknown station "${nameOrPoint}"`);
      return project(s, opts);
    },
    /** straight line between two stations in PLAN space, then projected.
        This is how an arrow flies through twelve axe helves and agrees with
        every shot of them. */
    ray(fromName, toName, u){
      const a = stations[fromName], b = stations[toName];
      if (!a || !b) throw new Error(`[plan:${id}] bad ray ${fromName}->${toName}`);
      return project({ x: lerp(a.x, b.x, u), z: lerp(a.z, b.z, u) });
    },
    has(n){ return !!stations[n]; },
    names(){ return Object.keys(stations); },
  };
  return plan;
}

/** MOVES: [{ who, from, to, t0, t1, kind, scale, ease }]
 *  A figure with no move at time t holds its last resolved station.
 *  Returns { who: {x,y,scale,d,station,moving} } */
export function blockingAt(plan, moves, t, initial = {}){
  const out = {};
  const held = { ...initial };
  const ordered = [...moves].sort((a, b) => a.t0 - b.t0);

  for (const m of ordered){
    if (t >= m.t1) held[m.who] = m.to;
    else if (t >= m.t0) held[m.who] = m.from;
    else if (held[m.who] == null) held[m.who] = m.from;
  }
  for (const [who, station] of Object.entries(held)){
    const live = ordered.find(m => m.who === who && t >= m.t0 && t < m.t1);
    if (live){
      const u = smooth(clamp01((t - live.t0) / Math.max(1e-6, live.t1 - live.t0)));
      const a = plan.stations[live.from], b = plan.stations[live.to];
      const p = project({ x: lerp(a.x, b.x, u), z: lerp(a.z, b.z, u) },
                        { kind: live.kind, scale: live.scale });
      out[who] = { ...p, station: null, from: live.from, to: live.to, u, moving: true };
    } else {
      const src = ordered.filter(m => m.who === who && t >= m.t1).pop();
      out[who] = { ...plan.at(station, { kind: src?.kind, scale: src?.scale }),
                   station, moving: false };
    }
  }
  return out;
}

/** cast entries the existing placeInstance()/restage path already understands */
export function toCast(plan, block, roles){
  return Object.entries(block).map(([who, p]) => ({
    asset: roles[who]?.asset ?? who,
    instance: who,
    anchor: { x: p.x, y: p.y },
    scale: (roles[who]?.scale ?? 1) * p.scale,
    ...(roles[who]?.state || {}),
  }));
}

/** the handoff. Scenes XVI+ export `exitOccupancy` alongside prose exitState;
 *  the next scene imports it as `initial`. Continuity stops being a promise. */
export function occupancyAt(plan, moves, t, initial = {}){
  const b = blockingAt(plan, moves, t, initial);
  const o = {};
  for (const [who, p] of Object.entries(b)) o[who] = p.station ?? p.to;
  return o;
}

export default { makePlan, blockingAt, occupancyAt, toCast, project };
