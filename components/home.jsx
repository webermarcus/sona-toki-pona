// Home screen — grammar + vocabulary + stories + practice.
// Layout is single-column on mobile (< 640px), two-column on desktop.

function useIsMobile() {
  const [m, setM] = React.useState(() => window.innerWidth < 640);
  React.useEffect(() => {
    const h = () => setM(window.innerWidth < 640);
    window.addEventListener('resize', h, { passive: true });
    return () => window.removeEventListener('resize', h);
  }, []);
  return m;
}

function Home({ theme, state, setState, onOpenLesson, onOpenFlashcards, onOpenGlyphs, onOpenStory }) {
  const isMobile      = useIsMobile();
  const grammarLessons = window.TP_LESSONS.filter(l => l.section === "grammar");
  const vocabLessons   = window.TP_LESSONS.filter(l => l.section === "vocab");

  const totalWords       = window.TP_VOCAB.length;
  const masteredWords    = window.TP_VOCAB.filter(v => masteryLevel(state.mastery[v.w]) >= 2).length;
  const completedLessons = Object.values(state.lessonProgress || {}).filter(p => p.completed).length;
  const totalSeen        = Object.keys(state.mastery).length;
  const totalLessons     = window.TP_LESSONS.length;

  // Render one lesson card. On desktop, `wide` spans two columns for odd sections.
  function renderCard(l, i, prevDone, wide) {
    const done = state.lessonProgress?.[l.id]?.completed;
    return (
      <div
        key={l.id}
        onClick={() => onOpenLesson(l)}
        style={{
          gridColumn: (!isMobile && wide) ? "1 / -1" : undefined,
          background: theme.bg, padding: "26px 20px", cursor: "pointer",
          display: "flex", gap: 16, alignItems: "center",
          transition: "background .15s",
          opacity: done || prevDone ? 1 : 0.75,
        }}
        onMouseEnter={e => e.currentTarget.style.background = theme.hover}
        onMouseLeave={e => e.currentTarget.style.background = theme.bg}
      >
        <div style={{ fontFamily: theme.mono, fontSize: 13, opacity: 0.4, flexShrink: 0, width: 24 }}>
          {l.num}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: theme.display, fontSize: isMobile ? 18 : 22, fontStyle: "italic",
            letterSpacing: "-0.01em", marginBottom: 2,
            overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
          }}>
            {l.title}
          </div>
          <div style={{
            fontSize: 12, opacity: 0.55,
            overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
          }}>
            {l.subtitle}
          </div>
        </div>
        <div style={{ color: done ? theme.accent : theme.line, fontSize: 18, flexShrink: 0 }}>
          {done ? "●" : "○"}
        </div>
      </div>
    );
  }

  const containerPad = isMobile ? "36px 16px 60px" : "72px 40px 80px";

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.ink }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: containerPad }}>

        {/* ── Masthead ─────────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "flex-end",
          justifyContent: "space-between",
          gap: isMobile ? 20 : 40,
          marginBottom: isMobile ? 40 : 64,
        }}>
          <div style={{ flex: isMobile ? undefined : 1 }}>
            <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", opacity: 0.5, marginBottom: 12 }}>
              a course in
            </div>
            <div style={{
              fontFamily: theme.display, fontSize: isMobile ? 52 : 72,
              fontStyle: "italic", lineHeight: 0.95,
              letterSpacing: "-0.03em", marginBottom: 14,
            }}>
              toki pona
            </div>
            {!isMobile && (
              <div style={{ fontSize: 17, opacity: 0.7, lineHeight: 1.5, maxWidth: 440, textWrap: "pretty" }}>
                One hundred and twenty words. A writing system of tiny pictures.
                Learn the whole language, at your own pace.
              </div>
            )}
          </div>

          <div style={{
            display: "flex",
            gap: isMobile ? 0 : 36,
            alignItems: "flex-end",
            justifyContent: isMobile ? "space-between" : undefined,
            alignSelf: isMobile ? "stretch" : undefined,
          }}>
            <Stat label="lessons done" value={`${completedLessons}/${totalLessons}`} theme={theme} compact={isMobile} />
            <Stat label="words met"    value={`${totalSeen}/${totalWords}`}           theme={theme} compact={isMobile} />
            <Stat label="mastered"     value={masteredWords}                           theme={theme} compact={isMobile} />
          </div>
        </div>

        {/* ── Grammar lessons ──────────────────────────────────────── */}
        <SectionTitle theme={theme}>grammar · sona nasin</SectionTitle>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 1,
          background: theme.line, border: `1px solid ${theme.line}`,
          borderRadius: theme.radius, overflow: "hidden", marginBottom: isMobile ? 40 : 64,
        }}>
          {grammarLessons.map((l, i) => {
            const prevDone = i === 0 || state.lessonProgress?.[grammarLessons[i - 1].id]?.completed;
            const wide     = !isMobile && grammarLessons.length % 2 === 1 && i === grammarLessons.length - 1;
            return renderCard(l, i, prevDone, wide);
          })}
        </div>

        {/* ── Vocabulary lessons ───────────────────────────────────── */}
        <SectionTitle theme={theme}>vocabulary · sona nimi</SectionTitle>
        {vocabLessons.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 1,
            background: theme.line, border: `1px solid ${theme.line}`,
            borderRadius: theme.radius, overflow: "hidden", marginBottom: isMobile ? 40 : 64,
          }}>
            {vocabLessons.map((l, i) => {
              const lastGrammarId = grammarLessons[grammarLessons.length - 1]?.id;
              const prevDone = i === 0
                ? state.lessonProgress?.[lastGrammarId]?.completed
                : state.lessonProgress?.[vocabLessons[i - 1].id]?.completed;
              const wide = !isMobile && vocabLessons.length % 2 === 1 && i === vocabLessons.length - 1;
              return renderCard(l, i, prevDone, wide);
            })}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 1,
            background: theme.line, border: `1px solid ${theme.line}`,
            borderRadius: theme.radius, overflow: "hidden",
            marginBottom: isMobile ? 40 : 64, opacity: 0.45,
          }}>
            {[
              { num: "12", title: "Colors",              subtitle: "kule, loje, laso, jelo, walo, pimeja"    },
              { num: "13", title: "Nature & Animals",    subtitle: "ma, soweli, kala, waso, seli, lete..."   },
              { num: "14", title: "Body & Senses",       subtitle: "lawa, noka, uta, kute, pilin, selo..."   },
              { num: "15", title: "Actions",             subtitle: "pali, lape, musi, utala, alasa, awen..." },
              { num: "16", title: "Things & Space",      subtitle: "ilo, poki, supa, lupa, sewi, sinpin..."  },
              { num: "17", title: "Feelings & Society",  subtitle: "mu, kalama, mani, esun, moli, sike..."   },
              { num: "18", title: "Writing & Materials", subtitle: "sitelen, nimi, lipu, ko, kiwen, len..."   },
            ].map((l, i, arr) => (
              <div key={l.num} style={{
                gridColumn: (!isMobile && arr.length % 2 === 1 && i === arr.length - 1) ? "1 / -1" : undefined,
                background: theme.bg, padding: "26px 20px",
                display: "flex", gap: 16, alignItems: "center",
              }}>
                <div style={{ fontFamily: theme.mono, fontSize: 13, opacity: 0.4, flexShrink: 0, width: 24 }}>{l.num}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: theme.display, fontSize: isMobile ? 18 : 22, fontStyle: "italic", letterSpacing: "-0.01em", marginBottom: 2 }}>
                    {l.title}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.6, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{l.subtitle}</div>
                </div>
                <div style={{ fontSize: 12, opacity: 0.3, fontFamily: theme.mono, flexShrink: 0 }}>soon</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Stories ──────────────────────────────────────────────── */}
        <SectionTitle theme={theme}>stories · lipu musi</SectionTitle>
        <div style={{ marginBottom: isMobile ? 40 : 64 }}>
          <div
            onClick={onOpenStory}
            style={{
              padding: isMobile ? "20px 16px" : "28px 32px",
              border: `1px solid ${theme.line}`,
              borderRadius: theme.radius, cursor: "pointer",
              display: "flex", gap: 20, alignItems: "center",
              background: theme.bg, transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = theme.hover}
            onMouseLeave={e => e.currentTarget.style.background = theme.bg}
          >
            <div style={{ color: theme.ink, opacity: 0.85, flexShrink: 0 }}>
              <Glyph word="lipu" size={36} style={theme.glyphStyle} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: theme.display, fontSize: isMobile ? 18 : 24,
                fontStyle: "italic", letterSpacing: "-0.01em", marginBottom: 4,
              }}>
                visual novel · guided reading
              </div>
              {!isMobile && (
                <div style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.5 }}>
                  Familiar stories retold in toki pona. Tap any glyph for its meaning.
                  Comprehension checks woven through each narrative.
                </div>
              )}
            </div>
            <div style={{ opacity: 0.3, fontSize: 20, flexShrink: 0 }}>→</div>
          </div>
        </div>

        {/* ── Practice ─────────────────────────────────────────────── */}
        <SectionTitle theme={theme}>practice · musi sona</SectionTitle>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
          gap: 14, marginBottom: isMobile ? 40 : 64,
        }}>
          <CardButton theme={theme} glyph="sitelen" title="all glyphs"
            subtitle={`browse all ${totalWords} words`}
            isMobile={isMobile}
            onClick={onOpenGlyphs} />
          <CardButton theme={theme} glyph="pu" title="flashcards · all"
            subtitle="self-paced review"
            isMobile={isMobile}
            onClick={() => onOpenFlashcards(window.TP_VOCAB.map(v => v.w), "all words")} />
          <CardButton theme={theme} glyph="sin" title="flashcards · new"
            subtitle="words you haven't met"
            isMobile={isMobile}
            onClick={() => {
              const unseen = window.TP_VOCAB.filter(v => !state.mastery[v.w]).map(v => v.w);
              onOpenFlashcards(
                unseen.length ? unseen : window.TP_VOCAB.map(v => v.w),
                unseen.length ? "new words" : "all words"
              );
            }} />
        </div>

        <div style={{
          borderTop: `1px solid ${theme.line}`, paddingTop: 24,
          fontSize: 11, opacity: 0.4, fontFamily: theme.mono,
          display: "flex", flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between", gap: 8,
        }}>
          <span>toki pona — language created by Sonja Lang, public-domain spirit</span>
          <span>sitelen pona · pictures for words</span>
        </div>

      </div>
    </div>
  );
}

function Stat({ label, value, theme, compact }) {
  return (
    <div style={{ textAlign: compact ? "center" : "right" }}>
      <div style={{
        fontFamily: theme.display, fontSize: compact ? 24 : 32,
        fontStyle: "italic", lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase",
        opacity: 0.5, marginTop: 5,
      }}>
        {label}
      </div>
    </div>
  );
}

function SectionTitle({ theme, children }) {
  return (
    <div style={{
      fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase",
      opacity: 0.5, fontFamily: theme.mono, marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

function CardButton({ theme, glyph, title, subtitle, onClick, isMobile }) {
  return (
    <div onClick={onClick} style={{
      padding: isMobile ? "18px 16px" : "24px 22px",
      border: `1px solid ${theme.line}`, borderRadius: theme.radius,
      cursor: "pointer",
      display: isMobile ? "flex" : "flex",
      flexDirection: isMobile ? "row" : "column",
      alignItems: isMobile ? "center" : undefined,
      gap: isMobile ? 14 : 14,
      background: theme.bg, transition: "background .15s",
    }}
    onMouseEnter={e => e.currentTarget.style.background = theme.hover}
    onMouseLeave={e => e.currentTarget.style.background = theme.bg}
    >
      <div style={{ color: theme.ink, opacity: 0.85, flexShrink: 0 }}>
        <Glyph word={glyph} size={isMobile ? 32 : 40} style={theme.glyphStyle} />
      </div>
      <div style={{ flex: isMobile ? 1 : undefined }}>
        <div style={{
          fontFamily: theme.display, fontSize: isMobile ? 18 : 22,
          fontStyle: "italic", letterSpacing: "-0.01em",
          marginBottom: isMobile ? 2 : 0,
        }}>
          {title}
        </div>
        {!isMobile && <div style={{ fontSize: 13, opacity: 0.6, marginTop: 6 }}>{subtitle}</div>}
        {isMobile && <div style={{ fontSize: 12, opacity: 0.55 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

window.Home = Home;