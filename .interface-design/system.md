# Zephyr Design System

## Intent

**Who:** Someone who chose a browser fork intentionally. Technical enough to care about control and privacy, but wants craft, not complexity. They left mainstream browsers for a reason.

**Task:** Orient quickly (onboarding), find and change preferences confidently (settings).

**Feel:** Precise clarity with atmospheric warmth. An instrument that breathes. The tension between the soft name (zephyr = gentle west wind) and the structural logo (compass rose / eight-pointed asterisk) defines the identity.

## Direction

**Domain:** Wind direction, wayfinding, compass bearing, atmosphere, horizon, clarity of air. Navigation as orientation — knowing where you are, where you can go.

**Signature:** The compass rose. The logo's cross is eight directions. This manifests as a wayfinding metaphor — settings as bearings, onboarding as orientation. Progress, navigation, and structure carry directional character.

## Palette

Derived from the late-afternoon sky — the hour when the west wind blows.

```css
/* Foundation — the sky at different altitudes */
--zephyr-zenith: #152671;         /* deep navy, top of sky */
--zephyr-horizon: #5669BD;        /* medium blue, where sky meets earth */
--zephyr-midsky: #1B2C78;         /* transitional blue */

/* The gradient — a vertical slice of atmosphere */
--zephyr-gradient: linear-gradient(
    180deg,
    var(--zephyr-zenith) 10%,
    var(--zephyr-midsky) 30%,
    var(--zephyr-horizon) 100%
);

/* Elevated surfaces — high-altitude light, blue-white */
--zephyr-elevated: #afbeff;
--zephyr-elevated-10: rgba(175, 190, 255, 0.1);
--zephyr-elevated-15: rgba(175, 190, 255, 0.15);
--zephyr-elevated-20: rgba(175, 190, 255, 0.2);
--zephyr-elevated-25: rgba(175, 190, 255, 0.25);
--zephyr-elevated-30: rgba(175, 190, 255, 0.3);
--zephyr-elevated-40: rgba(175, 190, 255, 0.4);
--zephyr-elevated-80: rgba(175, 190, 255, 0.8);

/* Semantic */
--white: #ffffff;
--black: #000000;
--white-80: rgba(255, 255, 255, 0.8);
--white-85: rgba(255, 255, 255, 0.85);
```

**Why these colors:** They come from the product's own world — the logo gradient IS the late-afternoon sky. We're not applying a palette to the product; the palette already lives in the brand mark. The elevated blue-white is high-altitude cloud light catching the last sun.

## Typography

**Typeface:** Instrument Sans Variable

**Why:** Geometric clarity with warmth. The letter shapes are precise (compass, instrument) but the variable weight range gives organic texture. It doesn't feel cold or clinical — it feels like a well-made tool.

**Scale:**
- h1: 48px, weight 500, tracking -0.05rem — presence without shouting
- h2: 32px, weight 500, tracking -0.05rem — section anchors
- h4: 18px, weight 500 — labels and group headers
- body: 16px, weight 500, line-height 1.2 — comfortable reading
- small: 12px — legal, disclaimers, metadata

## Spacing

**Base unit:** 12px (`--gap-1`)
**Double:** 24px (`--gap-2`)

Component padding: 16px-21px for interactive elements (buttons, toggles).
Section gaps: 32px between major groups.
Page margins: 64px top on content pages, 20px horizontal padding.

## Depth Strategy

**Approach:** Surface color shifts + subtle borders (no shadows)

**Why:** On a gradient background, shadows fight the atmosphere. Instead, elevation is expressed through opacity shifts on the same blue-white base. Higher = more opaque = more visible. This preserves the atmospheric quality — surfaces feel like layers of sky at different altitudes.

- Base: transparent (the gradient shows through)
- Elevated-10: barely-there containers
- Elevated-20: interactive surfaces (buttons, cards)
- Elevated-25: hover state
- Elevated-30: active/pressed state
- Elevated-80: toggle enabled state

## Border Radius

**Scale:**
- Small: 12px — buttons, inputs, toggles
- Large: 24px — big buttons, card-like elements
- Pill: 50px — toggle runners

**Why:** Rounded enough to feel approachable but not bubbly. The 12px base connects to the spacing unit. Larger elements get proportionally larger radius.

## Animation

**Transitions:**
- Micro: 0.1s — background-color on hover
- Short: 0.15s — toggle runner slide
- Medium: 0.2s — page out, opacity changes
- Entry: 0.3s — page in
- Welcome: 0.35s-0.6s — staggered intro with blur

**Easing:** Default (ease). Blur transitions for page changes give an atmospheric, wind-like quality.

**Reduced motion:** All animations collapse to simple opacity fades.

## Component Patterns

### Toggle
Full-width button with text left, toggle switch right. Background: elevated-20. Pill-shaped track with circular runner. Enabled state: elevated-80 track, runner translates right.

### Page Header
Icon + h2 title inline, subtitle paragraph below. 64px top margin. Icon: 32px with 1.7px stroke. Vertical variant: icon above title, 48px icon.

### Navigation
Fixed bottom, centered. Back + Next buttons. Back: secondary (elevated-20). Next: primary (white bg, black text). Absolutely positioned at bottom: 48px.

### Page Transitions
Pages are absolutely positioned, full-width. Entry: translate up 30px + blur 8px -> clear. Exit: fade + translate up 30px + blur 8px. Creates a rising-through-atmosphere feel.
