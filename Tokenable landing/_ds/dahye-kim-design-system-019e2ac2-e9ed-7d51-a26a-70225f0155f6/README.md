# Dahye Kim Design System

> Rounded midnight portfolio — a senior designer's gallery cut from achromatic tiles on a soft mist canvas, where 36px rounded corners and a single sans typeface do all the expressive work.

A design system for **Dahye Kim ("Daisy")**, a senior UX/Product Designer whose work focuses on **digital products in complex environments — where systems, constraints, and operational realities shape everyday user experiences.**

The visual language is **achromatic, rounded, and weight-driven**. Mist (#f4f4f5) canvas, Obsidian (#09090b) anchor, no chromatic CTA. 36px rounded cards everywhere. One typeface (Cosmica → DM Sans + Pretendard for Korean) carries the full hierarchy through weight contrast rather than family-switching.

---

## 1. Source Material

| Source | Link | What it gave us |
|---|---|---|
| Live portfolio (Adobe Portfolio) | https://dahyekim-daisy.myportfolio.com/ | Project list, hero copy, content tone, navigation pattern |
| Visual reference | `uploads/DESIGN.md` (Awesomic style) | Achromatic + 36px rounded + single-typeface system direction |

Listed projects (real, pulled from the portfolio):
**TalentX**, **LG Electronics AXPlorer**, **Lotte Tower Tabling Service**, **PMS/RMS**, **AKI | Kiosk Edu for Senior**, **Parking Easy App**, **The CHAIR**, **Writing Tool bar**.

> ⚠️ **The live site uses an Adobe Portfolio template.** This design system is a **deliberate redesign** that preserves the portfolio's *content* (projects, copy, sequencing) but rebuilds the *visual language* — Awesomic-inspired rounded-midnight marketplace aesthetic adapted to a senior designer's portfolio context.

---

## 2. Content Fundamentals

### Voice
- **First person, restrained.** "I design digital products in complex environments." Not "we", not "our team" — this is one designer speaking.
- **Korean-first.** Page-level UI labels, navigation, and project descriptions are in Korean. **English** is used for nav labels (`Work`, `Index`, `Playground`, `Contact`), badges, eyebrows, and project titles — bilingual without translation.
- **Professional, never cute.** No exclamation marks except in the home greeting. No emoji. No filler adjectives.
- **Systems-thinking vocabulary.** Words like *structuring*, *constraints*, *edge cases*, *policies*, *operational realities*, *reliability*. Avoid hype words.

### Casing
- **Project titles**: Title Case in English.
- **Section labels / eyebrows**: prefixed with a small dot (`● Selected Work`, `● 01 — Context`) — wide tracking is **not** used; Cosmica's normal tracking is the deliberate choice.
- **Body Korean**: 자연스러운 문장형, 종결어미는 다이내믹하게.

### Specific copy examples (from the live portfolio)
> *"Nice to see you!"* — home greeting  
> *"Hello, I'm Dahye Kim."* — direct, no titles  
> *"I design digital products in complex environments — where systems, constraints, and operational realities shape everyday user experiences."*  
> *"My work focuses on structuring products so they function reliably in real-world conditions, especially when decisions, policies, and edge cases matter as much as screens."*

### Numbers, metadata, and credits
Compact monospace or weight-contrast notation with em-dash or arrow separators:
- `2024 — Product Design Lead — TalentX`
- `9 → 3d`
- `47 → 12`

### Emoji
**No.** Anywhere.

---

## 3. Visual Foundations

### Palette philosophy
The system is **fully achromatic**. No chromatic CTAs, no accent colors. A 4-step neutral surface stack drives all hierarchy:

| Level | Name | Hex | Role |
|---|---|---|---|
| 1 | Canvas | `#f4f4f5` (Mist) | Page background, default section fill |
| 2 | Card White | `#ffffff` (Snow) | Primary card surface |
| 3 | Card Muted | `#ececee` (Fog) | Secondary card / tag surface |
| 4 | Dark | `#09090b` (Obsidian) | Filled CTA, dark panels, problem-statement bands |

**Emphasis** — when a word needs to stand apart, drop its weight (700 → 300) and switch its color to **Ash** (`#a1a1aa`). This is the "cycling-accent" pattern that replaces what italic + clay used to do.

### Typography
- **One typeface** — Cosmica (paid). **Substituted with DM Sans** as the Latin family, with **Pretendard Variable** as the Korean glyph fallback.
- Weights **300 / 400 / 500 / 600 / 700** carry all hierarchy.
- **Letter-spacing: normal** at body sizes; tightened to roughly **−0.025em → −0.045em** at display sizes for optical correctness.
- No italics (Korean italic is awkward; weight contrast carries the same intent).
- Mono: JetBrains Mono — code and raw tabular data only.

### Spacing & rhythm
- 4px base, compact density. Scale: `4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80, 120`.
- **Section vertical gap: 80px.** Internal card padding: 24–28px (or 48px on hero cards).
- Page max-width: **1200px**, centered on the Mist canvas.

### Corner radii — the system's signature
| Role | Radius |
|---|---|
| Badge / tag | 12px |
| Input | 14px |
| Small button | 16px |
| Card (compact) | 28px |
| **Card (primary) ★** | **36px** |
| Hero / large container | 48–64px |
| Pill (button, nav item) | ∞ (10000px) |

> **Never go below 28px on cards.** Smaller radii break the soft-container language and make surfaces read as generic rectangles.

### Shadows / Elevation
- **No drop shadows on cards.** Depth is expressed through background tone steps (Snow on Mist; Obsidian for inverse), never elevation.
- **Subtle inset hairline** (`rgb(228,228,231) inset 0 1px 0`) optional on white cards for separation.
- **Multi-layer pressed-glass shadow** is reserved for the primary pill button — it gives the CTA a unique tactile quality nothing else has.

### Backgrounds
- **No gradients.** No textures. No grain. The canvas is flat Mist; everything else is flat Snow / Fog / Obsidian.
- Dark panels (`card-dark`) appear once per page for contrast — typically a problem-statement or process-step section.

### Animation
- Default `220ms cubic-bezier(0.2, 0.7, 0.2, 1)` for hover and state changes.
- **Entrance animations** may use the mild overshoot spring `cubic-bezier(0.175, 0.885, 0.32, 1.275)` — reserved for entry only.
- **Animate only transform + opacity.** Never animate color or background.
- Continuous loops (logo strip) run at 40s linear, implying always-on output.

### Hover & press states
- **Pill buttons**: 1px `translateY(-1px)` lift. No color change.
- **Cards / tiles**: 3–4px `translateY` lift. No shadow.
- **Nav items**: background fades to Fog on hover, fills to Obsidian + Snow text when current.
- **Inputs**: 2px Obsidian ring on focus.

### Borders, rules
- Hairline `1px solid #d4d4d8` (Pebble) — used sparingly, mostly on the logo-strip dividers.
- Cards do not have visible borders; their radius and color is the separation.

### Imagery
- **Full-bleed product screenshots** clipped to 36px rounded rectangles. The work IS the image — no lifestyle photography, no human-context staging.
- When no screenshot exists, use one of four achromatic **pattern fills**: grid lines, dot grid, stripes, or solid Obsidian.
- **Forbidden**: drop shadows, tilt, rounded-then-bordered frames, gradient washes.

### Layout rules
- Max-width **1200px**, centered. 12-column grid.
- Hero is **2-column split** at desktop: large display headline left, compact right column with subtext + email input + Primary CTA.
- Horizontal scrolling client/logo strip immediately under hero.
- Subsequent sections alternate: white-card content rows → one dark problem panel → light card stat row → light card CTA.

---

## 4. Iconography

- **System**: [Lucide](https://lucide.dev/) — 1.5px stroke, rounded line caps, 20px in a 40px rounded frame (`border-radius: 16px`).
- Linked from CDN: `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>`
- Icons inherit `currentColor`; default fill is Obsidian on light surfaces, Snow on dark.
- **No emoji.** Anywhere.
- Decorative unicode glyphs (`●`, `—`, `→`, `↗`) are used as **inline markers** — `● Selected Work`, `2024 → 2025`, `LinkedIn ↗`. They sit before eyebrows and inside metadata rows.

---

## 5. Index

```
/
├── README.md                  ← this file
├── SKILL.md                   ← agent-skill manifest
├── colors_and_type.css        ← all tokens (Awesomic-style)
├── fonts/                     ← font notes & substitutions
├── assets/                    ← wordmark, signature SVGs
├── preview/                   ← Design System tab cards
│
├── ui_kits/
│   ├── home/                  ← landing page (hero, logo strip, work grid, dark panel, stats, CTA card)
│   ├── project-index/         ← grid / list views with pill toggle
│   ├── case-study/            ← long-form: hero, rounded cover, 5 chapters, dark process panel, next
│   ├── contact/               ← rounded form card + direct channels grid
│   └── playground/            ← mixed-size rounded card grid
│
└── slides/                    ← 1920×1080 deck (8 layouts)
    └── index.html
```

### Quick links
- **Foundations**: [`colors_and_type.css`](./colors_and_type.css)
- **All preview cards**: [`preview/`](./preview/) — surfaced in the Design System tab
- **UI kits**:
  - [`ui_kits/home/index.html`](./ui_kits/home/index.html)
  - [`ui_kits/project-index/index.html`](./ui_kits/project-index/index.html)
  - [`ui_kits/case-study/index.html`](./ui_kits/case-study/index.html)
  - [`ui_kits/contact/index.html`](./ui_kits/contact/index.html)
  - [`ui_kits/playground/index.html`](./ui_kits/playground/index.html)
- **Slides**: [`slides/index.html`](./slides/index.html)

---

## 6. Font substitutions (please review)

No font files were provided. **Cosmica is paid** — the system substitutes:

| Role | Used | Why | If you have access |
|---|---|---|---|
| All UI / Display / Body (Latin) | **DM Sans** | Closest free match to Cosmica's geometric-grotesque feel | Cosmica, Plus Jakarta Sans |
| Korean fallback | **Pretendard Variable** | Korean-first, excellent Latin too — fills any glyphs DM Sans doesn't cover | SUIT, Spoqa Han Sans Neo |
| Mono | **JetBrains Mono** | Restrained, good tnum | IBM Plex Mono, Berkeley Mono |

To swap, change `--font-cosmica` in `colors_and_type.css` — every component reads through that var.
