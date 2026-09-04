/* @ds-bundle: {"format":3,"namespace":"DahyeKimDesignSystem_019e2a","components":[],"sourceHashes":{"slides/deck-stage.js":"d8d952171670","ui_kits/_shared/components.jsx":"90dc330f6dab","ui_kits/_shared/data.js":"f9a68913fccf","ui_kits/case-study/CaseStudy.jsx":"01495678dade","ui_kits/contact/Contact.jsx":"832b0ffc5f46","ui_kits/home/Home.jsx":"29e466de85cb","ui_kits/playground/Playground.jsx":"f30d7f46c88b","ui_kits/project-index/ProjectIndex.jsx":"a718907e876b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DahyeKimDesignSystem_019e2a = window.DahyeKimDesignSystem_019e2a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// slides/deck-stage.js
try { (() => {
/**
 * <deck-stage> — reusable web component for HTML decks.
 *
 * Handles:
 *  (a) speaker notes — reads <script type="application/json" id="speaker-notes">
 *      and posts {slideIndexChanged: N} to the parent window on nav.
 *  (b) keyboard navigation — ←/→, PgUp/PgDn, Space, Home/End, number keys.
 *  (c) press R to reset to slide 0 (with a tasteful keyboard hint).
 *  (d) bottom-center overlay showing slide count + hints, fades out on idle.
 *  (e) auto-scaling — inner canvas is a fixed design size (default 1920×1080)
 *      scaled with `transform: scale()` to fit the viewport, letterboxed.
 *      Set the `noscale` attribute to render at authored size (1:1) — the
 *      PPTX exporter sets this so its DOM capture sees unscaled geometry.
 *  (f) print — `@media print` lays every slide out as its own page at the
 *      design size, so the browser's Print → Save as PDF produces a clean
 *      one-page-per-slide PDF with no extra setup.
 *  (g) thumbnail rail — resizable left-hand column of per-slide thumbnails
 *      (static clones). Click to navigate; ↑/↓ with a thumbnail focused to
 *      step between slides; drag to reorder; right-click for
 *      Skip / Move up / Move down / Delete (opens a Cancel/Delete confirm
 *      dialog). Drag the rail's right edge to resize; width persists to
 *      localStorage. Skipped slides carry `data-deck-skip`, are dimmed in
 *      the rail, omitted from prev/next navigation, and hidden at print.
 *      The rail is suppressed in presenting mode, in the host's Preview
 *      mode (ViewerMode='none'), on `noscale`, and via the `no-rail`
 *      attribute. Rail mutations dispatch a `deckchange`
 *      CustomEvent on the element: detail = {action, from, to, slide}.
 *
 * Slides are HIDDEN, not unmounted. Non-active slides stay in the DOM with
 * `visibility: hidden` + `opacity: 0`, so their state (videos, iframes,
 * form inputs, React trees) is preserved across navigation.
 *
 * Lifecycle event — the component dispatches a `slidechange` CustomEvent on
 * itself whenever the active slide changes (including the initial mount).
 * The event bubbles and composes out of shadow DOM, so you can listen on
 * the <deck-stage> element or on document:
 *
 *   document.querySelector('deck-stage').addEventListener('slidechange', (e) => {
 *     e.detail.index         // new 0-based index
 *     e.detail.previousIndex // previous index, or -1 on init
 *     e.detail.total         // total slide count
 *     e.detail.slide         // the new active slide element
 *     e.detail.previousSlide // the prior slide element, or null on init
 *     e.detail.reason        // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
 *   });
 *
 * Persistence: none at the deck level. The host app keeps the current slide
 * in its own URL (?slide=) and re-delivers it via location.hash on load, so a
 * bare load with no hash always starts at slide 1.
 *
 * Usage:
 *   <style>deck-stage:not(:defined){visibility:hidden}</style>
 *   <deck-stage width="1920" height="1080">
 *     <section data-label="Title">...</section>
 *     <section data-label="Agenda">...</section>
 *   </deck-stage>
 *   <script src="deck-stage.js"></script>
 *
 * The :not(:defined) rule prevents a flash of the first slide at its
 * authored styles before this script runs and attaches the shadow root.
 *
 * Slides are the direct element children of <deck-stage>. Each slide is
 * automatically tagged with:
 *   - data-screen-label="NN Label"   (1-indexed, for comment flow)
 *   - data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"
 */

(() => {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const OVERLAY_HIDE_MS = 1800;
  const VALIDATE_ATTR = 'no_overflowing_text,no_overlapping_text,slide_sized_text';
  const pad2 = n => String(n).padStart(2, '0');

  // Label precedence: data-label → data-screen-label (number stripped) → first heading → "Slide".
  const getSlideLabel = el => {
    const explicit = el.getAttribute('data-label');
    if (explicit) return explicit;
    const existing = el.getAttribute('data-screen-label');
    if (existing) return existing.replace(/^\s*\d+\s*/, '').trim() || existing;
    const h = el.querySelector('h1, h2, h3, [data-title]');
    const t = h && (h.textContent || '').trim().slice(0, 40);
    if (t) return t;
    return 'Slide';
  };
  const stylesheet = `
    :host {
      position: fixed;
      inset: 0;
      display: block;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      overflow: hidden;
    }
    /* connectedCallback holds this until document.fonts.ready (capped 2s) so
     * the first visible paint has the deck's real typography + final rail
     * layout. opacity (not visibility) so the active slide can't un-hide
     * itself via the ::slotted([data-deck-active]) visibility:visible rule.
     * Only the stage/rail hide — the black :host background stays, so the
     * iframe doesn't flash the page's default white. */
    :host([data-fonts-pending]) .stage,
    :host([data-fonts-pending]) .rail { opacity: 0; pointer-events: none; }

    .stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      transform-origin: center center;
      flex-shrink: 0;
      background: #fff;
      will-change: transform;
    }

    /* Slides live in light DOM (via <slot>) so authored CSS still applies.
       We absolutely position each slotted child to stack them. */
    ::slotted(*) {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    ::slotted([data-deck-active]) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    /* Tap zones for mobile — back/forward thirds like Stories.
       Transparent, no visible UI, don't block the overlay. */
    .tapzones {
      position: fixed;
      inset: 0;
      display: flex;
      z-index: 2147482000;
      pointer-events: none;
    }
    .tapzone {
      flex: 1;
      pointer-events: auto;
      -webkit-tap-highlight-color: transparent;
    }
    /* Only activate tap zones on coarse pointers (touch devices). */
    @media (hover: hover) and (pointer: fine) {
      .tapzones { display: none; }
    }

    .overlay {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translate(-50%, 6px) scale(0.92);
      filter: blur(6px);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: #000;
      color: #fff;
      border-radius: 999px;
      font-size: 12px;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.01em;
      opacity: 0;
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease;
      transform-origin: center bottom;
      z-index: 2147483000;
      user-select: none;
    }
    .overlay[data-visible] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
      filter: blur(0);
    }

    .btn {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: default;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      border-radius: 999px;
      color: rgba(255,255,255,0.72);
      transition: background 140ms ease, color 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }
    .btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .btn:active { background: rgba(255,255,255,0.18); }
    .btn:focus { outline: none; }
    .btn:focus-visible { outline: none; }
    .btn::-moz-focus-inner { border: 0; }
    .btn svg { width: 14px; height: 14px; display: block; }
    .btn.reset {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 0 10px 0 12px;
      gap: 6px;
      color: rgba(255,255,255,0.72);
    }
    .btn.reset .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px;
      line-height: 1;
      color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
    }

    .count {
      font-variant-numeric: tabular-nums;
      color: #fff;
      font-weight: 500;
      padding: 0 8px;
      min-width: 42px;
      text-align: center;
      font-size: 12px;
    }
    .count .sep { color: rgba(255,255,255,0.45); margin: 0 3px; font-weight: 400; }
    .count .total { color: rgba(255,255,255,0.55); }

    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.18);
      margin: 0 2px;
    }

    /* ── Thumbnail rail ──────────────────────────────────────────────────
       Fixed column on the left; each thumbnail is a static deep-clone of
       the light-DOM slide scaled into a 16:9 (or design-aspect) frame. The
       stage re-fits around it (see _fit); hidden during present / noscale
       / print so capture geometry and fullscreen output are unchanged. */
    .rail {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--deck-rail-w, 188px);
      background: #141414;
      border-right: 1px solid rgba(255,255,255,0.08);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 2147482500;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.18) transparent;
    }
    .rail::-webkit-scrollbar { width: 8px; }
    .rail::-webkit-scrollbar-track { background: transparent; margin: 2px; }
    .rail::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.18);
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    .rail::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.28);
      border: 2px solid transparent;
      background-clip: content-box;
    }
    :host([no-rail]) .rail,
    :host([noscale]) .rail { display: none; }
    .rail[data-presenting] { display: none; }
    /* User-driven show/hide (the TweaksPanel toggle) slides instead of
       popping. Transitions are gated on :host([data-rail-anim]) — set only
       for the 200ms around the toggle — so window-resize and rail-width
       drag (which also call _fit) don't lag behind the cursor. */
    .rail[data-user-hidden] { transform: translateX(-100%); }
    :host([data-rail-anim]) .rail { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .stage { transition: left 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .canvas { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    /* transition shorthand replaces rather than merges — repeat the base
       .overlay opacity/transform/filter transitions so visibility changes
       during the 200ms toggle window still fade instead of popping. */
    :host([data-rail-anim]) .overlay {
      transition: margin-left 200ms cubic-bezier(.3,.7,.4,1),
                  opacity 260ms ease,
                  transform 260ms cubic-bezier(.2,.8,.2,1),
                  filter 260ms ease;
    }
    :host([data-rail-anim]) .tapzones { transition: left 200ms cubic-bezier(.3,.7,.4,1); }

    .thumb {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
      user-select: none;
    }
    .thumb .num {
      width: 16px;
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 500;
      text-align: right;
      color: rgba(255,255,255,0.55);
      padding-top: 2px;
      font-variant-numeric: tabular-nums;
    }
    .thumb .frame {
      position: relative;
      flex: 1;
      min-width: 0;
      aspect-ratio: var(--deck-aspect);
      background: #fff;
      border-radius: 4px;
      outline: 2px solid transparent;
      outline-offset: 0;
      overflow: hidden;
      transition: outline-color 120ms ease;
    }
    .thumb:hover .frame { outline-color: rgba(255,255,255,0.25); }
    .thumb { outline: none; }
    .thumb:focus-visible .frame { outline-color: rgba(255,255,255,0.5); }
    .thumb[data-current] .num { color: #fff; }
    .thumb[data-current] .frame { outline-color: #D97757; }
    .thumb[data-dragging] { opacity: 0.35; }
    .thumb::before {
      content: '';
      position: absolute;
      left: 24px;
      right: 0;
      height: 3px;
      border-radius: 2px;
      background: #D97757;
      opacity: 0;
      pointer-events: none;
    }
    .thumb[data-drop="before"]::before { top: -8px; opacity: 1; }
    .thumb[data-drop="after"]::before { bottom: -8px; opacity: 1; }
    .thumb[data-skip] .frame { opacity: 0.35; }
    .thumb[data-skip] .frame::after {
      content: 'Skipped';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.45);
      color: #fff;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    .ctxmenu {
      position: fixed;
      min-width: 150px;
      padding: 4px;
      background: #242424;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 7px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      z-index: 2147483100;
      display: none;
      font-size: 12px;
    }
    .ctxmenu[data-open] { display: block; }
    .ctxmenu button {
      display: block;
      width: 100%;
      appearance: none;
      border: 0;
      background: transparent;
      color: #e8e8e8;
      font: inherit;
      text-align: left;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .ctxmenu button:hover:not(:disabled) { background: rgba(255,255,255,0.08); }
    .ctxmenu button:disabled { opacity: 0.35; cursor: default; }
    .ctxmenu hr {
      border: 0;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 4px 2px;
    }

    .rail-resize {
      position: fixed;
      left: calc(var(--deck-rail-w, 188px) - 3px);
      top: 0;
      bottom: 0;
      width: 6px;
      cursor: col-resize;
      z-index: 2147482600;
      touch-action: none;
    }
    .rail-resize:hover,
    .rail-resize[data-dragging] { background: rgba(255,255,255,0.12); }
    :host([no-rail]) .rail-resize,
    :host([noscale]) .rail-resize,
    .rail[data-presenting] + .rail-resize,
    .rail[data-user-hidden] + .rail-resize { display: none; }

    /* Delete-confirm popup — matches the SPA's ConfirmDialog layout
       (title + message body, depressed footer with Cancel / Delete). */
    .confirm-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 2147483200;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .confirm-backdrop[data-open] { display: flex; }
    .confirm {
      width: 320px;
      max-width: calc(100vw - 32px);
      background: #2a2a2a;
      color: #e8e8e8;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      overflow: hidden;
      font-family: inherit;
      animation: deck-confirm-in 0.18s ease;
    }
    @keyframes deck-confirm-in {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .confirm .body { padding: 20px 20px 16px; }
    .confirm .title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
    .confirm .msg { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.65); }
    .confirm .footer {
      padding: 14px 20px;
      background: #1f1f1f;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .confirm button {
      appearance: none;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
    }
    .confirm .cancel {
      background: transparent;
      border: 0;
      color: rgba(255,255,255,0.8);
    }
    .confirm .cancel:hover { background: rgba(255,255,255,0.08); }
    .confirm .danger {
      background: #c96442;
      border: 1px solid rgba(0,0,0,0.15);
      color: #fff;
      box-shadow: 0 1px 3px rgba(166,50,68,0.3), 0 2px 6px rgba(166,50,68,0.18);
    }
    .confirm .danger:hover { background: #b5563a; }

    /* ── Print: one page per slide, no chrome ────────────────────────────
       The screen layout stacks every slide at inset:0 inside a scaled
       canvas; for print we want them in document flow at the authored
       design size so the browser paginates one slide per sheet. The
       @page size is set from the width/height attributes via the inline
       <style id="deck-stage-print-page"> that connectedCallback injects
       into <head> (the @page at-rule has no effect inside shadow DOM). */
    @media print {
      :host {
        position: static;
        inset: auto;
        background: none;
        overflow: visible;
        color: inherit;
      }
      .stage { position: static; display: block; }
      .canvas {
        transform: none !important;
        width: auto !important;
        height: auto !important;
        background: none;
        will-change: auto;
      }
      ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        width: var(--deck-design-w) !important;
        height: var(--deck-design-h) !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
        overflow: hidden;
      }
      /* :last-child alone isn't enough once data-deck-skip hides the
         trailing slide(s) — the last *visible* slide still carries
         break-after:page and prints a blank sheet. _markLastVisible()
         maintains data-deck-last-visible on the last non-skipped slide. */
      ::slotted(*:last-child),
      ::slotted([data-deck-last-visible]) {
        break-after: auto;
        page-break-after: auto;
      }
      ::slotted([data-deck-skip]) { display: none !important; }
      .overlay, .tapzones, .rail, .rail-resize, .ctxmenu, .confirm-backdrop { display: none !important; }
    }
  `;
  class DeckStage extends HTMLElement {
    static get observedAttributes() {
      return ['width', 'height', 'noscale', 'no-rail'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._index = 0;
      this._slides = [];
      this._notes = [];
      this._hideTimer = null;
      this._mouseIdleTimer = null;
      this._menuIndex = -1;
      this._onKey = this._onKey.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTapBack = this._onTapBack.bind(this);
      this._onTapForward = this._onTapForward.bind(this);
      this._onMessage = this._onMessage.bind(this);
      // Capture-phase close so a click anywhere dismisses the menu, but
      // ignore clicks that land inside the menu itself — otherwise the
      // capture handler runs before the menu's own (bubble) handler and
      // clears _menuIndex out from under it.
      this._onDocClick = e => {
        if (this._menu && e.composedPath && e.composedPath().includes(this._menu)) return;
        this._closeMenu();
      };
    }
    get designWidth() {
      return parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
    }
    get designHeight() {
      return parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;
    }
    connectedCallback() {
      // Presenter-view popup loads deckUrl?_snthumb=...#N for its prev/cur/
      // next thumbnails — the rail has no business rendering inside those
      // (wrong scale, and it offsets the stage so the thumb shows a gutter).
      if (/[?&]_snthumb=/.test(location.search)) this.setAttribute('no-rail', '');
      this._render();
      this._loadNotes();
      this._syncPrintPageRule();
      window.addEventListener('keydown', this._onKey);
      window.addEventListener('resize', this._onResize);
      window.addEventListener('mousemove', this._onMouseMove, {
        passive: true
      });
      window.addEventListener('message', this._onMessage);
      window.addEventListener('click', this._onDocClick, true);
      // Initial collection + layout happens via slotchange, which fires on mount.
      this._enableRail();
      // Hold the stage hidden until webfonts are ready so the first visible
      // paint has the deck's real typography — the :not(:defined) guard in
      // the page HTML only covers custom-element upgrade, not font load.
      // Capped so a 404'd font URL can't blank the deck indefinitely.
      this.setAttribute('data-fonts-pending', '');
      const reveal = () => this.removeAttribute('data-fonts-pending');
      // rAF first: fonts.ready is a pre-resolved promise until layout has
      // resolved the slotted text's font-family and pushed a FontFace into
      // 'loading'. Reading it here in connectedCallback (parse-time) would
      // settle the race in a microtask before any font fetch starts.
      requestAnimationFrame(() => {
        Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 2000))]).then(reveal, reveal);
      });
    }
    _enableRail() {
      // Idempotent — older host builds still post __omelette_rail_enabled.
      // no-rail guard keeps the observers/stylesheet walk off the cheap path
      // for presenter-popup thumbnail iframes (up to 9 per view).
      if (this._railEnabled || this.hasAttribute('no-rail')) return;
      this._railEnabled = true;
      // Per-viewer preference — restored alongside rail width. Default on;
      // only a stored '0' (from the TweaksPanel toggle) hides it.
      this._railVisible = true;
      try {
        if (localStorage.getItem('deck-stage.railVisible') === '0') this._railVisible = false;
      } catch (e) {}
      // Live thumbnail updates: watch the light-DOM slides for content
      // edits and re-clone just the affected thumb(s), debounced. Ignore
      // the data-deck-* / data-screen-label / data-om-validate attributes
      // this component itself writes so nav and skip don't trigger
      // spurious refreshes.
      const OWN_ATTRS = /^data-(deck-|screen-label$|om-validate$)/;
      this._liveDirty = new Set();
      this._liveObserver = new MutationObserver(records => {
        for (const r of records) {
          if (r.type === 'attributes' && OWN_ATTRS.test(r.attributeName || '')) continue;
          let n = r.target;
          while (n && n.parentElement !== this) n = n.parentElement;
          if (n && this._slideSet && this._slideSet.has(n)) this._liveDirty.add(n);
        }
        if (this._liveDirty.size && !this._liveTimer) {
          this._liveTimer = setTimeout(() => {
            this._liveTimer = null;
            this._liveDirty.forEach(s => this._refreshThumb(s));
            this._liveDirty.clear();
          }, 200);
        }
      });
      this._liveObserver.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      // Lazy thumbnail materialization — clone the slide only when its
      // frame scrolls into (or near) the rail viewport. rootMargin gives
      // ~4 thumbs of pre-load so fast scrolling doesn't flash blanks.
      this._railObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting && e.target.__deckThumb) {
            this._materialize(e.target.__deckThumb);
          }
        });
      }, {
        root: this._rail,
        rootMargin: '400px 0px'
      });
      // Tweaks typically change CSS vars / attrs OUTSIDE <deck-stage>
      // (on <html>, <body>, a wrapper div, or a <style> tag), which
      // _liveObserver can't see. Re-snapshot author CSS (constructable
      // sheet is shared by reference, so one replaceSync updates every
      // thumb shadow root) and re-sync each thumb host's attrs + custom
      // properties. In-slide DOM mutations are _liveObserver's job.
      // Debounced so slider drags don't thrash.
      this._onTweakChange = () => {
        clearTimeout(this._tweakTimer);
        this._tweakTimer = setTimeout(() => {
          this._snapshotAuthorCss();
          // One getComputedStyle for the whole batch — each
          // getPropertyValue read below reuses the same computed style
          // as long as nothing invalidates layout between thumbs.
          const cs = getComputedStyle(this);
          (this._thumbs || []).forEach(t => {
            if (t.host) this._syncThumbHostAttrs(t.host, cs);
          });
        }, 120);
      };
      window.addEventListener('tweakchange', this._onTweakChange);
      this._snapshotAuthorCss();
      // Build the rail now that it's enabled — slotchange already fired,
      // so _renderRail's early-return skipped the initial build.
      this._syncRailHidden();
      this._renderRail();
      this._fit();
    }

    /** Snapshot document stylesheets into a constructable sheet that each
     *  thumbnail's nested shadow root adopts — so author CSS styles the
     *  cloned slide content without touching this component's chrome.
     *  Cross-origin sheets throw on .cssRules — skip them. Re-callable:
     *  the existing constructable sheet is reused via replaceSync so every
     *  already-adopted shadow root picks up the fresh CSS without re-adopt. */
    _snapshotAuthorCss() {
      // :root in an adopted sheet inside a shadow root matches nothing
      // (only the document root qualifies), so author rules like
      // `:root[data-voice="modern"] .serif` never reach the clones.
      // Rewrite :root → :host and mirror <html>'s data-*/class/lang onto
      // each thumb host (see _syncThumbHostAttrs) so the same selectors
      // match inside the thumbnail's shadow tree.
      const authorCss = Array.from(document.styleSheets).map(sh => {
        try {
          return Array.from(sh.cssRules).map(r => r.cssText).join('\n');
        } catch (e) {
          return '';
        }
      }).join('\n')
      // The shadow host is featureless outside the functional :host(...)
      // form, so any compound on :root — [attr], .class, #id, :pseudo —
      // must become :host(<compound>) not :host<compound>. Same for the
      // html type selector (Tailwind class-strategy dark mode emits
      // html.dark; Pico uses html[data-theme]), which has nothing to
      // match inside the thumb's shadow tree.
      .replace(/:root((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)/g, ':host($1)').replace(/:root\b/g, ':host').replace(/(^|[\s,>~+(}])html((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)(?![-\w])/g, '$1:host($2)').replace(/(^|[\s,>~+(}])html(?![-\w])/g, '$1:host');
      // Every custom property the author references. _syncThumbHostAttrs
      // mirrors each one's *computed* value at <deck-stage> onto the
      // thumb host so the live value wins over the :host default above
      // regardless of which ancestor the tweak wrote to (<html>, <body>,
      // a wrapper div, or the deck-stage element itself all inherit
      // down to getComputedStyle(this)).
      this._authorVars = new Set(authorCss.match(/--[\w-]+/g) || []);
      try {
        if (!this._adoptedSheet) this._adoptedSheet = new CSSStyleSheet();
        this._adoptedSheet.replaceSync(authorCss);
      } catch (e) {
        this._adoptedSheet = null;
        this._authorCss = authorCss;
      }
    }
    _syncThumbHostAttrs(host, cs) {
      const de = document.documentElement;
      // setAttribute overwrites but can't delete — an attr removed from
      // <html> (toggleAttribute off, classList emptied) would linger on
      // the host and :host([data-*]) / :host(.foo) rules would keep
      // matching. Remove stale mirrored attrs first; iterate backward
      // because removeAttribute mutates the live NamedNodeMap.
      for (let i = host.attributes.length - 1; i >= 0; i--) {
        const n = host.attributes[i].name;
        if ((n.startsWith('data-') || n === 'class' || n === 'lang') && !de.hasAttribute(n)) {
          host.removeAttribute(n);
        }
      }
      for (const a of de.attributes) {
        if (a.name.startsWith('data-') || a.name === 'class' || a.name === 'lang') {
          host.setAttribute(a.name, a.value);
        }
      }
      // The :root→:host rewrite in _snapshotAuthorCss pins each custom
      // property to its stylesheet default on the thumb host, shadowing
      // the live value that would otherwise inherit. Tweaks can write the
      // live value on any ancestor — <html>, <body>, a wrapper div, the
      // deck-stage element — so read it as the *computed* value at
      // <deck-stage> (which sees the whole inheritance chain) rather than
      // trying to guess which element the author wrote to. Inline on the
      // host beats the :host{} rule. remove-stale covers vars dropped
      // from the stylesheet between snapshots.
      const vars = this._authorVars || new Set();
      for (let i = host.style.length - 1; i >= 0; i--) {
        const p = host.style[i];
        if (p.startsWith('--') && !vars.has(p)) host.style.removeProperty(p);
      }
      const live = cs || getComputedStyle(this);
      vars.forEach(p => {
        const v = live.getPropertyValue(p);
        if (v) host.style.setProperty(p, v.trim());else host.style.removeProperty(p);
      });
    }
    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('message', this._onMessage);
      window.removeEventListener('click', this._onDocClick, true);
      if (this._hideTimer) clearTimeout(this._hideTimer);
      if (this._mouseIdleTimer) clearTimeout(this._mouseIdleTimer);
      if (this._liveTimer) clearTimeout(this._liveTimer);
      if (this._tweakTimer) clearTimeout(this._tweakTimer);
      if (this._railAnimTimer) clearTimeout(this._railAnimTimer);
      if (this._scaleRaf) cancelAnimationFrame(this._scaleRaf);
      if (this._liveObserver) this._liveObserver.disconnect();
      if (this._railObserver) this._railObserver.disconnect();
      if (this._onTweakChange) window.removeEventListener('tweakchange', this._onTweakChange);
    }
    attributeChangedCallback() {
      if (this._canvas) {
        this._canvas.style.width = this.designWidth + 'px';
        this._canvas.style.height = this.designHeight + 'px';
        this._canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
        this._canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
        if (this._rail) {
          this._rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
        }
        this._fit();
        this._scaleThumbs();
        this._syncPrintPageRule();
      }
    }
    _render() {
      const style = document.createElement('style');
      style.textContent = stylesheet;
      const stage = document.createElement('div');
      stage.className = 'stage';
      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.width = this.designWidth + 'px';
      canvas.style.height = this.designHeight + 'px';
      canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
      canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
      const slot = document.createElement('slot');
      slot.addEventListener('slotchange', this._onSlotChange);
      canvas.appendChild(slot);
      stage.appendChild(canvas);

      // Tap zones (mobile): left third = back, right third = forward.
      const tapzones = document.createElement('div');
      tapzones.className = 'tapzones export-hidden';
      tapzones.setAttribute('aria-hidden', 'true');
      tapzones.setAttribute('data-noncommentable', '');
      const tzBack = document.createElement('div');
      tzBack.className = 'tapzone tapzone--back';
      const tzMid = document.createElement('div');
      tzMid.className = 'tapzone tapzone--mid';
      tzMid.style.pointerEvents = 'none';
      const tzFwd = document.createElement('div');
      tzFwd.className = 'tapzone tapzone--fwd';
      tzBack.addEventListener('click', this._onTapBack);
      tzFwd.addEventListener('click', this._onTapForward);
      tapzones.append(tzBack, tzMid, tzFwd);

      // Overlay: compact, solid black, with clickable controls.
      const overlay = document.createElement('div');
      overlay.className = 'overlay export-hidden';
      overlay.setAttribute('role', 'toolbar');
      overlay.setAttribute('aria-label', 'Deck controls');
      overlay.setAttribute('data-noncommentable', '');
      overlay.innerHTML = `
        <button class="btn prev" type="button" aria-label="Previous slide" title="Previous (←)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <span class="count" aria-live="polite"><span class="current">1</span><span class="sep">/</span><span class="total">1</span></span>
        <button class="btn next" type="button" aria-label="Next slide" title="Next (→)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
        </button>
        <span class="divider"></span>
        <button class="btn reset" type="button" aria-label="Reset to first slide" title="Reset (R)">Reset<span class="kbd">R</span></button>
      `;
      overlay.querySelector('.prev').addEventListener('click', () => this._advance(-1, 'click'));
      overlay.querySelector('.next').addEventListener('click', () => this._advance(1, 'click'));
      overlay.querySelector('.reset').addEventListener('click', () => this._go(0, 'click'));

      // Thumbnail rail + context menu. Thumbnails are populated in
      // _renderRail() after _collectSlides().
      const rail = document.createElement('div');
      rail.className = 'rail export-hidden';
      rail.setAttribute('data-noncommentable', '');
      rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
      // Edge auto-scroll while dragging a thumb near the rail's top/bottom
      // so off-screen drop targets are reachable. Native dragover fires
      // continuously while the pointer is stationary, so a per-event nudge
      // (ramped by edge proximity) is enough — no rAF loop needed.
      rail.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        const r = rail.getBoundingClientRect();
        const EDGE = 40;
        const dt = e.clientY - r.top;
        const db = r.bottom - e.clientY;
        if (dt < EDGE) rail.scrollTop -= Math.ceil((EDGE - dt) / 3);else if (db < EDGE) rail.scrollTop += Math.ceil((EDGE - db) / 3);
      });
      const menu = document.createElement('div');
      menu.className = 'ctxmenu export-hidden';
      menu.setAttribute('data-noncommentable', '');
      menu.innerHTML = `
        <button type="button" data-act="skip">Skip slide</button>
        <button type="button" data-act="up">Move up</button>
        <button type="button" data-act="down">Move down</button>
        <hr>
        <button type="button" data-act="delete">Delete slide</button>
      `;
      menu.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        const i = this._menuIndex;
        this._closeMenu();
        if (act === 'skip') this._toggleSkip(i);else if (act === 'up') this._moveSlide(i, i - 1);else if (act === 'down') this._moveSlide(i, i + 1);else if (act === 'delete') this._openConfirm(i);
      });
      menu.addEventListener('contextmenu', e => e.preventDefault());

      // Rail resize handle — drag to set --deck-rail-w, persisted to
      // localStorage so the width survives reloads.
      const resize = document.createElement('div');
      resize.className = 'rail-resize export-hidden';
      resize.setAttribute('data-noncommentable', '');
      resize.addEventListener('pointerdown', e => {
        e.preventDefault();
        resize.setPointerCapture(e.pointerId);
        resize.setAttribute('data-dragging', '');
        const move = ev => this._setRailWidth(ev.clientX);
        const up = () => {
          resize.removeEventListener('pointermove', move);
          resize.removeEventListener('pointerup', up);
          resize.removeEventListener('pointercancel', up);
          resize.removeAttribute('data-dragging');
          try {
            localStorage.setItem('deck-stage.railWidth', String(this._railPx));
          } catch (err) {}
        };
        resize.addEventListener('pointermove', move);
        resize.addEventListener('pointerup', up);
        resize.addEventListener('pointercancel', up);
      });

      // Delete-confirm dialog — mirrors the SPA's ConfirmDialog layout.
      const confirm = document.createElement('div');
      confirm.className = 'confirm-backdrop export-hidden';
      confirm.setAttribute('data-noncommentable', '');
      confirm.innerHTML = `
        <div class="confirm" role="dialog" aria-modal="true">
          <div class="body">
            <div class="title">Delete slide?</div>
            <div class="msg">This slide will be removed from the deck.</div>
          </div>
          <div class="footer">
            <button type="button" class="cancel">Cancel</button>
            <button type="button" class="danger">Delete</button>
          </div>
        </div>
      `;
      confirm.addEventListener('click', e => {
        if (e.target === confirm) this._closeConfirm();
      });
      confirm.querySelector('.cancel').addEventListener('click', () => this._closeConfirm());
      confirm.querySelector('.danger').addEventListener('click', () => {
        const i = this._confirmIndex;
        this._closeConfirm();
        this._deleteSlide(i);
      });
      this._root.append(style, rail, resize, stage, tapzones, overlay, menu, confirm);
      this._canvas = canvas;
      this._slot = slot;
      this._overlay = overlay;
      this._tapzones = tapzones;
      this._rail = rail;
      this._resize = resize;
      this._menu = menu;
      this._confirm = confirm;
      this._countEl = overlay.querySelector('.current');
      this._totalEl = overlay.querySelector('.total');

      // Restore persisted rail width.
      let rw = 188;
      try {
        const s = localStorage.getItem('deck-stage.railWidth');
        if (s) rw = parseInt(s, 10) || rw;
      } catch (err) {}
      this._setRailWidth(rw);
      this._syncRailHidden();
    }
    _setRailWidth(px) {
      const w = Math.max(120, Math.min(360, Math.round(px)));
      this._railPx = w;
      this.style.setProperty('--deck-rail-w', w + 'px');
      this._fit();
      // _scaleThumbs forces a sync layout (frame.offsetWidth) then writes
      // N transforms. During a resize drag this runs per-pointermove;
      // coalesce to one per frame.
      if (!this._scaleRaf) {
        this._scaleRaf = requestAnimationFrame(() => {
          this._scaleRaf = null;
          this._scaleThumbs();
        });
      }
    }

    /** @page must live in the document stylesheet — it's a no-op inside
     *  shadow DOM. Inject/update a single <head> style tag so the print
     *  sheet matches the design size and Save-as-PDF yields one slide per
     *  page with no margins. */
    _syncPrintPageRule() {
      const id = 'deck-stage-print-page';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
        document.head.appendChild(tag);
      }
      tag.textContent = '@page { size: ' + this.designWidth + 'px ' + this.designHeight + 'px; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; overflow: visible !important; height: auto !important; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }';
    }
    _onSlotChange() {
      // Rail mutations (delete/move) already reconcile synchronously and
      // emit slidechange with reason 'api'; skip the async slotchange that
      // would otherwise re-broadcast with reason 'init'.
      if (this._squelchSlotChange) {
        this._squelchSlotChange = false;
        return;
      }
      this._collectSlides();
      this._restoreIndex();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'init'
      });
      this._fit();
    }
    _collectSlides() {
      const assigned = this._slot.assignedElements({
        flatten: true
      });
      this._slides = assigned.filter(el => {
        // Skip template/style/script nodes even if someone slots them.
        const tag = el.tagName;
        return tag !== 'TEMPLATE' && tag !== 'SCRIPT' && tag !== 'STYLE';
      });
      this._slideSet = new Set(this._slides);
      this._slides.forEach((slide, i) => {
        const n = i + 1;
        slide.setAttribute('data-screen-label', `${pad2(n)} ${getSlideLabel(slide)}`);

        // Validation attribute for comment flow / auto-checks.
        if (!slide.hasAttribute('data-om-validate')) {
          slide.setAttribute('data-om-validate', VALIDATE_ATTR);
        }
        slide.setAttribute('data-deck-slide', String(i));
      });
      if (this._totalEl) this._totalEl.textContent = String(this._slides.length || 1);
      if (this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
      this._markLastVisible();
      this._renderRail();
    }

    /** Tag the last non-skipped slide so print CSS can drop its
     *  break-after (see the @media print comment above — :last-child
     *  alone matches a hidden skipped slide). */
    _markLastVisible() {
      let last = null;
      this._slides.forEach(s => {
        s.removeAttribute('data-deck-last-visible');
        if (!s.hasAttribute('data-deck-skip')) last = s;
      });
      if (last) last.setAttribute('data-deck-last-visible', '');
    }
    _loadNotes() {
      const tag = document.getElementById('speaker-notes');
      if (!tag) {
        this._notes = [];
        return;
      }
      try {
        const parsed = JSON.parse(tag.textContent || '[]');
        if (Array.isArray(parsed)) this._notes = parsed;
      } catch (e) {
        console.warn('[deck-stage] Failed to parse #speaker-notes JSON:', e);
        this._notes = [];
      }
    }
    _restoreIndex() {
      // The host's ?slide= param is delivered as a #<int> hash (1-indexed) on
      // the iframe src. No hash → slide 1; the deck itself keeps no position
      // state across loads.
      const h = (location.hash || '').match(/^#(\d+)$/);
      if (h) {
        const n = parseInt(h[1], 10) - 1;
        if (n >= 0 && n < this._slides.length) this._index = n;
      }
    }
    _applyIndex({
      showOverlay = true,
      broadcast = true,
      reason = 'init'
    } = {}) {
      if (!this._slides.length) return;
      const prev = this._prevIndex == null ? -1 : this._prevIndex;
      const curr = this._index;
      // Keep the iframe's own hash in sync so an in-iframe location.reload()
      // (reload banner path in viewer-handle.ts) lands on the current slide,
      // not the stale deep-link hash from initial load.
      try {
        history.replaceState(null, '', '#' + (curr + 1));
      } catch (e) {}
      this._slides.forEach((s, i) => {
        if (i === curr) s.setAttribute('data-deck-active', '');else s.removeAttribute('data-deck-active');
      });
      if (this._countEl) this._countEl.textContent = String(curr + 1);
      // Follow-scroll on every navigation (init deep-link, keyboard, click,
      // tap, external goTo) — the only time we *don't* want the rail to
      // track current is after a rail-internal mutation, where _renderRail
      // has already restored the user's scroll position and yanking back to
      // current would undo it.
      this._syncRail(reason !== 'mutation');
      if (broadcast) {
        // (1) Legacy: host-window postMessage for speaker-notes renderers.
        try {
          window.postMessage({
            slideIndexChanged: curr,
            deckTotal: this._slides.length,
            deckSkipped: this._skippedIndices()
          }, '*');
        } catch (e) {}

        // (2) In-page CustomEvent on the <deck-stage> element itself.
        //     Bubbles and composes out of shadow DOM so slide code can listen:
        //       document.querySelector('deck-stage').addEventListener('slidechange', e => {
        //         e.detail.index, e.detail.previousIndex, e.detail.total, e.detail.slide, e.detail.reason
        //       });
        const detail = {
          index: curr,
          previousIndex: prev,
          total: this._slides.length,
          slide: this._slides[curr] || null,
          previousSlide: prev >= 0 ? this._slides[prev] || null : null,
          reason: reason // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
        };
        this.dispatchEvent(new CustomEvent('slidechange', {
          detail,
          bubbles: true,
          composed: true
        }));
      }
      this._prevIndex = curr;
      if (showOverlay) this._flashOverlay();
    }
    _flashOverlay() {
      // Host posts __omelette_presenting while in fullscreen/tab presentation
      // mode — suppress the nav footer entirely (both hover and slide-change
      // flash) so the audience sees clean slides.
      if (!this._overlay || this._presenting) return;
      this._overlay.setAttribute('data-visible', '');
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => {
        this._overlay.removeAttribute('data-visible');
      }, OVERLAY_HIDE_MS);
    }
    _railWidth() {
      // State-based, no offsetWidth: the first _fit() can run before the
      // rail has had layout on some load paths, and a 0 there paints the
      // slide full-width for one frame before the post-slotchange _fit()
      // corrects it.
      if (!this._railEnabled || !this._railVisible || this.hasAttribute('no-rail') || this.hasAttribute('noscale') || this._presenting || this._previewMode) return 0;
      return this._railPx || 0;
    }
    _fit() {
      if (!this._canvas) return;
      const stage = this._canvas.parentElement;
      // PPTX export sets noscale so the DOM capture sees authored-size
      // geometry — the scaled canvas is in shadow DOM, so the exporter's
      // resetTransformSelector can't reach .canvas.style.transform directly.
      if (this.hasAttribute('noscale')) {
        this._canvas.style.transform = 'none';
        if (stage) stage.style.left = '0';
        if (this._overlay) this._overlay.style.marginLeft = '0';
        if (this._tapzones) this._tapzones.style.left = '0';
        return;
      }
      const rw = this._railWidth();
      if (stage) stage.style.left = rw + 'px';
      // Overlay is centred on the viewport via left:50% + translate(-50%);
      // marginLeft shifts the centre by rw/2 so it lands in the middle of
      // the [rw, innerWidth] stage region. Tapzones just inset from rw.
      if (this._overlay) this._overlay.style.marginLeft = rw / 2 + 'px';
      if (this._tapzones) this._tapzones.style.left = rw + 'px';
      const vw = window.innerWidth - rw;
      const vh = window.innerHeight;
      const s = Math.min(vw / this.designWidth, vh / this.designHeight);
      this._canvas.style.transform = `scale(${s})`;
    }
    _onResize() {
      this._fit();
    }
    _onMouseMove() {
      // Keep overlay visible while mouse moves; hide after idle.
      this._flashOverlay();
    }
    _onMessage(e) {
      const d = e.data;
      if (d && typeof d.__omelette_presenting === 'boolean') {
        this._presenting = d.__omelette_presenting;
        if (this._presenting && this._overlay) {
          this._overlay.removeAttribute('data-visible');
          if (this._hideTimer) clearTimeout(this._hideTimer);
        }
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Host's Preview segment (ViewerMode='none'): the rail's drag-reorder /
      // right-click skip-delete affordances are editing chrome, so hide it
      // while the user is just looking at the deck. Same hard-hide path as
      // presenting; independent of the user's _railVisible preference so
      // returning to Edit restores whatever they had.
      if (d && typeof d.__omelette_preview_mode === 'boolean') {
        if (d.__omelette_preview_mode === this._previewMode) return;
        this._previewMode = d.__omelette_preview_mode;
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Per-viewer show/hide, driven by the TweaksPanel's auto-injected
      // "Thumbnail rail" toggle (or any author script). Independent of
      // whether the Tweaks panel itself is open — closing the panel
      // doesn't change rail visibility. Persists alongside rail width.
      if (d && d.type === '__deck_rail_visible' && typeof d.on === 'boolean') {
        if (d.on === this._railVisible) return;
        this._railVisible = d.on;
        try {
          localStorage.setItem('deck-stage.railVisible', d.on ? '1' : '0');
        } catch (e) {}
        // Arm the transition, commit it, then flip state — otherwise the
        // browser coalesces both writes and nothing animates on show.
        this.setAttribute('data-rail-anim', '');
        void (this._rail && this._rail.offsetHeight);
        this._syncRailHidden();
        this._fit();
        this._scaleThumbs();
        clearTimeout(this._railAnimTimer);
        this._railAnimTimer = setTimeout(() => this.removeAttribute('data-rail-anim'), 220);
      }
      if (d && d.type === '__omelette_rail_enabled') this._enableRail();
    }
    _syncRailHidden() {
      if (!this._rail) return;
      // data-presenting is the hard hide (display:none) for flag-off,
      // presentation mode, and the host's Preview segment — instant, no
      // transition. data-user-hidden is the soft hide (translateX(-100%))
      // for the viewer's rail toggle, so show/hide slides under
      // :host([data-rail-anim]).
      const hard = !this._railEnabled || this._presenting || this._previewMode;
      if (hard) this._rail.setAttribute('data-presenting', '');else this._rail.removeAttribute('data-presenting');
      if (!this._railVisible) this._rail.setAttribute('data-user-hidden', '');else this._rail.removeAttribute('data-user-hidden');
      // translateX hide leaves thumbs (tabIndex=0) in the tab order —
      // inert keeps them unfocusable while the rail is off-screen.
      this._rail.inert = hard || !this._railVisible;
    }
    _onTapBack(e) {
      e.preventDefault();
      this._advance(-1, 'tap');
    }
    _onTapForward(e) {
      e.preventDefault();
      this._advance(1, 'tap');
    }
    _onKey(e) {
      // Ignore when the user is typing.
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      // Confirm dialog swallows nav keys while open; Escape cancels. Enter
      // is left to the focused button's native activation so Tab→Cancel
      // →Enter activates Cancel, not the window-level confirm path.
      if (this._confirm && this._confirm.hasAttribute('data-open')) {
        if (e.key === 'Escape') {
          this._closeConfirm();
          e.preventDefault();
        }
        return;
      }
      if (e.key === 'Escape' && this._menu && this._menu.hasAttribute('data-open')) {
        this._closeMenu();
        e.preventDefault();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;
      let handled = true;
      if (key === 'ArrowRight' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
        this._advance(1, 'keyboard');
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        this._advance(-1, 'keyboard');
      } else if (key === 'Home') {
        this._go(0, 'keyboard');
      } else if (key === 'End') {
        this._go(this._slides.length - 1, 'keyboard');
      } else if (key === 'r' || key === 'R') {
        this._go(0, 'keyboard');
      } else if (/^[0-9]$/.test(key)) {
        // 1..9 jump to that slide; 0 jumps to 10.
        const n = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (n < this._slides.length) this._go(n, 'keyboard');
      } else {
        handled = false;
      }
      if (handled) {
        e.preventDefault();
        this._flashOverlay();
      }
    }
    _go(i, reason = 'api') {
      if (!this._slides.length) return;
      const clamped = Math.max(0, Math.min(this._slides.length - 1, i));
      if (clamped === this._index) {
        this._flashOverlay();
        return;
      }
      this._index = clamped;
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason
      });
    }

    /** Step forward/back skipping any slide marked data-deck-skip. Falls
     *  back to _go's clamp-at-ends behaviour (flash overlay) when there's
     *  nothing further in that direction. */
    _advance(dir, reason) {
      if (!this._slides.length) return;
      let i = this._index + dir;
      while (i >= 0 && i < this._slides.length && this._slides[i].hasAttribute('data-deck-skip')) {
        i += dir;
      }
      if (i < 0 || i >= this._slides.length) {
        this._flashOverlay();
        return;
      }
      this._go(i, reason);
    }

    // ── Thumbnail rail ────────────────────────────────────────────────────
    //
    // Thumbs are keyed by slide element and reused across _renderRail()
    // calls, so a reorder/delete is an O(changed) DOM shuffle instead of an
    // O(N) teardown-and-re-clone. Each thumb starts as a lightweight shell
    // (num + empty frame); the clone is materialized lazily by an
    // IntersectionObserver when the frame scrolls into (or near) view, so
    // only visible-ish slides pay the clone + image-decode cost.

    _renderRail() {
      if (!this._rail || !this._railEnabled) {
        this._thumbs = [];
        return;
      }
      // FLIP: record each *materialized* thumb's top before the reconcile.
      // Off-screen (non-materialized) thumbs don't need the animation and
      // skipping their getBoundingClientRect saves a forced layout per
      // off-screen thumb on large decks.
      const prevTops = new Map();
      (this._thumbs || []).forEach(({
        thumb,
        slide,
        host
      }) => {
        if (host) prevTops.set(slide, thumb.getBoundingClientRect().top);
      });
      const st = this._rail.scrollTop;

      // Reconcile: reuse thumbs that already exist for a slide, create
      // shells for new slides, drop thumbs for removed slides.
      const bySlide = new Map();
      (this._thumbs || []).forEach(t => bySlide.set(t.slide, t));
      const next = [];
      this._slides.forEach(slide => {
        let t = bySlide.get(slide);
        if (t) bySlide.delete(slide);else t = this._makeThumb(slide);
        next.push(t);
      });
      // Orphans — slides removed since last render.
      bySlide.forEach(t => {
        if (this._railObserver) this._railObserver.unobserve(t.frame);
        t.thumb.remove();
      });
      // Put thumbs into document order to match _slides. insertBefore on
      // an already-correctly-placed node is a no-op, so this is cheap
      // when nothing moved.
      next.forEach((t, i) => {
        const want = t.thumb;
        const at = this._rail.children[i];
        if (at !== want) this._rail.insertBefore(want, at || null);
        t.i = i;
        t.num.textContent = String(i + 1);
        if (t.slide.hasAttribute('data-deck-skip')) t.thumb.setAttribute('data-skip', '');else t.thumb.removeAttribute('data-skip');
      });
      this._thumbs = next;
      this._rail.scrollTop = st;
      if (prevTops.size) {
        const moved = [];
        this._thumbs.forEach(({
          thumb,
          slide
        }) => {
          const old = prevTops.get(slide);
          if (old == null) return;
          const dy = old - thumb.getBoundingClientRect().top;
          if (Math.abs(dy) < 1) return;
          thumb.style.transition = 'none';
          thumb.style.transform = `translateY(${dy}px)`;
          moved.push(thumb);
        });
        if (moved.length) {
          // Commit the inverted positions before flipping the transition
          // on — otherwise the browser coalesces both style writes and
          // nothing animates.
          void this._rail.offsetHeight;
          moved.forEach(t => {
            t.style.transition = 'transform 180ms cubic-bezier(.2,.7,.3,1)';
            t.style.transform = '';
          });
          setTimeout(() => moved.forEach(t => {
            t.style.transition = '';
          }), 220);
        }
      }
      requestAnimationFrame(() => this._scaleThumbs());
      this._syncRail(false);
    }

    /** Create a lightweight thumb shell for one slide. The clone is
     *  materialized later by the IntersectionObserver. Event handlers
     *  look up the thumb's *current* index (via _thumbs.indexOf) so the
     *  same element can be reused across reorders. */
    _makeThumb(slide) {
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      thumb.tabIndex = 0;
      const num = document.createElement('div');
      num.className = 'num';
      const frame = document.createElement('div');
      frame.className = 'frame';
      thumb.append(num, frame);
      const entry = {
        thumb,
        num,
        frame,
        slide,
        clone: null,
        host: null,
        i: -1
      };
      // entry.i is refreshed on every _renderRail reconcile pass, so
      // handlers read the thumb's current position without an O(N) scan.
      const idx = () => entry.i;
      thumb.addEventListener('click', () => this._go(idx(), 'click'));
      // ↑/↓ step through the rail when a thumb has focus. _go clamps at the
      // ends and _applyIndex→_syncRail scrolls the new current thumb into
      // view; we move focus to it (preventScroll — _syncRail already
      // scrolled) so a held key walks the whole list. stopPropagation keeps
      // this out of the window-level _onKey nav handler.
      thumb.addEventListener('keydown', e => {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        e.preventDefault();
        e.stopPropagation();
        this._go(idx() + (e.key === 'ArrowDown' ? 1 : -1), 'keyboard');
        const cur = this._thumbs && this._thumbs[this._index];
        if (cur) cur.thumb.focus({
          preventScroll: true
        });
      });
      thumb.addEventListener('contextmenu', e => {
        e.preventDefault();
        this._openMenu(idx(), e.clientX, e.clientY);
      });
      thumb.draggable = true;
      thumb.addEventListener('dragstart', e => {
        this._dragFrom = idx();
        thumb.setAttribute('data-dragging', '');
        e.dataTransfer.effectAllowed = 'move';
        try {
          e.dataTransfer.setData('text/plain', String(this._dragFrom));
        } catch (err) {}
      });
      thumb.addEventListener('dragend', () => {
        thumb.removeAttribute('data-dragging');
        this._clearDrop();
        this._dragFrom = null;
      });
      thumb.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const r = thumb.getBoundingClientRect();
        this._setDrop(idx(), e.clientY < r.top + r.height / 2 ? 'before' : 'after');
      });
      thumb.addEventListener('drop', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        const i = idx();
        const r = thumb.getBoundingClientRect();
        let to = e.clientY >= r.top + r.height / 2 ? i + 1 : i;
        if (this._dragFrom < to) to--;
        const from = this._dragFrom;
        this._clearDrop();
        this._dragFrom = null;
        if (to !== from) this._moveSlide(from, to);
      });
      if (this._railObserver) this._railObserver.observe(frame);
      frame.__deckThumb = entry;
      return entry;
    }

    /** Lazily build the clone for a thumb that has scrolled into view. */
    _materialize(entry) {
      if (entry.host) return;
      const dw = this.designWidth,
        dh = this.designHeight;
      let clone = entry.slide.cloneNode(true);
      clone.removeAttribute('id');
      clone.removeAttribute('data-deck-active');
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      // Neuter heavy media; replace <video> with its poster so the box
      // keeps a visual. <iframe>/<audio> become empty placeholders.
      clone.querySelectorAll('iframe, audio, object, embed').forEach(el => {
        el.removeAttribute('src');
        el.removeAttribute('srcdoc');
        el.removeAttribute('data');
        el.innerHTML = '';
      });
      clone.querySelectorAll('video').forEach(el => {
        if (!el.poster) {
          el.removeAttribute('src');
          el.innerHTML = '';
          return;
        }
        const img = document.createElement('img');
        img.src = el.poster;
        img.alt = '';
        img.style.cssText = el.style.cssText + ';object-fit:cover;width:100%;height:100%;';
        img.className = el.className;
        el.replaceWith(img);
      });
      // Images: defer decode and let the browser pick the smallest
      // srcset candidate for the ~140px thumb. Same-URL clones reuse the
      // slide's decoded bitmap (URL-keyed cache), so the remaining cost
      // is paint/composite — lazy+async keeps that off the main thread.
      clone.querySelectorAll('img').forEach(el => {
        el.loading = 'lazy';
        el.decoding = 'async';
        if (el.srcset) el.sizes = (this._railPx || 188) + 'px';
      });
      // Custom elements inside the slide would have their
      // connectedCallback fire when the clone is appended. Replace them
      // with inert boxes so a component-heavy deck doesn't run N copies
      // of each component's mount logic in the rail. Children are
      // preserved so layout-wrapper elements (<my-column><h2>…</h2>)
      // still show their authored content; the querySelectorAll NodeList
      // is static, so nested custom elements in the moved subtree are
      // still visited on later iterations.
      const neuter = el => {
        const box = document.createElement('div');
        box.style.cssText = (el.getAttribute('style') || '') + ';background:rgba(0,0,0,0.06);border:1px dashed rgba(0,0,0,0.15);';
        box.className = el.className;
        // Preserve theming/i18n hooks so [data-*] / :lang() / [dir]
        // descendant selectors still match the neutered root.
        for (const a of el.attributes) {
          const n = a.name;
          if (n.startsWith('data-') || n.startsWith('aria-') || n === 'lang' || n === 'dir' || n === 'role' || n === 'title') {
            box.setAttribute(n, a.value);
          }
        }
        while (el.firstChild) box.appendChild(el.firstChild);
        return box;
      };
      // querySelectorAll('*') returns descendants only — a custom-element
      // slide root (<my-slide>…</my-slide>) would slip through and upgrade
      // on append. Swap the root first.
      if (clone.tagName.includes('-')) clone = neuter(clone);
      clone.querySelectorAll('*').forEach(el => {
        if (el.tagName.includes('-')) el.replaceWith(neuter(el));
      });
      clone.style.cssText += ';position:absolute;top:0;left:0;transform-origin:0 0;' + 'pointer-events:none;width:' + dw + 'px;height:' + dh + 'px;' + 'box-sizing:border-box;overflow:hidden;visibility:visible;opacity:1;';
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute;inset:0;';
      this._syncThumbHostAttrs(host);
      const sr = host.attachShadow({
        mode: 'open'
      });
      if (this._adoptedSheet) sr.adoptedStyleSheets = [this._adoptedSheet];else {
        const st = document.createElement('style');
        st.textContent = this._authorCss || '';
        sr.appendChild(st);
      }
      sr.appendChild(clone);
      entry.frame.appendChild(host);
      entry.host = host;
      entry.clone = clone;
      if (this._thumbScale) clone.style.transform = 'scale(' + this._thumbScale + ')';
      // Once materialized the IO callback is a no-op early-return —
      // unobserve so scroll doesn't keep firing it.
      if (this._railObserver) this._railObserver.unobserve(entry.frame);
    }

    /** Re-clone a single thumb (live-update path). No-op if the thumb
     *  hasn't been materialized yet — it'll pick up current content when
     *  it scrolls into view. */
    _refreshThumb(slide) {
      const entry = (this._thumbs || []).find(t => t.slide === slide);
      if (!entry || !entry.host) return;
      entry.host.remove();
      entry.host = entry.clone = null;
      this._materialize(entry);
    }
    _scaleThumbs() {
      if (!this._thumbs || !this._thumbs.length) return;
      // Every frame is the same width; if it reads 0 the rail is
      // display:none (noscale / no-rail / presenting / print) — leave the
      // clones as-is and re-run when the rail is revealed.
      const fw = this._thumbs[0].frame.offsetWidth;
      if (!fw) return;
      this._thumbScale = fw / this.designWidth;
      this._thumbs.forEach(({
        clone
      }) => {
        if (clone) clone.style.transform = 'scale(' + this._thumbScale + ')';
      });
    }
    _setDrop(i, where) {
      // dragover fires at pointer-event rate; touch only the previous
      // and new target rather than sweeping all N thumbs.
      const t = this._thumbs && this._thumbs[i];
      if (this._dropOn && this._dropOn !== t) {
        this._dropOn.thumb.removeAttribute('data-drop');
      }
      if (t) t.thumb.setAttribute('data-drop', where);
      this._dropOn = t || null;
    }
    _clearDrop() {
      if (this._dropOn) this._dropOn.thumb.removeAttribute('data-drop');
      this._dropOn = null;
    }
    _syncRail(follow) {
      if (!this._thumbs) return;
      this._thumbs.forEach(({
        thumb
      }, i) => {
        if (i === this._index) {
          thumb.setAttribute('data-current', '');
          if (follow && typeof thumb.scrollIntoView === 'function') {
            thumb.scrollIntoView({
              block: 'nearest'
            });
          }
        } else {
          thumb.removeAttribute('data-current');
        }
      });
    }
    _openMenu(i, x, y) {
      if (!this._menu) return;
      this._menuIndex = i;
      const slide = this._slides[i];
      const skip = slide && slide.hasAttribute('data-deck-skip');
      this._menu.querySelector('[data-act="skip"]').textContent = skip ? 'Unskip slide' : 'Skip slide';
      this._menu.querySelector('[data-act="up"]').disabled = i <= 0;
      this._menu.querySelector('[data-act="down"]').disabled = i >= this._slides.length - 1;
      this._menu.querySelector('[data-act="delete"]').disabled = this._slides.length <= 1;
      // Place, then clamp to viewport after it's measurable.
      this._menu.style.left = x + 'px';
      this._menu.style.top = y + 'px';
      this._menu.setAttribute('data-open', '');
      const r = this._menu.getBoundingClientRect();
      const nx = Math.min(x, window.innerWidth - r.width - 4);
      const ny = Math.min(y, window.innerHeight - r.height - 4);
      this._menu.style.left = Math.max(4, nx) + 'px';
      this._menu.style.top = Math.max(4, ny) + 'px';
    }
    _closeMenu() {
      if (this._menu) this._menu.removeAttribute('data-open');
      this._menuIndex = -1;
    }
    _openConfirm(i) {
      if (!this._confirm) return;
      this._confirmIndex = i;
      this._confirm.querySelector('.title').textContent = 'Delete slide ' + (i + 1) + '?';
      this._confirm.setAttribute('data-open', '');
      const btn = this._confirm.querySelector('.danger');
      if (btn && btn.focus) btn.focus();
    }
    _closeConfirm() {
      if (this._confirm) this._confirm.removeAttribute('data-open');
      this._confirmIndex = -1;
    }
    _emitDeckChange(detail) {
      this.dispatchEvent(new CustomEvent('deckchange', {
        detail,
        bubbles: true,
        composed: true
      }));
    }
    _deleteSlide(i) {
      const slide = this._slides[i];
      if (!slide || this._slides.length <= 1) return;
      const wasCurrent = i === this._index;
      if (i < this._index || wasCurrent && i === this._slides.length - 1) this._index--;
      this._squelchSlotChange = true;
      slide.remove();
      this._emitDeckChange({
        action: 'delete',
        from: i,
        slide
      });
      this._collectSlides();
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason: 'mutation'
      });
    }
    _toggleSkip(i) {
      const slide = this._slides[i];
      if (!slide) return;
      const on = !slide.hasAttribute('data-deck-skip');
      if (on) slide.setAttribute('data-deck-skip', '');else slide.removeAttribute('data-deck-skip');
      if (this._thumbs && this._thumbs[i]) {
        if (on) this._thumbs[i].thumb.setAttribute('data-skip', '');else this._thumbs[i].thumb.removeAttribute('data-skip');
      }
      this._markLastVisible();
      this._emitDeckChange({
        action: on ? 'skip' : 'unskip',
        from: i,
        slide
      });
      // Re-broadcast so the presenter popup's prev/next thumbnails re-pick
      // the nearest non-skipped slide without waiting for a nav event.
      try {
        window.postMessage({
          slideIndexChanged: this._index,
          deckTotal: this._slides.length,
          deckSkipped: this._skippedIndices()
        }, '*');
      } catch (e) {}
    }
    _skippedIndices() {
      const out = [];
      for (let i = 0; i < this._slides.length; i++) {
        if (this._slides[i].hasAttribute('data-deck-skip')) out.push(i);
      }
      return out;
    }
    _moveSlide(i, j) {
      if (j < 0 || j >= this._slides.length || j === i) return;
      const slide = this._slides[i];
      const ref = j < i ? this._slides[j] : this._slides[j].nextSibling;
      // Track the active slide across the reorder so the same content
      // stays on screen.
      const cur = this._index;
      if (cur === i) this._index = j;else if (i < cur && j >= cur) this._index = cur - 1;else if (i > cur && j <= cur) this._index = cur + 1;
      this._squelchSlotChange = true;
      this.insertBefore(slide, ref);
      this._emitDeckChange({
        action: 'move',
        from: i,
        to: j,
        slide
      });
      this._collectSlides();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'mutation'
      });
    }

    // Public API ------------------------------------------------------------

    /** Current slide index (0-based). */
    get index() {
      return this._index;
    }
    /** Total slide count. */
    get length() {
      return this._slides.length;
    }
    /** Programmatically navigate. */
    goTo(i) {
      this._go(i, 'api');
    }
    next() {
      this._advance(1, 'api');
    }
    prev() {
      this._advance(-1, 'api');
    }
    reset() {
      this._go(0, 'api');
    }
  }
  if (!customElements.get('deck-stage')) {
    customElements.define('deck-stage', DeckStage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/deck-stage.js", error: String((e && e.message) || e) }); }

// ui_kits/_shared/components.jsx
try { (() => {
/* ============================================================
   Shared components — v2 Awesomic-style.
   ============================================================ */

const {
  useState,
  useEffect
} = React;
function Nav({
  current,
  onNav
}) {
  const items = [{
    id: "home",
    label: "Work"
  }, {
    id: "index",
    label: "Index"
  }, {
    id: "playground",
    label: "Playground"
  }, {
    id: "contact",
    label: "Contact"
  }];
  return /*#__PURE__*/React.createElement("header", {
    className: "app-nav"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "brand",
    onClick: e => {
      e.preventDefault();
      onNav && onNav("home");
    }
  }, "Dahye ", /*#__PURE__*/React.createElement("span", {
    className: "it"
  }, "Kim")), /*#__PURE__*/React.createElement("nav", null, items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.id,
    href: "#",
    className: current === it.id ? "cur" : "",
    onClick: e => {
      e.preventDefault();
      onNav && onNav(it.id);
    }
  }, it.label))), /*#__PURE__*/React.createElement("div", {
    className: "right"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => onNav && onNav("contact")
  }, "Book a call")));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "app-footer container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand-lg"
  }, "Dahye ", /*#__PURE__*/React.createElement("span", {
    className: "it"
  }, "Kim")), /*#__PURE__*/React.createElement("div", {
    className: "links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "mailto:hello@dahyekim.co"
  }, "hello@dahyekim.co"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "LinkedIn"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Are.na"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Resume \u2014 PDF"), /*#__PURE__*/React.createElement("span", {
    className: "copy"
  }, "\xA9 2025 \u2014 Dahye Kim \xB7 Seoul")));
}
function Eyebrow({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), children);
}

/* Fill recipe map for project tiles — chosen at data time. */
const FILL_MAP = {
  warm: "fill-obsidian",
  stone: "fill-dot",
  ink: "fill-grid",
  clay: "fill-stripes"
};
function ProjectTile({
  project,
  onOpen
}) {
  const fill = FILL_MAP[project.cover] || "fill-obsidian";
  return /*#__PURE__*/React.createElement("a", {
    className: "proj-tile",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onOpen && onOpen(project.slug);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `fill ${fill}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "label-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "badges"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge-overlay"
  }, project.year), project.tags && project.tags.slice(0, 2).map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "badge badge-overlay"
  }, t))), /*#__PURE__*/React.createElement("span", {
    className: "title"
  }, project.title)));
}
Object.assign(window, {
  Nav,
  Footer,
  Eyebrow,
  ProjectTile,
  FILL_MAP
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/_shared/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/_shared/data.js
try { (() => {
// Shared project data — used across all UI kits.
// Pulled from https://dahyekim-daisy.myportfolio.com/ project list.
window.PROJECTS = [{
  slug: "talent-x",
  title: "TalentX",
  year: "2024",
  role: "Product Design Lead",
  client: "HR SaaS",
  summary: "복잡한 HR 운영 환경에서 의사결정과 정책이 화면을 형성하는 구조 설계.",
  summaryEn: "Structuring an HR product so decisions and policies shape the screens.",
  cover: "warm",
  tags: ["Product Design", "Systems", "B2B"],
  featured: true
}, {
  slug: "lge-axplorer",
  title: "LG Electronics AXPlorer",
  year: "2025",
  role: "Senior UX Designer",
  client: "LG Electronics",
  summary: "AI 기반 분석 환경의 워크플로 재정의 — 데이터, 사용자, 정책의 교차점.",
  summaryEn: "Redefining workflows for an AI-led analytics environment.",
  cover: "stone",
  tags: ["AI/UX", "Enterprise"],
  featured: true
}, {
  slug: "lotte-tabling",
  title: "Lotte Tower Tabling Service",
  year: "2022",
  role: "Service Designer",
  client: "Lotte",
  summary: "롯데타워 F&B를 위한 예약·대기 통합 서비스. 운영 흐름까지 포함된 디자인.",
  summaryEn: "Reservation + waitlist service designed against real operational flow.",
  cover: "ink",
  tags: ["Service Design", "Operations"],
  featured: true
}, {
  slug: "pms-rms",
  title: "PMS / RMS",
  year: "2024",
  role: "Product Designer",
  client: "Hospitality",
  summary: "호텔 운영의 두 축 — 객실/요금 관리 시스템을 한 인터페이스로 정리.",
  summaryEn: "Two pillars of hotel operations unified into one interface.",
  cover: "warm",
  tags: ["Enterprise", "Systems"]
}, {
  slug: "aki-kiosk",
  title: "AKI · Kiosk Edu for Senior",
  year: "2021",
  role: "UX Designer",
  client: "Public",
  summary: "시니어의 키오스크 학습 곡선을 낮추는 교육형 인터페이스.",
  summaryEn: "An educational kiosk interface that lowers seniors' learning curve.",
  cover: "stone",
  tags: ["Accessibility", "Public"]
}, {
  slug: "parking-easy",
  title: "Parking Easy App",
  year: "2019",
  role: "UX Designer",
  client: "Suwon Smart City",
  summary: "수원 스마트시티 주차 — 시간, 위치, 결제의 복잡성을 단순화.",
  summaryEn: "Suwon Smart City parking — simplifying time, location, and payment.",
  cover: "ink",
  tags: ["Mobile", "Public"]
}, {
  slug: "the-chair",
  title: "The CHAIR",
  year: "2020",
  role: "UI Designer",
  client: "The CHAIR",
  summary: "공식 웹사이트 리뉴얼. 브랜드 톤에 맞춘 타이포그래피 시스템.",
  summaryEn: "Brand-aligned typographic system for the official site refresh.",
  cover: "clay",
  tags: ["Website", "Branding"]
}, {
  slug: "writing-toolbar",
  title: "Writing Tool bar",
  year: "2021",
  role: "Interaction Designer",
  client: "Tool",
  summary: "글쓰기 흐름을 방해하지 않는 컨텍스추얼 툴바.",
  summaryEn: "A contextual toolbar that stays out of the writer's flow.",
  cover: "warm",
  tags: ["Tools", "Interaction"]
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/_shared/data.js", error: String((e && e.message) || e) }); }

// ui_kits/case-study/CaseStudy.jsx
try { (() => {
/* CaseStudy.jsx — Awesomic-style: rounded cards, dark problem panel,
   white stat blocks, full-bleed rounded cover image. */

function CSHero({
  project
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 64,
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, project.year, " \xB7 ", project.client, " \xB7 Case Study")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: "clamp(56px, 7vw, 96px)",
      lineHeight: 1.02,
      fontWeight: 700,
      letterSpacing: "-0.03em",
      margin: 0,
      maxWidth: "14ch"
    }
  }, project.title), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 32,
      maxWidth: "32em",
      fontSize: 20,
      lineHeight: 1.55,
      color: "var(--color-ink)"
    }
  }, project.summary), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12,
      marginTop: 48
    }
  }, [["Role", project.role], ["Client", project.client], ["Year", project.year], ["Read", "9 min"]].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    className: "card-white",
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--color-steel)",
      fontWeight: 500,
      marginBottom: 8
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      color: "var(--color-obsidian)"
    }
  }, v)))));
}
function CSCover({
  project
}) {
  const fill = window.FILL_MAP && window.FILL_MAP[project.cover] || "fill-obsidian";
  return /*#__PURE__*/React.createElement("section", {
    className: "container",
    style: {
      paddingBottom: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "16 / 9",
      borderRadius: 48,
      overflow: "hidden",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `fill ${fill}`,
    style: {
      position: "absolute",
      inset: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 28,
      bottom: 28,
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge-overlay"
  }, "FIG. 01"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-overlay"
  }, "Project Cover"))));
}
function CSChapter({
  num,
  eyebrow,
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 40,
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "200px 1fr",
      gap: 64,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 96
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, num, " \u2014 ", eyebrow)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: 40,
      lineHeight: 1.15,
      fontWeight: 700,
      letterSpacing: "-0.025em",
      margin: 0,
      marginBottom: 32,
      maxWidth: "22ch"
    }
  }, title), children)));
}
function CSProse({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      lineHeight: 1.7,
      color: "var(--color-ink)",
      maxWidth: "40em"
    }
  }, children);
}
function CSQuote({
  children,
  cite
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card-muted",
    style: {
      padding: 36,
      margin: "32px 0",
      maxWidth: "44em"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: 26,
      lineHeight: 1.35,
      fontWeight: 600,
      color: "var(--color-obsidian)",
      letterSpacing: "-0.015em"
    }
  }, "\"", children, "\""), cite && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontSize: 13,
      color: "var(--color-steel)",
      fontWeight: 500
    }
  }, cite));
}
function CSFig({
  children,
  n,
  caption,
  dark
}) {
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: "32px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "16 / 9",
      borderRadius: 28,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: dark ? "fill fill-grid" : "fill fill-dot",
    style: {
      position: "absolute",
      inset: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--color-snow)",
      fontFamily: "var(--font-cosmica)",
      fontSize: 18,
      fontWeight: 500,
      padding: "0 32px",
      textAlign: "center"
    }
  }, children)), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 12,
      display: "flex",
      gap: 12,
      fontSize: 12,
      color: "var(--color-steel)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "FIG. ", n), /*#__PURE__*/React.createElement("span", null, caption)));
}
function CSStats({
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      gap: 12,
      margin: "32px 0"
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "card-white",
    style: {
      padding: 28,
      display: "flex",
      flexDirection: "column",
      gap: 14,
      minHeight: 200
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: "var(--color-steel)"
    }
  }, it.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: 56,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: "-0.04em",
      color: "var(--color-obsidian)"
    }
  }, it.value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.55,
      color: "var(--color-steel)",
      marginTop: "auto"
    }
  }, it.note))));
}
function DarkBlock({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card-dark",
    style: {
      padding: 40,
      margin: "32px 0"
    }
  }, children);
}
function NextProject({
  project,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 40,
      paddingBottom: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-dark",
    style: {
      padding: 64,
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 48,
      alignItems: "end"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      color: "var(--color-ash)",
      fontSize: 12,
      fontWeight: 500
    }
  }, "\u25CF Next project"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: 64,
      fontWeight: 700,
      letterSpacing: "-0.03em",
      lineHeight: 1.02,
      margin: 0,
      color: "var(--color-snow)"
    }
  }, project.title), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 20,
      maxWidth: "32em",
      fontSize: 16,
      lineHeight: 1.6,
      color: "var(--color-ash)"
    }
  }, project.summary)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-dark-soft",
    onClick: () => onOpen(project.slug),
    style: {
      alignSelf: "end"
    }
  }, "\uC77D\uC5B4\uBCF4\uAE30 \u2192")));
}
function CaseStudyPage({
  onNav,
  onOpen,
  slug
}) {
  const list = window.PROJECTS;
  const project = list.find(p => p.slug === slug) || list[0];
  const next = list[(list.indexOf(project) + 1) % list.length];
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement(Nav, {
    current: "index",
    onNav: onNav
  }), /*#__PURE__*/React.createElement(CSHero, {
    project: project
  }), /*#__PURE__*/React.createElement(CSCover, {
    project: project
  }), /*#__PURE__*/React.createElement(CSChapter, {
    num: "01",
    eyebrow: "Context",
    title: "\uC2DC\uC791\uC810\uC740 \uD56D\uC0C1 \uC6B4\uC601 \uD604\uC2E4\uC774\uC5C8\uB2E4."
  }, /*#__PURE__*/React.createElement(CSProse, null, /*#__PURE__*/React.createElement("p", null, "\uC758\uB8B0\uAC00 \uB4E4\uC5B4\uC654\uC744 \uB54C, \uD654\uBA74\uC740 \uC774\uBBF8 \uB450 \uBC88 \uB9AC\uB274\uC5BC\uB41C \uC0C1\uD0DC\uC600\uB2E4. \uADF8\uB7F0\uB370\uB3C4 \uC6B4\uC601\uD300\uC758 \uBD88\uB9CC\uC740 \uC904\uC9C0 \uC54A\uC558\uB2E4. \uBB38\uC81C\uB294 \uC778\uD130\uD398\uC774\uC2A4\uAC00 \uC544\uB2C8\uB77C, ", /*#__PURE__*/React.createElement("strong", null, "\uC758\uC0AC\uACB0\uC815\uC774 \uC77C\uC5B4\uB098\uB294 \uC704\uCE58"), "\uC5D0 \uC788\uC5C8\uB2E4. \uC5B4\uB5A4 \uACB0\uC815\uC740 \uD654\uBA74 \uC704\uC5D0\uC11C, \uC5B4\uB5A4 \uACB0\uC815\uC740 \uD654\uBA74 \uBC16\uC5D0\uC11C, \uB610 \uC5B4\uB5A4 \uACB0\uC815\uC740 \uC815\uCC45 \uBB38\uC11C \uC548\uC5D0\uC11C \uC77C\uC5B4\uB0AC\uB2E4."), /*#__PURE__*/React.createElement("p", null, "\uC81C\uD488\uC744 \uB2E4\uC2DC \uC124\uACC4\uD55C\uB2E4\uB294 \uAC74, \uACB0\uAD6D \uC774 \uD769\uC5B4\uC9C4 \uACB0\uC815 \uC9C0\uC810\uC744 \uD55C \uD750\uB984\uC73C\uB85C \uC815\uB9AC\uD558\uB294 \uC77C\uC774\uC5C8\uB2E4. \uD654\uBA74\uC740 \uADF8 \uACB0\uACFC\uB85C \uB530\uB77C\uC624\uB294 \uAC83\uC774\uC9C0, \uCD9C\uBC1C\uC810\uC774 \uC544\uB2C8\uC5C8\uB2E4.")), /*#__PURE__*/React.createElement(CSQuote, {
    cite: "\u2014 \uC6B4\uC601\uD300 \uB9AC\uB4DC \xB7 2024\uB144 \uCD08"
  }, "\uAE30\uB2A5\uC774 \uBD80\uC871\uD55C \uAC8C \uC544\uB2C8\uB77C, \uC5B4\uB514\uC11C \uACB0\uC815\uD574\uC57C \uD560\uC9C0\uB97C \uBAA8\uB974\uACA0\uC5B4\uC694.")), /*#__PURE__*/React.createElement(CSChapter, {
    num: "02",
    eyebrow: "Problem",
    title: "\uD654\uBA74 \uB108\uBA38\uC758 \uC2DC\uC2A4\uD15C\uC744 \uAC00\uC2DC\uD654\uD558\uB294 \uC77C."
  }, /*#__PURE__*/React.createElement(CSProse, null, /*#__PURE__*/React.createElement("p", null, "\uCCAB \uB450 \uC8FC\uB294 \uADF8\uC800 \uB4E3\uB294 \uC2DC\uAC04\uC774\uC5C8\uB2E4. \uC6B4\uC601\uD300, \uC815\uCC45\uD300, \uADF8\uB9AC\uACE0 \uC0AC\uC6A9\uC790 \u2014 \uAC19\uC740 \uB2E8\uC5B4\uB97C \uB2E4\uB974\uAC8C \uC4F0\uACE0 \uC788\uC5C8\uB2E4. ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 300,
      color: "var(--color-ash)"
    }
  }, "\"\uC2B9\uC778\""), "\uC774\uB77C\uB294 \uD55C \uB2E8\uC5B4\uAC00 \uC138 \uC885\uB958\uB85C \uAC08\uB838\uACE0, \uAC01\uAC01 \uB2E4\uB978 \uC870\uAC74\uACFC \uB2E4\uB978 \uCC45\uC784\uC790\uB97C \uAC00\uC9C0\uACE0 \uC788\uC5C8\uB2E4."), /*#__PURE__*/React.createElement("p", null, "\uC774\uAC78 \uADF8\uB300\uB85C \uC0AC\uC6A9\uC790\uC5D0\uAC8C \uBCF4\uC5EC\uC904 \uC218\uB294 \uC5C6\uC5C8\uC9C0\uB9CC, \uC2DC\uC2A4\uD15C \uC548\uC5D0\uC11C\uB294 \uBA85\uD655\uD788 \uBD84\uB9AC\uB418\uC5B4\uC57C \uD588\uB2E4. \uACB0\uAD6D \uC6B0\uB9AC\uB294 \uC815\uCC45 \uC5B4\uD718\uC9D1\uC744 \uBA3C\uC800 \uB9CC\uB4E4\uACE0, \uADF8 \uC5B4\uD718\uC5D0 \uAE30\uBC18\uD574\uC11C \uD654\uBA74\uC744 \uB2E4\uC2DC \uADF8\uB838\uB2E4.")), /*#__PURE__*/React.createElement(CSFig, {
    n: "02",
    caption: "\uC758\uC0AC\uACB0\uC815 \uD750\uB984\uB3C4 \u2014 3\uAC1C \uC2B9\uC778 \uC720\uD615\uC774 \uC2DC\uC2A4\uD15C \uC548\uC5D0\uC11C \uC5B4\uB5BB\uAC8C \uBD84\uAE30\uD558\uB294\uC9C0"
  })), /*#__PURE__*/React.createElement(CSChapter, {
    num: "03",
    eyebrow: "Process",
    title: "\uAD6C\uC870 \u2192 \uC815\uCC45 \u2192 \uD654\uBA74, \uADF8 \uC21C\uC11C\uB85C."
  }, /*#__PURE__*/React.createElement(DarkBlock, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 24
    }
  }, [{
    lead: "Step 01",
    key: "어휘를 정리한다"
  }, {
    lead: "Step 02",
    key: "상태 머신을 그린다"
  }, {
    lead: "Step 03",
    key: "그 후에 화면을 그린다"
  }].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--color-ash)",
      fontWeight: 500
    }
  }, r.lead), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      fontWeight: 600,
      color: "var(--color-snow)",
      letterSpacing: "-0.015em",
      lineHeight: 1.25
    }
  }, r.key))))), /*#__PURE__*/React.createElement(CSProse, null, /*#__PURE__*/React.createElement("p", null, "\uBCF4\uD1B5\uC758 \uD504\uB85C\uC138\uC2A4\uB294 \uC640\uC774\uC5B4\uD504\uB808\uC784\uC5D0\uC11C \uC2DC\uC791\uD558\uC9C0\uB9CC, \uC774\uBC88\uC5D4 \uADF8 \uBC18\uB300\uC600\uB2E4. \uC6B0\uB9AC\uB294 \uC5D4\uD2F0\uD2F0 \uB2E4\uC774\uC5B4\uADF8\uB7A8\uACFC \uC0C1\uD0DC \uBA38\uC2E0\uBD80\uD130 \uADF8\uB838\uB2E4. \uC5B4\uB5A4 \uAC1D\uCCB4\uAC00 \uC5B4\uB5A4 \uC0C1\uD0DC\uB97C \uAC00\uC9C8 \uC218 \uC788\uACE0, \uADF8 \uC804\uC774\uB294 \uB204\uAC00 \uC77C\uC73C\uD0A4\uB294\uAC00."), /*#__PURE__*/React.createElement("p", null, "\uC774 \uAD6C\uC870\uAC00 \uD569\uC758\uB41C \uB2E4\uC74C\uC5D0\uC57C \uD654\uBA74\uC744 \uADF8\uB838\uACE0, \uADF8\uC81C\uC11C\uC57C \uC6B4\uC601\uD300\uC740 \uC790\uC2E0\uC758 \uC77C\uC774 \uC778\uD130\uD398\uC774\uC2A4\uC5D0\uC11C \uC5B4\uB5BB\uAC8C \uD45C\uD604\uB418\uB294\uC9C0\uB97C \uC54C\uC544\uBD24\uB2E4."))), /*#__PURE__*/React.createElement(CSChapter, {
    num: "04",
    eyebrow: "Outcome",
    title: "\uC2E0\uB8B0\uC131\uC774 KPI\uBCF4\uB2E4 \uBA3C\uC800\uC600\uB2E4."
  }, /*#__PURE__*/React.createElement(CSStats, {
    items: [{
      label: "정책 어휘",
      value: "47 → 12",
      note: "단어 단위로 흩어진 어휘를 핵심 개념으로 통일."
    }, {
      label: "운영 이슈",
      value: "−68%",
      note: "재오픈 6개월간 정책 충돌 티켓 감소."
    }, {
      label: "신규 온보딩",
      value: "9 → 3d",
      note: "신규 운영자가 시스템을 혼자 운용하기까지."
    }]
  }), /*#__PURE__*/React.createElement(CSProse, null, /*#__PURE__*/React.createElement("p", null, "\uCD9C\uC2DC \uD6C4 \uCCAB \uBD84\uAE30, \uC6B0\uB9AC\uB294 \uC0AC\uC6A9\uC131 \uC9C0\uD45C\uBCF4\uB2E4 ", /*#__PURE__*/React.createElement("strong", null, "\uC6B4\uC601 \uC548\uC815\uC131 \uC9C0\uD45C"), "\uB97C \uBA3C\uC800 \uBD24\uB2E4. \uC815\uCC45\uACFC \uB2E4\uB974\uAC8C \uB3D9\uC791\uD55C \uC0AC\uB840, \uAC19\uC740 \uACB0\uC815\uC774 \uD654\uBA74\uB9C8\uB2E4 \uB2E4\uB974\uAC8C \uD45C\uD604\uB41C \uACBD\uC6B0, \uC608\uC678 \uCC98\uB9AC\uAC00 \uC0AC\uC6A9\uC790\uC5D0\uAC8C \uBCF4\uC774\uC9C0 \uC54A\uC740 \uBE48\uB3C4 \u2014 \uC774\uB7F0 \uAC83\uB4E4\uC774 0\uC5D0 \uC218\uB834\uD558\uB294\uC9C0."))), /*#__PURE__*/React.createElement(CSChapter, {
    num: "05",
    eyebrow: "Reflection",
    title: "\uD654\uBA74\uC740 \uB9C8\uC9C0\uB9C9\uC5D0 \uADF8\uB9B0\uB2E4."
  }, /*#__PURE__*/React.createElement(CSProse, null, /*#__PURE__*/React.createElement("p", null, "\uC774 \uD504\uB85C\uC81D\uD2B8\uB294 \uB514\uC790\uC774\uB108\uAC00 \uC5B4\uB514\uC11C\uBD80\uD130 \uC77C\uC744 \uC2DC\uC791\uD574\uC57C \uD558\uB294\uC9C0\uC5D0 \uB300\uD55C \uC9C8\uBB38\uC744 \uB2E4\uC2DC \uB358\uC84C\uB2E4. UI\uB294 \uACB0\uAD6D \uC2DC\uC2A4\uD15C\uACFC \uC815\uCC45\uC758 \uD45C\uD604\uC774\uACE0, \uD45C\uD604\uC774 \uC798 \uB418\uB824\uBA74 \uADF8 \uC548\uCABD\uC774 \uBA3C\uC800 \uC815\uB3C8\uB418\uC5B4 \uC788\uC5B4\uC57C \uD55C\uB2E4."), /*#__PURE__*/React.createElement("p", null, "\uD654\uBA74\uC744 \uC798 \uADF8\uB9AC\uB294 \uB514\uC790\uC774\uB108\uBCF4\uB2E4, \uC2DC\uC2A4\uD15C\uC744 \uC798 \uC77D\uB294 \uB514\uC790\uC774\uB108\uAC00 \uB418\uACE0 \uC2F6\uB2E4."))), /*#__PURE__*/React.createElement(NextProject, {
    project: next,
    onOpen: onOpen
  }), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  CaseStudyPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/case-study/CaseStudy.jsx", error: String((e && e.message) || e) }); }

// ui_kits/contact/Contact.jsx
try { (() => {
/* Contact.jsx — rounded white card form on mist canvas */

function ContactForm() {
  const [data, setData] = React.useState({
    name: "",
    email: "",
    topic: "협업 문의",
    message: ""
  });
  const [sent, setSent] = React.useState(false);
  const set = k => e => setData(d => ({
    ...d,
    [k]: e.target.value
  }));
  const submit = e => {
    e.preventDefault();
    if (data.name && data.email && data.message) setSent(true);
  };
  if (sent) {
    return /*#__PURE__*/React.createElement("div", {
      className: "card-white",
      style: {
        padding: 48
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(Eyebrow, null, "Received \xB7 \uC798 \uBC1B\uC558\uC2B5\uB2C8\uB2E4")), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: "var(--font-cosmica)",
        fontSize: 40,
        fontWeight: 700,
        letterSpacing: "-0.025em",
        margin: 0,
        lineHeight: 1.1,
        color: "var(--color-obsidian)"
      }
    }, "\uB2F5\uC7A5\uC744 ", /*#__PURE__*/React.createElement("em", {
      style: {
        fontWeight: 300,
        color: "var(--color-ash)"
      }
    }, "2\uC601\uC5C5\uC77C"), /*#__PURE__*/React.createElement("br", null), "\uC548\uC5D0 \uB4DC\uB9AC\uACA0\uC2B5\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        color: "var(--color-steel)",
        marginTop: 18,
        maxWidth: "30em"
      }
    }, data.email, " \uC8FC\uC18C\uB85C \uD68C\uC2E0\uB4DC\uB9B4 \uC608\uC815\uC785\uB2C8\uB2E4. \uC2A4\uD338 \uD3F4\uB354\uB3C4 \uD55C \uBC88 \uD655\uC778\uD574\uC8FC\uC138\uC694."), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-outline",
      style: {
        marginTop: 28
      },
      onClick: () => {
        setSent(false);
        setData({
          name: "",
          email: "",
          topic: "협업 문의",
          message: ""
        });
      }
    }, "\uC0C8 \uBA54\uC2DC\uC9C0 \uBCF4\uB0B4\uAE30"));
  }
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    className: "card-white",
    style: {
      padding: 36,
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(FieldWrap, {
    label: "Name *"
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    value: data.name,
    onChange: set("name"),
    placeholder: "\uAE40\uB2E4\uD61C"
  })), /*#__PURE__*/React.createElement(FieldWrap, {
    label: "Email *"
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    type: "email",
    value: data.email,
    onChange: set("email"),
    placeholder: "you@email.com"
  }))), /*#__PURE__*/React.createElement(FieldWrap, {
    label: "Topic"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, ["협업 문의", "프리랜스", "강연 / 워크숍", "기타"].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    type: "button",
    onClick: () => setData(d => ({
      ...d,
      topic: t
    })),
    style: {
      cursor: "pointer",
      padding: "8px 14px",
      fontSize: 13,
      fontWeight: 500,
      background: data.topic === t ? "var(--color-obsidian)" : "var(--color-mist)",
      color: data.topic === t ? "var(--color-snow)" : "var(--color-ink)",
      border: 0,
      borderRadius: 10000,
      fontFamily: "var(--font-cosmica)",
      transition: "all 220ms cubic-bezier(0.2,0.7,0.2,1)"
    }
  }, t)))), /*#__PURE__*/React.createElement(FieldWrap, {
    label: "Message *"
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "input textarea",
    value: data.message,
    onChange: set("message"),
    placeholder: "\uD504\uB85C\uC81D\uD2B8 \uBC30\uACBD, \uC77C\uC815, \uC608\uC0C1 \uBC94\uC704\uB97C \uC54C\uB824\uC8FC\uC2DC\uBA74 \uB2F5\uC7A5\uC774 \uBE68\uB77C\uC9D1\uB2C8\uB2E4."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--color-steel)",
      fontWeight: 500
    }
  }, "\u25CF Reply within 2 working days"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "\uBA54\uC2DC\uC9C0 \uBCF4\uB0B4\uAE30 \u2192")));
}
function FieldWrap({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--color-steel)",
      fontWeight: 500
    }
  }, label), children);
}
function DirectChannels() {
  const channels = [{
    l: "Email",
    v: "hello@dahyekim.co",
    h: "mailto:hello@dahyekim.co"
  }, {
    l: "LinkedIn",
    v: "linkedin.com/in/dahyekim",
    h: "#"
  }, {
    l: "Are.na",
    v: "are.na/dahye-kim",
    h: "#"
  }, {
    l: "Resume",
    v: "Resume — PDF",
    h: "#"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, channels.map((c, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: c.h,
    className: "card-white",
    style: {
      padding: 20,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      textDecoration: "none",
      color: "inherit",
      transition: "background 220ms cubic-bezier(0.2,0.7,0.2,1)"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--color-fog)",
    onMouseLeave: e => e.currentTarget.style.background = "var(--color-snow)"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--color-steel)",
      fontWeight: 500,
      marginBottom: 4
    }
  }, c.l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: "var(--color-obsidian)"
    }
  }, c.v)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      color: "var(--color-steel)"
    }
  }, "\u2197"))));
}
function ContactPage({
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement(Nav, {
    current: "contact",
    onNav: onNav
  }), /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 64,
      paddingBottom: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 48,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Contact")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: "clamp(48px, 6vw, 80px)",
      lineHeight: 1.05,
      fontWeight: 700,
      letterSpacing: "-0.03em",
      margin: 0
    }
  }, "\uC9E7\uAC8C\uB77C\uB3C4 ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 300,
      color: "var(--color-ash)"
    }
  }, "\uBA3C\uC800"), /*#__PURE__*/React.createElement("br", null), "\uC778\uC0AC\uB97C \uC8FC\uC138\uC694."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 24,
      maxWidth: "30em",
      fontSize: 16,
      lineHeight: 1.65,
      color: "var(--color-ink)"
    }
  }, "\uC77C\uC815\xB7\uBC94\uC704\xB7\uB9C9\uD78C \uBD80\uBD84\uC744 \uD55C \uBB38\uB2E8\uC73C\uB85C \uC801\uC5B4\uC8FC\uC2DC\uBA74 \uB2F5\uC7A5\uC774 \uC815\uD655\uD574\uC9D1\uB2C8\uB2E4. \uC801\uD569\uD558\uC9C0 \uC54A\uC73C\uBA74 \uB2E4\uB978 \uB514\uC790\uC774\uB108\uB97C \uC18C\uAC1C\uD574\uB4DC\uB9B4 \uC218\uB3C4 \uC788\uC2B5\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(DirectChannels, null))), /*#__PURE__*/React.createElement(ContactForm, null))), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  ContactPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/contact/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/home/Home.jsx
try { (() => {
/* Home.jsx — Awesomic-style landing
   Two-column hero, logo strip, portfolio grid, dark problem panel,
   stat row, light CTA card.
*/

function Hero({
  onSeeWork,
  onContact
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 64,
      paddingBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 64,
      alignItems: "end"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: "clamp(48px, 6.4vw, 84px)",
      lineHeight: 1.05,
      fontWeight: 700,
      letterSpacing: "-0.025em",
      margin: 0,
      color: "var(--color-obsidian)"
    }
  }, "\uBCF5\uC7A1\uD55C \uD658\uACBD\uC758", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 300,
      color: "var(--color-ash)"
    }
  }, "\uAD6C\uC870"), "\uB97C \uC124\uACC4\uD569\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.55,
      color: "var(--color-ink)",
      margin: 0
    }
  }, "\uC2DC\uC2A4\uD15C\xB7\uC815\uCC45\xB7\uC6B4\uC601 \uD604\uC2E4\uC774 \uC0AC\uC6A9\uC790 \uACBD\uD5D8\uC744 \uD615\uC131\uD558\uB294 \uACF3\uC5D0\uC11C \uC81C\uD488\uC744 \uB9CC\uB4ED\uB2C8\uB2E4. \uD654\uBA74\uB9CC\uD07C \uC758\uC0AC\uACB0\uC815\uACFC \uC608\uC678 \uCC98\uB9AC\uAC00 \uC911\uC694\uD55C \uC601\uC5ED."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "you@email.com",
    style: {
      flex: "1 1 220px",
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onContact
  }, "Book a call")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--color-steel)"
    }
  }, "Reply within 2 working days \xB7 \uD3C9\uC77C \uAE30\uC900 2\uC77C \uB0B4 \uD68C\uC2E0"))));
}
function LogoStrip() {
  const items = ["TalentX", "LG Electronics", "Lotte", "Suwon Smart City", "Hospitality Group", "Public Sector", "Independent", "The CHAIR"];
  const all = [...items, ...items];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "32px 0",
      overflow: "hidden",
      borderTop: "1px solid var(--color-pebble)",
      borderBottom: "1px solid var(--color-pebble)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 64,
      whiteSpace: "nowrap",
      animation: "logo-scroll 40s linear infinite",
      fontFamily: "var(--font-cosmica)",
      fontSize: 18,
      fontWeight: 500,
      color: "var(--color-steel)"
    }
  }, all.map((x, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, x))), /*#__PURE__*/React.createElement("style", null, `@keyframes logo-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`));
}
function FeaturedWork({
  onOpen
}) {
  const featured = window.PROJECTS.slice(0, 4);
  return /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 80,
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-between",
    style: {
      marginBottom: 40,
      alignItems: "end"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Selected Work")), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 48,
      fontWeight: 700,
      letterSpacing: "-0.025em",
      margin: 0,
      lineHeight: 1.08
    }
  }, "\uC5EC\uB35F \uAC1C\uC758 ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 300,
      color: "var(--color-ash)"
    }
  }, "\uD504\uB85C\uC81D\uD2B8"), ".")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline"
  }, "View all projects")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16
    }
  }, featured.map(p => /*#__PURE__*/React.createElement(ProjectTile, {
    key: p.slug,
    project: p,
    onOpen: onOpen
  }))));
}
function DarkPanel() {
  const rows = [{
    lead: "화면 위에서",
    key: "결정되는 일들"
  }, {
    lead: "화면 밖에서",
    key: "결정되는 일들"
  }, {
    lead: "정책 문서 안에서",
    key: "결정되는 일들"
  }, {
    lead: "예외 처리가 모이는",
    key: "보이지 않는 곳"
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 40,
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-dark",
    style: {
      padding: 48,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      color: "var(--color-ash)",
      fontSize: 12,
      fontWeight: 500
    }
  }, "\u25CF The work"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: 48,
      fontWeight: 700,
      letterSpacing: "-0.025em",
      lineHeight: 1.08,
      color: "var(--color-snow)",
      margin: 0
    }
  }, "\uC758\uC0AC\uACB0\uC815\uC774", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 300,
      color: "var(--color-ash)"
    }
  }, "\uC5B4\uB514\uC11C"), /*#__PURE__*/React.createElement("br", null), "\uC77C\uC5B4\uB098\uB294\uAC00.")), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: 18,
      alignSelf: "end"
    }
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: 14,
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "var(--color-graphite)",
      flexShrink: 0,
      transform: "translateY(2px)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-ash)",
      fontWeight: 400
    }
  }, r.lead, " "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-snow)",
      fontWeight: 600
    }
  }, r.key)))))));
}
function StatRow() {
  const stats = [{
    n: "8+",
    l: "Years in digital product"
  }, {
    n: "20+",
    l: "Shipped products"
  }, {
    n: "6",
    l: "Industries — HR · Hospitality · Public · Retail · AI · Tools"
  }, {
    n: "2025",
    l: "Currently at TalentX"
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 40,
      paddingBottom: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16
    }
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "card-white",
    style: {
      padding: 28,
      minHeight: 180,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: 56,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: "-0.04em",
      color: "var(--color-obsidian)"
    }
  }, s.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--color-steel)",
      lineHeight: 1.5
    }
  }, s.l)))));
}
function ContactCard({
  onContact
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 40,
      paddingBottom: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-white",
    style: {
      padding: 64,
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 48,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 56,
      fontWeight: 700,
      letterSpacing: "-0.03em",
      lineHeight: 1.05,
      margin: 0
    }
  }, "\uC9E7\uAC8C\uB77C\uB3C4 ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 300,
      color: "var(--color-ash)"
    }
  }, "\uBA3C\uC800"), /*#__PURE__*/React.createElement("br", null), "\uC778\uC0AC\uB97C \uC8FC\uC138\uC694."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: "var(--color-ink)",
      margin: 0,
      lineHeight: 1.55
    }
  }, "\uC77C\uC815\xB7\uBC94\uC704\xB7\uB9C9\uD78C \uBD80\uBD84\uC744 \uD55C \uBB38\uB2E8\uC73C\uB85C \uC801\uC5B4\uC8FC\uC2DC\uBA74 \uB2F5\uC7A5\uC774 \uC815\uD655\uD574\uC9D1\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onContact,
    style: {
      alignSelf: "flex-start"
    }
  }, "hello@dahyekim.co \u2192"))));
}
function HomePage({
  onNav,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement(Nav, {
    current: "home",
    onNav: onNav
  }), /*#__PURE__*/React.createElement(Hero, {
    onContact: () => onNav("contact")
  }), /*#__PURE__*/React.createElement(LogoStrip, null), /*#__PURE__*/React.createElement(FeaturedWork, {
    onOpen: onOpen
  }), /*#__PURE__*/React.createElement(DarkPanel, null), /*#__PURE__*/React.createElement(StatRow, null), /*#__PURE__*/React.createElement(ContactCard, {
    onContact: () => onNav("contact")
  }), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  HomePage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/home/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/playground/Playground.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Playground.jsx — mixed-size rounded card grid */

function PCard({
  size,
  label,
  title,
  body,
  visual,
  year,
  dark
}) {
  const colSpan = {
    sm: "span 4",
    md: "span 6",
    lg: "span 8",
    xl: "span 12"
  }[size] || "span 6";
  const baseStyle = {
    gridColumn: colSpan,
    padding: 28,
    borderRadius: 36,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    minHeight: size === "lg" || size === "xl" ? 360 : 280,
    cursor: "pointer",
    transition: "transform 300ms cubic-bezier(0.2,0.7,0.2,1)"
  };
  const surface = dark ? {
    ...baseStyle,
    background: "var(--color-obsidian)",
    color: "var(--color-snow)"
  } : {
    ...baseStyle,
    background: "var(--color-snow)",
    color: "var(--color-obsidian)"
  };
  return /*#__PURE__*/React.createElement("article", {
    style: surface,
    onMouseEnter: e => e.currentTarget.style.transform = "translateY(-4px)",
    onMouseLeave: e => e.currentTarget.style.transform = "translateY(0)"
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: dark ? "var(--color-ash)" : "var(--color-steel)"
    }
  }, "\u25CF ", label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: dark ? "var(--color-ash)" : "var(--color-steel)"
    }
  }, year)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: "-0.015em",
      margin: 0,
      lineHeight: 1.25,
      color: dark ? "var(--color-snow)" : "var(--color-obsidian)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.6,
      color: dark ? "var(--color-ash)" : "var(--color-steel)",
      margin: 0
    }
  }, body), visual && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, visual));
}
function VColor() {
  const cols = ["#09090b", "#18181b", "#3f3f46", "#71717a", "#a1a1aa", "#d4d4d8", "#ececee", "#ffffff"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, cols.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      height: 48,
      borderRadius: 12,
      background: c,
      border: c === "#ffffff" ? "1px solid var(--color-pebble)" : 0
    }
  })));
}
function VType() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: 48,
      lineHeight: 1,
      letterSpacing: "-0.03em",
      fontWeight: 700,
      color: "inherit"
    }
  }, "\uAC00", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 300,
      color: "var(--color-ash)"
    }
  }, "Aa"), "\u201499");
}
function VRadii() {
  const rs = [12, 16, 28, 36, 48];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "flex-end"
    }
  }, rs.map(r => /*#__PURE__*/React.createElement("div", {
    key: r,
    style: {
      width: 56,
      height: 56,
      background: "var(--color-fog)",
      borderRadius: r,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      fontSize: 10,
      color: "var(--color-steel)",
      paddingBottom: 6,
      fontWeight: 500
    }
  }, r)));
}
function VMotion() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    let t = 0;
    let raf;
    const loop = () => {
      t += 0.012;
      if (ref.current) {
        const x = (Math.sin(t) * 0.5 + 0.5) * 100;
        ref.current.style.left = `${x}%`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 56,
      background: "var(--color-fog)",
      borderRadius: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: "absolute",
      top: "50%",
      width: 28,
      height: 28,
      background: "var(--color-obsidian)",
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      left: "50%"
    }
  }));
}
function VPill() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, ["Default", "Hover", "Focus", "Disabled"].map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: l,
    className: "badge badge-outline",
    style: {
      opacity: i === 3 ? 0.4 : 1,
      background: i === 1 ? "var(--color-fog)" : "transparent",
      boxShadow: i === 2 ? "0 0 0 2px var(--color-obsidian)" : "none"
    }
  }, l)));
}
function PlaygroundPage({
  onNav
}) {
  const items = [{
    size: "lg",
    label: "TYPE",
    title: "Cosmica → DM Sans 페어링",
    body: "한 패밀리가 디스플레이부터 캡션까지 모두 처리. 굵기 300→700 사이 다섯 단계로 위계를 만든다.",
    year: "2025",
    visual: /*#__PURE__*/React.createElement(VType, null)
  }, {
    size: "md",
    label: "COLOR",
    title: "Achromatic only.",
    body: "검정·회색·흰색 8단계. 컬러 CTA 금지.",
    year: "2025",
    visual: /*#__PURE__*/React.createElement(VColor, null)
  }, {
    size: "md",
    label: "RADII",
    title: "36px is the signature.",
    body: "12·16·28·36·48 — 작은 라운드는 쓰지 않는다.",
    year: "2025",
    visual: /*#__PURE__*/React.createElement(VRadii, null)
  }, {
    size: "lg",
    label: "MOTION",
    title: "Slow eased, transform only.",
    body: "220–350ms cubic-bezier(0.2,0.7,0.2,1). Color나 background는 절대 애니메이션하지 않는다.",
    year: "2025",
    visual: /*#__PURE__*/React.createElement(VMotion, null),
    dark: true
  }, {
    size: "md",
    label: "COMPONENTS",
    title: "Pill button states.",
    body: "Default · Hover · Focus · Disabled.",
    year: "2025",
    visual: /*#__PURE__*/React.createElement(VPill, null)
  }, {
    size: "md",
    label: "WRITING",
    title: "디자이너의 글.",
    body: "주간 노트 — 화면 너머의 일에 대해.",
    year: "2025"
  }, {
    size: "sm",
    label: "NOTE",
    title: "운영 어휘집",
    body: "정책 단어를 사용자 어휘로 번역하는 메모.",
    year: "2024"
  }, {
    size: "sm",
    label: "SKETCH",
    title: "Density grids",
    body: "데이터 테이블의 행 높이 실험.",
    year: "2024"
  }, {
    size: "sm",
    label: "PROCESS",
    title: "구조 → 정책 → 화면",
    body: "프로젝트 시작 시 항상 같은 순서.",
    year: "2024"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement(Nav, {
    current: "playground",
    onNav: onNav
  }), /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 64,
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Playground")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: "clamp(48px, 6.4vw, 84px)",
      lineHeight: 1.05,
      fontWeight: 700,
      letterSpacing: "-0.025em",
      margin: 0,
      maxWidth: "18ch"
    }
  }, "\uC791\uC5C5 \uC0AC\uC774\uC758 ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 300,
      color: "var(--color-ash)"
    }
  }, "\uC5EC\uBC31"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 20,
      maxWidth: "32em",
      fontSize: 16,
      lineHeight: 1.65,
      color: "var(--color-ink)"
    }
  }, "\uD504\uB85C\uC81D\uD2B8\uAC00 \uB418\uAE30 \uC804\uC758 \uC2E4\uD5D8\uB4E4 \u2014 \uD0C0\uC774\uD3EC\uADF8\uB798\uD53C, \uC0C9, \uBAA8\uC158, \uCEF4\uD3EC\uB10C\uD2B8. \uC644\uC131\uB418\uC9C0 \uC54A\uC740 \uCC44\uB85C \uB450\uB294 \uAC8C \uB354 \uB9DE\uB294 \uAC83\uB4E4.")), /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(12, 1fr)",
      gap: 16
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement(PCard, _extends({
    key: i
  }, it))))), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  PlaygroundPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/playground/Playground.jsx", error: String((e && e.message) || e) }); }

// ui_kits/project-index/ProjectIndex.jsx
try { (() => {
/* ProjectIndex.jsx — full project list, view-toggle (Grid / List) */

function IndexHeader({
  view,
  setView,
  count
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 64,
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-between",
    style: {
      alignItems: "end"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Index \xB7 ", String(count).padStart(2, "0"))), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: "clamp(48px, 6.4vw, 84px)",
      lineHeight: 1.05,
      fontWeight: 700,
      letterSpacing: "-0.025em",
      margin: 0
    }
  }, "\uC5EC\uB35F \uAC1C\uC758 ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 300,
      color: "var(--color-ash)"
    }
  }, "\uD504\uB85C\uC81D\uD2B8"), ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      padding: 4,
      background: "var(--color-fog)",
      borderRadius: 10000
    }
  }, ["Grid", "List"].map(v => /*#__PURE__*/React.createElement("button", {
    key: v,
    onClick: () => setView(v),
    style: {
      padding: "8px 16px",
      fontSize: 13,
      fontWeight: 500,
      background: view === v ? "var(--color-obsidian)" : "transparent",
      color: view === v ? "var(--color-snow)" : "var(--color-ink)",
      border: 0,
      borderRadius: 10000,
      cursor: "pointer",
      fontFamily: "var(--font-cosmica)",
      transition: "all 220ms cubic-bezier(0.2,0.7,0.2,1)"
    }
  }, v)))));
}
function GridView({
  projects,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 16
    }
  }, projects.map(p => /*#__PURE__*/React.createElement(ProjectTile, {
    key: p.slug,
    project: p,
    onOpen: onOpen
  }))));
}
function ListView({
  projects,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "section container",
    style: {
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, projects.map((p, i) => /*#__PURE__*/React.createElement("a", {
    key: p.slug,
    href: "#",
    onClick: e => {
      e.preventDefault();
      onOpen(p.slug);
    },
    className: "card-white",
    style: {
      display: "grid",
      gridTemplateColumns: "44px 1.4fr 2fr 160px 80px",
      gap: 24,
      alignItems: "center",
      padding: "22px 28px",
      textDecoration: "none",
      color: "inherit",
      transition: "background 220ms cubic-bezier(0.2,0.7,0.2,1), transform 220ms"
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = "var(--color-fog)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "var(--color-snow)";
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: 12,
      color: "var(--color-steel)",
      fontWeight: 500
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: 20,
      fontWeight: 600,
      color: "var(--color-obsidian)",
      letterSpacing: "-0.01em"
    }
  }, p.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: 14,
      color: "var(--color-steel)",
      lineHeight: 1.55
    }
  }, p.summary), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-outline"
  }, p.role), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-cosmica)",
      fontSize: 14,
      color: "var(--color-ink)",
      fontWeight: 500,
      textAlign: "right"
    }
  }, p.year, " \u2192")))));
}
function ProjectIndexPage({
  onNav,
  onOpen
}) {
  const [view, setView] = React.useState("Grid");
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement(Nav, {
    current: "index",
    onNav: onNav
  }), /*#__PURE__*/React.createElement(IndexHeader, {
    view: view,
    setView: setView,
    count: window.PROJECTS.length
  }), view === "Grid" ? /*#__PURE__*/React.createElement(GridView, {
    projects: window.PROJECTS,
    onOpen: onOpen
  }) : /*#__PURE__*/React.createElement(ListView, {
    projects: window.PROJECTS,
    onOpen: onOpen
  }), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  ProjectIndexPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/project-index/ProjectIndex.jsx", error: String((e && e.message) || e) }); }

})();
