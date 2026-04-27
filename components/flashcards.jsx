// Flashcard deck: self-paced review of any subset of vocabulary.

function Flashcards({ words, theme, state, setState, onBack, title = "Flashcards" }) {
  const [idx, setIdx] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [order, setOrder] = React.useState(() => shuffle(words));

  React.useEffect(() => { setOrder(shuffle(words)); setIdx(0); setFlipped(false); }, [words.join(",")]);

  const word = order[idx];
  const entry = word ? window.TP_INDEX[word] : null;

  function mark(known) {
    recordAnswer(state, setState, word, known);
    setFlipped(false);
    setTimeout(() => setIdx(i => (i + 1) % order.length), 180);
  }

  if (!word) {
    return (
      <div style={{ padding: 40, color: theme.ink }}>
        No words in this deck. <button onClick={onBack} style={btnStyle(theme)}>back</button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: theme.bg, color: theme.ink,
      display: "flex", flexDirection: "column",
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
          {title}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, opacity: 0.5, fontFamily: theme.mono }}>
          {idx + 1} / {order.length}
        </div>
      </header>

      <main style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 40, padding: "24px",
      }}>
        <div
          onClick={() => setFlipped(f => !f)}
          style={{
            width: 360, height: 360, background: theme.card,
            border: `1.5px solid ${theme.line}`, borderRadius: theme.radius,
            cursor: "pointer", position: "relative",
            perspective: "1000px",
          }}
        >
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 12, transition: "opacity .3s",
            opacity: flipped ? 0 : 1, pointerEvents: flipped ? "none" : "auto",
          }}>
            <div style={{ color: theme.ink }}>
              <Glyph word={word} size={180} style={theme.glyphStyle} />
            </div>
            {theme.showRomanization && (
              <div style={{ fontFamily: theme.mono, fontSize: 12, opacity: 0.4, marginTop: 14 }}>
                {word}
              </div>
            )}
          </div>
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 8, padding: 24, textAlign: "center",
            transition: "opacity .3s", opacity: flipped ? 1 : 0, pointerEvents: flipped ? "auto" : "none",
          }}>
            <div style={{
              fontFamily: theme.display, fontSize: 48, fontStyle: "italic",
              letterSpacing: "-0.02em",
            }}>
              {word}
            </div>
            <div style={{ fontSize: 16, opacity: 0.7, marginTop: 6, textWrap: "pretty" }}>
              {entry?.m}
            </div>
            <div style={{ fontSize: 11, opacity: 0.4, fontFamily: theme.mono, marginTop: 18, textTransform: "uppercase", letterSpacing: 1.5 }}>
              {entry?.cat.join(" · ")}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, opacity: 0.45, fontFamily: theme.mono, letterSpacing: 1 }}>
          {flipped ? "how did you do?" : "tap card to flip"}
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          <button
            onClick={() => flipped && mark(false)}
            disabled={!flipped}
            style={{
              ...btnStyle(theme), opacity: flipped ? 1 : 0.25,
              borderColor: flipped ? theme.bad : theme.line,
              color: flipped ? theme.bad : theme.ink,
            }}
          >
            again
          </button>
          <button
            onClick={() => flipped && mark(true)}
            disabled={!flipped}
            style={{
              ...btnStyle(theme), opacity: flipped ? 1 : 0.25,
              borderColor: flipped ? theme.good : theme.line,
              color: flipped ? theme.good : theme.ink,
            }}
          >
            got it
          </button>
        </div>
      </main>
    </div>
  );
}

window.Flashcards = Flashcards;