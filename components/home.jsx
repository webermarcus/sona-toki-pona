// Home screen: course overview with lessons, flashcards, glyph index, and stories.

function Home({ theme, state, setState, onOpenLesson, onOpenFlashcards, onOpenGlyphs, onOpenStory }) {
  const totalWords = window.TP_VOCAB.length;
  const masteredWords = window.TP_VOCAB.filter(v => masteryLevel(state.mastery[v.w]) >= 2).length;
  const completedLessons = Object.values(state.lessonProgress || {}).filter(p => p.completed).length;
  const totalSeen = Object.keys(state.mastery).length;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.ink }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "72px 40px 80px" }}>

        {/* Masthead */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, marginBottom: 64 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", opacity: 0.5, marginBottom: 16 }}>
              a course in
            </div>
            <div style={{
              fontFamily: theme.display, fontSize: 72, fontStyle: "italic",
              lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: 18,
            }}>
              toki pona
            </div>
            <div style={{ fontSize: 17, opacity: 0.7, lineHeight: 1.5, maxWidth: 440, textWrap: "pretty" }}>
              One hundred and twenty words. A writing system of tiny pictures.
              Learn the whole grammar, at your own pace.
            </div>
          </div>
          <div style={{ display: "flex", gap: 36, alignItems: "flex-end" }}>
            <Stat label="lessons done" value={`${completedLessons}/${window.TP_LESSONS.length}`} theme={theme} />
            <Stat label="words met"    value={`${totalSeen}/${totalWords}`} theme={theme} />
            <Stat label="mastered"     value={masteredWords} theme={theme} />
          </div>
        </div>

        {/* Lessons */}
        <SectionTitle theme={theme}>the grammar · sona nasin</SectionTitle>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,
          background: theme.line, border: `1px solid ${theme.line}`,
          borderRadius: theme.radius, overflow: "hidden", marginBottom: 64,
        }}>
          {window.TP_LESSONS.map((l, i) => {
            const done = state.lessonProgress?.[l.id]?.completed;
            const prevDone = i === 0 || state.lessonProgress?.[window.TP_LESSONS[i-1].id]?.completed;
            return (
              <div
                key={l.id}
                onClick={() => onOpenLesson(l)}
                style={{
                  background: theme.bg, padding: "26px 28px", cursor: "pointer",
                  display: "flex", gap: 22, alignItems: "center",
                  transition: "background .15s",
                  opacity: done || prevDone ? 1 : 0.75,
                }}
                onMouseEnter={e => e.currentTarget.style.background = theme.hover}
                onMouseLeave={e => e.currentTarget.style.background = theme.bg}
              >
                <div style={{ fontFamily: theme.mono, fontSize: 13, opacity: 0.4, width: 28 }}>
                  {l.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: theme.display, fontSize: 22, fontStyle: "italic",
                    letterSpacing: "-0.01em", marginBottom: 4,
                  }}>
                    {l.title}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 8 }}>{l.subtitle}</div>
                  <MasteryRow words={l.words} state={state} />
                </div>
                <div style={{ color: done ? theme.accent : theme.line, fontSize: 20 }}>
                  {done ? "●" : "○"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stories */}
        <SectionTitle theme={theme}>stories · lipu musi</SectionTitle>
        <div style={{ marginBottom: 64 }}>
          <div
            onClick={onOpenStory}
            style={{
              padding: "28px 32px",
              border: `1px solid ${theme.line}`,
              borderRadius: theme.radius,
              cursor: "pointer",
              display: "flex", gap: 28, alignItems: "center",
              background: theme.bg, transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = theme.hover}
            onMouseLeave={e => e.currentTarget.style.background = theme.bg}
          >
            <div style={{ color: theme.ink, opacity: 0.85 }}>
              <Glyph word="lipu" size={44} style={theme.glyphStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: theme.display, fontSize: 24, fontStyle: "italic",
                letterSpacing: "-0.01em", marginBottom: 5,
              }}>
                visual novel · guided reading
              </div>
              <div style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.5 }}>
                Familiar stories retold in toki pona, freshly generated from your vocabulary.
                Tap any glyph for its meaning. Comprehension checks woven through the narrative.
              </div>
            </div>
            <div style={{ opacity: 0.3, fontSize: 22 }}>→</div>
          </div>
        </div>

        {/* Practice */}
        <SectionTitle theme={theme}>practice · musi sona</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 64 }}>
          <CardButton theme={theme} glyph="sitelen" title="all glyphs"
            subtitle={`browse all ${totalWords} words`}
            onClick={onOpenGlyphs} />
          <CardButton theme={theme} glyph="pu" title="flashcards · all"
            subtitle="self-paced review"
            onClick={() => onOpenFlashcards(window.TP_VOCAB.map(v => v.w), "all words")} />
          <CardButton theme={theme} glyph="sin" title="flashcards · new"
            subtitle="words you haven't met"
            onClick={() => {
              const unseen = window.TP_VOCAB.filter(v => !state.mastery[v.w]).map(v => v.w);
              onOpenFlashcards(unseen.length ? unseen : window.TP_VOCAB.map(v => v.w), unseen.length ? "new words" : "all words");
            }} />
        </div>

        <div style={{
          borderTop: `1px solid ${theme.line}`, paddingTop: 24,
          fontSize: 12, opacity: 0.4, fontFamily: theme.mono,
          display: "flex", justifyContent: "space-between",
        }}>
          <span>toki pona — language created by Sonja Lang, public-domain spirit</span>
          <span>sitelen pona · pictures for words</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, theme }) {
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontFamily: theme.display, fontSize: 32, fontStyle: "italic", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.5, marginTop: 6 }}>{label}</div>
    </div>
  );
}

function SectionTitle({ theme, children }) {
  return (
    <div style={{
      fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", opacity: 0.5,
      fontFamily: theme.mono, marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

function CardButton({ theme, glyph, title, subtitle, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding: "24px 22px", border: `1px solid ${theme.line}`, borderRadius: theme.radius,
      cursor: "pointer", display: "flex", flexDirection: "column", gap: 14,
      background: theme.bg, transition: "background .15s",
    }}
    onMouseEnter={e => e.currentTarget.style.background = theme.hover}
    onMouseLeave={e => e.currentTarget.style.background = theme.bg}
    >
      <div style={{ color: theme.ink, opacity: 0.85 }}>
        <Glyph word={glyph} size={40} style={theme.glyphStyle} />
      </div>
      <div style={{ fontFamily: theme.display, fontSize: 22, fontStyle: "italic", letterSpacing: "-0.01em" }}>
        {title}
      </div>
      <div style={{ fontSize: 13, opacity: 0.6 }}>{subtitle}</div>
    </div>
  );
}

window.Home = Home;