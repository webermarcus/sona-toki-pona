// Glyph index / dictionary view. Full vocabulary grid with masteries.

function GlyphIndex({ theme, state, onBack, onOpenFlashcards }) {
  const [filter, setFilter] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const cats = ["all", ...Array.from(new Set(window.TP_VOCAB.map(v => v.cat)))];

  const filtered = window.TP_VOCAB.filter(v => {
    if (filter !== "all" && v.cat !== filter) return false;
    if (query) {
      const q = query.toLowerCase();
      return v.w.includes(q) || v.m.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.ink }}>
      <header style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "22px 40px", borderBottom: `1px solid ${theme.line}`,
      }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "none", cursor: "pointer",
          color: theme.ink, fontSize: 20, opacity: 0.6,
        }}>←</button>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.55 }}>
          nimi ale · every word
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, opacity: 0.5, fontFamily: theme.mono }}>
          {filtered.length} / {window.TP_VOCAB.length}
        </div>
      </header>

      <div style={{
        padding: "24px 40px", display: "flex", gap: 18, alignItems: "center",
        flexWrap: "wrap", borderBottom: `1px solid ${theme.line}`,
      }}>
        <input
          placeholder="search…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            padding: "10px 14px", background: "transparent",
            border: `1px solid ${theme.line}`, borderRadius: theme.radius,
            color: theme.ink, fontFamily: theme.ui, fontSize: 14, outline: "none",
            width: 220,
          }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: "6px 12px", background: filter === c ? theme.ink : "transparent",
                color: filter === c ? theme.bg : theme.ink,
                border: `1px solid ${theme.line}`, borderRadius: 999,
                fontFamily: theme.mono, fontSize: 11, cursor: "pointer",
                letterSpacing: 1, textTransform: "uppercase",
                transition: "background .15s, color .15s",
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => onOpenFlashcards(filtered.map(v => v.w), query || filter === "all" ? "all words" : filter)}
          style={btnStyle(theme)}
        >
          flashcard these
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 1,
        background: theme.line,
        borderBottom: `1px solid ${theme.line}`,
      }}>
        {filtered.map(v => {
          const ml = masteryLevel(state.mastery[v.w]);
          return (
            <div key={v.w} style={{
              background: theme.bg, padding: "22px 16px 16px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              minHeight: 170, position: "relative",
            }}>
              <div style={{ position: "absolute", top: 10, right: 12 }}>
                <MasteryDot level={ml} size={8} color={theme.ink} />
              </div>
              <div style={{ color: theme.ink, marginTop: 4 }}>
                <Glyph word={v.w} size={64} style={theme.glyphStyle} />
              </div>
              <div style={{
                fontFamily: theme.display, fontSize: 20, fontStyle: "italic",
                marginTop: 6,
              }}>
                {v.w}
              </div>
              <div style={{
                fontSize: 11, opacity: 0.55, textAlign: "center",
                lineHeight: 1.35, textWrap: "pretty",
              }}>
                {v.m}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.GlyphIndex = GlyphIndex;
