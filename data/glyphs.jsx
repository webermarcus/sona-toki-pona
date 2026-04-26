// Sitelen pona rendering via webfonts, replacing the old hand-drawn SVG glyphs.
//
// Both fonts work via OpenType ligatures: pass a toki pona word as text and
// the font substitutes the whole string with its logographic glyph.
//
//   "ink" style  → linja pona 4.1 (jan Same, OT rework by David A Roberts).
//   "geo" style  → nasin nanpa   (jan Itan / etbcor).
//
// Fonts are CORS-served from davidar.github.io and jsDelivr. @font-face
// declarations live in index.html so the browser can preload them.
//
// Original font authors: jan Same, David A Roberts, jan Itan. SIL OFL.

function Glyph({ word, size = 64, style = 'ink', title }) {
  // Font choice by style. The fallback chain keeps the app usable even if
  // one font fails to load.
  const fontFamily = style === 'geo'
    ? '"nasin nanpa", "linja pona", sans-serif'
    : '"linja pona", "nasin nanpa", sans-serif';

  // Ink style: deterministic tiny rotation per word, so repeated glyphs
  // don't look mechanically aligned. Word-hash keeps it stable across renders.
  let rot = 0;
  if (style === 'ink') {
    let h = 0;
    for (let i = 0; i < word.length; i++) h = (h * 31 + word.charCodeAt(i)) | 0;
    rot = ((h % 7) - 3) * 0.25;
  }

  // Single-letter words (a, e, o) can fail to trigger ligature substitution
  // in some fonts unless followed by a word boundary. Append a zero-width
  // space, which linja pona / nasin nanpa both treat as a word boundary
  // without adding visible width.
  const display = word.length === 1 ? word + '\u200B' : word;

  return (
    <span
      title={title || undefined}
      style={{
        fontFamily,
        fontSize: size,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Force a size × size box so layout matches the old SVG component.
        width: size,
        height: size,
        overflow: 'visible',
        transform: rot ? `rotate(${rot}deg)` : undefined,
        transformOrigin: 'center',
        // Enable ligatures + kerning. Required for the font substitution.
        fontFeatureSettings: '"liga" 1, "clig" 1, "calt" 1, "kern" 1, "mark" 1',
        textRendering: 'optimizeLegibility',
        WebkitFontSmoothing: 'antialiased',
        userSelect: 'none',
        whiteSpace: 'pre',
      }}
    >
      {display}
    </span>
  );
}

// No more GLYPHS dictionary — the font IS the dictionary. If any code
// elsewhere imports GLYPHS, expose an empty object so nothing crashes.
window.Glyph = Glyph;
window.GLYPHS = {};