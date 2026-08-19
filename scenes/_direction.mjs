/* ============================================================================
   _direction.mjs — THE PERFORMANCE, WHERE IT MATTERS.

   Reading the film's own key beats: 56 of 94 sampled face shots carried an
   expression lifted from the pose the scene already assigned its body. The
   other 40% played neutral, because the scene had asked that body for
   `neutral_front` or `lean_forward` — direction for a figure standing in a
   hall, which says nothing about a face in close-up.

   So this is the shortlist, chosen the same way the twelve faces were: the
   film nominates one key beat per scene, eighty-two of those belong to the
   twelve principals, and every one of the eighty-two is directed here by hand
   against the line actually spoken. Not 1,056 lines. Eighty-two moments.

   ---------------------------------------------------------------------------
   THE VOCABULARY THE RIG DID NOT HAVE

   figure-hero ships seven emotions — enthusiasm, skepticism, confrontation,
   guarded, grief, desperation, laughter — and they are a BODY vocabulary:
   what a whole figure does across a room. The Odyssey does not run on those.
   It runs on a man lying to everyone he meets, a wife who cannot afford to
   believe, a son who does not recognise his father, and a nurse who does. So:

     RECOGNITION  the poem's central event, and it happens four times
     CONTEMPT     what Odysseus feels for the suitors, distinct from anger
     IRONY        a face saying one thing while its owner means another —
                  the single most-used expression in this text
     APPEAL       supplication, which is the poem's whole social machinery
     WEARINESS    twenty years, and it is not the same as grief

   Every value below is a channel drawCloseup already reads. Nothing new was
   added to the renderer to support this.
========================================================================== */

export const EMOTIONS = {
  /* the poem's own five */
  recognition:  { browUp:.90, eyeWide:.62, headPitch:-.10, jaw:.14 },
  contempt:     { browKnit:.30, eyeNarrow:.58, mouthAsym:.70, headYaw:.12, headPitch:-.10 },
  irony:        { browUp:.30, eyeNarrow:.34, mouthAsym:.62, headRoll:-.10, smile:.14 },
  appeal:       { browUp:.70, browKnit:.30, eyeWide:.30, headPitch:-.16 },
  weariness:    { browUp:.26, browKnit:.18, eyeNarrow:.46, frown:.22, headPitch:.26 },

  /* and the rest of what eighty-two lines actually ask for */
  resolve:      { browKnit:.40, eyeNarrow:.22, frown:.12, headPitch:-.04 },
  command:      { browKnit:.48, eyeWide:.16, frown:.10, headPitch:-.06 },
  tenderness:   { browUp:.34, smile:.30, eyeNarrow:.20, headPitch:.16, headRoll:.07 },
  grief:        { browUp:.50, browKnit:.52, frown:.52, headPitch:.34 },
  anguish:      { browUp:.80, browKnit:.60, frown:.60, eyeNarrow:.30, headPitch:.28 },
  hurt:         { browUp:.58, browKnit:.44, frown:.40, headPitch:.18, headRoll:.08 },
  concern:      { browUp:.48, browKnit:.40, frown:.28, headPitch:.12 },
  fear:         { browUp:.85, browKnit:.45, eyeWide:.80, headPitch:.10 },
  wonder:       { browUp:.68, eyeWide:.55, headPitch:-.14 },
  joy:          { smile:.85, browUp:.45, eyeWide:.25, cheek:.50 },
  guarded:      { browKnit:.28, eyeNarrow:.30, frown:.18, headYaw:.22 },
  skepticism:   { browUp:.16, browKnit:.36, eyeNarrow:.40, mouthAsym:.65, headRoll:-.22 },
  confrontation:{ browKnit:.70, eyeNarrow:.35, frown:.45 },
  desperation:  { browUp:.95, browKnit:.22, eyeWide:.65, frown:.40 },
};

/* ---------------------------------------------------------------------------
   THE EIGHTY-TWO. Scene -> the emotion its key beat is played on.
   The note is the reason, kept short, and kept because six months from now the
   reason is the only thing that makes a direction arguable rather than random.
--------------------------------------------------------------------------- */
export const BEATS = {
  "OD-B01-S01": ["appeal",      "she is petitioning Zeus, not commanding him"],
  "OD-B01-S02": ["resolve",     "the decision that starts the poem"],
  "OD-B01-S03": ["tenderness",  "a boy offering hospitality he cannot afford"],
  "OD-B01-S04": ["irony",       "she is lying about who she is, warmly"],
  "OD-B01-S05": ["command",     "the goddess drops the disguise's manner"],
  "OD-B01-S06": ["resolve",     "first time he overrules his mother"],
  "OD-B02-S01": ["resolve",     "he claims the assembly in front of men who dismiss him"],
  "OD-B02-S05": ["command",     "instructions, cleanly given"],
  "OD-B02-S06": ["concern",     "the nurse's fear for an only son"],
  "OD-B03-S01": ["command",     "no more shyness, not now"],
  "OD-B03-S02": ["grief",       "you bring it all back"],
  "OD-B03-S03": ["weariness",   "an old man recounting a bad decision at sunset"],
  "OD-B03-S04": ["contempt",    "Aegisthus sat safe while we bled"],
  "OD-B03-S05": ["tenderness",  "dear boy, no fear that you prove base"],
  "OD-B03-S06": ["command",     "harness the horses"],
  "OD-B04-S02": ["recognition", "never have I seen such likeness — the poem's first"],
  "OD-B04-S03": ["wonder",      "she is describing a man who scarred himself to get in"],
  "OD-B05-S03": ["appeal",      "do not be angry — he is asking a goddess for release"],
  "OD-B05-S06": ["appeal",      "I come to your current a suppliant"],
  "OD-B06-S03": ["tenderness",  "the kindest greeting a stranger gets in the poem"],
  "OD-B06-S04": ["concern",     "she is managing what the town will say"],
  "OD-B07-S01": ["guarded",     "they do not warm to strangers"],
  "OD-B07-S03": ["appeal",      "at the queen's knees, formally"],
  "OD-B07-S04": ["weariness",   "hard to tell all my griefs"],
  "OD-B08-S01": ["command",     "a king ordering a ship down to the sea"],
  "OD-B08-S03": ["confrontation","that was badly spoken, young man"],
  "OD-B08-S05": ["concern",     "he has noticed his guest weeping"],
  "OD-B09-S01": ["irony",       "the compliment that opens four books of lies"],
  "OD-B09-S03": ["command",     "bind them under the benches"],
  "OD-B09-S05": ["resolve",     "the curiosity that costs six men their lives"],
  "OD-B09-S07": ["guarded",     "naming Agamemnon to a monster, carefully"],
  "OD-B09-S08": ["contempt",    "drink wine on that man-flesh you have eaten"],
  "OD-B09-S10": ["resolve",     "under the ram's belly, hands twisted in wool"],
  "OD-B09-S11": ["anguish",     "the prophecy comes home and he is blind"],
  "OD-B10-S07": ["command",     "haul the ship high and follow me"],
  "OD-B10-S08": ["command",     "Circe gives sailing directions to the dead"],
  "OD-B11-S04": ["grief",       "his mother died of longing for him"],
  "OD-B11-S07": ["grief",       "the eulogy for Achilles"],
  "OD-B12-S02": ["command",     "wax in their ears, and bind me"],
  "OD-B13-S02": ["wonder",      "all of it here, nothing taken"],
  "OD-B13-S03": ["confrontation","where were you all the salt years"],
  "OD-B13-S05": ["irony",       "she relishes the disguise she is building"],
  "OD-B14-S02": ["tenderness",  "kind to me past any telling"],
  "OD-B14-S03": ["skepticism",  "go on, leave nothing out — he does not believe a word"],
  "OD-B14-S04": ["irony",       "since wine loosens me — a lie told for a cloak"],
  "OD-B15-S01": ["command",     "go first to the swineherd"],
  "OD-B15-S02": ["tenderness",  "a robe woven by her own hands, for his wedding"],
  "OD-B15-S04": ["weariness",   "I was a king's son once"],
  "OD-B15-S05": ["command",     "take her round without me"],
  "OD-B16-S01": ["tenderness",  "keep your seat, stranger"],
  "OD-B16-S02": ["guarded",     "a Cretan, then — he is deciding whether to believe it"],
  "OD-B16-S03": ["fear",        "you are not my father; this is terror, not doubt"],
  "OD-B16-S04": ["resolve",     "counting a hundred and eight men he intends to fight"],
  "OD-B16-S05": ["confrontation","your own father came here hunted"],
  "OD-B16-S06": ["joy",         "the prince is home and safe"],
  "OD-B17-S01": ["weariness",   "every honour but no news"],
  "OD-B17-S04": ["irony",       "the king begging in his own hall"],
  "OD-B17-S05": ["weariness",   "I had a house and men of my own once"],
  "OD-B17-S06": ["confrontation","they struck a guest in my own house"],
  "OD-B17-S07": ["weariness",   "the pigs want me before dawn"],
  "OD-B19-S01": ["command",     "keep the women shut in until this is done"],
  "OD-B19-S06": ["resolve",     "she sets the contest that ends it"],
  "OD-B20-S01": ["desperation", "put your arrow in my breast tonight"],
  "OD-B20-S03": ["resolve",     "mark what I say, and let the gods hear it"],
  "OD-B20-S04": ["confrontation","be glad you missed"],
  "OD-B21-S02": ["resolve",     "here is the great bow of Odysseus"],
  "OD-B21-S04": ["command",     "carry the bow to me anyway"],
  "OD-B21-S05": ["resolve",     "no guest is refused in my house"],
  "OD-B21-S07": ["resolve",     "the stranger has not disgraced you — the turn"],
  "OD-B22-S01": ["contempt",    "you dogs. you never thought I would come home"],
  "OD-B22-S02": ["confrontation","my hands would not stop"],
  "OD-B22-S04": ["command",     "someone is arming them out of my own storeroom"],
  "OD-B22-S05": ["appeal",      "Mentor, keep ruin off me"],
  "OD-B22-S07": ["contempt",    "twelve of you went the shameless way"],
  "OD-B22-S08": ["resolve",     "not aloud — it is not holy to crow over dead men"],
  "OD-B23-S01": ["joy",         "wake and see it with your own eyes"],
  "OD-B23-S02": ["command",     "let the singer strike up a wedding tune"],
  "OD-B23-S03": ["hurt",        "no other wife would sit across the room"],
  "OD-B23-S04": ["recognition", "the summit: she knows him, and says why she could not"],
  "OD-B23-S05": ["weariness",   "one labour is still on me"],
  "OD-B23-S06": ["command",     "stay within doors, and bar them"],
  "OD-B24-S04": ["tenderness",  "count the trees you gave me when I was a boy"],
};

/** The emotion for a scene's key beat, or null. */
export function beatEmotion(sceneId) {
  const b = BEATS[sceneId];
  return b ? (EMOTIONS[b[0]] || null) : null;
}
export function beatName(sceneId) { const b = BEATS[sceneId]; return b ? b[0] : null; }
export const DIRECTION_VERSION = "direction/1.0.0";
