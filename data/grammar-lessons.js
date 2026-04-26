// Grammar lessons L1–L11.
// Colors have moved to vocab-lessons.js as L12.

window.TP_LESSONS = [
  {
    id: "l1", num: "01", section: "grammar",
    title: "toki! — Hello",
    subtitle: "Sounds, greetings, and your first six glyphs",
    sections: [
      { kind: "intro", body: "Toki Pona has 14 sounds and about 120 words. Its writing system, sitelen pona, turns each word into a small picture. Let's meet the first six." },
      { kind: "rule", title: "How to say it", body: "Every letter is always one sound. Vowels: a as in 'father', e as in 'bed', i as in 'tree', o as in 'go', u as in 'moon'. The letter j sounds like the y in 'yes', never as in 'jam'. Stress always falls on the first syllable: TO-ki PO-na." },
      { kind: "rule", title: "pona and a", body: "pona means good, simple, or kind. It is the heart of the language. a is a particle of emotion and emphasis. a, pona! means something like 'ah, wonderful!'" },
    ],
    words: ["toki","mi","sina","ona","pona","a"],
    sentences: [
      { tp:["toki"],        en:"Hello." },
      { tp:["mi","pona"],   en:"I am good." },
      { tp:["sina","pona"], en:"You are good." },
      { tp:["a","pona"],    en:"Ah, wonderful!" },
    ],
  },

  {
    id: "l2", num: "02", section: "grammar",
    title: "li — the predicate",
    subtitle: "Joining a subject to what it does or is",
    sections: [
      { kind: "rule", title: "The li particle", body: "When the subject is not mi or sina, place li before the predicate. jan li pona means 'the person is good'." },
      { kind: "rule", title: "No li with mi or sina", body: "mi pona and sina pona do not use li. This is the only exception in the language." },
      { kind: "rule", title: "No articles", body: "Toki Pona has no words for 'a' or 'the'. jan means person, a person, or the person. Context decides which is meant." },
    ],
    words: ["jan","li","ike","ni","ijo"],
    sentences: [
      { tp:["jan","li","pona"],     en:"The person is good." },
      { tp:["ni","li","ike"],       en:"This is bad." },
      { tp:["ijo","li","pona"],     en:"The thing is good." },
      { tp:["jan","ni","li","ike"], en:"This person is bad." },
    ],
  },

  {
    id: "l3", num: "03", section: "grammar",
    title: "Modifiers",
    subtitle: "Describing words come after the noun",
    sections: [
      { kind: "rule", title: "Word order", body: "In toki pona, describing words follow what they describe. jan pona = good person. jan suli = big or important person." },
      { kind: "rule", title: "Stacking modifiers", body: "Modifiers stack left to right. jan pona suli = a good, important person. Each word modifies everything before it." },
      { kind: "rule", title: "One word, many roles", body: "Any word can be a noun, verb, or modifier depending on its position. pona means good as a modifier, to fix as a verb, or goodness as a noun." },
    ],
    words: ["suli","lili","sin","wawa","suwi"],
    sentences: [
      { tp:["jan","pona"],                en:"friend (good person)" },
      { tp:["jan","lili"],                en:"child (small person)" },
      { tp:["jan","suli"],                en:"important person, adult" },
      { tp:["jan","sin","li","wawa"],     en:"The new person is strong." },
      { tp:["ni","li","suwi"],            en:"This is cute." },
    ],
  },

  {
    id: "l4", num: "04", section: "grammar",
    title: "e — direct object",
    subtitle: "Marking what the verb acts on",
    sections: [
      { kind: "rule", title: "The e particle", body: "e marks the direct object of a verb. mi moku e kili means 'I eat a fruit'. The object always follows e." },
      { kind: "rule", title: "Chaining objects", body: "Repeat e for each additional object. mi moku e kili e pan means 'I eat fruit and bread'." },
    ],
    words: ["e","moku","kili","telo","pan","jo"],
    sentences: [
      { tp:["mi","moku","e","kili"],              en:"I eat fruit." },
      { tp:["mi","jo","e","telo"],                en:"I have water." },
      { tp:["sina","moku","e","pan"],             en:"You eat bread." },
      { tp:["jan","li","jo","e","ijo","suwi"],    en:"The person has a sweet thing." },
    ],
  },

  {
    id: "l5", num: "05", section: "grammar",
    title: "en, anu & taso",
    subtitle: "And, or, but",
    sections: [
      { kind: "rule", title: "en joins subjects", body: "en means 'and' between subjects only. mi en sina li pona = you and I are good. For multiple objects, repeat e instead: mi jo e kili e pan." },
      { kind: "rule", title: "anu and taso", body: "anu means 'or': kili anu pan = fruit or bread. taso means 'but' at the start of a sentence, or 'only' as a modifier: mi taso = just me, only me." },
    ],
    words: ["en","anu","mama","meli","mije","taso"],
    sentences: [
      { tp:["mi","en","sina","li","pona"],    en:"You and I are good." },
      { tp:["meli","en","mije","li","pona"],  en:"The woman and man are good." },
      { tp:["kili","anu","pan"],              en:"fruit or bread" },
      { tp:["mama","li","pona"],              en:"The parent is good." },
    ],
  },

  {
    id: "l6", num: "06", section: "grammar",
    title: "pi — grouping",
    subtitle: "Regrouping modifiers into a phrase",
    sections: [
      { kind: "rule", title: "The pi particle", body: "pi regroups modifiers so that everything after it modifies the head as a unit. tomo telo = water room. tomo pi telo nasa = room of strange liquid, meaning a bar." },
      { kind: "rule", title: "pi needs two or more words after it", body: "Never use pi before a single word. jan pi pona is wrong. jan pona is correct. pi is only needed when a phrase of two or more words modifies a noun together." },
    ],
    words: ["pi","tomo","nasin","kulupu","nasa"],
    sentences: [
      { tp:["tomo","telo"],              en:"bathroom (water room)" },
      { tp:["tomo","pi","telo","nasa"],  en:"bar (room of strange liquid)" },
      { tp:["kulupu","pi","jan","pona"], en:"group of good people (friends)" },
      { tp:["nasin","ni","li","pona"],   en:"This way is good." },
    ],
  },

  {
    id: "l7", num: "07", section: "grammar",
    title: "Prepositions",
    subtitle: "lon, tawa, kepeken, tan, sama",
    sections: [
      { kind: "rule", title: "lon and tawa", body: "lon means at, in, or on. mi lon tomo = I am at home. lon can also stand alone as a verb meaning to exist or be true. tawa means to, toward, or for. mi tawa = goodbye (I move)." },
      { kind: "rule", title: "kepeken, tan, sama", body: "kepeken means using or with a tool or method. tan means from or because of. sama means like, as, or similar to." },
      { kind: "rule", title: "Prepositions do not take li", body: "A prepositional phrase follows the predicate directly, without li in between. mi moku lon tomo = I eat at home. The preposition lon follows moku without li. Inserting li before a preposition is ungrammatical." },
    ],
    words: ["lon","tawa","kepeken","tan","sama"],
    sentences: [
      { tp:["mi","lon","tomo"],               en:"I am at home." },
      { tp:["mi","tawa"],                     en:"Goodbye." },
      { tp:["mi","moku","kepeken","ijo"],     en:"I eat using a utensil." },
      { tp:["sina","sama","jan","pona"],      en:"You are like a friend." },
    ],
  },

  {
    id: "l8", num: "08", section: "grammar",
    title: "Questions",
    subtitle: "seme and yes/no with ala",
    sections: [
      { kind: "rule", title: "seme — what, which", body: "Replace the unknown word with seme. ni li seme? = what is this? sina tawa nasin seme? = which path are you taking?" },
      { kind: "rule", title: "Yes/no with ala", body: "To ask yes or no, repeat the verb with ala between it. sina pona ala pona? = are you okay? Answer with the verb for yes (pona), or verb ala for no (pona ala)." },
    ],
    words: ["seme","ala","sona","wile","ken"],
    sentences: [
      { tp:["ni","li","seme"],            en:"What is this?" },
      { tp:["sina","pona","ala","pona"],  en:"Are you okay?" },
      { tp:["mi","sona","ala"],           en:"I don't know." },
      { tp:["sina","wile","e","seme"],    en:"What do you want?" },
    ],
  },

  {
    id: "l9", num: "09", section: "grammar",
    title: "la — context",
    subtitle: "Setting the stage for a sentence",
    sections: [
      { kind: "rule", title: "The la particle", body: "A phrase before la sets the context for what follows. tenpo ni la mi moku = right now, I am eating. The context can be time, place, or any condition." },
      { kind: "rule", title: "la for conditions", body: "la often marks a condition or cause. sina wile la sina kama = if you want, you come. Any phrase can go before la." },
    ],
    words: ["la","tenpo","suno","pini","kama"],
    sentences: [
      { tp:["tenpo","suno","ni","la","mi","pona"], en:"Today, I am well." },
      { tp:["tenpo","pini","la","mi","moku"],      en:"Earlier, I ate." },
      { tp:["sina","wile","la","sina","kama"],     en:"If you want, you come." },
      { tp:["kama","pona"],                        en:"Welcome!" },
    ],
  },

  {
    id: "l10", num: "10", section: "grammar",
    title: "o — commands",
    subtitle: "Instructions, calls for attention, and wishes",
    sections: [
      { kind: "rule", title: "o as imperative", body: "o before a predicate makes a command or request. o tawa = go. o moku e kili = eat a fruit. This works for any predicate in the language." },
      { kind: "rule", title: "o as vocative", body: "o after a name or noun calls for attention. jan pona o = hey, friend! mama o = hey, mom! The vocative o always follows the noun it addresses." },
      { kind: "rule", title: "mi o for wishes", body: "mi o lape = I should sleep, or let me sleep. This expresses a wish or obligation directed at yourself." },
    ],
    words: ["o","open","olin","pana"],
    sentences: [
      { tp:["o","tawa"],                       en:"Go!" },
      { tp:["o","moku","e","kili"],            en:"Eat a fruit!" },
      { tp:["jan","pona","o"],                 en:"Hey, friend!" },
      { tp:["o","pana","e","ni","tawa","mi"],  en:"Give this to me." },
      { tp:["mi","olin","e","sina"],           en:"I love you." },
    ],
  },

  {
    id: "l11", num: "11", section: "grammar",
    title: "Numbers",
    subtitle: "wan, tu, luka, mute, ale",
    sections: [
      { kind: "rule", title: "The number words", body: "wan = 1. tu = 2. luka = 5 (also the word for hand). mute = many or 20. ale = all or 100. Numbers are modifiers that follow the noun." },
      { kind: "rule", title: "Counting by addition", body: "Larger numbers stack with the bigger value first. tu wan = 3 (2 plus 1). luka tu = 7 (5 plus 2). mute luka tu wan = 28." },
      { kind: "rule", title: "Ordinals need pi nanpa", body: "For first, second, third, use pi nanpa. jan pi nanpa wan = the first person. pi is required because nanpa wan is a two-word phrase modifying jan." },
    ],
    words: ["wan","tu","luka","mute","ale","nanpa"],
    sentences: [
      { tp:["jan","tu"],                     en:"two people" },
      { tp:["ijo","mute"],                   en:"many things" },
      { tp:["jan","pi","nanpa","wan"],        en:"the first person" },
      { tp:["mi","jo","e","kili","luka"],     en:"I have five fruits." },
      { tp:["jan","ale","li","pona"],        en:"All people are good." },
    ],
  },
];