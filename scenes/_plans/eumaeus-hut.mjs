/* scenes/_plans/eumaeus-hut.mjs — the swineherd's steading. ADDITIVE, Book XVI+.
   Books XIV, XV played here as collages; XVI, XVII re-enter it. Small room,
   four bodies, one door — which is exactly why the recognition works. */
import { makePlan } from "../../engine/blocking.mjs";

export const eumaeusHut = makePlan({
  id: "eumaeus-hut",
  name: "The Hut of Eumaeus",
  notes: "One door. Telemachus enters through it in S01; Eumaeus leaves " +
         "through it in S02, which is what empties the room for the reveal in S03.",
  stations: {
    door:        { x:.50, z:.14 },
    yard:        { x:.50, z:.06 },   // outside — dogs, arrivals
    dog_post:    { x:.24, z:.18 },
    hearth:      { x:.42, z:.52 },
    bench_far:   { x:.70, z:.42 },
    bench_near:  { x:.30, z:.70 },
    seat_guest:  { x:.66, z:.66 },   // the beggar's stool — he is given it in S01
    centre:      { x:.50, z:.62 },   // solo focus
    // CONTACT PAIR — two bodies that touch must not resolve to one point.
    // Any beat where figures embrace, grapple or hand something over uses a
    // pair, never the same station twice. Book XXII needs many of these.
    centre_l:    { x:.44, z:.62 },
    centre_r:    { x:.56, z:.62 },
    corner_dark: { x:.14, z:.56 },
    pen_wall:    { x:.88, z:.30 },
  },
  fixtures: [ { id:"hearth_fire", kind:"divine_fx", at:"hearth" } ],
});
export default eumaeusHut;
