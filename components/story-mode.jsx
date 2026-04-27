// Story Mode: visual novel + guided reading.
// Stories are static — no AI generation. Each story uses real, reviewed toki pona.
// Flow: pick → read → (activity?) → ... → done
// Tap any glyph to see its meaning. Translation hidden until revealed.

function useIsMobile() {
  const [m, setM] = React.useState(() => window.innerWidth < 640);
  React.useEffect(() => {
    const h = () => setM(window.innerWidth < 640);
    window.addEventListener('resize', h, { passive: true });
    return () => window.removeEventListener('resize', h);
  }, []);
  return m;
}

const TP_STORIES = [
  {
    id: "redhood",
    label: "meli lili pi len loje",
    labelEn: "Little Red Riding Hood",
    char: "meli",
    scenes: [
      { tp: ["jan","lili","li","jo","e","len","loje"],                                    en: "The little girl has a red cloak.",                        addActivity: false },
      { tp: ["mama","ona","li","pana","e","poki","moku"],                                 en: "Her mother gives her a food basket.",                     addActivity: false },
      { tp: ["o","tawa","tomo","pi","mama","mama","sina"],                                en: "Go to your grandmother's house.",                         addActivity: false },
      { tp: ["tenpo","ni","la","jan","lili","li","tawa","lon","nasin","pi","ma","kasi"],  en: "Now the little girl travels on the forest path.",         addActivity: true  },
      { tp: ["soweli","ike","li","kama"],                                                  en: "A bad wolf comes.",                                       addActivity: false },
      { tp: ["ona","li","toki","tawa","jan","lili"],                                      en: "It speaks to the little girl.",                           addActivity: false },
      { tp: ["soweli","li","wile","sona","e","nasin"],                                    en: "The wolf wants to know the path.",                        addActivity: true  },
      { tp: ["jan","lili","li","toki","e","ni","tawa","ona"],                             en: "The little girl tells it.",                               addActivity: false },
      { tp: ["soweli","li","tawa","open"],                                                en: "The wolf goes ahead.",                                    addActivity: false },
      { tp: ["ona","li","kama","lon","tomo","pi","mama","mama"],                          en: "It arrives at grandmother's house.",                      addActivity: false },
      { tp: ["jan","lili","li","kama","lon","tomo"],                                      en: "The little girl arrives at the house.",                   addActivity: false },
      { tp: ["ona","li","open","e","lupa"],                                               en: "She opens the door.",                                     addActivity: false },
      { tp: ["soweli","li","lon","supa"],                                                 en: "The wolf is in the bed.",                                 addActivity: false },
      { tp: ["ona","li","jo","e","len","pi","mama","mama"],                               en: "It has grandmother's clothes.",                           addActivity: false },
      { tp: ["a","nena","en","uta","sina","li","suli","mute"],                            en: "Ah! Your nose and mouth are very big!",                   addActivity: false },
      { tp: ["jan","wawa","li","kama","li","utala","e","soweli"],                         en: "A strong person comes and fights the wolf.",              addActivity: false },
      { tp: ["jan","lili","li","awen","pona"],                                            en: "The little girl remains safe.",                           addActivity: false },
    ],
  },
  {
    id: "pigs",
    label: "soweli lili tu wan",
    labelEn: "The Three Little Pigs",
    char: "soweli",
    scenes: [
      { tp: ["soweli","lili","tu","wan","li","weka","tan","tomo","mama","ona"],           en: "Three little pigs leave their mother's home.",            addActivity: false },
      { tp: ["mama","li","toki","o","pali","e","tomo","sina"],                            en: "Mother says: build your own house.",                      addActivity: false },
      { tp: ["o","awen","wawa"],                                                          en: "Stay strong.",                                            addActivity: false },
      { tp: ["soweli","pi","nanpa","wan","li","pali","e","tomo","pi","kasi","lili"],      en: "The first pig builds a house of grass.",                  addActivity: true  },
      { tp: ["soweli","pi","nanpa","tu","li","pali","e","tomo","palisa"],                 en: "The second pig builds a house of sticks.",                addActivity: false },
      { tp: ["soweli","pi","nanpa","tu","wan","li","pali","e","tomo","kiwen"],            en: "The third pig builds a house of stone.",                  addActivity: false },
      { tp: ["soweli","ike","suli","li","kama"],                                          en: "A big bad wolf comes.",                                   addActivity: true  },
      { tp: ["ona","li","uta","e","tomo","kasi"],                                         en: "It blows on the grass house.",                            addActivity: false },
      { tp: ["tomo","kasi","li","pakala"],                                                en: "The grass house breaks.",                                 addActivity: false },
      { tp: ["soweli","lili","li","weka"],                                                en: "The little pig flees.",                                   addActivity: false },
      { tp: ["tomo","palisa","li","anpa"],                                                en: "The stick house falls.",                                  addActivity: false },
      { tp: ["soweli","lili","tu","li","tawa","tomo","kiwen"],                            en: "The two little pigs go to the stone house.",              addActivity: false },
      { tp: ["soweli","ike","li","uta","mute"],                                           en: "The wolf blows hard.",                                    addActivity: false },
      { tp: ["taso","tomo","kiwen","li","awen"],                                          en: "But the stone house stands.",                             addActivity: false },
      { tp: ["soweli","ike","li","tawa","insa","kepeken","lupa","sewi"],                  en: "The wolf enters through the chimney.",                    addActivity: false },
      { tp: ["ona","li","pakala","li","moli"],                                            en: "It crashes and dies.",                                    addActivity: false },
    ],
  },
  {
    id: "goldilocks",
    label: "meli pi linja jelo",
    labelEn: "Goldilocks",
    char: "meli",
    scenes: [
      { tp: ["meli","li","jan","nasa"],                                                   en: "The girl is a strange person.",                           addActivity: false },
      { tp: ["ona","li","tawa","lon","ma","kasi"],                                        en: "She travels in the forest.",                              addActivity: false },
      { tp: ["meli","li","kute","ala","e","kalama"],                                      en: "The girl hears no sound.",                                addActivity: false },
      { tp: ["ona","li","tawa","insa","tomo"],                                            en: "She goes inside the house.",                              addActivity: true  },
      { tp: ["poki","pi","nanpa","wan","li","seli","jaki"],                               en: "The first bowl is disgustingly hot.",                     addActivity: false },
      { tp: ["nanpa","tu","li","lete","mute"],                                            en: "The second one is very cold.",                            addActivity: false },
      { tp: ["nanpa","tu","wan","li","pona"],                                             en: "The third one is perfect.",                               addActivity: true  },
      { tp: ["meli","li","moku","e","poki","pona"],                                       en: "The girl eats the good bowl.",                            addActivity: false },
      { tp: ["supa","lili","li","pona"],                                                  en: "The small bed is good.",                                  addActivity: false },
      { tp: ["meli","li","lape","lon","supa","pi","soweli","lili"],                       en: "The girl sleeps on the little bear's bed.",               addActivity: false },
      { tp: ["soweli","tu","wan","li","kama"],                                            en: "Three bears come.",                                       addActivity: false },
      { tp: ["soweli","lili","li","mu"],                                                  en: "The little bear growls!",                                 addActivity: false },
      { tp: ["soweli","li","lukin","e","sinpin","tomo"],                                  en: "The bears look at the front of the room.",                addActivity: false },
      { tp: ["ona","li","lukin","e","meli","lon","supa"],                                 en: "They see the girl on the bed.",                           addActivity: false },
      { tp: ["meli","li","pilin","ike"],                                                  en: "The girl feels bad.",                                     addActivity: false },
      { tp: ["ona","li","weka","tan","tomo"],                                             en: "She flees from the house.",                               addActivity: false },
      { tp: ["soweli","tu","wan","li","awen","lon","tomo","pona","ona"],                  en: "The three bears remain in their good home.",              addActivity: false },
    ],
  },
  {
    id: "fisherman",
    label: "jan kala li wile e ale",
    labelEn: "The Fisherman's Wish",
    char: "jan",
    scenes: [
      { tp: ["mije","en","meli","li","unpa"],                                             en: "A man and woman are married.",                            addActivity: false },
      { tp: ["ona","li","lon","tomo","lili"],                                             en: "They live in a small house.",                             addActivity: false },
      { tp: ["jan","mije","li","alasa","e","kala","lon","telo"],                          en: "The man fishes in the water.",                            addActivity: false },
      { tp: ["ona","li","jo","e","ilo","alasa"],                                          en: "He has a fishing tool.",                                  addActivity: true  },
      { tp: ["kala","pi","sona","mute","li","kama","tawa","linja","ona"],                 en: "A wise fish comes to his line.",                          addActivity: false },
      { tp: ["kala","li","toki","mi","ken","pana","e","wile","sina"],                     en: "The fish says: I can grant your wish.",                   addActivity: false },
      { tp: ["wile","seme","li","lon","sina"],                                            en: "What do you wish for?",                                   addActivity: true  },
      { tp: ["jan","mije","li","wile","e","esun","suli"],                                 en: "The man wants a big business.",                           addActivity: false },
      { tp: ["kala","li","pana","e","ni"],                                                en: "The fish grants it.",                                     addActivity: false },
      { tp: ["meli","li","wile","lawa","e","kulupu"],                                     en: "The wife wants to lead the community.",                   addActivity: false },
      { tp: ["meli","li","wile","e","olin","pi","ijo","ale"],                             en: "The wife wants the love of all things.",                  addActivity: false },
      { tp: ["kala","li","pilin","ike"],                                                  en: "The fish feels bad.",                                     addActivity: false },
      { tp: ["kala","li","toki","e","nimi","tawa","jan","mije"],                          en: "The fish speaks a word to the man.",                      addActivity: false },
      { tp: ["kala","li","weka"],                                                         en: "The fish goes.",                                          addActivity: false },
      { tp: ["ale","li","kama","sama"],                                                   en: "Everything returns to the same.",                         addActivity: false },
      { tp: ["tomo","lili","li","kama","sin"],                                            en: "The little house is new again.",                          addActivity: false },
      { tp: ["jan","mije","li","sona","e","ni","olin","li","suli","mani","li","lili"],    en: "The man knows: love is important, money is small.",       addActivity: false },
    ],
  },
  {
    id: "bedtime",
    label: "tenpo lape pona",
    labelEn: "A Bedtime Story",
    char: "jan",
    scenes: [
      { tp: ["suno","li","weka"],                                                         en: "The sun sets.",                                           addActivity: false },
      { tp: ["tenpo","pimeja","la","mun","li","open","lon","sewi"],                       en: "In the dark time, the moon appears in the sky.",          addActivity: false },
      { tp: ["jan","lili","li","lon","supa"],                                             en: "The little child is in bed.",                             addActivity: false },
      { tp: ["mama","li","jo","e","lipu","musi"],                                         en: "The parent holds a fun book.",                            addActivity: true  },
      { tp: ["mama","li","sitelen","e","toki","tan","lipu"],                              en: "The parent reads words from the book.",                   addActivity: false },
      { tp: ["kon","mama","li","pona"],                                                   en: "The parent's spirit is good.",                            addActivity: false },
      { tp: ["jan","lili","li","kute"],                                                   en: "The little child listens.",                               addActivity: false },
      { tp: ["ma","kasi","la","waso","pi","kule","laso","li","lape"],                     en: "In the forest, a blue bird sleeps.",                      addActivity: true  },
      { tp: ["akesi","lili","li","tawa","lon","kiwen"],                                   en: "A little lizard walks on stones.",                        addActivity: false },
      { tp: ["pipi","li","musi"],                                                         en: "A bug plays.",                                            addActivity: false },
      { tp: ["soweli","li","moku","e","kili","jelo","pi","poka","telo"],                  en: "An animal eats yellow fruit beside the water.",           addActivity: false },
      { tp: ["jan","li","pali","e","pan","kepeken","ko"],                                 en: "A person makes bread with dough.",                        addActivity: false },
      { tp: ["luka","ona","li","wawa"],                                                   en: "Their hands are strong.",                                 addActivity: false },
      { tp: ["sike","mun","li","suli"],                                                   en: "The moon's circle is big.",                               addActivity: false },
      { tp: ["walo","li","suno","e","sewi","pimeja"],                                     en: "White illuminates the dark sky.",                         addActivity: false },
      { tp: ["ijo","ale","li","pona"],                                                    en: "All things are good.",                                    addActivity: false },
      { tp: ["sijelo","sina","li","wile","lape"],                                         en: "Your body wants sleep.",                                  addActivity: false },
      { tp: ["mama","li","lon","monsi","sina"],                                           en: "The parent is behind you.",                               addActivity: false },
      { tp: ["selo","sina","li","suwi"],                                                  en: "Your skin is sweet.",                                     addActivity: false },
      { tp: ["o","lape","pona"],                                                          en: "Sleep well.",                                             addActivity: false },
    ],
  },
];

// ── Main component ─────────────────────────────────────────────────
function StoryMode({ theme, state, setState, onBack }) {
  const [phase,        setPhase]        = React.useState("pick");
  const [story,        setStory]        = React.useState(null);
  const [idx,          setIdx]          = React.useState(0);
  const [revealed,     setRevealed]     = React.useState(false);
  const [tappedWord,   setTappedWord]   = React.useState(null);
  const [encountered,  setEncountered]  = React.useState(new Set());
  const [activityWord, setActivityWord] = React.useState("pona");
  const [activityKind, setActivityKind] = React.useState("tapWord");

  function openStory(s) {
    setStory(s);
    setIdx(0);
    setRevealed(false);
    setTappedWord(null);
    setEncountered(new Set());
    setPhase("read");
  }

  function trackAndAdvance() {
    const scene = story.scenes[idx];
    scene.tp.forEach(w => {
      setEncountered(prev => { const s = new Set(prev); s.add(w); return s; });
      if (window.TP_INDEX[w]) recordAnswer(state, setState, w, true);
    });
    if (scene.addActivity) {
      const valid = scene.tp.filter(w => window.TP_INDEX[w]);
      const word  = valid[Math.floor(Math.random() * valid.length)] || "pona";
      const kinds = ["tapWord", "tapGlyph", "type"];
      setActivityWord(word);
      setActivityKind(kinds[Math.floor(Math.random() * kinds.length)]);
      setPhase("activity");
    } else {
      goNext();
    }
  }

  function goNext() {
    if (idx >= story.scenes.length - 1) {
      setPhase("done");
    } else {
      setIdx(i => i + 1);
      setRevealed(false);
      setTappedWord(null);
      setPhase("read");
    }
  }

  if (phase === "pick") return (
    <PickScreen stories={TP_STORIES} theme={theme} onBack={onBack} onPick={openStory} />
  );

  if (phase === "read" && story) return (
    <StoryPanel
      scene={story.scenes[idx]} story={story} idx={idx} theme={theme}
      tappedWord={tappedWord} revealed={revealed}
      onTap={w => setTappedWord(prev => prev === w ? null : w)}
      onReveal={() => setRevealed(true)}
      onAdvance={trackAndAdvance}
      onBack={onBack}
    />
  );

  if (phase === "activity" && story) return (
    <div style={{
      minHeight: "100vh", background: theme.bg, color: theme.ink,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px", gap: 4,
    }}>
      <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", opacity: 0.4, marginBottom: 20, fontFamily: theme.mono }}>
        sona lili · quick check
      </div>
      {activityKind === "tapWord"  && <ActivityTapWord  word={activityWord} theme={theme} onAnswer={c => { recordAnswer(state, setState, activityWord, c); setTimeout(goNext, c ? 350 : 700); }} />}
      {activityKind === "tapGlyph" && <ActivityTapGlyph word={activityWord} theme={theme} onAnswer={c => { recordAnswer(state, setState, activityWord, c); setTimeout(goNext, c ? 350 : 700); }} />}
      {activityKind === "type"     && <ActivityType     word={activityWord} theme={theme} onAnswer={c => { recordAnswer(state, setState, activityWord, c); setTimeout(goNext, c ? 700 : 900); }} />}
    </div>
  );

  if (phase === "done" && story) return (
    <DoneScreen
      story={story} encountered={encountered} theme={theme}
      onBack={onBack}
      onReplay={() => { setIdx(0); setRevealed(false); setTappedWord(null); setEncountered(new Set()); setPhase("read"); }}
      onNew={() => { setStory(null); setPhase("pick"); }}
    />
  );

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button onClick={onBack} style={btnStyle(theme)}>← back</button>
    </div>
  );
}

// ── PickScreen ─────────────────────────────────────────────────────
function PickScreen({ stories, theme, onBack, onPick }) {
  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.ink }}>
      <header style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "22px 40px", borderBottom: `1px solid ${theme.line}`,
      }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.ink, fontSize: 20, opacity: 0.6 }}>←</button>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.55 }}>lipu musi · stories</div>
      </header>
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "56px 40px" }}>
        <div style={{ fontFamily: theme.display, fontSize: 52, fontStyle: "italic", letterSpacing: "-0.02em", marginBottom: 14 }}>
          read a story
        </div>
        <div style={{ fontSize: 15, opacity: 0.55, marginBottom: 48, lineHeight: 1.6, maxWidth: 480 }}>
          Familiar stories retold in toki pona. Tap any glyph to look it up. Translation stays hidden until you're ready.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, background: theme.line, borderRadius: theme.radius, border: `1px solid ${theme.line}`, overflow: "hidden" }}>
          {stories.map(s => (
            <div key={s.id} onClick={() => onPick(s)}
              style={{ background: theme.bg, padding: "22px 28px", cursor: "pointer", display: "flex", gap: 22, alignItems: "center", transition: "background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background = theme.hover}
              onMouseLeave={e => e.currentTarget.style.background = theme.bg}
            >
              <div style={{ color: theme.ink }}><Glyph word={s.char} size={44} style={theme.glyphStyle} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: theme.display, fontSize: 21, fontStyle: "italic", marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 12, opacity: 0.5 }}>{s.labelEn}</div>
              </div>
              <div style={{ opacity: 0.3, fontSize: 18 }}>→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── StoryPanel ─────────────────────────────────────────────────────
function StoryPanel({ scene, story, idx, theme, tappedWord, revealed, onTap, onReveal, onAdvance, onBack }) {
  const isMobile = useIsMobile();
  const total = story.scenes.length;
  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "14px 16px" : "20px 28px", borderBottom: `1px solid ${theme.line}` }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.ink, opacity: 0.5, fontSize: 18 }}>←</button>
        <div style={{ flex: 1, height: 2, background: theme.line, borderRadius: 2, margin: "0 20px", overflow: "hidden" }}>
          <div style={{ width: `${((idx + 1) / total) * 100}%`, height: "100%", background: theme.accent, transition: "width .4s cubic-bezier(.2,.7,.3,1)" }} />
        </div>
        <div style={{ fontFamily: theme.mono, fontSize: 11, opacity: 0.4, letterSpacing: 1 }}>{idx + 1} / {total}</div>
      </div>

      {idx === 0 && (
        <div style={{ textAlign: "center", padding: "24px 24px 0", fontFamily: theme.display, fontStyle: "italic", fontSize: 18, opacity: 0.45, animation: "fadeIn .6s ease" }}>
          {story.label}
        </div>
      )}

      {tappedWord && (
        <div onClick={() => onTap(tappedWord)} style={{ position: "fixed", inset: 0, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)", animation: "fadeIn .15s ease" }}>
          <div onClick={() => onTap(tappedWord)} style={{ background: theme.card, color: theme.ink, borderRadius: theme.radius, padding: "26px 34px", textAlign: "center", maxWidth: 220, border: `1.5px solid ${theme.line}`, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", cursor: "pointer" }}>
            <div style={{ color: theme.ink, marginBottom: 12 }}><Glyph word={tappedWord} size={72} style={theme.glyphStyle} /></div>
            <div style={{ fontFamily: theme.display, fontSize: 26, fontStyle: "italic", marginBottom: 5 }}>{tappedWord}</div>
            <div style={{ fontSize: 13, opacity: 0.62 }}>{window.TP_INDEX[tappedWord]?.m ?? "—"}</div>
            <div style={{ fontSize: 9, opacity: 0.3, marginTop: 14, fontFamily: theme.mono, textTransform: "uppercase", letterSpacing: 1.5 }}>tap to close</div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "20px 16px" : "48px 32px", gap: isMobile ? 24 : 40 }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          {scene.tp.map((w, i) => (
            <div key={i} onClick={() => onTap(w)} style={{ cursor: "pointer", transform: tappedWord === w ? "scale(1.12)" : "scale(1)", transition: "transform .15s" }}>
              <Glyph word={w} size={76} style={theme.glyphStyle} />
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", maxWidth: 520, minHeight: 30 }}>
          <div key={idx} style={{ fontFamily: theme.display, fontStyle: "italic", fontSize: 19, opacity: revealed ? 0.75 : 0, transition: "opacity .45s", lineHeight: 1.5 }}>
            {scene.en}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {!revealed
            ? <button onClick={onReveal} style={btnStyle(theme)}>show translation</button>
            : <button onClick={onAdvance} style={btnStyle(theme)}>{idx < total - 1 ? "continue →" : "finish →"}</button>
          }
          <div style={{ fontSize: 10, opacity: 0.28, fontFamily: theme.mono, letterSpacing: 1 }}>tap a glyph for its meaning</div>
        </div>
      </div>
    </div>
  );
}

// ── DoneScreen ─────────────────────────────────────────────────────
function DoneScreen({ story, encountered, theme, onBack, onReplay, onNew }) {
  const words = [...encountered].filter(w => window.TP_INDEX[w]);
  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.ink }}>
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "72px 40px", textAlign: "center" }}>
        <div style={{ color: theme.accent, marginBottom: 22 }}><Glyph word="pona" size={72} style={theme.glyphStyle} /></div>
        <div style={{ fontFamily: theme.display, fontSize: 42, fontStyle: "italic", letterSpacing: "-0.02em", marginBottom: 6 }}>{story.labelEn}</div>
        <div style={{ fontFamily: theme.display, fontSize: 20, fontStyle: "italic", opacity: 0.45, marginBottom: 44 }}>{story.label}</div>
        <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", opacity: 0.45, marginBottom: 18, fontFamily: theme.mono }}>
          words in this story — {words.length}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 52 }}>
          {words.map(w => (
            <div key={w} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 12px", border: `1px solid ${theme.line}`, borderRadius: theme.radius, background: theme.card }}>
              <Glyph word={w} size={28} style={theme.glyphStyle} />
              <span style={{ fontFamily: theme.mono, fontSize: 8, opacity: 0.45 }}>{w}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onReplay} style={btnStyle(theme)}>read again</button>
          <button onClick={onNew}    style={btnStyle(theme)}>new story</button>
          <button onClick={onBack}   style={btnStyle(theme)}>back to course</button>
        </div>
      </div>
    </div>
  );
}

window.StoryMode = StoryMode;