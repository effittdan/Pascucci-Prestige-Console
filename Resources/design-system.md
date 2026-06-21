# Pascucci Prestige — Design System Specification

A complete reference for replicating the site's visual design in any framework. Brand: **Luxury Auto Concierge, San Antonio TX**. Aesthetic: cinematic, dark, editorial, minimal — Awwwards-tier luxury automotive.

---

## 1. Color Palette

All brand colors are raw hex. Map them to your framework's tokens as shown.

### Brand Colors

| Token        | Hex       | Usage                                                   |
| ------------ | --------- | ------------------------------------------------------- |
| `obsidian`   | `#090A0B` | Page background (dark mode default)                     |
| `charcoal`   | `#202225` | Cards, secondary surfaces                               |
| `ivory`      | `#F1EEE7` | Body text on dark, light section backgrounds            |
| `gold`       | `#B89A63` | Accent, eyebrows, highlights, hovers, primary CTA hover |
| `red`        | `#A7191F` | Primary CTA button background                           |
| `titanium`   | `#8C9094` | Muted text, secondary metadata                          |
| `muted`      | `#15171A` | Deepest surface                                         |

### Semantic Token Mapping (shadcn-style)

```
--background:            #090A0B   (obsidian)
--foreground:            #F1EEE7   (ivory)
--card:                  #202225   (charcoal)
--card-foreground:       #F1EEE7
--popover:               #202225
--popover-foreground:    #F1EEE7
--primary:               #B89A63   (gold)
--primary-foreground:    #090A0B
--secondary:             #202225
--secondary-foreground:  #F1EEE7
--muted:                 #15171A
--muted-foreground:      #8C9094
--accent:                #B89A63
--accent-foreground:     #090A0B
--destructive:           #A7191F
--destructive-foreground:#F1EEE7
--border:                rgba(241, 238, 231, 0.10)
--input:                 rgba(241, 238, 231, 0.14)
--ring:                  #B89A63
```

---

## 2. Typography

### Font Families

| Role         | Stack                                                                       | Source       |
| ------------ | --------------------------------------------------------------------------- | ------------ |
| Serif (display/headings) | `"Cormorant Garamond", "Libre Baskerville", Georgia, serif`     | Google Fonts |
| Sans (body)  | `"Inter", "Helvetica Neue", Arial, sans-serif`                              | Google Fonts |
| Mono (eyebrows/specs/buttons) | `"Oswald", "DIN Condensed", "Roboto Condensed", sans-serif` | Google Fonts |

Load via `<link>` in `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600;700&family=Oswald:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### Heading Defaults
- `font-family: serif`
- `font-weight: 400` (light/regular — never bold)
- `letter-spacing: -0.01em`
- Italics rendered with `<em class="text-gold not-italic">` — gold-colored, NOT italicized (used as accent device)

### Type Scale

| Element | Mobile        | Desktop (lg+)      | Weight | Family | Line-height |
| ------- | ------------- | ------------------ | ------ | ------ | ----------- |
| h1 hero | 3rem (48px)   | 6rem–8rem (96–128px) | 400 | serif  | 1.02        |
| h2 section | 2.25rem (36px) | 3.75rem–6rem (60–96px) | 400 | serif | 1.1        |
| h3 card | 1.5rem (24px) | 1.875rem (30px)    | 400    | serif  | 1.2         |
| Body lg | 1rem (16px)   | 1.125rem (18px)    | 400    | sans   | 1.6 (relaxed) |
| Body    | 0.875rem (14px) | 1rem (16px)      | 400    | sans   | 1.6         |
| Small   | 0.75rem (12px) | 0.875rem (14px)  | 400    | sans   | 1.5         |

### Utility Type Styles

**Eyebrow** (section labels, in gold)
```css
font-family: Oswald, mono;
text-transform: uppercase;
letter-spacing: 0.22em;
font-size: 0.72rem;  /* ~11.5px */
font-weight: 500;
color: #B89A63;
```

**Spec** (metadata, vehicle specs, button text)
```css
font-family: Oswald, mono;
text-transform: uppercase;
letter-spacing: 0.14em;
font-size: 0.78rem;  /* ~12.5px */
font-weight: 400;
color: #8C9094;
```

**Body smoothing (global)**
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
font-feature-settings: "ss01", "cv11";
```

---

## 3. Spacing & Layout

### Container
- Max width: `max-w-7xl` = **1280px**
- Horizontal padding: `1.25rem` mobile (px-5), `2.5rem` desktop (lg:px-10)
- Centered: `mx-auto`

### Section Padding (vertical)
- Standard: `py-24` (96px) mobile, `lg:py-32` (128px) desktop
- Hero: `min-h-[100svh]`, `pt-32` top, `pb-20 lg:pb-28` bottom
- Tight CTA bands: `py-20 lg:py-28`

### Grid Patterns
- Featured Fleet: `grid gap-8 md:grid-cols-2 lg:grid-cols-3`
- How It Works: `grid gap-10 sm:grid-cols-2 lg:grid-cols-4`
- Occasions: `grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4` (1px hairline border via `gap-px` + `bg-border`)
- Testimonials: `grid gap-px bg-border md:grid-cols-3`

### Common Gaps
- Card grid: `gap-8` (32px)
- Inline groups: `gap-4` (16px) or `gap-3` (12px)
- Eyebrow → heading: `mt-4` to `mt-6`
- Heading → body: `mt-6` to `mt-8`
- Body → CTA group: `mt-10`

---

## 4. Borders, Radii, Shadows

- **Default radius**: `0.25rem` (4px) — kept minimal; nearly square
- **Borders**: 1px, color `rgba(241, 238, 231, 0.10)` (10% ivory on dark)
- **Hairline rule** (decorative under eyebrows / dividers):
  ```css
  height: 1px;
  background: #B89A63;
  opacity: 0.45;
  ```
- **Gold gradient rule**:
  ```css
  height: 1px;
  background: linear-gradient(90deg, transparent, #B89A63, transparent);
  ```
- **Shadows**: minimal — rely on contrast and gradients, not drop shadows. Buttons get `shadow-sm` only.

---

## 5. Buttons

### Primary (red)
```css
display: inline-flex; align-items: center; justify-content: center;
gap: 0.6rem;
font-family: Oswald, mono;
text-transform: uppercase;
letter-spacing: 0.18em;
font-size: 0.78rem;
padding: 0.95rem 1.6rem;   /* ~15px 26px */
background: #A7191F;
color: #F1EEE7;
border: 1px solid #A7191F;
transition: all 0.3s ease;

/* hover */
background: transparent;
color: #F1EEE7;
border-color: #F1EEE7;
```

### Ghost (outline on dark)
```css
/* same metrics as primary */
background: transparent;
color: #F1EEE7;
border: 1px solid rgba(241, 238, 231, 0.35);

/* hover */
border-color: #B89A63;
color: #B89A63;
```

### Gold (on light surfaces)
```css
background: #B89A63;
color: #090A0B;
border: 1px solid #B89A63;

/* hover */
background: transparent;
color: #B89A63;
```

### Inline text-link CTA
```
.spec text-gold inline-flex items-center gap-2
+ ArrowRight icon (14px) that translates 4px on group-hover
```

---

## 6. Imagery & Media

- Hero: full-bleed `object-cover`, `min-h-[100svh]`, brightness `1.32` + saturation `1.04` filter
- Hero overlays (stacked for legibility):
  - `bg-gradient-to-t from-obsidian/70 via-obsidian/35 to-obsidian/5`
  - `bg-gradient-to-r from-obsidian/40 via-obsidian/10 to-transparent`
- Card images: `aspect-[4/3]`, `object-cover`, hover scale `1.05` over `1200ms`
- Skyline / atmosphere images: `opacity-50` + dark gradient overlay `from-obsidian via-obsidian/70 to-obsidian/40`

---

## 7. Motion

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up { animation: fade-up 0.9s ease forwards; }
```

- Hover transitions: `transition: all 0.3s ease`
- Image scale: `duration-[1200ms]` for cinematic feel
- Arrow icons: `transition-transform group-hover:translate-x-1` (4px right shift)
- Gold scroll-cue dot: `animate-pulse`

---

## 8. Iconography

- Library: **Lucide React** (`lucide-react`)
- Default size: **14–18px** inline with text; **12px** in spec/eyebrow rows
- Color: inherit text color; accents use `text-gold` (#B89A63)

---

## 9. Section Composition Patterns

1. **Eyebrow** (gold, mono, uppercase, tracked)
2. **Heading** (serif, light, large, with an `<em class="text-gold not-italic">word</em>` accent)
3. **Body paragraph** (max ~xl width, ivory/80 on dark or charcoal/80 on light)
4. **CTA row** (mt-10, primary + ghost button pair, or inline gold text-link)

Alternating section backgrounds: `obsidian` → `charcoal` → `obsidian` → `ivory` (final CTA on light).

---

## 10. Breakpoints (Tailwind defaults)

| Name | Min width |
| ---- | --------- |
| sm   | 640px     |
| md   | 768px     |
| lg   | 1024px    |
| xl   | 1280px    |
| 2xl  | 1536px    |

---

## 11. Accessibility

- Body text contrast on obsidian: ivory at 80–100% opacity
- Muted text on obsidian: titanium (`#8C9094`) — meets AA for body sizes
- Focus ring: 1px, color `#B89A63`
- All decorative gradients sit over images; ensure overlay opacity keeps text contrast ≥ 4.5:1
