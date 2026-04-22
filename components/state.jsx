// Shared helpers and mastery-dots progress system.
// Persists to localStorage. Each word tracks seen/correct counts.

const STORAGE_KEY = "tp-course-state-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch (e) {
    return defaultState();
  }
}

function defaultState() {
  return {
    mastery: {},           // word -> { seen, correct }
    lessonProgress: {},    // lessonId -> { completed: bool, score: int }
    currentLesson: null,
    currentView: "home",   // home | lesson | flashcards | glyphs
    currentFlashcard: 0,
  };
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function masteryLevel(stats) {
  if (!stats || !stats.seen) return 0;
  const ratio = stats.correct / Math.max(1, stats.seen);
  if (stats.seen >= 6 && ratio >= 0.9) return 4;
  if (stats.seen >= 4 && ratio >= 0.75) return 3;
  if (stats.seen >= 2 && ratio >= 0.5) return 2;
  if (stats.seen >= 1) return 1;
  return 0;
}

// Mastery dot: 0=empty circle, 1-4=filled amount
function MasteryDot({ level, size = 10, color = "currentColor" }) {
  const fill = level === 0 ? "none" : color;
  const opacity = level === 0 ? 0.25 : 0.3 + level * 0.175;
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: "inline-block" }}>
      <circle cx="5" cy="5" r="3.5" fill={fill} stroke={color} strokeWidth="1" opacity={opacity} />
    </svg>
  );
}

function MasteryRow({ words, state, max = 4 }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {words.slice(0, max).map(w => (
        <MasteryDot key={w} level={masteryLevel(state.mastery[w])} />
      ))}
      {words.length > max && (
        <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 2 }}>+{words.length - max}</span>
      )}
    </div>
  );
}

function recordAnswer(state, setState, word, correct) {
  const prev = state.mastery[word] || { seen: 0, correct: 0 };
  const next = {
    ...state,
    mastery: {
      ...state.mastery,
      [word]: { seen: prev.seen + 1, correct: prev.correct + (correct ? 1 : 0) },
    },
  };
  setState(next);
}

// Shuffle util
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick N distractors from the full vocab excluding `except`
function pickDistractors(except, n) {
  const pool = window.TP_VOCAB.filter(v => !except.includes(v.w));
  return shuffle(pool).slice(0, n).map(v => v.w);
}

Object.assign(window, {
  loadState, saveState, defaultState, masteryLevel,
  MasteryDot, MasteryRow, recordAnswer, shuffle, pickDistractors,
});
