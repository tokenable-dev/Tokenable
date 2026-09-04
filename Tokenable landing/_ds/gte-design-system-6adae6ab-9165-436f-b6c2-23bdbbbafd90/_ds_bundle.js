/* @ds-bundle: {"format":3,"namespace":"GTEDesignSystem_6adae6","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"Badge","sourcePath":"components/data/Badge.jsx"},{"name":"Stat","sourcePath":"components/data/Stat.jsx"},{"name":"Tag","sourcePath":"components/data/Tag.jsx"},{"name":"Accordion","sourcePath":"components/disclosure/Accordion.jsx"},{"name":"ConsentModal","sourcePath":"components/feedback/ConsentModal.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"DataGlyph","sourcePath":"components/graphics/DataGlyph.jsx"},{"name":"TradingVisual","sourcePath":"components/graphics/TradingVisual.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navbar.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"SectionHeading","sourcePath":"components/surfaces/SectionHeading.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"14cd941e7c59","components/actions/IconButton.jsx":"7e09b38882da","components/brand/Wordmark.jsx":"7d286c05f960","components/data/Badge.jsx":"ea271efbb4ca","components/data/Stat.jsx":"45b67d58897a","components/data/Tag.jsx":"eab6687c5af4","components/disclosure/Accordion.jsx":"0576dcf031c8","components/feedback/ConsentModal.jsx":"d8e660823ceb","components/forms/Input.jsx":"61555e432091","components/forms/Select.jsx":"fc0056aee6c3","components/graphics/DataGlyph.jsx":"884a11ff8836","components/graphics/TradingVisual.jsx":"6226a12a0326","components/navigation/Navbar.jsx":"10cdbac72275","components/surfaces/Card.jsx":"1e0006f8ac3d","components/surfaces/SectionHeading.jsx":"d9ab4dff110f","ui_kits/landing/CTASection.jsx":"2f9fca24f615","ui_kits/landing/ConnectModal.jsx":"ba3bb911f28e","ui_kits/landing/FAQSection.jsx":"98b811b4dcb5","ui_kits/landing/Features.jsx":"0f68866b186f","ui_kits/landing/Hero.jsx":"b78a6f2211d3","ui_kits/landing/Nav.jsx":"cedac9916093"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GTEDesignSystem_6adae6 = window.GTEDesignSystem_6adae6 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tokenable Button — trading-desk action control.
 *
 * Variants:
 *  - primary   : Azure Blue fill, white label (the main CTA)
 *  - secondary : on light = obsidian fill / white label; on dark = translucent
 *                white fill / white label (a visible second action over the hero)
 *  - outline   : transparent + hairline + label
 *  - ghost     : transparent, no border; label only
 * Shapes: 'pill' (600px, mono label — the hero CTA) | 'rounded' (8px, sans label)
 * Sizes:  'sm' | 'md' | 'lg'
 * On a dark surface pass `onDark` so outline/ghost flip to light ink.
 */
function Button({
  children,
  variant = 'primary',
  shape = 'rounded',
  size = 'md',
  onDark = false,
  icon = null,
  iconRight = null,
  disabled = false,
  type = 'button',
  style = {},
  ...rest
}) {
  const isPill = shape === 'pill';
  const sizes = {
    sm: {
      padding: isPill ? '6px 14px' : '7px 12px',
      font: '13px',
      gap: '6px'
    },
    md: {
      padding: isPill ? '8px 16px' : '10px 16px',
      font: '14px',
      gap: '8px'
    },
    lg: {
      padding: isPill ? '12px 22px' : '13px 22px',
      font: '16px',
      gap: '10px'
    }
  };
  const s = sizes[size] || sizes.md;
  const palettes = {
    primary: {
      bg: 'var(--color-azure)',
      fg: 'var(--color-vellum)',
      border: 'transparent'
    },
    secondary: onDark ? {
      bg: 'rgba(255,255,255,0.10)',
      fg: 'var(--color-vellum)',
      border: 'rgba(255,255,255,0.22)'
    } : {
      bg: 'var(--color-obsidian)',
      fg: 'var(--color-vellum)',
      border: 'transparent'
    },
    outline: {
      bg: 'transparent',
      fg: onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)',
      border: onDark ? 'rgba(255,255,255,0.38)' : 'var(--color-obsidian)'
    },
    ghost: {
      bg: 'transparent',
      fg: onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)',
      border: 'transparent'
    }
  };
  const p = palettes[variant] || palettes.primary;
  const isQuiet = variant === 'ghost' || variant === 'outline';
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    padding: s.padding,
    fontFamily: isPill ? 'var(--font-mono)' : 'var(--font-sans)',
    fontWeight: 500,
    fontSize: s.font,
    lineHeight: 1,
    letterSpacing: isPill ? '-0.02em' : '-0.01em',
    textTransform: isPill ? 'uppercase' : 'none',
    color: p.fg,
    background: p.bg,
    border: `1px solid ${p.border}`,
    borderRadius: isPill ? 'var(--radius-pill)' : 'var(--radius-buttons)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'opacity var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    ...style
  };
  const handleDown = e => {
    if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
  };
  const handleUp = e => {
    e.currentTarget.style.transform = 'scale(1)';
  };
  // On dark, quiet buttons brighten with a fill on hover instead of dimming the
  // (already low-contrast) white label.
  const handleEnter = e => {
    if (disabled) return;
    if (isQuiet) {
      e.currentTarget.style.background = onDark ? 'rgba(255,255,255,0.12)' : 'var(--action-hover-tint)';
    } else {
      e.currentTarget.style.opacity = '0.9';
    }
  };
  const handleLeave = e => {
    if (disabled) return;
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.transform = 'scale(1)';
    if (isQuiet) e.currentTarget.style.background = p.bg;
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    style: base,
    onMouseDown: handleDown,
    onMouseUp: handleUp,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      fontSize: '1.05em'
    }
  }, icon) : null, children, iconRight ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      fontSize: '1.05em'
    }
  }, iconRight) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GTE IconButton — square/circular control holding a single glyph or icon node.
 * Use for toolbar actions, close buttons, and nav controls.
 *
 * Variants: 'solid' (obsidian fill) | 'outline' (hairline) | 'ghost' (bare)
 * Shapes:   'square' (8px radius) | 'circle'
 * Sizes:    'sm' (28) | 'md' (36) | 'lg' (44)
 */
function IconButton({
  children,
  label,
  variant = 'ghost',
  shape = 'square',
  size = 'md',
  onDark = false,
  disabled = false,
  style = {},
  ...rest
}) {
  const dim = {
    sm: 28,
    md: 36,
    lg: 44
  }[size] || 36;
  const palettes = {
    solid: {
      bg: 'var(--color-obsidian)',
      fg: 'var(--color-vellum)',
      border: 'transparent'
    },
    outline: {
      bg: 'transparent',
      fg: onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)',
      border: onDark ? 'var(--border-on-dark)' : 'var(--border-hairline)'
    },
    ghost: {
      bg: 'transparent',
      fg: onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)',
      border: 'transparent'
    }
  };
  const p = palettes[variant] || palettes.ghost;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dim,
    height: dim,
    padding: 0,
    color: p.fg,
    background: p.bg,
    border: `1px solid ${p.border}`,
    borderRadius: shape === 'circle' ? '50%' : 'var(--radius-buttons)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    fontSize: dim * 0.45,
    lineHeight: 1,
    transition: 'opacity var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard)',
    WebkitTapHighlightColor: 'transparent',
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    style: base,
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.opacity = '0.7';
    },
    onMouseLeave: e => {
      if (!disabled) e.currentTarget.style.opacity = '1';
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/brand/Wordmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tokenable Wordmark — the official TOKENABLE logotype (vector lettering).
 * Renders as an inline SVG that inherits `color`, so it works on any surface:
 * pass color="var(--color-vellum)" on dark, color="var(--color-obsidian)" on light.
 * Sized by `height`; width scales to the logo's 314:50 aspect ratio.
 */
function Wordmark({
  height = 22,
  color = 'currentColor',
  title = 'Tokenable',
  style = {},
  ...rest
}) {
  const width = Math.round(height * (314 / 50));
  return /*#__PURE__*/React.createElement("svg", _extends({
    role: "img",
    "aria-label": title,
    viewBox: "0 0 314 50",
    height: height,
    width: width,
    style: {
      display: 'block',
      color,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("title", null, title), /*#__PURE__*/React.createElement("g", {
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12.64 40V18H2.71997V12H29.52V18H19.44V40H12.64Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M50.8556 40.4C48.4556 40.4 46.2556 40.04 44.2556 39.32C42.2823 38.5733 40.5623 37.5467 39.0956 36.24C37.6556 34.9333 36.5356 33.4 35.7356 31.64C34.9356 29.8533 34.5356 27.9333 34.5356 25.88C34.5356 23.8 34.9356 21.88 35.7356 20.12C36.5356 18.36 37.669 16.8267 39.1356 15.52C40.6023 14.2133 42.3223 13.2 44.2956 12.48C46.269 11.7333 48.4423 11.36 50.8156 11.36C53.2156 11.36 55.4023 11.72 57.3756 12.44C59.3756 13.16 61.0956 14.1867 62.5356 15.52C64.0023 16.8267 65.1223 18.36 65.8956 20.12C66.6956 21.88 67.0956 23.8 67.0956 25.88C67.0956 27.96 66.6956 29.88 65.8956 31.64C65.1223 33.4 64.0023 34.9467 62.5356 36.28C61.0956 37.5867 59.3756 38.6 57.3756 39.32C55.4023 40.04 53.229 40.4 50.8556 40.4ZM50.8556 34C52.2156 34 53.469 33.8 54.6156 33.4C55.7623 32.9733 56.749 32.4 57.5756 31.68C58.4023 30.9333 59.0423 30.0667 59.4956 29.08C59.949 28.0933 60.1756 27.0267 60.1756 25.88C60.1756 24.7333 59.949 23.6667 59.4956 22.68C59.0423 21.6933 58.4023 20.84 57.5756 20.12C56.749 19.3733 55.749 18.8 54.5756 18.4C53.429 17.9733 52.189 17.76 50.8556 17.76C49.4956 17.76 48.2423 17.9733 47.0956 18.4C45.949 18.8 44.949 19.36 44.0956 20.08C43.2423 20.8 42.589 21.6667 42.1356 22.68C41.709 23.6667 41.4956 24.7333 41.4956 25.88C41.4956 27.0267 41.709 28.1067 42.1356 29.12C42.589 30.1067 43.2423 30.96 44.0956 31.68C44.949 32.4 45.949 32.9733 47.0956 33.4C48.2423 33.8 49.4956 34 50.8556 34Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M80.7441 32.64L79.1041 26.88L96.3441 12H104.784L80.7441 32.64ZM76.0641 40V12H82.8641V40H76.0641ZM96.9441 40L85.7041 25.84L89.9841 21.52L105.064 40H96.9441Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M113.213 40V12H135.853V17.8H119.813V34.2H136.253V40H113.213ZM111 28.52V23H135.853V28.52H111Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M145.947 40V12H152.267L170.067 32L168.987 31.8C168.827 30.84 168.707 29.9333 168.627 29.08C168.547 28.2 168.467 27.3467 168.387 26.52C168.334 25.6933 168.28 24.88 168.227 24.08C168.2 23.28 168.187 22.4533 168.187 21.6C168.187 20.7467 168.187 19.8533 168.187 18.92V12H174.787V40H168.387L149.947 19.36L151.747 19.64C151.854 20.4133 151.947 21.1467 152.027 21.84C152.107 22.5067 152.174 23.1733 152.227 23.84C152.307 24.5067 152.374 25.1867 152.427 25.88C152.48 26.5467 152.507 27.28 152.507 28.08C152.534 28.8533 152.547 29.7067 152.547 30.64V40H145.947Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M181.675 40L194.315 12H200.435L213.035 40H206.075L199.115 24.44C198.849 23.88 198.595 23.32 198.355 22.76C198.142 22.1733 197.929 21.6 197.715 21.04C197.502 20.4533 197.302 19.88 197.115 19.32C196.929 18.7333 196.755 18.1733 196.595 17.64L197.995 17.6C197.809 18.2133 197.622 18.8 197.435 19.36C197.249 19.92 197.035 20.4933 196.795 21.08C196.582 21.64 196.355 22.2 196.115 22.76C195.875 23.32 195.635 23.8933 195.395 24.48L188.475 40H181.675ZM187.595 34.88L189.755 29.76H204.835L206.275 34.88H187.595Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M219.931 40V12H234.291C236.505 12 238.385 12.28 239.931 12.84C241.478 13.4 242.638 14.1867 243.411 15.2C244.185 16.2133 244.571 17.44 244.571 18.88C244.571 20.4533 244.131 21.7867 243.251 22.88C242.398 23.9733 241.105 24.7333 239.371 25.16L239.451 24.4C240.678 24.6667 241.785 25.1067 242.771 25.72C243.785 26.3333 244.585 27.1333 245.171 28.12C245.758 29.08 246.051 30.2133 246.051 31.52C246.051 33.0933 245.745 34.4267 245.131 35.52C244.518 36.5867 243.678 37.4533 242.611 38.12C241.571 38.76 240.398 39.24 239.091 39.56C237.785 39.8533 236.438 40 235.051 40H219.931ZM226.331 34.32H235.051C235.905 34.32 236.651 34.2133 237.291 34C237.931 33.76 238.438 33.4133 238.811 32.96C239.185 32.48 239.371 31.8933 239.371 31.2C239.371 30.48 239.145 29.9067 238.691 29.48C238.238 29.0267 237.665 28.7067 236.971 28.52C236.278 28.3067 235.571 28.2 234.851 28.2H226.331V34.32ZM226.331 23.12H233.931C234.731 23.12 235.425 23.0133 236.011 22.8C236.625 22.56 237.091 22.24 237.411 21.84C237.731 21.44 237.891 20.9333 237.891 20.32C237.891 19.44 237.505 18.7867 236.731 18.36C235.958 17.9067 234.945 17.68 233.691 17.68H226.331V23.12Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M255.009 40V12H261.809V34H277.409V40H255.009Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M285.869 40V12H308.509V17.8H292.469V34.2H308.909V40H285.869ZM283.5 28.52V23H306.709V28.52H283.5Z"
  })));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/data/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GTE Badge — compact status indicator in mono type for terminal-feeling UI.
 * Tones: 'neutral' | 'accent' | 'positive' | 'dark'. Positive reuses the
 * brand orange (the system has no green) so directionality reads via the
 * caret glyph, not hue.
 */
function Badge({
  children,
  tone = 'neutral',
  dot = false,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      bg: 'var(--color-bone)',
      fg: 'var(--color-slate)',
      border: 'transparent'
    },
    accent: {
      bg: 'rgba(47,107,255,0.12)',
      fg: 'var(--color-azure)',
      border: 'transparent'
    },
    positive: {
      bg: 'transparent',
      fg: 'var(--color-azure)',
      border: 'var(--color-azure)'
    },
    dark: {
      bg: 'var(--color-obsidian)',
      fg: 'var(--color-vellum)',
      border: 'transparent'
    }
  };
  const t = tones[tone] || tones.neutral;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 8px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    lineHeight: 1.1,
    color: t.fg,
    background: t.bg,
    border: `1px solid ${t.border}`,
    borderRadius: 'var(--radius-sm)',
    whiteSpace: 'nowrap',
    ...style
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: base
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GTE Stat — a labelled metric readout in PP Supply Mono, the trading-desk
 * data primitive (24h volume, open interest, funding, PnL).
 * Place on light or dark; pass `onDark` to flip ink.
 */
function Stat({
  label,
  value,
  delta = null,
  deltaPositive = true,
  size = 'md',
  onDark = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: '20px',
    md: '30px',
    lg: '40px'
  };
  const valueSize = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
      color: onDark ? 'var(--color-mist)' : 'var(--color-slate)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: valueSize,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1,
      color: onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)'
    }
  }, value), delta != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      fontWeight: 500,
      letterSpacing: '-0.02em',
      color: deltaPositive ? 'var(--color-azure)' : onDark ? 'var(--color-mist)' : 'var(--color-slate)'
    }
  }, deltaPositive ? '▲' : '▼', " ", delta) : null));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Stat.jsx", error: String((e && e.message) || e) }); }

// components/data/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GTE Tag — the editorial kicker pill that sits above a section heading.
 * Default is the orange-ink, no-background "feature tag" from the brand.
 *
 * Variants:
 *  - kicker  : orange Inter text, no fill, no border (section category label)
 *  - outline : orange text + orange hairline pill
 *  - solid   : orange fill, black text
 *  - neutral : slate text + pebble hairline (metadata chips)
 */
function Tag({
  children,
  variant = 'kicker',
  onDark = false,
  style = {},
  ...rest
}) {
  const palettes = {
    kicker: {
      bg: 'transparent',
      fg: 'var(--color-azure)',
      border: 'transparent'
    },
    outline: {
      bg: 'transparent',
      fg: 'var(--color-azure)',
      border: 'var(--color-azure)'
    },
    solid: {
      bg: 'var(--color-azure)',
      fg: 'var(--color-vellum)',
      border: 'transparent'
    },
    neutral: {
      bg: 'transparent',
      fg: onDark ? 'var(--color-mist)' : 'var(--color-slate)',
      border: onDark ? 'var(--border-on-dark)' : 'var(--border-hairline)'
    }
  };
  const p = palettes[variant] || palettes.kicker;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: variant === 'kicker' ? '0' : '4px 10px',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-caption)',
    fontWeight: 500,
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
    color: p.fg,
    background: p.bg,
    border: `1px solid ${p.border}`,
    borderRadius: 'var(--radius-tags)',
    whiteSpace: 'nowrap',
    ...style
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: base
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Tag.jsx", error: String((e && e.message) || e) }); }

// components/disclosure/Accordion.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tokenable Accordion — the disclosure list behind FAQ sections.
 * Each row is a question button + a smoothly-expanding answer. The indicator is
 * a plus that collapses to a minus (Azure Blue when open). Rows are separated by
 * hairline rules — no cards, no shadows. Set `allowMultiple` to keep several
 * rows open at once; `defaultOpen` seeds the initial open row(s).
 *
 * items: [{ question, answer }]
 */
function AccordionItem({
  item,
  isOpen,
  onToggle,
  ink,
  muted,
  border
}) {
  const ref = React.useRef(null);
  const [h, setH] = React.useState(0);
  React.useEffect(() => {
    if (ref.current) setH(ref.current.scrollHeight);
  }, [item, isOpen]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: `1px solid ${border}`
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    "aria-expanded": isOpen,
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '22px 2px',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '18px',
      fontWeight: 500,
      letterSpacing: '-0.01em',
      color: ink
    }
  }, item.question), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: '16px',
      height: '16px',
      flexShrink: 0,
      color: isOpen ? 'var(--color-azure)' : muted,
      transition: 'color var(--duration-fast) var(--ease-standard)'
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1.5px',
      background: 'currentColor',
      transform: 'translateY(-50%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 0,
      bottom: 0,
      width: '1.5px',
      background: 'currentColor',
      transform: 'translateX(-50%)',
      opacity: isOpen ? 0 : 1,
      transition: 'opacity var(--duration-base) var(--ease-standard)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      maxHeight: isOpen ? h : 0,
      opacity: isOpen ? 1 : 0,
      transition: 'max-height var(--duration-base) var(--ease-standard), opacity var(--duration-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      padding: '0 2px 24px',
      maxWidth: '680px',
      fontFamily: 'var(--font-sans)',
      fontSize: '16px',
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
      color: muted,
      textWrap: 'pretty'
    }
  }, item.answer))));
}
function Accordion({
  items = [],
  allowMultiple = false,
  defaultOpen = null,
  onDark = false,
  style = {},
  ...rest
}) {
  const seed = defaultOpen == null ? [] : Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen];
  const [open, setOpen] = React.useState(seed);
  const toggle = i => setOpen(prev => {
    const has = prev.includes(i);
    if (allowMultiple) return has ? prev.filter(x => x !== i) : [...prev, i];
    return has ? [] : [i];
  });
  const ink = onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)';
  const muted = onDark ? 'var(--color-mist)' : 'var(--color-slate)';
  const border = onDark ? 'var(--border-on-dark)' : 'var(--border-hairline)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderTop: `1px solid ${border}`,
      ...style
    }
  }, rest), items.map((it, i) => /*#__PURE__*/React.createElement(AccordionItem, {
    key: i,
    item: it,
    isOpen: open.includes(i),
    onToggle: () => toggle(i),
    ink: ink,
    muted: muted,
    border: border
  })));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/disclosure/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ConsentModal.jsx
try { (() => {
/**
 * GTE ConsentModal — the brand's signature bottom-right dark overlay
 * (the cookie-consent pattern). Onyx surface, 12px radius, white heading
 * in Inter, mist body, two actions (ghost "Decline" + primary "Accept").
 * Render at the page root; position is fixed bottom-right by default.
 */
function ConsentModal({
  title = 'Cookies',
  body,
  acceptLabel = 'Accept',
  declineLabel = 'Decline',
  onAccept,
  onDecline,
  position = 'bottom-right',
  style = {}
}) {
  const pos = {
    'bottom-right': {
      bottom: 'var(--spacing-24)',
      right: 'var(--spacing-24)'
    },
    'bottom-left': {
      bottom: 'var(--spacing-24)',
      left: 'var(--spacing-24)'
    },
    'bottom-center': {
      bottom: 'var(--spacing-24)',
      left: '50%',
      transform: 'translateX(-50%)'
    }
  }[position] || {};
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      zIndex: 1000,
      width: '340px',
      maxWidth: 'calc(100vw - 32px)',
      background: 'var(--color-onyx)',
      color: 'var(--color-vellum)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-subtle)',
      padding: 'var(--spacing-20)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-12)',
      ...pos,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body)',
      fontWeight: 500,
      letterSpacing: '-0.01em',
      color: 'var(--color-vellum)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-caption)',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      color: 'var(--color-mist)',
      textWrap: 'pretty'
    }
  }, body)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--spacing-8)',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "sm",
    onDark: true,
    onClick: onDecline
  }, declineLabel), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    onClick: onAccept
  }, acceptLabel)));
}
Object.assign(__ds_scope, { ConsentModal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ConsentModal.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GTE Input — text field with an 8px radius and obsidian focus border.
 * Light by default; pass `onDark` for inputs on dark panels (onyx fill).
 * Optional leading `prefix` / trailing `suffix` nodes (e.g. a USD label,
 * a MAX pill) align inside the field.
 */
function Input({
  label,
  hint,
  error,
  prefix = null,
  suffix = null,
  onDark = false,
  mono = false,
  style = {},
  id,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const fieldId = id || React.useId();
  const borderColor = error ? 'var(--color-azure)' : focused ? onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)' : onDark ? 'var(--border-on-dark)' : 'var(--border-hairline)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-sm)',
      fontWeight: 500,
      letterSpacing: '-0.01em',
      color: onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 12px',
      background: onDark ? 'var(--color-onyx)' : 'var(--color-vellum)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-inputs)',
      transition: 'border-color var(--duration-fast) var(--ease-standard)'
    }
  }, prefix ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-slate)',
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      letterSpacing: '-0.02em'
    }
  }, prefix) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontSize: 'var(--text-body)',
      letterSpacing: mono ? '-0.02em' : '-0.01em',
      color: onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)'
    }
  })), suffix ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-slate)',
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      letterSpacing: '-0.02em'
    }
  }, suffix) : null), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-caption)',
      letterSpacing: '-0.01em',
      color: 'var(--color-azure)'
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-caption)',
      letterSpacing: '-0.01em',
      color: onDark ? 'var(--color-mist)' : 'var(--color-slate)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GTE Select — native-backed dropdown styled to match Input. Keeps the
 * custom caret and 8px radius; light by default, `onDark` for dark panels.
 */
function Select({
  label,
  hint,
  options = [],
  onDark = false,
  style = {},
  id,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const fieldId = id || React.useId();
  const borderColor = focused ? onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)' : onDark ? 'var(--border-on-dark)' : 'var(--border-hairline)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-sm)',
      fontWeight: 500,
      letterSpacing: '-0.01em',
      color: onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      background: onDark ? 'var(--color-onyx)' : 'var(--color-vellum)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-inputs)',
      transition: 'border-color var(--duration-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }, rest, {
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      padding: '10px 36px 10px 12px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body)',
      letterSpacing: '-0.01em',
      color: onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)',
      cursor: 'pointer'
    }
  }), options.map(o => {
    const value = typeof o === 'string' ? o : o.value;
    const text = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value
    }, text);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: '12px',
      pointerEvents: 'none',
      fontSize: '11px',
      color: onDark ? 'var(--color-mist)' : 'var(--color-slate)'
    }
  }, "\u25BC")), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-caption)',
      letterSpacing: '-0.01em',
      color: onDark ? 'var(--color-mist)' : 'var(--color-slate)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/graphics/DataGlyph.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DataGlyph — the diagrammatic monochrome line-art used inside feature cards.
 * Stroke work in slate/mist; a single accent highlight where it carries meaning
 * (e.g. the LONG pill on the gauge). Built from styled divs, not SVG assets.
 *
 * kind: 'chart' (candlestick column) | 'gauge' (LONG/SHORT meter) | 'orderbook'
 */
function DataGlyph({
  kind = 'chart',
  accent = 'var(--color-azure)',
  style = {},
  ...rest
}) {
  const wrap = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '120px',
    ...style
  };
  if (kind === 'gauge') {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: wrap
    }, rest), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '120px',
        height: '60px',
        borderRadius: '120px 120px 0 0',
        border: '1.5px solid var(--color-slate)',
        borderBottom: 'none',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        width: '2px',
        height: '52px',
        background: 'var(--color-obsidian)',
        transformOrigin: 'bottom',
        transform: 'translateX(-50%) rotate(32deg)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '8px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '-0.01em',
        color: accent,
        border: `1px solid ${accent}`,
        borderRadius: '4px',
        padding: '2px 8px'
      }
    }, "Long"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '-0.01em',
        color: 'var(--color-slate)',
        border: '1px solid var(--color-pebble)',
        borderRadius: '4px',
        padding: '2px 8px'
      }
    }, "Short"))));
  }
  if (kind === 'orderbook') {
    const rows = [82, 64, 95, 48, 72, 58];
    return /*#__PURE__*/React.createElement("div", _extends({
      style: wrap
    }, rest), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%'
      }
    }, rows.map((w, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '8px',
        width: w + '%',
        background: i < 3 ? 'var(--color-slate)' : 'var(--color-mist)',
        borderRadius: '2px',
        opacity: i < 3 ? 0.9 : 0.6
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--color-mist)',
        letterSpacing: '-0.01em'
      }
    }, (67400 - i * 12).toLocaleString())))));
  }

  // chart (default)
  const bars = [40, 70, 52, 88, 64, 100, 76];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: wrap
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '8px',
      height: '120px'
    }
  }, bars.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'relative',
      width: '8px',
      height: h + '%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '-12px',
      bottom: '-12px',
      width: '1px',
      transform: 'translateX(-50%)',
      background: 'var(--color-mist)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '2px',
      border: '1px solid var(--color-slate)',
      background: i % 3 === 0 ? 'transparent' : 'var(--color-slate)'
    }
  })))));
}
Object.assign(__ds_scope, { DataGlyph });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/graphics/DataGlyph.jsx", error: String((e && e.message) || e) }); }

// components/graphics/TradingVisual.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TradingVisual — the signature abstract hero graphic: glowing token orbs
 * floating over a field of candlestick bars. Drops in as an absolutely-
 * positioned layer inside any `position: relative` dark section.
 *
 * Palettes (the only place chromatic imagery color is allowed):
 *  - 'azure' : the current brand — blue orbs + blue/slate candles (default)
 *  - 'ember' : the original Tokenable look — amber/copper orbs + teal-cyan candles
 * Both keep down-bars neutral slate so direction reads from the warm/cool split.
 */
const PALETTES = {
  azure: {
    orb: 'radial-gradient(circle at 32% 28%, #cfe0ff, #2F6BFF 46%, #14387a 100%)',
    glow: '47,107,255',
    up: '47,107,255'
  },
  ember: {
    orb: 'radial-gradient(circle at 32% 28%, #ffd9a8, #ff7817 46%, #b8470a 100%)',
    glow: '255,120,23',
    up: '45,212,191'
  }
};
const BARS = [{
  h: 120,
  up: true,
  o: 0.5
}, {
  h: 200,
  up: false,
  o: 0.65
}, {
  h: 150,
  up: true,
  o: 0.7
}, {
  h: 240,
  up: true,
  o: 1
}, {
  h: 110,
  up: false,
  o: 0.5
}, {
  h: 190,
  up: true,
  o: 0.8
}, {
  h: 140,
  up: false,
  o: 0.5
}];
const ORBS = [{
  x: '16%',
  y: '30%',
  s: 64,
  b: 0.9
}, {
  x: '80%',
  y: '26%',
  s: 88,
  b: 1
}, {
  x: '72%',
  y: '64%',
  s: 40,
  b: 0.7
}, {
  x: '24%',
  y: '66%',
  s: 32,
  b: 0.55
}];
function TradingVisual({
  palette = 'azure',
  fade = true,
  style = {},
  ...rest
}) {
  const p = PALETTES[palette] || PALETTES.azure;
  const mask = fade ? 'radial-gradient(120% 90% at 50% 60%, #000 30%, transparent 78%)' : 'none';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: '26px',
      paddingBottom: '40px',
      opacity: 0.5,
      maskImage: mask,
      WebkitMaskImage: mask
    }
  }, BARS.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'relative',
      width: '6px',
      height: b.h + 'px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '-30px',
      bottom: '-30px',
      width: '1px',
      transform: 'translateX(-50%)',
      background: b.up ? `rgba(${p.up}, 0.5)` : 'rgba(120,120,130,0.4)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '2px',
      background: b.up ? `rgba(${p.up}, ${b.o})` : `rgba(120,120,130,${b.o})`
    }
  })))), ORBS.map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'absolute',
      left: o.x,
      top: o.y,
      width: o.s,
      height: o.s,
      borderRadius: '50%',
      background: p.orb,
      boxShadow: `0 0 ${o.s / 2}px rgba(${p.glow}, ${o.b * 0.5})`,
      opacity: o.b
    }
  })));
}
Object.assign(__ds_scope, { TradingVisual });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/graphics/TradingVisual.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navbar.jsx
try { (() => {
/**
 * Tokenable Navbar — the primary site/app navigation bar.
 * Logo + menu links on the left, actions (Connect Wallet + Launch App) on the
 * right. A link with a `menu` array reveals a dropdown on hover and toggles on
 * click; the panel closes on outside-click or Escape. Active link carries an
 * Azure Blue underline. Use `onDark` over the hero, light elsewhere.
 *
 * links: [{ label, href, active, menu?: [{ label, href, description }] }]
 */
function Navbar({
  links = [],
  onDark = false,
  onLaunch,
  onConnect,
  ctaLabel = 'Launch App',
  connectLabel = 'Connect Wallet',
  showConnect = true,
  logoHeight = 20,
  style = {},
  linksClassName = 'nav-links'
}) {
  const ink = onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)';
  const muted = onDark ? 'var(--color-mist)' : 'var(--color-slate)';
  const [open, setOpen] = React.useState(null);
  const [hovered, setHovered] = React.useState(null);
  const navRef = React.useRef(null);
  const timer = React.useRef(null);
  const openMenu = i => {
    clearTimeout(timer.current);
    setOpen(i);
  };
  const scheduleClose = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(null), 140);
  };
  React.useEffect(() => {
    const onDoc = e => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(null);
    };
    const onKey = e => {
      if (e.key === 'Escape') setOpen(null);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  const panelBg = onDark ? 'var(--color-onyx)' : 'var(--color-vellum)';
  const panelBorder = onDark ? '1px solid var(--border-on-dark)' : '1px solid var(--border-hairline)';
  return /*#__PURE__*/React.createElement("nav", {
    ref: navRef,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '32px',
      padding: '18px 32px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '40px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: 'inline-flex',
      textDecoration: 'none'
    },
    "aria-label": "Tokenable home"
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    height: logoHeight,
    color: ink
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '26px'
    },
    className: linksClassName
  }, links.map((l, i) => {
    const hasMenu = Array.isArray(l.menu) && l.menu.length > 0;
    const active = !!l.active;
    const isOpen = open === i;
    const lit = active || hovered === i || isOpen;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'relative'
      },
      onMouseEnter: () => {
        setHovered(i);
        if (hasMenu) openMenu(i);
      },
      onMouseLeave: () => {
        setHovered(null);
        if (hasMenu) scheduleClose();
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: l.href || '#',
      "aria-haspopup": hasMenu ? 'true' : undefined,
      "aria-expanded": hasMenu ? isOpen ? 'true' : 'false' : undefined,
      onClick: e => {
        if (hasMenu) {
          e.preventDefault();
          setOpen(isOpen ? null : i);
        }
      },
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        color: lit ? ink : muted,
        padding: '6px 0',
        cursor: 'pointer',
        transition: 'color var(--duration-fast) var(--ease-standard)'
      }
    }, l.label, hasMenu ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '9px',
        lineHeight: 1,
        color: muted,
        transform: isOpen ? 'rotate(180deg)' : 'none',
        transition: 'transform var(--duration-base) var(--ease-standard)'
      }
    }, "\u25BE") : null, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: hasMenu ? '14px' : 0,
        bottom: '-2px',
        height: '2px',
        background: 'var(--color-azure)',
        borderRadius: '2px',
        transform: active ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform var(--duration-base) var(--ease-standard)'
      }
    })), hasMenu && isOpen ? /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '100%',
        left: '-12px',
        paddingTop: '12px',
        zIndex: 60
      },
      onMouseEnter: () => openMenu(i),
      onMouseLeave: scheduleClose
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: '236px',
        background: panelBg,
        border: panelBorder,
        borderRadius: 'var(--radius-lg)',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        boxShadow: onDark ? 'var(--shadow-subtle)' : 'none'
      }
    }, l.menu.map((m, j) => /*#__PURE__*/React.createElement("a", {
      key: j,
      href: m.href || '#',
      onClick: () => setOpen(null),
      onMouseEnter: e => {
        e.currentTarget.style.background = onDark ? 'rgba(255,255,255,0.06)' : 'var(--color-bone)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.background = 'transparent';
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        transition: 'background var(--duration-fast) var(--ease-standard)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        color: ink
      }
    }, m.label), m.description ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        letterSpacing: '-0.01em',
        color: muted
      }
    }, m.description) : null)))) : null);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, showConnect ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    shape: "pill",
    size: "sm",
    onDark: onDark,
    onClick: onConnect
  }, connectLabel) : null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    shape: "pill",
    size: "sm",
    iconRight: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.9em'
      }
    }, "\u2197"),
    onClick: onLaunch
  }, ctaLabel)));
}
Object.assign(__ds_scope, { Navbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navbar.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GTE Card — flat, unshadowed content surface. Depth is tonal:
 *  - tone="bone"  : #ebebeb inset card on the white canvas (default)
 *  - tone="canvas": white card with a pebble hairline
 *  - tone="dark"  : obsidian card with the 1px inset hairline (on dark sections)
 *  - tone="deep"  : onyx surface for modals / deepest layer
 * Radius defaults to 24 (generous); pass radius="sm" for the compact 12px.
 */
function Card({
  children,
  tone = 'bone',
  radius = 'lg',
  padding = 24,
  interactive = false,
  style = {},
  ...rest
}) {
  const tones = {
    bone: {
      bg: 'var(--surface-card)',
      fg: 'var(--text-primary)',
      border: 'none',
      shadow: 'none'
    },
    canvas: {
      bg: 'var(--surface-canvas)',
      fg: 'var(--text-primary)',
      border: '1px solid var(--border-hairline)',
      shadow: 'none'
    },
    dark: {
      bg: 'var(--color-obsidian)',
      fg: 'var(--color-vellum)',
      border: 'none',
      shadow: 'var(--shadow-subtle)'
    },
    deep: {
      bg: 'var(--color-onyx)',
      fg: 'var(--color-vellum)',
      border: 'none',
      shadow: 'var(--shadow-subtle)'
    }
  };
  const t = tones[tone] || tones.bone;
  const radii = {
    sm: 'var(--radius-lg)',
    lg: 'var(--radius-xl)'
  };
  const base = {
    background: t.bg,
    color: t.fg,
    border: t.border,
    boxShadow: t.shadow,
    borderRadius: radii[radius] || radii.lg,
    padding: typeof padding === 'number' ? `${padding}px` : padding,
    transition: interactive ? 'background var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)' : 'none',
    cursor: interactive ? 'pointer' : 'default',
    ...style
  };
  const hover = interactive ? {
    onMouseEnter: e => {
      e.currentTarget.style.background = tone === 'bone' ? 'var(--color-pebble)' : tone === 'canvas' ? 'var(--color-bone)' : 'var(--color-onyx)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = t.bg;
    }
  } : {};
  return /*#__PURE__*/React.createElement("div", _extends({
    style: base
  }, hover, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GTE SectionHeading — the editorial heading block: orange kicker tag,
 * then a thin Ogg serif title, then optional Inter subtitle. Left-aligned,
 * constrained to a readable measure. The brand's core compositional unit.
 */
function SectionHeading({
  kicker,
  title,
  subtitle,
  size = 'lg',
  onDark = false,
  align = 'left',
  style = {},
  ...rest
}) {
  const titleSize = size === 'xl' ? 'var(--text-display)' : 'var(--text-heading)';
  const titleLeading = size === 'xl' ? 'var(--leading-display)' : 'var(--leading-heading)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-16)',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
      maxWidth: '680px',
      ...style
    }
  }, rest), kicker ? /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    variant: "kicker"
  }, kicker) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: titleSize,
      lineHeight: titleLeading,
      letterSpacing: '-0.01em',
      color: onDark ? 'var(--color-vellum)' : 'var(--color-obsidian)',
      fontFeatureSettings: 'var(--font-display-features)',
      textWrap: 'balance'
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-subheading)',
      lineHeight: 'var(--leading-subheading)',
      letterSpacing: '-0.01em',
      color: onDark ? 'var(--color-mist)' : 'var(--color-slate)',
      textWrap: 'pretty'
    }
  }, subtitle) : null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/CTASection.jsx
try { (() => {
/* Tokenable landing — dark CTA band + footer. Closes the dark→light→dark rhythm. */
function CTASection({
  onLaunch
}) {
  const {
    SectionHeading,
    Button,
    Wordmark
  } = window.GTEDesignSystem_6adae6;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--color-obsidian)',
      padding: '80px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "center",
    size: "lg",
    onDark: true,
    kicker: "Open access",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Bring your own wallet ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--color-azure)'
      }
    }, "///")),
    subtitle: "No sign-up, no custody, no waiting. Connect and trade in seconds."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    shape: "pill",
    iconRight: /*#__PURE__*/React.createElement("span", null, "\u2197"),
    onClick: onLaunch
  }, "Launch App"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    shape: "pill",
    onDark: true
  }, "View markets"))), /*#__PURE__*/React.createElement("footer", {
    style: {
      maxWidth: '1200px',
      margin: '64px auto 0',
      paddingTop: '24px',
      borderTop: '1px solid var(--border-on-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
      letterSpacing: '0',
      textTransform: 'uppercase',
      color: 'var(--color-mist)'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    height: 18,
    color: "var(--color-vellum)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '24px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Docs"), /*#__PURE__*/React.createElement("span", null, "Markets"), /*#__PURE__*/React.createElement("span", null, "Discord"), /*#__PURE__*/React.createElement("span", null, "X")), /*#__PURE__*/React.createElement("span", null, "\xA9 2026")));
}
window.CTASection = CTASection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/CTASection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/ConnectModal.jsx
try { (() => {
/* GTE landing — connect-wallet modal triggered by "Launch App".
 * Centered onyx dialog over a scrim. Demonstrates Input, Button, Badge.
 */
function ConnectModal({
  open,
  onClose
}) {
  const {
    Button,
    IconButton,
    Badge
  } = window.GTEDesignSystem_6adae6;
  if (!open) return null;
  const wallets = [{
    name: 'MetaMask',
    tag: 'Popular'
  }, {
    name: 'Rabby',
    tag: null
  }, {
    name: 'WalletConnect',
    tag: null
  }, {
    name: 'Coinbase Wallet',
    tag: null
  }];
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 900,
      background: 'rgba(9,9,11,0.6)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '380px',
      maxWidth: '100%',
      background: 'var(--color-onyx)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-subtle)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 4px',
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: '28px',
      letterSpacing: '-0.01em',
      color: 'var(--color-vellum)'
    }
  }, "Connect wallet"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: '13px',
      letterSpacing: '-0.01em',
      color: 'var(--color-mist)'
    }
  }, "Self-custody \u2014 Tokenable never holds your funds.")), /*#__PURE__*/React.createElement(IconButton, {
    label: "Close",
    variant: "ghost",
    onDark: true,
    onClick: onClose
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }
  }, wallets.map(w => /*#__PURE__*/React.createElement("button", {
    key: w.name,
    onClick: onClose,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--color-obsidian)',
      border: '1px solid var(--border-on-dark)',
      cursor: 'pointer',
      transition: 'border-color 120ms'
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = 'var(--color-azure)',
    onMouseLeave: e => e.currentTarget.style.borderColor = 'var(--border-on-dark)'
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '28px',
      height: '28px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #cfe0ff, #2F6BFF)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '15px',
      fontWeight: 500,
      letterSpacing: '-0.01em',
      color: 'var(--color-vellum)'
    }
  }, w.name)), w.tag ? /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, w.tag) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-mist)'
    }
  }, "\u2192")))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: '12px',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      color: 'var(--color-slate)',
      textAlign: 'center'
    }
  }, "By connecting you agree to the Terms & Risk Disclosure.")));
}
window.ConnectModal = ConnectModal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/ConnectModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/FAQSection.jsx
try { (() => {
/* Tokenable landing — FAQ section.
 * Two-column: editorial heading on the left, Accordion of questions on the
 * right. Sits on the white canvas between Features and the dark CTA.
 */
function FAQSection() {
  const {
    SectionHeading,
    Accordion
  } = window.GTEDesignSystem_6adae6;
  const faqs = [{
    question: 'Is Tokenable self-custodial?',
    answer: 'Yes. You trade directly from your own wallet — Tokenable never takes custody of your funds or your keys.'
  }, {
    question: 'What leverage is available?',
    answer: 'Up to 50× on supported perpetual markets, with transparent funding and liquidation you can read straight off the order book.'
  }, {
    question: 'How are funding rates calculated?',
    answer: 'Funding accrues continuously from the gap between the perpetual and its index price, and settles directly on-chain — no opaque off-book adjustments.'
  }, {
    question: 'Which networks are supported?',
    answer: 'Tokenable runs on a fully on-chain order book. Connect any supported EVM wallet and start trading in seconds.'
  }, {
    question: 'Are there trading fees?',
    answer: 'Maker and taker fees are charged per fill and shown before you confirm. There is no hidden spread baked into the price.'
  }, {
    question: 'How do liquidations work?',
    answer: 'Positions are liquidated on-book the moment margin falls below maintenance. Every step is verifiable on-chain.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--color-vellum)',
      padding: '80px 32px 96px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.8fr 1.2fr',
      gap: '48px',
      alignItems: 'start'
    },
    className: "faq-grid"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    kicker: "FAQ",
    title: "Questions, answered",
    subtitle: "Everything you need before your first trade \u2014 and the fine print, in plain language."
  }), /*#__PURE__*/React.createElement(Accordion, {
    items: faqs,
    defaultOpen: 0
  })));
}
window.FAQSection = FAQSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/FAQSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Features.jsx
try { (() => {
/* Tokenable landing — white feature grid.
 * Editorial section heading + bone cards, each with a DataGlyph line-art
 * illustration from the design system.
 */
function FeatureCard({
  kind,
  title,
  body,
  big = false
}) {
  const {
    Card,
    DataGlyph
  } = window.GTEDesignSystem_6adae6;
  return /*#__PURE__*/React.createElement(Card, {
    tone: "bone",
    radius: "lg",
    padding: 28,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      minHeight: big ? '320px' : '260px',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(DataGlyph, {
    kind: kind
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: big ? '34px' : '26px',
      lineHeight: 1.05,
      letterSpacing: '-0.01em',
      color: 'var(--color-obsidian)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: '15px',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      color: 'var(--color-slate)',
      textWrap: 'pretty'
    }
  }, body)));
}
function Features() {
  const {
    SectionHeading
  } = window.GTEDesignSystem_6adae6;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--color-vellum)',
      padding: '80px 32px',
      maxWidth: '1200px',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    kicker: "Built for the desk",
    title: "Every edge a trader expects, on-chain",
    subtitle: "Sub-second matching, deep books, and risk tooling \u2014 without surrendering custody."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: '10px',
      marginTop: '40px'
    }
  }, /*#__PURE__*/React.createElement(FeatureCard, {
    big: true,
    kind: "chart",
    title: "Order-book execution",
    body: "A fully on-chain central limit order book matches at the speed of the chain \u2014 no AMM slippage, no hidden spread."
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    kind: "gauge",
    title: "Leverage, controlled",
    body: "Up to 50\xD7 with transparent funding and liquidation you can read off the book."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      marginTop: '10px'
    }
  }, /*#__PURE__*/React.createElement(FeatureCard, {
    kind: "orderbook",
    title: "Depth you can see",
    body: "Real liquidity, real time \u2014 the whole book is on-chain and verifiable."
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    kind: "chart",
    title: "Cross-margin",
    body: "One collateral pool across every market, settled atomically."
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    kind: "gauge",
    title: "Self-custody",
    body: "Your keys, your positions \u2014 the desk never holds your funds."
  })));
}
window.Features = Features;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Features.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Hero.jsx
try { (() => {
/* Tokenable landing — dark hero.
 * Obsidian stage with the brand TradingVisual backdrop and the big Lexend
 * display headline carrying the double-slash accent.
 */
function Hero({
  onLaunch
}) {
  const {
    Tag,
    Button,
    TradingVisual
  } = window.GTEDesignSystem_6adae6;
  const section = {
    position: 'relative',
    overflow: 'hidden',
    background: 'var(--color-obsidian)',
    minHeight: '640px',
    padding: '150px 32px 80px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  };
  const headline = {
    fontFamily: 'var(--font-display)',
    fontWeight: 300,
    fontSize: 'clamp(48px, 8vw, 92px)',
    lineHeight: 0.95,
    letterSpacing: '-0.03em',
    color: 'var(--color-vellum)',
    margin: '20px 0 0',
    maxWidth: '900px',
    fontFeatureSettings: 'var(--font-display-features)'
  };
  const sub = {
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
    color: 'var(--color-mist)',
    margin: '24px 0 0',
    maxWidth: '520px'
  };
  return /*#__PURE__*/React.createElement("section", {
    style: section
  }, /*#__PURE__*/React.createElement(TradingVisual, {
    palette: "azure"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "outline"
  }, "On-chain perpetuals"), /*#__PURE__*/React.createElement("h1", {
    style: headline
  }, "Liquidity without", /*#__PURE__*/React.createElement("br", null), "the latency ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-azure)'
    }
  }, "///")), /*#__PURE__*/React.createElement("p", {
    style: sub
  }, "The on-chain order book with the speed, depth, and feel of a centralized trading desk."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '12px',
      marginTop: '32px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    shape: "pill",
    iconRight: /*#__PURE__*/React.createElement("span", null, "\u2197"),
    onClick: onLaunch
  }, "Start trading"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    shape: "pill",
    onDark: true
  }, "Read docs"))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Nav.jsx
try { (() => {
/* Tokenable landing — top navigation.
 * Thin wrapper that pins the design-system Navbar over the dark hero and
 * supplies the menu structure (with dropdown submenus) + Launch handler.
 */
function Nav({
  onLaunch
}) {
  const {
    Navbar
  } = window.GTEDesignSystem_6adae6;
  const links = [{
    label: 'Trade',
    href: '#',
    active: true,
    menu: [{
      label: 'Perpetuals',
      href: '#',
      description: 'Up to 50× on-chain'
    }, {
      label: 'Spot',
      href: '#',
      description: 'Instant settlement'
    }, {
      label: 'Vaults',
      href: '#',
      description: 'Automated strategies'
    }]
  }, {
    label: 'Markets',
    href: '#',
    menu: [{
      label: 'All markets',
      href: '#'
    }, {
      label: 'Top movers',
      href: '#'
    }, {
      label: 'New listings',
      href: '#'
    }]
  }, {
    label: 'Points',
    href: '#'
  }, {
    label: 'Docs',
    href: '#',
    menu: [{
      label: 'Developer docs',
      href: '#',
      description: 'Build on Tokenable'
    }, {
      label: 'API reference',
      href: '#'
    }, {
      label: 'Guides',
      href: '#'
    }]
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement(Navbar, {
    links: links,
    onDark: true,
    onLaunch: onLaunch,
    onConnect: onLaunch
  }));
}
window.Nav = Nav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Nav.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.ConsentModal = __ds_scope.ConsentModal;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.DataGlyph = __ds_scope.DataGlyph;

__ds_ns.TradingVisual = __ds_scope.TradingVisual;

__ds_ns.Navbar = __ds_scope.Navbar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

})();
