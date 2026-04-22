// Lesson player: runs a sequence of activities for a lesson's vocab + sentences.

function LessonPlayer({ lesson, theme, state, setState, onBack }) {
  // Build a sequence: for each new word, do Reveal -> TapGlyph. Then a few
  // mixed-word rounds at the end (tap word + type).
  const seq = React.useMemo(() => {
    const steps = [];

    // Intro + word introduction
    steps.push({ kind: "teach", sectionIdx: 0 });
    lesson.words.forEach(w => {
      steps.push({ kind: "reveal",   word: w });
      steps.push({ kind: "tapGlyph", word: w });
    });

    // Grammar rule + isolated word drills
    steps.push({ kind: "teach", sectionIdx: 1 });
    const practice = shuffle(lesson.words).flatMap((w, i) => [
      { kind: i % 2 === 0 ? "tapWord" : "type", word: w },
    ]);
    steps.push(...practice.slice(0, 4));

    if (lesson.sections.length > 2) {
      steps.push({ kind: "teach", sectionIdx: 2 });
    }

    // Sentence-level activities — guarded by minimum length
    const sents    = lesson.sentences || [];
    const forCloze = sents.filter(s => s.tp.length >= 3);
    const forTrans = sents.filter(s => s.tp.length >= 2);
    const forBuild = sents.filter(s => s.tp.length >= 4);

    forCloze.slice(0, 2).forEach(s => steps.push({ kind: "cloze", sentence: s }));

    const clozeUsed  = new Set(forCloze.slice(0, 2).map(s => s.en));
    const transPool  = forTrans.filter(s => !clozeUsed.has(s.en));
    const transSents = (transPool.length > 0 ? transPool : forTrans).slice(0, 2);
    transSents.forEach(s => steps.push({ kind: "sentTrans", sentence: s }));

    if (forBuild.length > 0) {
      const used      = new Set([...clozeUsed, ...transSents.map(s => s.en)]);
      const buildPool = forBuild.filter(s => !used.has(s.en));
      const buildSent = (buildPool.length > 0 ? buildPool : forBuild)[0];
      steps.push({ kind: "sentBuild", sentence: buildSent });
    }

    steps.push({ kind: "sentences" });
    steps.push({ kind: "done" });
    return steps;
  }, [lesson.id]);

  const [idx, setIdx] = React.useState(0);
  const cur = seq[idx];
  const pct = Math.round((idx / (seq.length - 1)) * 100);

  function next() { setIdx(i => Math.min(i + 1, seq.length - 1)); }

  function handleAnswer(word, correct) {
    recordAnswer(state, setState, word, correct);
    setTimeout(next, 50);
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: theme.bg, color: theme.ink,
    }}>
      <header style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "22px 40px", borderBottom: `1px solid ${theme.line}`,
      }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "none", cursor: "pointer",
          color: theme.ink, fontSize: 20, opacity: 0.6,
        }}>←</button>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.55 }}>
          {lesson.num} · {lesson.title}
        </div>
        <div style={{ flex: 1, height: 2, background: theme.line, borderRadius: 2, margin: "0 20px", overflow: "hidden" }}>
          <div style={{
            width: `${pct}%`, height: "100%", background: theme.accent,
            transition: "width .4s cubic-bezier(.2,.7,.3,1)",
          }} />
        </div>
        <div style={{ fontSize: 12, opacity: 0.5, fontFamily: theme.mono, minWidth: 40, textAlign: "right" }}>
          {Math.min(idx + 1, seq.length)}/{seq.length}
        </div>
      </header>

      <main style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div key={idx} style={{ animation: "fadeIn .4s ease" }}>
          {cur.kind === "teach" && (
            <TeachingBlock section={lesson.sections[cur.sectionIdx]} onNext={next} theme={theme} />
          )}
          {cur.kind === "reveal" && (
            <ActivityReveal word={cur.word} theme={theme} onNext={() => {
              recordAnswer(state, setState, cur.word, true);
              next();
            }} />
          )}
          {cur.kind === "tapGlyph" && (
            <ActivityTapGlyph word={cur.word} theme={theme} onAnswer={c => handleAnswer(cur.word, c)} />
          )}
          {cur.kind === "tapWord" && (
            <ActivityTapWord word={cur.word} theme={theme} onAnswer={c => handleAnswer(cur.word, c)} />
          )}
          {cur.kind === "type" && (
            <ActivityType word={cur.word} theme={theme} onAnswer={c => handleAnswer(cur.word, c)} />
          )}
          {cur.kind === "cloze" && (
            <ActivityCloze
              sentence={cur.sentence} lesson={lesson} theme={theme}
              onAnswer={correct => {
                cur.sentence.tp.forEach(w => {
                  if (window.TP_INDEX[w]) recordAnswer(state, setState, w, correct);
                });
                setTimeout(next, 50);
              }}
            />
          )}
          {cur.kind === "sentTrans" && (
            <ActivitySentTrans
              sentence={cur.sentence} theme={theme}
              onAnswer={correct => {
                cur.sentence.tp.forEach(w => {
                  if (window.TP_INDEX[w]) recordAnswer(state, setState, w, correct);
                });
                setTimeout(next, 50);
              }}
            />
          )}
          {cur.kind === "sentBuild" && (
            <ActivitySentBuild
              sentence={cur.sentence} theme={theme}
              onAnswer={correct => {
                cur.sentence.tp.forEach(w => {
                  if (window.TP_INDEX[w]) recordAnswer(state, setState, w, correct);
                });
                setTimeout(next, correct ? 900 : 2800);
              }}
            />
          )}
          {cur.kind === "sentences" && (
            <SentencePractice lesson={lesson} theme={theme} onNext={next} />
          )}
          {cur.kind === "done" && (
            <LessonDone lesson={lesson} theme={theme} state={state} onBack={() => {
              const next = {
                ...state,
                lessonProgress: {
                  ...state.lessonProgress,
                  [lesson.id]: { completed: true },
                },
              };
              setState(next);
              onBack();
            }} />
          )}
        </div>
      </main>
    </div>
  );
}

function TeachingBlock({ section, onNext, theme }) {
  if (!section) { React.useEffect(() => onNext(), []); return null; }
  return (
    <div style={{ maxWidth: 520, textAlign: "left" }}>
      {section.kind === "intro" ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.55, marginBottom: 20 }}>
            lesson
          </div>
          <div style={{
            fontFamily: theme.display, fontSize: 48, fontStyle: "italic",
            lineHeight: 1.15, marginBottom: 24, letterSpacing: "-0.02em",
            textWrap: "pretty",
          }}>
            {section.body}
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.55, marginBottom: 16 }}>
            {section.kind === "rule" ? "grammar" : "note"}
          </div>
          <div style={{
            fontFamily: theme.display, fontSize: 32, fontStyle: "italic",
            lineHeight: 1.2, marginBottom: 20, letterSpacing: "-0.01em",
          }}>
            {section.title}
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.55, opacity: 0.85, textWrap: "pretty" }}>
            {section.body}
          </div>
        </>
      )}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button onClick={onNext} style={btnStyle(theme)}>continue</button>
      </div>
    </div>
  );
}

function SentencePractice({ lesson, theme, onNext }) {
  return (
    <div style={{ maxWidth: 680, textAlign: "center" }}>
      <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.55, marginBottom: 28 }}>
        putting it together
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {lesson.sentences.map((s, i) => (
          <div key={i} style={{
            padding: "28px 32px", borderTop: `1px solid ${theme.line}`,
            borderBottom: `1px solid ${theme.line}`,
          }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 16, flexWrap: "wrap" }}>
              {s.tp.map((w, j) => (
                <div key={j} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ color: theme.ink }}>
                    <Glyph word={w} size={52} style={theme.glyphStyle} />
                  </div>
                  {theme.showRomanization && (
                    <div style={{ fontFamily: theme.mono, fontSize: 10, opacity: 0.55 }}>{w}</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ fontFamily: theme.display, fontSize: 20, fontStyle: "italic", opacity: 0.8 }}>
              {s.en}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 36 }}>
        <button onClick={onNext} style={btnStyle(theme)}>continue</button>
      </div>
    </div>
  );
}

function LessonDone({ lesson, theme, state, onBack }) {
  const masteredCount = lesson.words.filter(w => masteryLevel(state.mastery[w]) >= 2).length;
  return (
    <div style={{ textAlign: "center", maxWidth: 440 }}>
      <div style={{ marginBottom: 28, color: theme.accent }}>
        <Glyph word="pona" size={100} style={theme.glyphStyle} />
      </div>
      <div style={{
        fontFamily: theme.display, fontSize: 40, fontStyle: "italic",
        letterSpacing: "-0.02em", marginBottom: 12,
      }}>
        pona!
      </div>
      <div style={{ fontSize: 16, opacity: 0.7, marginBottom: 28, lineHeight: 1.5, textWrap: "pretty" }}>
        You finished {lesson.title}. {masteredCount} of {lesson.words.length} words reached mastery.
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
        {lesson.words.map(w => (
          <MasteryDot key={w} level={masteryLevel(state.mastery[w])} size={14} color={theme.ink} />
        ))}
      </div>
      <button onClick={onBack} style={btnStyle(theme)}>back to course</button>
    </div>
  );
}

Object.assign(window, { LessonPlayer, TeachingBlock, SentencePractice, LessonDone });