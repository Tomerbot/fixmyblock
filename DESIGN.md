# FixMyBlock design

## Concept: "Marked on the street"

When a city crew finds a pothole, they spray a bright ring of marking paint around it.
Everyone walking by knows: this spot is known, and someone is coming.

FixMyBlock turns every report into that ring. The map is the street, each problem
gets a sprayed ring, and the ring grows when more neighbors say "I saw it too".
When the problem is fixed, the ring turns green with a check.

The spray ring is the one bold thing. Everything around it stays quiet: a grey
"sidewalk" map, plain lists, one typeface.

## Color tokens

| Token | Hex | Used for |
|---|---|---|
| `--sidewalk` | `#F1F2EF` | App background, sheets. A cool concrete grey, not cream. |
| `--asphalt` | `#34383C` | Text, the top bar, dark buttons. Real asphalt grey. |
| `--paint` | `#FF5A1F` | Marking-paint orange. Open problems, the Report button, the rings. |
| `--paint-ink` | `#C2410C` | The same orange, dark enough for text on light backgrounds. |
| `--line` | `#FFC72C` | Road-line yellow. Only for "I saw it too" (your vote). |
| `--fixed` | `#1F9D55` | Paint green. Fixed problems. |
| `--curb` | `#C9CCC8` | Borders and dividers. |

Every color means one thing. Orange is always "open problem", green is always "fixed",
yellow is always "your vote".

## Type

**Overpass** (Google Fonts) for everything. It is based on Highway Gothic, the typeface
on US road signs, so the app speaks the language of the street.
- Headings: Overpass 800, tight letter spacing.
- Body: Overpass 400/500, 16 px, line height 1.45.
- Numbers (vote counts, ranks): Overpass 800 with tabular figures.

## Layout (phone first)

```
┌──────────────────────────┐
│ ◯ FixMyBlock         (i) │  asphalt top bar
│                          │
│     full-screen map      │  grey OSM tiles
│   ◯     ◎(7)             │  sprayed rings, size = urgency
│            ✓             │  green = fixed
│                          │
│      [ + Report a problem ]   big orange button
├──────────────────────────┤
│  Map | Fix first | Fixed │  bottom tabs
└──────────────────────────┘
```

- **Report:** a sheet slides up over the lower half. The map stays visible above it with a
  sprayed crosshair in the middle. You move the map to put the ring on the problem.
- **Details:** tapping a ring opens a sheet with the photo, "7 neighbors saw this",
  and three actions: I saw it too, Mark fixed, Share with city.
- **Fix first:** a ranked list (the ranking is real, so rank numbers are allowed).
- **Fixed:** before/after rows with "fixed in 4 days".
- Content is left aligned. On desktop the app becomes a centered phone-width column
  next to a wider map.

## Principles

1. The map is the hero. Nothing covers it unless you asked for it.
2. One bold element: the spray ring. No gradients, no shadows on list rows, no decoration.
3. Say what happens: "Report a problem", "I saw it too", "Mark fixed". The toast repeats the
   same words ("Marked fixed").
4. Big touch targets (48 px). Visible keyboard focus. Reduced motion is respected.

## What I rejected as generic

- Blue primary color + Inter + Google-style teardrop pins. That is every map app.
- Cards with soft shadows for each report. Reports are rows in a list, like a work order sheet.
- A dark "night mode" UI with one neon accent. The street is grey in daylight.
- Stat tiles ("8 OPEN / 3 FIXED") with all-caps labels. The Fix first tab says it in one sentence.
