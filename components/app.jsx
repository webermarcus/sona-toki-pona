// Main app shell. Owns state and theme, routes between views, and
// implements the Tweaks protocol for live customization.

const THEMES = {
  zen: {
    name: "calm zen",
    bg: "#f5f1ea",
    ink: "#2a2a2e",
    line: "rgba(42,42,46,0.12)",
    card: "#faf7f2",
    hover: "#ede8df",
    accent: "oklch(0.62 0.06 180)",
    good: "oklch(0.55 0.09 150)",
    goodBg: "oklch(0.95 0.03 150)",
    bad: "oklch(0.55 0.11 25)",
    badBg: "oklch(0.95 0.03 25)",
    radius: 10,
  },
  ink: {
    name: "ink & paper",
    bg: "#efe8d8",
    ink: "#2b1e15",
    line: "rgba(43,30,21,0.2)",
    card: "#f7f1e2",
    hover: "#e6dec7",
    accent: "oklch(0.52 0.12 45)",
    good: "oklch(0.48 0.09 140)",
    goodBg: "oklch(0.93 0.03 140)",
    bad: "oklch(0.5 0.14 30)",
    badBg: "oklch(0.93 0.04 30)",
    radius: 4,
  },
  grid: {
    name: "quiet grid",
    bg: "#fafafa",
    ink: "#1a1a1a",
    line: "rgba(0,0,0,0.08)",
    card: "#ffffff",
    hover: "#f3f3f3",
    accent: "oklch(0.5 0 0)",
    good: "oklch(0.5 0.09 150)",
    goodBg: "oklch(0.96 0.02 150)",
    bad: "oklch(0.55 0.11 25)",
    badBg: "oklch(0.96 0.03 25)",
    radius: 0,
  },
  night: {
    name: "night study",
    bg: "#17171a",
    ink: "#e8e4d8",
    line: "rgba(232,228,216,0.14)",
    card: "#1e1e22",
    hover: "#222226",
    accent: "oklch(0.78 0.08 80)",
    good: "oklch(0.75 0.1 150)",
    goodBg: "oklch(0.28 0.04 150)",
    bad: "oklch(0.7 0.12 25)",
    badBg: "oklch(0.28 0.05 25)",
    radius: 8,
  },
};

const TYPOGRAPHY = {
  serif: {
    name: "serif",
    display: "'Instrument Serif', 'EB Garamond', Georgia, serif",
    ui: "'IBM Plex Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
  },
  sans: {
    name: "sans",
    display: "'IBM Plex Sans', system-ui, sans-serif",
    ui: "'IBM Plex Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
  },
  mono: {
    name: "all mono",
    display: "'JetBrains Mono', ui-monospace, monospace",
    ui: "'JetBrains Mono', ui-monospace, monospace",
    mono: "'JetBrains Mono', ui-monospace, monospace",
  },
};

function buildTheme(tweaks) {
  const base = THEMES[tweaks.theme] || THEMES.zen;
  const type = TYPOGRAPHY[tweaks.typography] || TYPOGRAPHY.serif;
  return {
    ...base,
    ...type,
    glyphStyle: tweaks.glyphStyle || "ink",
    showRomanization: tweaks.showRomanization !== false,
  };
}

function CourseApp({ initialTweaks }) {
  const [state, _setState] = React.useState(() => loadState());
  const [tweaks, setTweaks] = React.useState(initialTweaks);
  const [view, setView] = React.useState({ kind: "home" });
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  const setState = React.useCallback(next => {
    _setState(next);
    saveState(next);
  }, []);

  React.useEffect(() => {
    function onMsg(e) {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    }
    window.addEventListener("message", onMsg);
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  function updateTweak(key, value) {
    const next = { ...tweaks, [key]: value };
    setTweaks(next);
    try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: value } }, "*"); } catch (e) {}
  }

  const theme = buildTheme(tweaks);

  let content;
  if (view.kind === "home") {
    content = (
      <Home
        theme={theme} state={state} setState={setState}
        onOpenLesson={l => setView({ kind: "lesson", lesson: l })}
        onOpenFlashcards={(words, title) => setView({ kind: "flashcards", words, title })}
        onOpenGlyphs={() => setView({ kind: "glyphs" })}
        onOpenStory={() => setView({ kind: "story" })}
      />
    );
  } else if (view.kind === "lesson") {
    content = (
      <LessonPlayer
        lesson={view.lesson} theme={theme} state={state} setState={setState}
        onBack={() => setView({ kind: "home" })}
      />
    );
  } else if (view.kind === "flashcards") {
    content = (
      <Flashcards
        words={view.words} title={view.title}
        theme={theme} state={state} setState={setState}
        onBack={() => setView({ kind: "home" })}
      />
    );
  } else if (view.kind === "glyphs") {
    content = (
      <GlyphIndex
        theme={theme} state={state}
        onBack={() => setView({ kind: "home" })}
        onOpenFlashcards={(words, title) => setView({ kind: "flashcards", words, title })}
      />
    );
  } else if (view.kind === "story") {
    content = (
      <StoryMode
        theme={theme} state={state} setState={setState}
        onBack={() => setView({ kind: "home" })}
      />
    );
  }

  return (
    <div style={{ fontFamily: theme.ui, color: theme.ink, background: theme.bg, minHeight: "100vh" }}>
      {content}
      {tweaksOpen && (
        <TweaksPanel tweaks={tweaks} updateTweak={updateTweak} theme={theme} state={state} setState={setState} />
      )}
    </div>
  );
}

function TweaksPanel({ tweaks, updateTweak, theme, state, setState }) {
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, width: 280,
      background: theme.card, color: theme.ink,
      border: `1px solid ${theme.line}`, borderRadius: theme.radius,
      padding: 18, boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
      fontFamily: theme.ui, fontSize: 13, zIndex: 100,
    }}>
      <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", opacity: 0.5, marginBottom: 14, fontFamily: theme.mono }}>
        tweaks
      </div>
      <TweakRow label="theme">
        {Object.entries(THEMES).map(([k, v]) => (
          <Chip key={k} active={tweaks.theme === k} onClick={() => updateTweak("theme", k)} theme={theme}>{v.name}</Chip>
        ))}
      </TweakRow>
      <TweakRow label="typography">
        {Object.entries(TYPOGRAPHY).map(([k, v]) => (
          <Chip key={k} active={tweaks.typography === k} onClick={() => updateTweak("typography", k)} theme={theme}>{v.name}</Chip>
        ))}
      </TweakRow>
      <TweakRow label="glyph style">
        <Chip active={tweaks.glyphStyle === "ink"} onClick={() => updateTweak("glyphStyle", "ink")} theme={theme}>hand-drawn</Chip>
        <Chip active={tweaks.glyphStyle === "geo"} onClick={() => updateTweak("glyphStyle", "geo")} theme={theme}>geometric</Chip>
      </TweakRow>
      <TweakRow label="romanization">
        <Chip active={tweaks.showRomanization} onClick={() => updateTweak("showRomanization", true)} theme={theme}>show</Chip>
        <Chip active={!tweaks.showRomanization} onClick={() => updateTweak("showRomanization", false)} theme={theme}>hide</Chip>
      </TweakRow>
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${theme.line}` }}>
        <button onClick={() => {
          if (confirm("Reset all mastery progress?")) setState(defaultState());
        }} style={{
          padding: "6px 12px", fontSize: 11, fontFamily: theme.mono,
          background: "transparent", color: theme.ink, opacity: 0.6,
          border: `1px solid ${theme.line}`, borderRadius: theme.radius,
          cursor: "pointer", letterSpacing: 1, textTransform: "uppercase",
        }}>reset progress</button>
      </div>
    </div>
  );
}

function TweakRow({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.5, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}

function Chip({ active, onClick, theme, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 10px", fontSize: 11, fontFamily: theme.mono,
      background: active ? theme.ink : "transparent",
      color: active ? theme.bg : theme.ink,
      border: `1px solid ${theme.line}`, borderRadius: 999,
      cursor: "pointer", letterSpacing: 0.5, textTransform: "lowercase",
      transition: "background .15s, color .15s",
    }}>{children}</button>
  );
}

window.CourseApp = CourseApp;