// Vocabulary lessons L13–L18.
// Include after data/lessons.js in index.html:
//   <script src="data/vocab-lessons.js"></script>
//
// Covers the remaining 56 nimi pu not taught in the 12 grammar lessons.
// All sentences use only words from grammar lessons (L1-L12) or prior
// vocabulary lessons in this file.

(function () {

window.TP_LESSONS.push(

  // ── L13 — Nature & Animals ─────────────────────────────────────────
  {
    id: "l13",
    num: "13",
    section: "vocab",
    title: "Nature & Animals",
    subtitle: "ma, soweli, kala, waso, and more",
    sections: [
      {
        kind: "intro",
        body: "Toki Pona divides the living world into broad categories. One word covers all land mammals. One covers all birds. Let's meet the natural world."
      },
      {
        kind: "vocab",
        title: "Animals",
        body: "soweli = any land mammal (cat, dog, bear, deer). waso = any bird (and bat). kala = fish and other aquatic animals. akesi = reptile or amphibian. pipi = bug, insect, or spider."
      },
      {
        kind: "vocab",
        title: "Land, sky, and temperature",
        body: "ma = land, country, earth, or outdoor space. kasi = plant, tree, or herb. mun = moon or any celestial body. seli = fire, heat, or warmth. lete = cold, cool, or raw."
      },
    ],
    words: ["ma", "kasi", "soweli", "kala", "waso", "akesi", "pipi", "mun", "seli", "lete"],
    sentences: [
      { tp: ["soweli","li","lon","ma","kasi"],   en: "The animal is in the forest." },
      { tp: ["kala","li","lon","telo"],          en: "The fish is in the water." },
      { tp: ["pipi","lili","li","musi"],         en: "The little bug plays." },
      { tp: ["mun","li","suli"],                 en: "The moon is big." },
      { tp: ["seli","li","pona"],                en: "Warmth is good." },
    ],
  },

  // ── L14 — Body & Senses ────────────────────────────────────────────
  {
    id: "l14",
    num: "14",
    section: "vocab",
    title: "Body & Senses",
    subtitle: "lawa, sijelo, pilin, lukin, and more",
    sections: [
      {
        kind: "intro",
        body: "The body in toki pona is described simply. Most body words also work as verbs."
      },
      {
        kind: "vocab",
        title: "Body parts",
        body: "lawa = head or mind. sijelo = body or torso. noka = foot or leg. uta = mouth. kute = ear. nena = bump, hill, or nose. selo = outer layer, skin, or bark."
      },
      {
        kind: "vocab",
        title: "Senses and feeling",
        body: "lukin = eye, or to look and see. kute can also mean to hear and listen. pilin = heart, gut feeling, or to feel and sense. pilin bridges the body and the emotions."
      },
    ],
    words: ["lawa", "noka", "uta", "kute", "sijelo", "pilin", "selo", "nena", "lukin"],
    sentences: [
      { tp: ["mi","pilin","pona"],              en: "I feel good." },
      { tp: ["sijelo","sina","li","wawa"],      en: "Your body is strong." },
      { tp: ["mi","lukin","e","ona"],           en: "I see them." },
      { tp: ["lawa","ona","li","suli"],         en: "Their head and mind are important." },
      { tp: ["noka","jan","li","lili"],         en: "The person's legs are small." },
    ],
  },

  // ── L15 — Actions ─────────────────────────────────────────────────
  {
    id: "l15",
    num: "15",
    section: "vocab",
    title: "Actions",
    subtitle: "pali, musi, awen, pakala, and more",
    sections: [
      {
        kind: "intro",
        body: "These are high-frequency action words. Most are primarily verbs but all can be nouns or modifiers."
      },
      {
        kind: "vocab",
        title: "Making, playing, staying",
        body: "pali = to do, make, or work. musi = to play, have fun, or create art. lape = to sleep or rest. awen = to stay, remain, or keep. As a pre-verb, awen means to continue doing: mi awen moku = I keep eating."
      },
      {
        kind: "vocab",
        title: "Conflict and change",
        body: "utala = to fight, battle, or challenge. alasa = to hunt or forage. weka = to go away, remove, or be absent. pakala = to break or damage. ante = different, or to change something."
      },
    ],
    words: ["pali", "lape", "musi", "utala", "alasa", "weka", "pakala", "ante", "awen"],
    sentences: [
      { tp: ["mi","pali","e","tomo"],                  en: "I build a house." },
      { tp: ["soweli","li","alasa","e","kala"],        en: "The animal hunts fish." },
      { tp: ["ijo","li","pakala"],                     en: "The thing is broken." },
      { tp: ["jan","li","lape"],                       en: "The person sleeps." },
      { tp: ["mi","wile","awen"],                      en: "I want to stay." },
    ],
  },

  // ── L16 — Things & Space ──────────────────────────────────────────
  {
    id: "l16",
    num: "16",
    section: "vocab",
    title: "Things & Space",
    subtitle: "ilo, poki, sewi, insa, and more",
    sections: [
      {
        kind: "intro",
        body: "Objects, containers, surfaces, and spatial positions. Everything needs a place."
      },
      {
        kind: "vocab",
        title: "Objects",
        body: "ilo = tool or machine. poki = container, box, or cup. supa = horizontal surface, table, or flat object. palisa = long hard thing or stick. linja = long thin flexible thing, line, or hair. lupa = hole, door, or window."
      },
      {
        kind: "vocab",
        title: "Spatial positions",
        body: "insa = inside or center. monsi = back or behind. anpa = down, below, or the floor. sewi = above, sky, or divine. These words are nouns and can follow lon: lon sewi = up above. lon anpa = down below."
      },
    ],
    words: ["ilo", "poki", "supa", "palisa", "linja", "lupa", "insa", "monsi", "anpa", "sewi"],
    sentences: [
      { tp: ["ilo","li","lon","supa"],            en: "The tool is on the table." },
      { tp: ["mi","jo","e","poki","lili"],        en: "I have a small container." },
      { tp: ["lupa","li","lon","tomo"],           en: "There is a door in the house." },
      { tp: ["mi","tawa","sewi"],                 en: "I go upward." },
      { tp: ["insa","tomo","li","pona"],          en: "The inside of the house is good." },
    ],
  },

  // ── L17 — Feelings & Society ──────────────────────────────────────
  {
    id: "l17",
    num: "17",
    section: "vocab",
    title: "Feelings & Society",
    subtitle: "mu, mani, esun, moli, and more",
    sections: [
      {
        kind: "intro",
        body: "Feelings, sounds, exchange, and life's most significant events."
      },
      {
        kind: "vocab",
        title: "Sound and exchange",
        body: "mu = any animal sound (bark, meow, chirp). kalama = sound, noise, or voice. mani = money, wealth, or large domesticated animal. esun = market, shop, or trade. sike = circle, ball, round thing, or year (cycle)."
      },
      {
        kind: "vocab",
        title: "Life and taboo",
        body: "jaki = gross, dirty, or disgusting. moli = death or dying. unpa = to be in a sexual or marital relationship. pu = the official toki pona book published by Sonja Lang in 2014."
      },
    ],
    words: ["mu", "kalama", "mani", "esun", "jaki", "moli", "unpa", "sike", "pu"],
    sentences: [
      { tp: ["soweli","li","mu"],                en: "The animal makes a sound." },
      { tp: ["mi","jo","e","mani","mute"],       en: "I have a lot of money." },
      { tp: ["ona","li","tawa","esun"],          en: "They go to the market." },
      { tp: ["ijo","ni","li","jaki"],            en: "This thing is disgusting." },
      { tp: ["kalama","li","musi"],              en: "Sound is fun. Music!" },
    ],
  },

  // ── L18 — Words & Culture ─────────────────────────────────────────
  {
    id: "l18",
    num: "18",
    section: "vocab",
    title: "Words & Culture",
    subtitle: "sitelen, nimi, lipu, kiwen, and more",
    sections: [
      {
        kind: "intro",
        body: "The final set. Marks, materials, and names. After this lesson, you know all 120 words of toki pona."
      },
      {
        kind: "vocab",
        title: "Writing and language",
        body: "sitelen = image, symbol, drawing, or writing. nimi = name or word. lipu = flat object, paper, document, or book. sitelen pona = the toki pona writing system, literally 'good pictures'."
      },
      {
        kind: "vocab",
        title: "Materials and position",
        body: "ko = powder, paste, clay, or semi-solid. kon = air, wind, spirit, or essence. kiwen = stone, hard object, or metal. len = cloth, clothing, or fabric. sinpin = front, wall, or face. poka = side, hip, or to be beside."
      },
    ],
    words: ["sitelen", "nimi", "lipu", "ko", "kon", "kiwen", "len", "sinpin", "poka"],
    sentences: [
      { tp: ["mi","sitelen","e","nimi","sina"],  en: "I write your name." },
      { tp: ["lipu","ni","li","pona"],           en: "This book is good." },
      { tp: ["len","sina","li","loje"],          en: "Your clothing is red." },
      { tp: ["tomo","kiwen","li","wawa"],        en: "The stone house is strong." },
      { tp: ["jan","li","lon","poka","mi"],      en: "The person is beside me." },
    ],
  }

); // end TP_LESSONS.push

})();