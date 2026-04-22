// Toki Pona grammar curriculum - 10 lessons covering the complete grammar.
// Each lesson: id, title, subtitle, sections (teaching blocks), words (vocab introduced),
// sentences (example sentences), and a suggested set of practice activity types.

window.TP_LESSONS = [
  {
    id: "l1",
    num: "01",
    title: "toki! — Hello",
    subtitle: "Greetings and your first glyphs",
    sections: [
      {
        kind: "intro",
        body: "Toki Pona is a tiny language — about 130 words. Its writing system, sitelen pona, turns each word into a little picture. Let's meet our first five glyphs."
      },
      {
        kind: "rule",
        title: "Saying hello",
        body: "toki means both 'language' and 'hello'. You can greet someone with just toki."
      },
      {
        kind: "rule",
        title: "The pronouns",
        body: "mi means I/me/we. sina means you. ona means he/she/it/they. That's all of them."
      },
      {
        kind: "rule",
        title: "pona — good",
        body: "pona is the heart of the language: good, simple, friendly. A smile. Saying mi pona means 'I am good'."
      },
    ],
    words: ["toki", "mi", "sina", "ona", "pona"],
    sentences: [
      { tp: ["toki"],                        en: "Hello." },
      { tp: ["mi", "pona"],                  en: "I am good." },
      { tp: ["sina", "pona"],                en: "You are good." },
      { tp: ["toki", "pona"],                en: "Toki Pona (the good language)." },
    ],
  },
  {
    id: "l2",
    num: "02",
    title: "li — the predicate",
    subtitle: "Joining a subject to what it does or is",
    sections: [
      {
        kind: "rule",
        title: "The li particle",
        body: "When the subject is NOT mi or sina, you place li before the verb or description. jan li pona → 'the person is good'."
      },
      {
        kind: "rule",
        title: "No li with mi or sina",
        body: "mi pona and sina pona do NOT use li. This is the only exception."
      },
      {
        kind: "rule",
        title: "No 'the' or 'a'",
        body: "Toki Pona has no articles. jan means 'person', 'a person', or 'the person' — context decides."
      },
    ],
    words: ["jan", "li", "ike", "suli", "lili"],
    sentences: [
      { tp: ["jan", "li", "pona"],           en: "The person is good." },
      { tp: ["ona", "li", "suli"],           en: "They are big." },
      { tp: ["jan", "li", "lili"],           en: "The person is small." },
      { tp: ["mi", "pona"],                  en: "I am good." },
    ],
  },
  {
    id: "l3",
    num: "03",
    title: "Modifiers",
    subtitle: "Adjectives come AFTER the noun",
    sections: [
      {
        kind: "rule",
        title: "Word order",
        body: "In Toki Pona, describing words follow the thing they describe. jan pona = good person. jan suli = big person / important person."
      },
      {
        kind: "rule",
        title: "Stacking modifiers",
        body: "You can stack them: jan pona suli = 'a good, big person'. Each modifier modifies what came before."
      },
      {
        kind: "rule",
        title: "Same words, different roles",
        body: "Any word can be noun, verb, or adjective. pona means good (adj), to fix (verb), or goodness (noun)."
      },
    ],
    words: ["pona", "ike", "suli", "lili", "sin"],
    sentences: [
      { tp: ["jan", "pona"],                 en: "friend (good person)" },
      { tp: ["jan", "suli"],                 en: "important person / adult" },
      { tp: ["jan", "lili"],                 en: "child (small person)" },
      { tp: ["jan", "sin"],                  en: "new person / stranger" },
    ],
  },
  {
    id: "l4",
    num: "04",
    title: "e — direct object",
    subtitle: "Marking what the verb acts on",
    sections: [
      {
        kind: "rule",
        title: "The e particle",
        body: "Place e before the direct object. mi moku e kili = 'I eat a fruit'."
      },
      {
        kind: "rule",
        title: "Chaining objects",
        body: "Use e for each object: mi moku e kili e pan = 'I eat fruit and bread'."
      },
    ],
    words: ["e", "moku", "lukin", "kili", "telo"],
    sentences: [
      { tp: ["mi", "moku", "e", "kili"],              en: "I eat fruit." },
      { tp: ["sina", "lukin", "e", "ona"],            en: "You see them." },
      { tp: ["jan", "li", "moku", "e", "telo"],       en: "The person drinks water." },
    ],
  },
  {
    id: "l5",
    num: "05",
    title: "en & anu",
    subtitle: "Joining subjects",
    sections: [
      {
        kind: "rule",
        title: "en — 'and' for subjects",
        body: "mi en sina li pona = 'you and I are good'. Only use en to join subjects, not objects — for objects, repeat e."
      },
      {
        kind: "rule",
        title: "anu — or",
        body: "anu means 'or'. kili anu pan = 'fruit or bread'."
      },
    ],
    words: ["en", "anu", "jan", "mama", "meli", "mije"],
    sentences: [
      { tp: ["mi", "en", "sina", "li", "pona"],       en: "You and I are good." },
      { tp: ["mama", "en", "jan", "lili"],            en: "a parent and a child" },
      { tp: ["kili", "anu", "pan"],                   en: "fruit or bread" },
    ],
  },
  {
    id: "l6",
    num: "06",
    title: "pi — grouping",
    subtitle: "Regrouping modifiers",
    sections: [
      {
        kind: "rule",
        title: "The pi particle",
        body: "pi regroups so that what follows modifies as a unit. tomo telo = 'water building', but tomo pi telo nasa = 'building of strange liquid' (a bar)."
      },
      {
        kind: "rule",
        title: "When to use pi",
        body: "Use pi only when a single modifier won't do the job — when you need a phrase (two+ words) to modify a noun together."
      },
    ],
    words: ["pi", "tomo", "nasa", "kulupu", "toki"],
    sentences: [
      { tp: ["tomo", "telo"],                         en: "bathroom (water room)" },
      { tp: ["tomo", "pi", "telo", "nasa"],           en: "bar (room of strange liquid)" },
      { tp: ["kulupu", "pi", "toki", "pona"],         en: "the Toki Pona community" },
    ],
  },
  {
    id: "l7",
    num: "07",
    title: "Prepositions",
    subtitle: "lon, tawa, kepeken, tan, sama",
    sections: [
      {
        kind: "rule",
        title: "lon — at, in",
        body: "mi lon tomo = 'I am at home'. lon can be its own verb meaning 'to exist'."
      },
      {
        kind: "rule",
        title: "tawa — to, toward; also 'move'",
        body: "mi tawa = 'I go' or 'goodbye' (lit. 'I move')."
      },
      {
        kind: "rule",
        title: "kepeken, tan, sama",
        body: "kepeken = using. tan = because of, from. sama = like, as, similar to."
      },
    ],
    words: ["lon", "tawa", "kepeken", "tan", "sama"],
    sentences: [
      { tp: ["mi", "lon", "tomo"],                    en: "I am at home." },
      { tp: ["mi", "tawa"],                           en: "I'm leaving / goodbye." },
      { tp: ["mi", "pali", "kepeken", "luka"],        en: "I work with my hands." },
    ],
  },
  {
    id: "l8",
    num: "08",
    title: "Questions",
    subtitle: "seme and yes/no with ala",
    sections: [
      {
        kind: "rule",
        title: "seme — 'what'",
        body: "Put seme where the unknown would go. sina pali e seme? = 'what do you do?'"
      },
      {
        kind: "rule",
        title: "Yes/no with 'verb ala verb'",
        body: "To ask yes/no, repeat the verb with ala between: sina pona ala pona? = 'are you good?' Answer with the verb (pona) for yes, or verb ala (pona ala) for no."
      },
    ],
    words: ["seme", "ala", "sona", "wile", "ken"],
    sentences: [
      { tp: ["ni", "li", "seme"],                     en: "What is this?" },
      { tp: ["sina", "pona", "ala", "pona"],          en: "Are you okay?" },
      { tp: ["mi", "sona", "ala"],                    en: "I don't know." },
    ],
  },
  {
    id: "l9",
    num: "09",
    title: "la — context",
    subtitle: "Setting the stage",
    sections: [
      {
        kind: "rule",
        title: "The la particle",
        body: "Put a context phrase before la, and the main sentence after. tenpo suno ni la, mi pali = 'today, I work'."
      },
      {
        kind: "rule",
        title: "la as 'if'",
        body: "sina moku la, sina wawa = 'if you eat, you are strong'."
      },
    ],
    words: ["la", "tenpo", "suno", "pini", "kama"],
    sentences: [
      { tp: ["tenpo", "suno", "ni", "la", "mi", "pali"],   en: "Today, I work." },
      { tp: ["tenpo", "pini", "la", "mi", "moku"],         en: "Earlier, I ate." },
      { tp: ["sina", "moku", "la", "sina", "wawa"],        en: "If you eat, you are strong." },
    ],
  },
  {
    id: "l10",
    num: "10",
    title: "Numbers",
    subtitle: "wan, tu, luka, mute, ale",
    sections: [
      {
        kind: "rule",
        title: "The tiny number system",
        body: "wan = 1, tu = 2, luka = 5 (from 'hand'), mute = many / 20, ale = all / 100. Add them together to make larger numbers."
      },
      {
        kind: "rule",
        title: "Counting by addition",
        body: "tu wan = 3 (2+1). luka tu = 7 (5+2). mute luka = 25."
      },
      {
        kind: "rule",
        title: "Ordinals with nanpa",
        body: "jan nanpa wan = 'person number one' = 'the first person'."
      },
    ],
    words: ["wan", "tu", "luka", "mute", "ale", "nanpa"],
    sentences: [
      { tp: ["jan", "tu"],                            en: "two people" },
      { tp: ["jan", "nanpa", "wan"],                  en: "the first person" },
      { tp: ["mi", "jo", "e", "kili", "luka"],        en: "I have five fruits." },
    ],
  },
];
