# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Achievements
- User profiles
- Multiplayer typing races
- Typing history and progress tracking
- Custom theme builder
- Additional sound packs
- Performance analytics
- Plugin system

## [1.0.0] - 2026-07-20

### Added

- First public open-source release.
- Full repository documentation: README, LICENSE, CONTRIBUTING,
  CODE_OF_CONDUCT, SECURITY, THIRD_PARTY_NOTICES, issue and pull
  request templates.

No application functionality changed in this release — see 0.3.1 and
earlier for the full feature history.

## [0.3.1] - 2026-07-20

### Fixed

- **"Try Again" on the Results page 404'd** (linked to a `/test` route
  that no longer exists after the single-page redesign). It now
  resumes a new session with the exact same mode, duration/word
  count/quote length, and modifiers as the test just completed, via a
  small `lib/storage.ts` addition (`saveLastConfig`/`loadLastConfig`)
  — the typing engine itself is unchanged.
- The empty-results "Start a test" link had the same broken `/test`
  reference; fixed to point at `/`.

### Changed

- Further keycap visual refinement: stronger border contrast, a subtle
  top-surface light catch, deeper layered shadows, and a touch of 3D
  tilt on press — visuals only, same keyboard layout and behavior.

## [0.3.0] - 2026-07-20

### Changed

- **Mechanical sound pack now uses real per-key recordings** (an audio
  sprite with a precise offset for every physical key), sourced from
  Keythm under Apache License 2.0 — see `THIRD_PARTY_NOTICES.md`.
  Mechanical is now the default sound pack.
- **Typewriter pack** now picks from several original samples per key
  category (letters, numbers, modifier, backspace, enter, space) with
  small random pitch/volume jitter, instead of one repeated sample.
- **Theme switching bug fixed**: a hardcoded `data-palette` on `<body>`
  was silently overriding every palette choice. Removed the conflict.
- **Light/Dark/System appearance fixed**: generated genuine light-mode
  tokens for all 12 palettes and corrected the `next-themes` provider
  config (`enableSystem` was off).
- **Virtual keyboard rebuilt**: realistic keycap proportions, layered
  inset/drop shadows for depth, and a real spring-physics press
  animation (key drops ~2.5px, compresses, springs back) instead of a
  color swap.
- **Focus mode** now uses a real CSS blur filter on surrounding chrome
  (not just opacity), while the typing card and live stats stay sharp.
- Settings panel blur strengthened and now clears instantly on close.
- Live stats redesigned as a compact glass status pill.
- Control bar spacing/alignment tightened for a more premium segmented-
  control feel.
- GitHub button now points at the project's actual repository by default.

## [0.2.0] - 2026-07-19

### Changed

- **Rearchitected as a single-page experience.** The home page and typing
  test page are merged into one non-scrolling `/` route; the results
  page remains separate.
- Expanded color themes from 5 to 12 (added Frost, Bloom, Tide, Moss,
  Ink, Neon, Mocha).
- Replaced the 3-option font picker (mono/sans/serif) with 14 named
  fonts across Mono and Sans groups, including Geist Mono.
- Appearance is now Light/Dark/System (via next-themes) instead of a
  single dark-mode toggle.

### Added

- **Zen mode** — endless, untimed typing practice.
- **Modifiers** — Punctuation, Numbers, Capital Words, and
  mutually-exclusive Easy/Hard difficulty, applied to word/quote generation.
- **Focus mode** — UI dims once typing starts and hides entirely after
  5 seconds of mouse inactivity; moving the mouse restores it.
- **Tab + Enter** keyboard shortcut to restart a test instantly.
- **Animated virtual keyboard** with live pressed-key highlighting,
  wrong-key flash, and Shift/Caps Lock tracking (desktop only).
- **Ghost Mode** — dims not-yet-reached words for better focus.
- Dedicated Error Sound ("Fah Mode") toggle, independent of the sound pack.
- Quote length selector (Short/Medium/Long).
- `NEXT_PUBLIC_GITHUB_URL` environment variable for the top bar's
  GitHub button.

### Fixed

- Typing box no longer clips the final visible line.

## [0.1.0] - 2026-07-19

### Added

- Initial release of KeyFlow
- Time, Words, and Quote typing test modes
- Live WPM and accuracy tracking while typing
- Detailed results page with WPM chart, accuracy, consistency, and
  character/word breakdowns
- Five color themes (Flow, Paper, Dusk, Terminal, Sunset) with light/dark mode
- Three typing fonts (mono, sans, serif)
- Mechanical and Typewriter keyboard sound packs
- Fully local persistence via `localStorage` — settings, latest result,
  and result history
- Responsive, glassmorphism-inspired UI built with Tailwind CSS and
  Framer Motion
