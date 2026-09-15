
export const SLOTS=["matter","place","light","people"];
export const PREFIX={matter:"A HOUSE OF",place:"",light:"USING",people:"INHABITED BY"};
export const VOCAB={
 matter:[
 {label:"CLAY AND STORED WINE",items:["prop.travel-wine-jars","prop.cheese-racks-and-milk-vessels","prop.water-pitcher"],verb:"The vessels make a place to store, pour, and share."},
 {label:"WOVEN THREAD",items:["prop.laertess-shroud-and-loom","prop.laundry-bundles","prop.guest-chair-and-footstool"],verb:"Thread gathers into cloth; the same work can be undone."},
 {label:"OLIVE WOOD",items:["prop.olive-tree-marriage-bed","prop.guest-chair-and-footstool","prop.elpenors-oar"],verb:"The rooted bed holds the room together."},
 {label:"GOLD AND SILVER",items:["prop.golden-pitcher-and-silver-basin","prop.silver-mixing-bowl","prop.gift-chest-and-treasures"],verb:"The pitcher rises; water passes into the basin."},
 {label:"SONG",items:["prop.demodocuss-lyre","prop.wine-cup","prop.raised-dining-tables"],verb:"The strings move; the listeners gather around the instrument."}
 ],
 place:[
 {label:"AT THE SWINEHERD'S HUT",id:"location.eumaeus-hut-interior"},
 {label:"INSIDE THE CYCLOPS' CAVE",id:"location.polyphemuss-cave"},
 {label:"ON CALYPSO'S ISLAND",id:"location.ogygia-cavern-and-grove"},
 {label:"AROUND THE ROOTED BED",id:"location.marriage-chamber"},
 {label:"ON THE ITHACAN SHORE",id:"location.ithacan-shore"}
 ],
 light:[
 {label:"DAYLIGHT",kind:"day"},
 {label:"FIRELIGHT",kind:"fire",id:"set-piece.royal-hearth"},
 {label:"MOONLIGHT",kind:"moon"},
 {label:"LIGHT THROUGH THE DOOR",kind:"door"}
 ],
 people:[
 {label:"PENELOPE AND A RETURNING STRANGER",ids:["character.penelope","character.odysseus"],beats:[["neutral","grieving","pleading","neutral"],["neutral","crafty","speaking","neutral"]]},
 {label:"A HOST AND HIS GUEST",ids:["character.eumaeus","character.odysseus-as-beggar"],beats:[["welcoming","speaking","listening","welcoming"],["neutral","listening","speaking","neutral"]]},
 {label:"A SINGER AND A LISTENER",ids:["character.demodocus","character.telemachus"],beats:[["locating","projecting","inspired","inspiredCalm"],["neutral","listening","neutral","speaking"]]},
 {label:"CALYPSO AND ODYSSEUS",ids:["character.calypso","character.odysseus"],beats:[["neutral","speaking","neutral","grieving"],["grieving","neutral","speaking","neutral"]]},
 {label:"A MAN AND THE DOG WHO KNOWS HIM",ids:["character.odysseus","creature.argos"],beats:[["neutral","grieving","neutral","crafty"],["scent","recognize","wag","neglected"]]}
 ]
};
export const INITIAL={matter:1,place:0,light:0,people:0};
export function validScore(s){return Object.fromEntries(SLOTS.map(k=>[k,Number.isInteger(+s?.[k])&&+s[k]>=0&&+s[k]<VOCAB[k].length?+s[k]:INITIAL[k]]));}
export function poem(s){return SLOTS.map(k=>[PREFIX[k],VOCAB[k][s[k]].label].filter(Boolean).join(" "));}
export function recipe(s){
 return {setting:VOCAB.place[s.place].id,objects:[...VOCAB.matter[s.matter].items],light:VOCAB.light[s.light].kind,lightAsset:VOCAB.light[s.light].id||null,inhabitants:[...VOCAB.people[s.people].ids]};
}
export function cast(s,held,random=Math.random){return Object.fromEntries(SLOTS.map(k=>[k,held[k]?s[k]:(s[k]+1+Math.floor(random()*(VOCAB[k].length-1)))%VOCAB[k].length]));}
export function encode(s,held,view="room"){const q=new URLSearchParams({...s,hold:SLOTS.filter(k=>held[k]).join(","),view});return "#"+q;}
export function decode(hash){const q=new URLSearchParams(hash.replace(/^#/,""));return {score:validScore(Object.fromEntries(SLOTS.map(k=>[k,q.has(k)?+q.get(k):INITIAL[k]]))),held:Object.fromEntries(SLOTS.map(k=>[k,(q.get("hold")||"").split(",").includes(k)])),view:["room","near","wide"].includes(q.get("view"))?q.get("view"):"room"};}

export const ASSETS={
  "prop.travel-wine-jars": {
    "name": "TRAVEL WINE JARS",
    "path": "/assets/prop/travel-wine-jars.mjs",
    "scene": "OD-B02-S06"
  },
  "prop.cheese-racks-and-milk-vessels": {
    "name": "CHEESE RACKS AND MILK VESSELS",
    "path": "/assets/prop/cheese-racks-and-milk-vessels.mjs",
    "scene": "OD-B09-S05"
  },
  "prop.water-pitcher": {
    "name": "WATER PITCHER",
    "path": "/assets/prop/water-pitcher.mjs",
    "scene": "OD-B07-S01"
  },
  "prop.laertess-shroud-and-loom": {
    "name": "LAERTES'S SHROUD AND LOOM",
    "path": "/assets/prop/laertess-shroud-and-loom.mjs",
    "scene": "OD-B02-S02"
  },
  "prop.laundry-bundles": {
    "name": "LAUNDRY BUNDLES",
    "path": "/assets/prop/laundry-bundles.mjs",
    "scene": "OD-B06-S01"
  },
  "prop.guest-chair-and-footstool": {
    "name": "GUEST CHAIR AND FOOTSTOOL",
    "path": "/assets/prop/guest-chair-and-footstool.mjs",
    "scene": "OD-B01-S04"
  },
  "prop.olive-tree-marriage-bed": {
    "name": "OLIVE-TREE MARRIAGE BED",
    "path": "/assets/prop/olive-tree-marriage-bed.mjs",
    "scene": "OD-B23-S04"
  },
  "prop.elpenors-oar": {
    "name": "ELPENOR'S OAR",
    "path": "/assets/prop/elpenors-oar.mjs",
    "scene": "OD-B11-S02"
  },
  "prop.golden-pitcher-and-silver-basin": {
    "name": "GOLDEN PITCHER AND SILVER BASIN",
    "path": "/assets/prop/golden-pitcher-and-silver-basin.mjs",
    "scene": "OD-B01-S04"
  },
  "prop.silver-mixing-bowl": {
    "name": "SILVER MIXING BOWL",
    "path": "/assets/prop/silver-mixing-bowl.mjs",
    "scene": "OD-B04-S06"
  },
  "prop.gift-chest-and-treasures": {
    "name": "GIFT CHEST AND TREASURES",
    "path": "/assets/prop/gift-chest-and-treasures.mjs",
    "scene": "OD-B13-S01"
  },
  "prop.demodocuss-lyre": {
    "name": "DEMODOCUS'S LYRE",
    "path": "/assets/prop/demodocuss-lyre.mjs",
    "scene": "OD-B08-S02"
  },
  "prop.wine-cup": {
    "name": "WINE CUP",
    "path": "/assets/prop/wine-cup.mjs",
    "scene": "OD-B09-S08"
  },
  "prop.raised-dining-tables": {
    "name": "RAISED DINING TABLES",
    "path": "/assets/prop/raised-dining-tables.mjs",
    "scene": "OD-B22-S02"
  },
  "location.eumaeus-hut-interior": {
    "name": "EUMAEUS HUT INTERIOR",
    "path": "/assets/location/eumaeus-hut-interior.mjs"
  },
  "location.polyphemuss-cave": {
    "name": "POLYPHEMUS'S CAVE",
    "path": "/assets/location/polyphemuss-cave.mjs",
    "scene": "OD-B09-S05"
  },
  "location.ogygia-cavern-and-grove": {
    "name": "OGYGIA CAVERN AND GROVE",
    "path": "/assets/location/ogygia-cavern-and-grove.mjs",
    "scene": "OD-B05-S01"
  },
  "location.marriage-chamber": {
    "name": "MARRIAGE CHAMBER",
    "path": "/assets/location/marriage-chamber.mjs",
    "scene": "OD-B23-S05"
  },
  "location.ithacan-shore": {
    "name": "ITHACAN SHORE",
    "path": "/assets/location/ithacan-shore.mjs",
    "scene": "OD-B02-S05"
  },
  "set-piece.royal-hearth": {
    "name": "ROYAL HEARTH",
    "path": "/assets/set_piece/royal-hearth.mjs",
    "scene": "OD-B07-S03"
  },
  "character.penelope": {
    "name": "PENELOPE",
    "path": "/assets/character/penelope.mjs",
    "scene": "OD-B01-S06"
  },
  "character.odysseus": {
    "name": "ODYSSEUS",
    "path": "/assets/character/odysseus.mjs",
    "scene": "OD-B04-S04"
  },
  "character.eumaeus": {
    "name": "EUMAEUS",
    "path": "/assets/character/eumaeus.mjs",
    "scene": "OD-B14-S01"
  },
  "character.odysseus-as-beggar": {
    "name": "ODYSSEUS AS BEGGAR",
    "path": "/assets/character/odysseus-as-beggar.mjs",
    "scene": "OD-B14-S01"
  },
  "character.demodocus": {
    "name": "DEMODOCUS",
    "path": "/assets/character/demodocus.mjs",
    "scene": "OD-B08-S02"
  },
  "character.telemachus": {
    "name": "TELEMACHUS",
    "path": "/assets/character/telemachus.mjs",
    "scene": "OD-B01-S03"
  },
  "character.calypso": {
    "name": "CALYPSO",
    "path": "/assets/character/calypso.mjs",
    "scene": "OD-B05-S02"
  },
  "creature.argos": {
    "name": "ARGOS",
    "path": "/assets/creature/argos.mjs",
    "scene": "OD-B17-S03"
  },
  "character.penelope-at-the-loom": {
    "name": "PENELOPE AT THE LOOM",
    "path": "/assets/character/penelope-at-the-loom.mjs",
    "scene": "OD-B02-S02"
  }
};
