/* ensemble.suitors — ALIAS of ensemble.the-suitors.
   The atlas names this group both "Suitors" and "The suitors"; they are one
   asset. This re-export keeps continuity (one canonical appearance) while
   satisfying scene references to `ensemble.suitors`. */
import { asset as theSuitors } from "../../assets/ensemble/the-suitors.mjs";
export const asset = { ...theSuitors, id:"ensemble.suitors", name:"Suitors" };
export default asset;
