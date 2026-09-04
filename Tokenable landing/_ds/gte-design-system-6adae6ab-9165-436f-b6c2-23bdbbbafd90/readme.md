# Tokenable Design System

> **Trading terminal behind gallery lighting.**

Tokenable is an on-chain perpetuals exchange. Its visual language is a high-contrast,
split-personality canvas: a near-black hero stage gives way to a stark white
content body, with a single vivid blue accent as the connective tissue. The
brand identity is carried by **typography, not color** — Lexend (the brand/logo
sans) for headlines, Inter for dense UI + body, and JetBrains Mono for data
— producing a *clean-terminal-meets-editorial* feel. Surfaces are flat and
unshadowed; depth comes from tonal layering, not blur.

This project is a self-contained design system: tokens, fonts, reusable React
primitives, foundation specimen cards, and a full landing-page UI kit.

## Source material

This system was authored from a single written style reference
(`uploads/DESIGN (2).md`) — no codebase or Figma was provided. All tokens,
component specs, do's/don'ts, and imagery notes are derived from that document.
There is **no product UI source code** behind the UI kit; the landing page is a
faithful reconstruction of the *documented* marketing surface (dark hero → white
feature grid → dark CTA band), not a copy of proprietary product screens.

> ✅ **Fonts.** All three families load from Google Fonts — no uploads needed.
> Display + headlines use **Lexend**, the brand's logo typeface (a geometric
> humanist sans; light weights read elegantly at large display sizes). **Inter**
> handles dense UI + body (compact and neutral). **JetBrains Mono** carries data,
> tickers, and figures. The earlier commercial faces (Ogg Text Light / PP Supply
> Mono) are no longer used — the system is intentionally all-sans to harmonize
> with the Lexend wordmark.

---

## Content Fundamentals

How Tokenable writes and talks.

- **Voice:** confident, terse, trading-desk serious. Reads like a financial
  publication, not a SaaS landing page. Short declarative lines.
- **Person:** addresses the trader directly as **you** ("Bring your own wallet",
  "Your keys, your positions"). First-person plural ("we") only for the company
  in fine print / consent copy.
- **Casing:** sentence case for headlines and body. **UPPERCASE is reserved for
  mono labels** — ticker rows, stat captions, nav status, badges (e.g.
  `24H VOL`, `LONG`, `BTC-PERP`). Never uppercase the display headlines.
- **Signature mark:** a **double slash `///`** (in Azure Blue) appended to a
  headline's last line — the brand's punctuation. Use it sparingly, as a
  terminal/route motif. The logo itself is the **TOKENABLE** wordmark (use the
  `Wordmark` component — never retype it as text).
- **Numbers are first-class.** Prices, volumes, funding rates, leverage all
  render in mono and are shown precisely (`$2.41B`, `+0.012%`, `50×`).
- **Tone examples:** "Liquidity without the latency." · "Order-book execution at
  the speed of the chain." · "No sign-up, no custody, no waiting."
- **No emoji.** Never. The system uses mono glyphs and a couple of unicode arrows
  (`↗ → ▲ ▼ ✕`) as functional marks only — see Iconography.
- **No exclamation marks, no hype adjectives** ("revolutionary", "amazing").
  Let the typography and the numbers carry the weight.

---

## Visual Foundations

- **Colors.** Monochrome canvas + **one** chromatic accent. Azure Blue
  `#2F6BFF` is the *only* color and is used surgically: CTA fills, kicker tags,
  the `///` accent, active states. Everything else is a tonal step from white
  (`#ffffff`) through bone/pebble grays to obsidian (`#18181b`), onyx
  (`#09090b`), and true black. **Never** add a second hue to the UI; **never**
  use blue for body text, links, or large fills.
- **Type.** Three voices. **Lexend** (the brand/logo sans, weight 300 at large
  display) for all headlines ≥28px. **Inter** for all UI and body
  (16/14/12). **JetBrains Mono** for data, ticker labels, stats, badges.
  Tracking is gently negative for a crafted feel but tuned for readability:
  near-neutral on body/caption, modestly tight (~-0.01em) on large display,
  lightly tight (-0.01em) on mono. Type scale: 12 / 14 / 16 / 18 / 28 / 40 / 80.
- **Spacing.** Compact density — **10px** is the signature element gap, 16–24px
  card padding. Breathing room (40–80px) is reserved for section transitions.
  Page max-width 1200px.
- **Backgrounds.** Flat fills only — **no gradients as section backgrounds**.
  The hard, ungradiented cut between dark and light sections *is* the design.
  The only place a glow appears is **imagery** (the abstract hero trading
  visual: floating azure-blue tokens over blue/slate candlestick bars)
  — never as UI chrome.
- **Cards.** Flat, **no drop shadows**. Depth is the tonal step between a bone
  card `#ebebeb` and the white canvas `#ffffff`. Radius 12px (compact) to 24px
  (generous). Dark cards on dark sections get the system's *only* shadow: a 1px
  inset hairline `rgba(255,255,255,0.1) 0 0 0 1px inset`.
- **Borders.** Hairline pebble `#e5e7eb` dividers on light; `rgba(255,255,255,
  0.12)` on dark; obsidian for strong/input outlines and focus.
- **Radii.** 4px small · 8px buttons/inputs/tags · 12–24px cards · **600px**
  full-pill (the hero CTA). Never 0px on buttons, inputs, or cards.
- **Buttons.** Primary = Azure Blue fill, **white** label. The hero CTA is a
  full **pill** with a **mono uppercase** label and a trailing `↗`.
- **Animation.** Restrained. Short fades and ease-out (`cubic-bezier(0.22,0.61,
  0.36,1)`, 120–200ms). **No bounce, no decorative loops.**
- **Hover states.** Light dimming of opacity (controls drop to ~0.7–0.88); on
  cards, a one-step tonal darken (bone → pebble). No glow, no shadow.
- **Press states.** A subtle `scale(0.97)` on buttons. No color flash.
- **Transparency / blur.** Used only for overlays — the connect-wallet scrim
  (`rgba(9,9,11,0.6)` + 4px blur) and consent modal. Never on content surfaces.
- **Imagery vibe.** Dark, abstract financial infrastructure — no people, no
  lifestyle photography, no product screenshots. The hero `TradingVisual`
  component carries it: glowing token orbs over a candlestick field, in either
  the **azure** (current brand) or **ember** (original amber/copper + teal-cyan)
  palette — imagery is the one place chromatic color beyond the single accent is
  allowed. Feature illustrations use the `DataGlyph` component: **diagrammatic
  monochrome line art** (candlesticks, gauges with LONG/SHORT, order books) in
  slate/mist — no fill color.

---

## Iconography

Tokenable has **no icon font and no illustrated icon set** in the source material. Its
icon language is deliberately minimal and typographic:

- **Functional unicode glyphs only**, rendered in the current text color: arrows
  `↗` (launch/external), `→` (proceed), carets `▲ ▼` (price direction), close
  `✕`, menu `☰`, settings `⚙`, and the brand `/` `///` slashes. These read as
  terminal marks, not decoration.
- **Direction is shown by glyph + position, never by a second color** — the
  system has no green, so a rising value uses a blue `▲`, not a green fill.
- **Diagrammatic line art** (not icons) carries product illustration: candlestick
  charts, semicircular execution gauges, and order-book depth bars, drawn in
  `--color-slate` / `--color-mist` stroke work on bone cards. These are built
  from styled `<div>`s in the UI kit (`ui_kits/landing/Features.jsx`), not SVG
  assets.
- **No emoji, ever.**

> If a richer icon set is needed later, the closest free match to this aesthetic
> (thin, geometric, terminal-flavored) is **Lucide** at 1.5px stroke — flag
> before adopting, as it is a substitution, not part of the documented brand.

---

## Index — what's in this system

**Global entry**
- `styles.css` — the one file consumers link; `@import`s every token + font file.

**Tokens** (`tokens/`)
- `fonts.css` — webfont `@import` + commented brand `@font-face` blocks.
- `colors.css` — palette, surfaces, semantic text/action/border aliases.
- `typography.css` — families, weights, type scale, role classes.
- `spacing.css` — spacing scale, radii, elevation, layout, motion.

**Components** (`components/` — namespace `window.GTEDesignSystem_6adae6`)
- `brand/` — **Wordmark** (the TOKENABLE logotype)
- `navigation/` — **Navbar** (logo + menu links + Connect / Launch actions)
- `graphics/` — **TradingVisual** (hero imagery; azure / ember palettes), **DataGlyph** (feature line-art)
- `actions/` — **Button**, **IconButton**
- `data/` — **Tag**, **Badge**, **Stat**
- `surfaces/` — **Card**, **SectionHeading**
- `forms/` — **Input**, **Select**
- `disclosure/` — **Accordion** (FAQ expand/collapse)
- `feedback/` — **ConsentModal**

Each component dir has `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`, and one
`@dsCard` HTML preview.

**Foundation cards** (`guidelines/`) — color, type, spacing/radius/elevation
specimen cards shown in the Design System tab.

**UI kit** (`ui_kits/landing/`) — full interactive Tokenable landing page
(`index.html`) composed from `Nav.jsx`, `Hero.jsx`, `Features.jsx`,
`CTASection.jsx`, `ConnectModal.jsx`. Demonstrates the dark→light→dark rhythm,
the consent overlay, and a connect-wallet flow.

**Skill** — `SKILL.md` makes this folder usable as an Agent Skill.

---

## Using it

```html
<link rel="stylesheet" href="styles.css" />
<script src="_ds_bundle.js"></script>
<script>
  const { Button, SectionHeading, Stat } = window.GTEDesignSystem_6adae6;
</script>
```

All styling is driven by CSS custom properties (`--color-azure`,
`--font-display`, `--radius-pill`, …) — reference tokens, don't hard-code hexes.
