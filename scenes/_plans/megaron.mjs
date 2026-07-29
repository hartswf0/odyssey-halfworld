/* scenes/_plans/megaron.mjs — the hall of Odysseus. ADDITIVE, Book XVI+.
   Authored ONCE. Books XVI, XVII, XVIII, XX, XXI, XXII, XXIII all play here.
   Every station below is a plot fact somewhere in those books; the plan is the
   single place they are decided. x: 0 left .. 1 right. z: 0 far .. 1 near. */
import { makePlan } from "../../engine/blocking.mjs";

export const megaron = makePlan({
  id: "megaron",
  name: "The Great Hall at Ithaca",
  notes: "Doors are load-bearing: main door is the only exit the suitors know; " +
         "the postern (side door) is how Melanthius fetches arms in XXII, and " +
         "the sill is where Odysseus stands to shoot. Do not move these.",
  stations: {
    // --- architecture ---
    door_main:    { x:.50, z:.10 },   // the great doors, far wall
    threshold:    { x:.50, z:.16 },   // THE SILL — XXI.420, he shoots from here
    postern:      { x:.06, z:.24 },   // side door to the storeroom passage
    storeroom:    { x:.02, z:.30 },   // the arms; Melanthius' route in XXII
    hearth:       { x:.50, z:.52 },
    pillar_l:     { x:.26, z:.44 },
    pillar_r:     { x:.74, z:.44 },
    throne:       { x:.50, z:.86 },   // near camera, facing the doors
    stair_up:     { x:.92, z:.66 },   // to Penelope's chamber
    // --- the suitors' ground ---
    bench_l1:     { x:.18, z:.62 },  bench_l2: { x:.16, z:.76 },
    bench_r1:     { x:.82, z:.62 },  bench_r2: { x:.84, z:.76 },
    table_l:      { x:.24, z:.70 },  table_r:  { x:.76, z:.70 },
    // --- Book XXI: the twelve axes, a straight line down the spine ---
    axe_first:    { x:.50, z:.28 },
    axe_last:     { x:.50, z:.74 },
    shot_mark:    { x:.50, z:.80 },   // where the archer stands to loose
    // --- Book XXII ---
    corner_dead:  { x:.10, z:.90 },   // the killing corner
    doorway_maid: { x:.94, z:.40 },
  },
  fixtures: [
    { id:"axe_line", kind:"prop", along:["axe_first","axe_last"], count:12,
      note:"12 helves, evenly spaced in PLAN space — the arrow's path is plan.ray('shot_mark','door_main',u)" },
    { id:"hearth_fire", kind:"divine_fx", at:"hearth" },
  ],
});
export default megaron;
