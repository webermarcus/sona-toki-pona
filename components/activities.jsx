// Activity components for lessons.
// Types: Reveal (flashcard intro), TapGlyph (word -> pick glyph),
// TapWord (glyph -> pick word), TypeRomanization (glyph -> type word).

function ActivityReveal({ word, onNext, theme }) {
  const [shown, setShown] = React.useState(false);
  const entry = window.TP_INDEX[word];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
      <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.55 }}>
        new word
      </div>
      <div
        onClick={() => setShown(true)}
        style={{
          width: 220, height: 220, border: `1.5px solid ${theme.line}`,
          borderRadius: theme.radius, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: shown ? "default" : "pointer", background: theme.card,
          transition: "background .25s",
        }}
      >
        <div style={{ color: theme.ink, opacity: shown ? 1 : 0.15, transition: "opacity .5s" }}>
          <Glyph word={word} size={140} style={theme.glyphStyle} />
        </div>
      </div>
      <div style={{ textAlign: "center", minHeight: 72 }}>
        {shown ? (
          <>
            <div style={{ fontFamily: theme.display, fontSize: 36, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.01em" }}>
              {word}
            </div>
            <div style={{ fontSize: 15, opacity: 0.65, marginTop: 6 }}>{entry?.m}</div>
          </>
        ) : (
          <div style={{ fontSize: 14, opacity: 0.5, marginTop: 28 }}>tap to reveal</div>
        )}
      </div>
      <button
        onClick={onNext}
        disabled={!shown}
        style={{
          ...btnStyle(theme),
          opacity: shown ? 1 : 0.3,
          cursor: shown ? "pointer" : "default",
        }}
      >
        continue
      </button>
    </div>
  );
}

function ActivityTapGlyph({ word, onAnswer, theme }) {
  const [choices] = React.useState(() => shuffle([word, ...pickDistractors([word], 3)]));
  const [picked, setPicked] = React.useState(null);
  const entry = window.TP_INDEX[word];

  function handle(w) {
    if (picked) return;
    setPicked(w);
    setTimeout(() => onAnswer(w === word), 700);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.55 }}>
        which glyph means
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: theme.display, fontSize: 44, fontStyle: "italic", fontWeight: 400 }}>
          {word}
        </div>
        <div style={{ fontSize: 14, opacity: 0.6, marginTop: 4 }}>{entry?.m}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, width: 320 }}>
        {choices.map(c => {
          const isPicked = picked === c;
          const isCorrect = c === word;
          let bg = theme.card, border = theme.line;
          if (picked) {
            if (isCorrect) { bg = theme.goodBg; border = theme.good; }
            else if (isPicked) { bg = theme.badBg; border = theme.bad; }
          }
          return (
            <div
              key={c}
              onClick={() => handle(c)}
              style={{
                aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
                background: bg, border: `1.5px solid ${border}`,
                borderRadius: theme.radius, cursor: picked ? "default" : "pointer",
                transition: "background .25s, border .25s, transform .15s",
                transform: isPicked ? "scale(0.97)" : "scale(1)",
                color: theme.ink,
              }}
            >
              <Glyph word={c} size={72} style={theme.glyphStyle} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityTapWord({ word, onAnswer, theme }) {
  const [choices] = React.useState(() => shuffle([word, ...pickDistractors([word], 3)]));
  const [picked, setPicked] = React.useState(null);

  function handle(w) {
    if (picked) return;
    setPicked(w);
    setTimeout(() => onAnswer(w === word), 700);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.55 }}>
        what word is this
      </div>
      <div style={{
        width: 180, height: 180, border: `1.5px solid ${theme.line}`, borderRadius: theme.radius,
        display: "flex", alignItems: "center", justifyContent: "center", background: theme.card,
        color: theme.ink,
      }}>
        <Glyph word={word} size={110} style={theme.glyphStyle} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 300 }}>
        {choices.map(c => {
          const isPicked = picked === c;
          const isCorrect = c === word;
          let bg = theme.card, border = theme.line, col = theme.ink;
          if (picked) {
            if (isCorrect) { bg = theme.goodBg; border = theme.good; }
            else if (isPicked) { bg = theme.badBg; border = theme.bad; }
          }
          return (
            <div
              key={c}
              onClick={() => handle(c)}
              style={{
                padding: "14px 18px", background: bg, border: `1.5px solid ${border}`,
                borderRadius: theme.radius, cursor: picked ? "default" : "pointer",
                fontFamily: theme.display, fontSize: 22, fontStyle: "italic",
                textAlign: "center", color: col,
                transition: "background .25s, border .25s",
              }}
            >
              {c}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityType({ word, onAnswer, theme }) {
  const [val, setVal] = React.useState("");
  const [state, setState] = React.useState("typing"); // typing | correct | wrong

  function submit(e) {
    e.preventDefault();
    if (state !== "typing") return;
    const correct = val.trim().toLowerCase() === word;
    setState(correct ? "correct" : "wrong");
    setTimeout(() => onAnswer(correct), 900);
  }

  const borderCol = state === "correct" ? theme.good : state === "wrong" ? theme.bad : theme.line;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.55 }}>
        type the word for this glyph
      </div>
      <div style={{
        width: 180, height: 180, border: `1.5px solid ${theme.line}`, borderRadius: theme.radius,
        display: "flex", alignItems: "center", justifyContent: "center", background: theme.card,
        color: theme.ink,
      }}>
        <Glyph word={word} size={110} style={theme.glyphStyle} />
      </div>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <input
          autoFocus
          value={val}
          onChange={e => setVal(e.target.value)}
          disabled={state !== "typing"}
          placeholder="…"
          style={{
            width: 260, padding: "12px 16px", fontSize: 22,
            fontFamily: theme.display, fontStyle: "italic",
            background: "transparent", border: "none",
            borderBottom: `2px solid ${borderCol}`, outline: "none",
            textAlign: "center", color: theme.ink,
            transition: "border .2s",
          }}
        />
        <button type="submit" style={{ ...btnStyle(theme), opacity: val.trim() ? 1 : 0.3 }}>
          check
        </button>
        {state === "wrong" && (
          <div style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>
            the answer was <em style={{ fontStyle: "italic", fontFamily: theme.display }}>{word}</em>
          </div>
        )}
      </form>
    </div>
  );
}

function btnStyle(theme) {
  return {
    padding: "11px 28px",
    background: "transparent",
    color: theme.ink,
    border: `1.5px solid ${theme.line}`,
    borderRadius: 999,
    fontFamily: theme.ui,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "background .2s, color .2s, border .2s",
  };
}

// ── Helpers for sentence-level activities ─────────────────────────

// Context-aware blank selection for cloze.
// Prefers words from the lesson's own word list (particles included),
// falls back to any non-pronoun word, then any word.
function pickBlankIdx(tp, lesson) {
  const lessonWords = new Set(lesson.words);
  const pronouns    = new Set(["mi", "sina", "ona"]);

  const byPriority = [
    // 1. lesson word + not a pronoun
    tp.map((w, i) => ({ w, i })).filter(({ w }) =>  lessonWords.has(w) && !pronouns.has(w)),
    // 2. any lesson word (including pronouns — useful for early lessons)
    tp.map((w, i) => ({ w, i })).filter(({ w }) =>  lessonWords.has(w)),
    // 3. any non-pronoun
    tp.map((w, i) => ({ w, i })).filter(({ w }) => !pronouns.has(w)),
    // 4. anything
    tp.map((w, i) => ({ w, i })),
  ];

  for (const pool of byPriority) {
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)].i;
  }
  return 0;
}

// Smart distractors: same grammatical category where possible.
function getClozeChoices(correctWord, tp, lesson) {
  const inSentence = new Set(tp);
  const particles  = ["li","e","pi","la","o","en","anu","taso"];
  const preps      = ["lon","tawa","kepeken","tan","sama"];

  let preferred = [];
  if (particles.includes(correctWord)) {
    preferred = particles.filter(w => w !== correctWord && !inSentence.has(w));
  } else if (preps.includes(correctWord)) {
    preferred = [...preps, ...particles].filter(w => w !== correctWord && !inSentence.has(w));
  } else {
    preferred = lesson.words.filter(w => w !== correctWord && !inSentence.has(w));
  }

  const extras = window.TP_VOCAB
    .map(v => v.w)
    .filter(w => w !== correctWord && !inSentence.has(w) && !preferred.includes(w));

  const pool = [...shuffle(preferred), ...shuffle(extras)];
  return shuffle([correctWord, ...pool.slice(0, 3)]);
}

// English distractors for sentence translation — pull from all lessons.
function getSentTransChoices(correctEn) {
  const others = window.TP_LESSONS
    .flatMap(l => l.sentences)
    .map(s => s.en)
    .filter(en => en !== correctEn);
  return shuffle([correctEn, ...shuffle(others).slice(0, 3)]);
}

// ── ActivityCloze ─────────────────────────────────────────────────
// Shows a sentence with one word blanked; pick the missing glyph.
// The blank is context-aware: lessons that teach li, e, pi etc.
// will blank those particles rather than defaulting to content words.

function ActivityCloze({ sentence, lesson, theme, onAnswer }) {
  const [blankIdx] = React.useState(() => pickBlankIdx(sentence.tp, lesson));
  const correctWord = sentence.tp[blankIdx];
  const [choices]   = React.useState(() => getClozeChoices(correctWord, sentence.tp, lesson));
  const [picked, setPicked] = React.useState(null);

  function handle(w) {
    if (picked) return;
    setPicked(w);
    setTimeout(() => onAnswer(w === correctWord), 700);
  }

  const correct = picked && picked === correctWord;
  const wrong   = picked && picked !== correctWord;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, maxWidth: 440 }}>
      <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.55 }}>
        fill the gap
      </div>

      {/* Sentence with blank slot */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        {sentence.tp.map((w, i) => (
          i === blankIdx ? (
            <div key={i} style={{
              width: 64, height: 64,
              border: `2px dashed ${picked ? (correct ? theme.good : theme.bad) : theme.accent}`,
              borderRadius: theme.radius,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: picked ? (correct ? theme.goodBg : theme.badBg) : "transparent",
              transition: "border .25s, background .25s",
              color: theme.ink,
            }}>
              {picked && <Glyph word={picked} size={44} style={theme.glyphStyle} />}
            </div>
          ) : (
            <div key={i} style={{ color: theme.ink }}>
              <Glyph word={w} size={52} style={theme.glyphStyle} />
            </div>
          )
        ))}
      </div>

      {/* English for context — always visible; the task is completing the form, not the meaning */}
      <div style={{ fontSize: 25, opacity: 0.5, fontStyle: "italic", fontFamily: theme.display, textAlign: "center" }}>
        {sentence.en}
      </div>

      {/* Four glyph choices */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: 300 }}>
        {choices.map(c => {
          const isPicked  = picked === c;
          const isCorrect = c === correctWord;
          let bg = theme.card, border = theme.line;
          if (picked) {
            if (isCorrect)       { bg = theme.goodBg; border = theme.good; }
            else if (isPicked)   { bg = theme.badBg;  border = theme.bad;  }
          }
          return (
            <div key={c} onClick={() => handle(c)} style={{
              aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
              background: bg, border: `1.5px solid ${border}`,
              borderRadius: theme.radius, cursor: picked ? "default" : "pointer",
              transition: "background .25s, border .25s, transform .15s",
              transform: isPicked && !isCorrect ? "scale(0.97)" : "scale(1)",
              color: theme.ink,
            }}>
              <Glyph word={c} size={64} style={theme.glyphStyle} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── ActivitySentTrans ─────────────────────────────────────────────
// Show a full toki pona sentence as glyphs; pick the correct English meaning.

function ActivitySentTrans({ sentence, theme, onAnswer }) {
  const [choices] = React.useState(() => getSentTransChoices(sentence.en));
  const [picked, setPicked]   = React.useState(null);

  function handle(en) {
    if (picked) return;
    setPicked(en);
    setTimeout(() => onAnswer(en === sentence.en), 700);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, maxWidth: 480 }}>
      <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.55 }}>
        what does this mean
      </div>

      {/* Sentence as glyphs */}
      <div style={{
        display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center",
        padding: "22px 28px",
        border: `1.5px solid ${theme.line}`, borderRadius: theme.radius, background: theme.card,
      }}>
        {sentence.tp.map((w, i) => (
          <div key={i} style={{ color: theme.ink }}>
            <Glyph word={w} size={56} style={theme.glyphStyle} />
          </div>
        ))}
      </div>

      {/* English choices */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 380 }}>
        {choices.map(en => {
          const isPicked  = picked === en;
          const isCorrect = en === sentence.en;
          let bg = theme.card, border = theme.line;
          if (picked) {
            if (isCorrect)     { bg = theme.goodBg; border = theme.good; }
            else if (isPicked) { bg = theme.badBg;  border = theme.bad;  }
          }
          return (
            <div key={en} onClick={() => handle(en)} style={{
              padding: "14px 18px",
              background: bg, border: `1.5px solid ${border}`,
              borderRadius: theme.radius, cursor: picked ? "default" : "pointer",
              fontFamily: theme.display, fontSize: 18, fontStyle: "italic",
              textAlign: "center", color: theme.ink, lineHeight: 1.35,
              transition: "background .25s, border .25s",
            }}>
              {en}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── ActivitySentBuild ─────────────────────────────────────────────
// Scrambled glyphs; tap to place them in the correct order.
// Tap placed glyphs to return them to the bank.
// Auto-checks when all words are placed.

function ActivitySentBuild({ sentence, theme, onAnswer }) {
  // Track by origIdx to handle duplicate words (e.g. two "e" in one sentence)
  const [placed,    setPlaced]    = React.useState([]);
  const [remaining, setRemaining] = React.useState(
    () => shuffle(sentence.tp.map((word, origIdx) => ({ word, origIdx })))
  );
  const [result, setResult] = React.useState(null); // null | "correct" | "wrong"

  function placeWord(item, fromIdx) {
    if (result) return;
    setRemaining(prev => prev.filter((_, i) => i !== fromIdx));
    setPlaced(prev => [...prev, item]);
  }

  function removeWord(item, fromIdx) {
    if (result) return;
    setPlaced(prev => prev.filter((_, i) => i !== fromIdx));
    setRemaining(prev => [...prev, item]);
  }

  // Auto-check when all words have been placed
  React.useEffect(() => {
    if (placed.length !== sentence.tp.length || result !== null) return;
    const isCorrect = placed.map(p => p.word).join(",") === sentence.tp.join(",");
    setResult(isCorrect ? "correct" : "wrong");
    onAnswer(isCorrect);
  }, [placed.length]);

  const placedBorderColor = result === "correct" ? theme.good : result === "wrong" ? theme.bad : theme.line;
  const placedBg          = result === "correct" ? theme.goodBg : result === "wrong" ? theme.badBg : theme.card;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, maxWidth: 520 }}>
      <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.55 }}>
        build this sentence
      </div>

      {/* English target */}
      <div style={{
        fontFamily: theme.display, fontStyle: "italic", fontSize: 17,
        opacity: 0.65, textAlign: "center", lineHeight: 1.4,
      }}>
        {sentence.en}
      </div>

      {/* Placement zone */}
      <div style={{
        minHeight: 88, width: "100%",
        border: `1.5px solid ${placedBorderColor}`,
        borderRadius: theme.radius, background: placedBg,
        display: "flex", alignItems: "center",
        justifyContent: placed.length ? "flex-start" : "center",
        padding: "12px 16px", gap: 10, flexWrap: "wrap",
        transition: "border .3s, background .3s",
      }}>
        {placed.length === 0 ? (
          <div style={{ fontSize: 12, opacity: 0.3, fontFamily: theme.mono }}>
            tap words below to place them
          </div>
        ) : (
          placed.map((item, i) => (
            <div
              key={`p-${item.origIdx}`}
              onClick={() => removeWord(item, i)}
              style={{ cursor: result ? "default" : "pointer", color: theme.ink }}
            >
              <Glyph word={item.word} size={52} style={theme.glyphStyle} />
            </div>
          ))
        )}
      </div>

      {/* Correct order shown on wrong answer */}
      {result === "wrong" && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 10, opacity: 0.45, fontFamily: theme.mono,
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10,
          }}>
            correct order
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {sentence.tp.map((w, i) => (
              <div key={i} style={{ color: theme.ink }}>
                <Glyph word={w} size={44} style={theme.glyphStyle} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Word bank */}
      <div style={{
        display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center",
        padding: "14px 16px",
        border: `1px solid ${theme.line}`, borderRadius: theme.radius,
        width: "100%", minHeight: 76,
        opacity: result ? 0.35 : 1, transition: "opacity .3s",
      }}>
        {remaining.length === 0 && (
          <div style={{ fontSize: 12, opacity: 0.3, fontFamily: theme.mono, alignSelf: "center" }}>—</div>
        )}
        {remaining.map((item, i) => (
          <div
            key={`b-${item.origIdx}`}
            onClick={() => placeWord(item, i)}
            style={{
              cursor: result ? "default" : "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              color: theme.ink,
            }}
          >
            <Glyph word={item.word} size={52} style={theme.glyphStyle} />
            {theme.showRomanization && (
              <span style={{ fontFamily: theme.mono, fontSize: 9, opacity: 0.5 }}>
                {item.word}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  ActivityReveal, ActivityTapGlyph, ActivityTapWord, ActivityType, btnStyle,
  ActivityCloze, ActivitySentTrans, ActivitySentBuild,
  pickBlankIdx, getClozeChoices, getSentTransChoices,
});