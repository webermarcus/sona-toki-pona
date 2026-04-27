// Main app shell. Owns theme and state, routes between views.
// Tweaks (theme, typography, glyph style, romanization) are now stored
// in React state with sensible defaults. No external edit-mode protocol.

const THEMES = {
  zen: {
    name: "calm zen",
    bg: "#f5f1ea", ink: "#2a2a2e", line: "rgba(42,42,46,0.12)",
    card: "#faf7f2", hover: "#ede8df", accent: "oklch(0.62 0.06 180)",
    good: "oklch(0.55 0.09 150)", goodBg: "oklch(0.95 0.03 150)",
    bad:  "oklch(0.55 0.11 25)",  badBg:  "oklch(0.95 0.03 25)",
    radius: 10,
  },
  ink: {
    name: "ink & paper",
    bg: "#efe8d8", ink: "#2b1e15", line: "rgba(43,30,21,0.2)",
    card: "#f7f1e2", hover: "#e6dec7", accent: "oklch(0.52 0.12 45)",
    good: "oklch(0.48 0.09 140)", goodBg: "oklch(0.93 0.03 140)",
    bad:  "oklch(0.5 0.14 30)",   badBg:  "oklch(0.93 0.04 30)",
    radius: 4,
  },
  grid: {
    name: "quiet grid",
    bg: "#fafafa", ink: "#1a1a1a", line: "rgba(0,0,0,0.08)",
    card: "#ffffff", hover: "#f3f3f3", accent: "oklch(0.5 0 0)",
    good: "oklch(0.5 0.09 150)", goodBg: "oklch(0.96 0.02 150)",
    bad:  "oklch(0.55 0.11 25)", badBg:  "oklch(0.96 0.03 25)",
    radius: 0,
  },
  night: {
    name: "night study",
    bg: "#17171a", ink: "#e8e4d8", line: "rgba(232,228,216,0.14)",
    card: "#1e1e22", hover: "#222226", accent: "oklch(0.78 0.08 80)",
    good: "oklch(0.75 0.1 150)", goodBg: "oklch(0.28 0.04 150)",
    bad:  "oklch(0.7 0.12 25)",  badBg:  "oklch(0.28 0.05 25)",
    radius: 8,
  },
};

const TYPOGRAPHY = {
  serif: {
    name: "serif",
    display: "'Instrument Serif', 'EB Garamond', Georgia, serif",
    ui:      "'IBM Plex Sans', system-ui, sans-serif",
    mono:    "'JetBrains Mono', ui-monospace, monospace",
  },
  sans: {
    name: "sans",
    display: "'IBM Plex Sans', system-ui, sans-serif",
    ui:      "'IBM Plex Sans', system-ui, sans-serif",
    mono:    "'JetBrains Mono', ui-monospace, monospace",
  },
  mono: {
    name: "all mono",
    display: "'JetBrains Mono', ui-monospace, monospace",
    ui:      "'JetBrains Mono', ui-monospace, monospace",
    mono:    "'JetBrains Mono', ui-monospace, monospace",
  },
};

const DEFAULT_TWEAKS = {
  theme:            "night",
  typography:       "serif",
  glyphStyle:       "ink",
  showRomanization: true,
};

function buildTheme(tweaks) {
  const base = THEMES[tweaks.theme]          || THEMES.night;
  const type = TYPOGRAPHY[tweaks.typography] || TYPOGRAPHY.serif;
  return {
    ...base,
    ...type,
    glyphStyle:       tweaks.glyphStyle       || "ink",
    showRomanization: tweaks.showRomanization !== false,
  };
}

function CourseApp() {
  const [state,  _setState] = React.useState(() => loadState());
  const [tweaks, setTweaks] = React.useState(DEFAULT_TWEAKS);
  const [view,   setView]   = React.useState({ kind: "home" });

  const setState = React.useCallback(next => {
    _setState(next);
    saveState(next);
  }, []);

  function updateTweak(key, value) {
    setTweaks(prev => ({ ...prev, [key]: value }));
  }

  const theme = buildTheme(tweaks);

  let content;
  if (view.kind === "home") {
    content = (
      <Home
        theme={theme} state={state} setState={setState}
        tweaks={tweaks} updateTweak={updateTweak}
        onOpenLesson={l => setView({ kind: "lesson", lesson: l })}
        onOpenFlashcards={(words, title) => setView({ kind: "flashcards", words, title })}
        onOpenGlyphs={() => setView({ kind: "glyphs" })}
        onOpenStory={() => setView({ kind: "story" })}
      />
    );
  } else if (view.kind === "lesson") {
    content = (
      <LessonPlayer
        key={view.lesson.id}
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
    </div>
  );
}

window.CourseApp = CourseApp;
window.THEMES = THEMES;
window.TYPOGRAPHY = TYPOGRAPHY;