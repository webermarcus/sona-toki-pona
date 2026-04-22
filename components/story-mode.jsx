// Story Mode: visual novel + guided reading with AI-generated content.
//
// API key lives in server.js. Requests go to /api/messages (local proxy).
//
// Flow: pick → loading → [read → (activity?) → ...] → done
// Tap any glyph to see its meaning. Translation hidden until revealed.

const STORY_PROMPTS = [
  { id: "redhood",    label: "jan lili li tawa ma kasi",    labelEn: "Little Red Riding Hood",  char: "meli"   },
  { id: "pigs",       label: "soweli lili tu wan",            labelEn: "The Three Little Pigs",   char: "soweli" },
  { id: "goldilocks", label: "meli nasa e tomo soweli",       labelEn: "Goldilocks",              char: "meli"   },
  { id: "fisherman",  label: "jan kala li wile e ale",        labelEn: "The Fisherman's Wish",    char: "jan"    },
  { id: "bedtime",    label: "tenpo lape · pona",             labelEn: "A Bedtime Story",         char: "jan"    },
];

// ── Main component ─────────────────────────────────────────────────
function StoryMode({ theme, state, setState, onBack }) {
  const [phase,        setPhase]        = React.useState("pick");
  const [story,        setStory]        = React.useState(null);
  const [idx,          setIdx]          = React.useState(0);
  const [revealed,     setRevealed]     = React.useState(false);
  const [tappedWord,   setTappedWord]   = React.useState(null);
  const [loaderGlyph,  setLoaderGlyph]  = React.useState("toki");
  const [error,        setError]        = React.useState(null);
  const [encountered,  setEncountered]  = React.useState(new Set());
  // FIX: activity kind/word live at component level — never inside a conditional.
  // Calling React.useState inside an if-block violates the Rules of Hooks and
  // corrupts the hook chain, causing the blank-screen crash at story end.
  const [activityWord, setActivityWord] = React.useState("pona");
  const [activityKind, setActivityKind] = React.useState("tapWord");

  const knownVocab = React.useMemo(() => {
    const seen = window.TP_VOCAB
      .filter(v => masteryLevel(state.mastery[v.w]) >= 1)
      .map(v => v.w);
    const base = [
      "mi","sina","ona","jan","li","e","pona","ike","suli","lili","toki",
      "moku","telo","tomo","lon","tawa","kama","pali","olin","soweli","wile",
      "sona","awen","mama","kili","la","tan","sama","ala","moli","pilin",
      "sin","nasa","lukin","lawa","noka","luka","uta","kon","ma","seli",
      "lete","mute","wan","tu","ale","nanpa","ni","ijo","ken","wawa",
      "pakala","pana","jo","sitelen","nimi","nasin","tenpo","suno","pini",
      "open","lape","musi","kalama","kulupu","ante","sewi","anpa","insa",
    ];
    return [...new Set([...seen, ...base])];
  }, [state.mastery]);

  React.useEffect(() => {
    if (phase !== "loading") return;
    const pool = ["toki","pona","sona","musi","sitelen","lipu","olin","wawa","kasi","ma","sewi"];
    let i = 0;
    const t = setInterval(() => { i = (i + 1) % pool.length; setLoaderGlyph(pool[i]); }, 520);
    return () => clearInterval(t);
  }, [phase]);

  // ── API call ─────────────────────────────────────────────────────
  async function generate(p) {
    setPhase("loading");
    setError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1200,
          system:
            "You generate short toki pona learning stories. " +
            "Always respond with valid JSON only — no markdown fences, no explanation, no extra text.",
          messages: [{
            role: "user",
            content:
`Write a visual novel story based on "${p.labelEn}" using ONLY these toki pona words:
${knownVocab.join(", ")}

Return exactly this JSON (no markdown, no fences):
{
  "title": "toki pona title, 4-6 words",
  "titleEn": "English title",
  "scenes": [
    { "tp": ["word","word","word"], "en": "English gloss", "addActivity": false }
  ]
}

Rules:
- 8 to 10 scenes total
- Each tp array: 3 to 7 words, grammatically correct toki pona
- Use ONLY words from the vocabulary list — no exceptions
- Set addActivity: true on scenes at index 3 and 6 (0-based)
- Story must be recognizable as "${p.labelEn}"
- First scene sets the stage, last resolves the story`,
          }],
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(`${res.status} — ${body?.error?.message || res.statusText}`);
      }
      const data   = await res.json();
      const raw    = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      const clean  = raw.replace(/```(?:json)?|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed.scenes) || parsed.scenes.length < 4) throw new Error("unexpected shape");
      setStory(parsed);
      setIdx(0);
      setRevealed(false);
      setTappedWord(null);
      setEncountered(new Set());
      setPhase("read");
    } catch (e) {
      console.error("Story generation error:", e);
      setError(`pakala — ${e.message}. Try again.`);
      setPhase("pick");
    }
  }

  // ── Scene flow ───────────────────────────────────────────────────
  function trackAndAdvance() {
    const scene = story.scenes[idx];
    scene.tp.forEach(w => {
      setEncountered(prev => { const s = new Set(prev); s.add(w); return s; });
      if (window.TP_INDEX[w]) recordAnswer(state, setState, w, true);
    });
    if (scene.addActivity) {
      // Set activity state BEFORE changing phase — no hooks called here
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

  // ── Rendering ────────────────────────────────────────────────────
  if (phase === "pick") return (
    <PickScreen
      prompts={STORY_PROMPTS} theme={theme}
      onBack={onBack} onPick={generate} error={error}
    />
  );

  if (phase === "loading") return (
    <div style={{
      minHeight: "100vh", background: theme.bg, color: theme.ink,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 28,
    }}>
      <div key={loaderGlyph} style={{ animation: "fadeIn .35s ease", color: theme.ink }}>
        <Glyph word={loaderGlyph} size={88} style={theme.glyphStyle} />
      </div>
      <div style={{ fontFamily: theme.mono, fontSize: 11, letterSpacing: 2.5, opacity: 0.4, textTransform: "uppercase" }}>
        o awen · generating story…
      </div>
    </div>
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
      <div style={{
        fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase",
        opacity: 0.4, marginBottom: 20, fontFamily: theme.mono,
      }}>
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
      onNew={() => { setStory(null); setError(null); setPhase("pick"); }}
    />
  );

  // Fallback — should not be reached, but prevents a blank white screen
  return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button onClick={onBack} style={btnStyle(theme)}>← back</button>
    </div>
  );
}

// ── PickScreen ─────────────────────────────────────────────────────
function PickScreen({ prompts, theme, onBack, onPick, error }) {
  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.ink }}>
      <header style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "22px 40px", borderBottom: `1px solid ${theme.line}`,
      }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.ink, fontSize: 20, opacity: 0.6 }}>←</button>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.55 }}>
          lipu musi · stories
        </div>
      </header>
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "56px 40px" }}>
        <div style={{ fontFamily: theme.display, fontSize: 52, fontStyle: "italic", letterSpacing: "-0.02em", marginBottom: 14 }}>
          read a story
        </div>
        <div style={{ fontSize: 15, opacity: 0.55, marginBottom: 48, lineHeight: 1.6, maxWidth: 480 }}>
          Familiar stories retold in toki pona. Each one is freshly generated using
          your known vocabulary. Tap any glyph to look it up.
        </div>
        {error && (
          <div style={{ marginBottom: 24, padding: "12px 16px", background: theme.badBg, border: `1px solid ${theme.bad}`, borderRadius: theme.radius, fontSize: 13 }}>
            {error}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, background: theme.line, borderRadius: theme.radius, border: `1px solid ${theme.line}`, overflow: "hidden" }}>
          {prompts.map(p => (
            <div key={p.id} onClick={() => onPick(p)}
              style={{ background: theme.bg, padding: "22px 28px", cursor: "pointer", display: "flex", gap: 22, alignItems: "center", transition: "background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background = theme.hover}
              onMouseLeave={e => e.currentTarget.style.background = theme.bg}
            >
              <div style={{ color: theme.ink }}>
                <Glyph word={p.char} size={44} style={theme.glyphStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: theme.display, fontSize: 21, fontStyle: "italic", marginBottom: 3 }}>{p.label}</div>
                <div style={{ fontSize: 12, opacity: 0.5 }}>{p.labelEn}</div>
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
// Clean, centered layout. Glyphs are the hero. Translation underneath.
// No background decorations. No Latin labels on individual glyphs.
function StoryPanel({ scene, story, idx, theme, tappedWord, revealed, onTap, onReveal, onAdvance, onBack }) {
  const total = story.scenes.length;

  return (
    <div style={{
      minHeight: "100vh", background: theme.bg, color: theme.ink,
      display: "flex", flexDirection: "column",
    }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 28px",
        borderBottom: `1px solid ${theme.line}`,
      }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "none", cursor: "pointer",
          color: theme.ink, opacity: 0.5, fontSize: 18,
        }}>←</button>

        {/* Progress bar */}
        <div style={{ flex: 1, height: 2, background: theme.line, borderRadius: 2, margin: "0 20px", overflow: "hidden" }}>
          <div style={{
            width: `${((idx + 1) / total) * 100}%`, height: "100%",
            background: theme.accent,
            transition: "width .4s cubic-bezier(.2,.7,.3,1)",
          }} />
        </div>

        <div style={{ fontFamily: theme.mono, fontSize: 11, opacity: 0.4, letterSpacing: 1 }}>
          {idx + 1} / {total}
        </div>
      </div>

      {/* Story title — first panel only */}
      {idx === 0 && (
        <div style={{
          textAlign: "center", padding: "24px 24px 0",
          fontFamily: theme.display, fontStyle: "italic",
          fontSize: 18, opacity: 0.45, letterSpacing: "-0.01em",
          animation: "fadeIn .6s ease",
        }}>
          {story.title}
        </div>
      )}

      {/* Word meaning tooltip */}
      {tappedWord && (
        <div
          onClick={() => onTap(tappedWord)}
          style={{
            position: "fixed", inset: 0, zIndex: 30,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.45)", animation: "fadeIn .15s ease",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: theme.card, color: theme.ink,
              borderRadius: theme.radius, padding: "26px 34px",
              textAlign: "center", maxWidth: 220,
              border: `1.5px solid ${theme.line}`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ color: theme.ink, marginBottom: 12 }}>
              <Glyph word={tappedWord} size={72} style={theme.glyphStyle} />
            </div>
            <div style={{ fontFamily: theme.display, fontSize: 26, fontStyle: "italic", marginBottom: 5 }}>
              {tappedWord}
            </div>
            <div style={{ fontSize: 13, opacity: 0.62 }}>
              {window.TP_INDEX[tappedWord]?.m ?? "—"}
            </div>
            <div style={{ fontSize: 9, opacity: 0.3, marginTop: 14, fontFamily: theme.mono, textTransform: "uppercase", letterSpacing: 1.5 }}>
              tap to close
            </div>
          </div>
        </div>
      )}

      {/* Main content — centered vertically */}
      <div style={{
        flex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 32px",
        gap: 40,
      }}>

        {/* Glyphs — large, centered, no Latin labels */}
        <div style={{
          display: "flex", gap: 20, flexWrap: "wrap",
          justifyContent: "center", alignItems: "center",
        }}>
          {scene.tp.map((w, i) => (
            <div
              key={i}
              onClick={() => onTap(w)}
              style={{
                cursor: "pointer",
                transform: tappedWord === w ? "scale(1.12)" : "scale(1)",
                transition: "transform .15s",
              }}
            >
              <Glyph word={w} size={76} style={theme.glyphStyle} />
            </div>
          ))}
        </div>

        {/* Translation — revealed on demand */}
        <div style={{ textAlign: "center", maxWidth: 520, minHeight: 30 }}>
          <div style={{
            fontFamily: theme.display, fontStyle: "italic", fontSize: 19,
            opacity: revealed ? 0.75 : 0,
            transition: "opacity .45s",
            lineHeight: 1.5,
          }}>
            {scene.en}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {!revealed ? (
            <button onClick={onReveal} style={btnStyle(theme)}>
              show translation
            </button>
          ) : (
            <button onClick={onAdvance} style={btnStyle(theme)}>
              {idx < total - 1 ? "continue →" : "finish →"}
            </button>
          )}
          <div style={{ fontSize: 10, opacity: 0.28, fontFamily: theme.mono, letterSpacing: 1 }}>
            tap a glyph for its meaning
          </div>
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
        <div style={{ color: theme.accent, marginBottom: 22 }}>
          <Glyph word="pona" size={72} style={theme.glyphStyle} />
        </div>
        <div style={{ fontFamily: theme.display, fontSize: 42, fontStyle: "italic", letterSpacing: "-0.02em", marginBottom: 6 }}>
          {story.titleEn}
        </div>
        <div style={{ fontFamily: theme.display, fontSize: 20, fontStyle: "italic", opacity: 0.45, marginBottom: 44 }}>
          {story.title}
        </div>
        <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", opacity: 0.45, marginBottom: 18, fontFamily: theme.mono }}>
          words in this story — {words.length}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 52 }}>
          {words.map(w => (
            <div key={w} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "10px 12px",
              border: `1px solid ${theme.line}`, borderRadius: theme.radius, background: theme.card,
            }}>
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