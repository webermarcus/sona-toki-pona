// Lesson player — resume + requeue.
//
// Requeue fix: previously used useState + closure-captured qIdx, which
// caused stale reads when the activity's onAnswer callback fired after
// a delay. Now uses useReducer so the reducer always sees current state.
//
// REQUEUE action: inserts a retried copy of the current step 4 positions
// ahead (but always before the final sentences+done pair). Each step is
// only requeued once (retried flag).
//
// NEXT action: just increments qIdx.
//
// Resume: saves {lessonId, idx} to localStorage via useEffect whenever
// qIdx changes. On next mount, reads that position and slices seq there.
// The ↺ button clears the saved position and resets to step 1.

const RESUME_KEY = 'tp-lesson-resume';

function getSavedIdx(lessonId, seqLen) {
  try {
    const s = JSON.parse(localStorage.getItem(RESUME_KEY) || 'null');
    if (s && s.lessonId === lessonId && typeof s.idx === 'number'
        && s.idx > 0 && s.idx < seqLen - 1) return s.idx;
  } catch {}
  return 0;
}

// ── Reducer ────────────────────────────────────────────────────────
function lessonReducer(state, action) {
  switch (action.type) {

    case 'INIT':
      return { queue: action.queue, qIdx: 0 };

    case 'NEXT':
      return { ...state, qIdx: state.qIdx + 1 };

    case 'REQUEUE': {
      const { queue, qIdx } = state;
      const cur = queue[qIdx];
      if (!cur || cur.retried) return state;
      // Insert before the last 2 items (sentences + done).
      const insertAt = Math.min(
        qIdx + 4,
        Math.max(qIdx + 1, queue.length - 2)
      );
      const newQueue = [...queue];
      newQueue.splice(insertAt, 0, { ...cur, retried: true });
      return { queue: newQueue, qIdx };
    }

    default:
      return state;
  }
}

// ── Component ──────────────────────────────────────────────────────
function LessonPlayer({ lesson, theme, state, setState, onBack }) {

  const seq = React.useMemo(() => {
    const steps = [];

    steps.push({ kind: "teach", sectionIdx: 0 });
    lesson.words.forEach(w => {
      steps.push({ kind: "reveal",   word: w });
      steps.push({ kind: "tapGlyph", word: w });
    });

    steps.push({ kind: "teach", sectionIdx: 1 });
    const practice = shuffle(lesson.words).flatMap((w, i) => [
      { kind: i % 2 === 0 ? "tapWord" : "type", word: w },
    ]);
    steps.push(...practice.slice(0, 4));

    if (lesson.sections.length > 2) {
      steps.push({ kind: "teach", sectionIdx: 2 });
    }

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

  const [savedIdx] = React.useState(() => getSavedIdx(lesson.id, seq.length));

  const [{ queue, qIdx }, dispatch] = React.useReducer(
    lessonReducer,
    null,
    () => ({ queue: seq.slice(savedIdx).map(s => ({ ...s })), qIdx: 0 })
  );

  // Safety: if lesson changes without a remount (shouldn't happen with key prop
  // in app.jsx, but belt-and-suspenders).
  React.useEffect(() => {
    const start = getSavedIdx(lesson.id, seq.length);
    dispatch({ type: 'INIT', queue: seq.slice(start).map(s => ({ ...s })) });
  }, [lesson.id]);

  // Save progress whenever qIdx advances.
  React.useEffect(() => {
    try {
      localStorage.setItem(RESUME_KEY, JSON.stringify({
        lessonId: lesson.id,
        idx: Math.min(savedIdx + qIdx, seq.length - 1),
      }));
    } catch {}
  }, [qIdx, lesson.id]);

  const cur = queue[qIdx] || { kind: "done" };

  const origPos = Math.min(savedIdx + qIdx, seq.length - 1);
  const pct     = seq.length > 1
    ? Math.round((origPos / (seq.length - 1)) * 100)
    : 100;

  // ── Actions ──────────────────────────────────────────────────────
  function clearProgress() {
    try { localStorage.removeItem(RESUME_KEY); } catch {}
  }

  function restart() {
    clearProgress();
    dispatch({ type: 'INIT', queue: seq.map(s => ({ ...s })) });
  }

  // These two dispatch functions are stable references (dispatch never changes),
  // so there are no stale closure issues regardless of when they fire.
  function doNext()    { dispatch({ type: 'NEXT' }); }
  function doRequeue() { dispatch({ type: 'REQUEUE' }); }

  function handleAnswer(word, correct) {
    recordAnswer(state, setState, word, correct);
    if (!correct) doRequeue();
    setTimeout(doNext, 50);
  }

  function handleSentenceAnswer(correct, delay) {
    cur.sentence.tp.forEach(w => {
      if (window.TP_INDEX[w]) recordAnswer(state, setState, w, correct);
    });
    if (!correct) doRequeue();
    setTimeout(doNext, delay);
  }

  // ── Render ───────────────────────────────────────────────────────
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
          {Math.min(qIdx + 1, queue.length)}/{queue.length}
        </div>

        <button
          onClick={restart}
          title="start over"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: theme.ink, opacity: 0.3, fontSize: 16, paddingLeft: 8,
            fontFamily: theme.mono,
          }}
        >↺</button>
      </header>

      <main style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div key={`${lesson.id}-${qIdx}`} style={{ animation: "fadeIn .4s ease" }}>

          {cur.kind === "teach" && (
            <TeachingBlock
              section={lesson.sections[cur.sectionIdx]}
              onNext={doNext}
              theme={theme}
            />
          )}

          {cur.kind === "reveal" && (
            <ActivityReveal word={cur.word} theme={theme} onNext={() => {
              recordAnswer(state, setState, cur.word, true);
              doNext();
            }} />
          )}

          {cur.kind === "tapGlyph" && (
            <ActivityTapGlyph
              word={cur.word} theme={theme}
              onAnswer={c => handleAnswer(cur.word, c)}
            />
          )}

          {cur.kind === "tapWord" && (
            <ActivityTapWord
              word={cur.word} theme={theme}
              onAnswer={c => handleAnswer(cur.word, c)}
            />
          )}

          {cur.kind === "type" && (
            <ActivityType
              word={cur.word} theme={theme}
              onAnswer={c => handleAnswer(cur.word, c)}
            />
          )}

          {cur.kind === "cloze" && (
            <ActivityCloze
              sentence={cur.sentence} lesson={lesson} theme={theme}
              onAnswer={correct => handleSentenceAnswer(correct, 50)}
            />
          )}

          {cur.kind === "sentTrans" && (
            <ActivitySentTrans
              sentence={cur.sentence} theme={theme}
              onAnswer={correct => handleSentenceAnswer(correct, 50)}
            />
          )}

          {cur.kind === "sentBuild" && (
            <ActivitySentBuild
              sentence={cur.sentence} theme={theme}
              onAnswer={correct => handleSentenceAnswer(correct, correct ? 900 : 2800)}
            />
          )}

          {cur.kind === "sentences" && (
            <SentencePractice lesson={lesson} theme={theme} onNext={doNext} />
          )}

          {cur.kind === "done" && (
            <LessonDone lesson={lesson} theme={theme} state={state} onBack={() => {
              clearProgress();
              setState({
                ...state,
                lessonProgress: {
                  ...state.lessonProgress,
                  [lesson.id]: { completed: true },
                },
              });
              onBack();
            }} />
          )}

        </div>
      </main>
    </div>
  );
}

// ── Supporting components (unchanged) ──────────────────────────────

function TeachingBlock({ section, onNext, theme }) {
  React.useEffect(() => { if (!section) onNext(); }, []);
  if (!section) return null;

  const kindLabel =
    section.kind === "rule"  ? "grammar"    :
    section.kind === "vocab" ? "vocabulary" :
    "note";

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
            {kindLabel}
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
            padding: "28px 32px",
            borderTop: `1px solid ${theme.line}`,
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