# Content Generation Guide — Semiconductor Physics Course

Rules for AI assistants generating chapter content, equations, diagrams,
and mascot admonitions in this repository.

---

## LaTeX / MathJax Equations

All mathematical equations use **backslash notation** (not dollar-sign notation):

- Inline math: `\(...\)`
- Display math: `\[...\]`

MathJax 3 is configured via `docs/js/mathjax.js` and loaded in `mkdocs.yml`
under `extra_javascript`. The `pymdownx.arithmatex` extension (with
`generic: true`) is required in `markdown_extensions`. This setup is already
in place — do not change the equation delimiter style or remove these entries.

When generating chapter content, always write equations in backslash notation.
Never use `$...$` or `$$...$$`.

---

## Writing Style and Reading Level

- American English spelling throughout (color, center, analyze)
- This is a college-junior/senior and first-year-graduate-level
  textbook — assume calculus, ODEs/PDEs, linear algebra, and intro
  quantum mechanics as prerequisites

---

## Learning Mascot: Nova the Electron Sprite

### Mascot File Index

The canonical files for this mascot. When editing any of these, update
the others in the same turn so they stay in sync.

| File | Purpose |
|------|---------|
| [`docs/img/mascot/character-sheet.md`](docs/img/mascot/character-sheet.md) | Canonical identity document (name, species, colors, voice). Source of truth. |
| [`docs/img/mascot/image-prompts.md`](docs/img/mascot/image-prompts.md) | Self-contained AI prompts for regenerating each pose. |
| [`docs/img/mascot/neutral.png`](docs/img/mascot/neutral.png) | Default / general-purpose pose. |
| [`docs/img/mascot/welcome.png`](docs/img/mascot/welcome.png) | Chapter-opening pose. |
| [`docs/img/mascot/thinking.png`](docs/img/mascot/thinking.png) | Key-concept pose. |
| [`docs/img/mascot/tip.png`](docs/img/mascot/tip.png) | Hint / helpful-guidance pose. |
| [`docs/img/mascot/warning.png`](docs/img/mascot/warning.png) | Common-mistake / pitfall pose. |
| [`docs/img/mascot/encouraging.png`](docs/img/mascot/encouraging.png) | Difficult-content / struggle pose. |
| [`docs/img/mascot/celebration.png`](docs/img/mascot/celebration.png) | End-of-chapter / achievement pose. |
| [`docs/css/mascot.css`](docs/css/mascot.css) | Custom admonition styles for the seven pose contexts. |
| [`docs/learning-graph/mascot-test.md`](docs/learning-graph/mascot-test.md) | Rendering test page that exercises every admonition style. |

### Character Overview

- **Name:** Nova
- **Species:** Electron sprite (anthropomorphized electron particle)
- **Personality:** Playful, clever, witty, energetic
- **Catchphrase:** "Let's get excited!"
- **Visual:** A round cyan-blue (#0288d1) particle with a soft outer
  glow halo, a faint "−" charge symbol on the body, small expressive
  cartoon arms and hands, big friendly eyes, and occasional small orange
  (#ff9800) sparks for energy accents. Modern flat-vector style.

### Voice Characteristics

- Uses light physics puns — "don't let this concept repel you", "let's
  get excited!", "time to jump bands"
- Refers to students as "fellow particles" or "explorers"
- Sentences are short and punchy — Nova is a sprite, not a lecturer
- Signature phrases: "Let's get excited!", "Time to jump bands!",
  "Field's looking good!"
- **Never use gendered pronouns** — always "Nova" or "they/them"

### Mascot Admonition Format

Always place the mascot image in the admonition body, never in the title
bar:

    !!! mascot-welcome "Title Here"
        <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Nova waving welcome">
        Admonition text goes here after the img tag.

The `src` path is relative to the rendered page URL. For chapter pages
at `docs/chapters/<slug>/index.md`, use `../../img/mascot/`. Count `../`
segments from the rendered HTML directory to `docs/img/mascot/`.

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|-----------------|-----------|
| General note / sidebar | `mascot-neutral` | As needed |
| Chapter opening | `mascot-welcome` | Every chapter (once) |
| Key concept | `mascot-thinking` | 2-3 per chapter |
| Helpful tip | `mascot-tip` | As needed |
| Common mistake | `mascot-warning` | As needed |
| Difficult content | `mascot-encourage` | Where students may struggle |
| Section completion | `mascot-celebration` | End of major sections (once) |

**Hard limits:**

- Maximum 5-6 mascot admonitions per chapter
- At most one `mascot-welcome` and one `mascot-celebration` per chapter
- Never place mascot admonitions back-to-back

### Do's and Don'ts

**Do:**

- Use Nova to introduce new topics warmly
- Include the catchphrase in welcome admonitions when natural
- Keep body text brief (1-3 sentences) and in Nova's voice
- Match the pose/image to the content type

**Don't:**

- Use Nova more than 5-6 times per chapter
- Put mascot admonitions back-to-back
- Use the mascot for purely decorative purposes
- Change Nova's personality, voice, or appearance
- Refer to Nova with he/him or she/her
