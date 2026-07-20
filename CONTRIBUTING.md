# Contributing to KeyFlow

Thanks for your interest in contributing! KeyFlow aims to stay small,
fast, and simple — please keep that spirit in mind for any change.

## Getting Started

1. Fork the repository and clone your fork
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Create a branch: `git checkout -b feat/short-description`

## Development Guidelines

- **Keep it simple.** KeyFlow intentionally has no backend, no database,
  and no auth. New features should work entirely client-side with
  `localStorage`.
- **Match the existing structure.** Components live under `components/`,
  grouped by feature area; shared logic goes in `lib/` or `hooks/`.
- **Type everything.** This is a TypeScript project — avoid `any` where
  reasonably possible.
- **Style with Tailwind.** Use existing design tokens (see
  `app/globals.css`) instead of hardcoding colors.
- **Run checks before pushing:**

  ```bash
  npm run lint
  npm run format
  npm run build
  ```

## Commit Style

We loosely follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add custom word list upload
fix: correct WPM calculation for quote mode
docs: update sound pack instructions
chore: bump dependencies
```

## Pull Requests

- Keep PRs focused on a single change
- Fill out the PR template
- Link any related issues
- Add screenshots/GIFs for UI changes when possible

## Reporting Bugs & Requesting Features

Please use the issue templates under `.github/ISSUE_TEMPLATE/`.

## Adding a Sound Pack

KeyFlow supports two kinds of sound packs — see
[`lib/sound-packs.ts`](./lib/sound-packs.ts) for the full picture:

- **Sample-based** (like the Typewriter pack): a folder with a few
  files per key category (`letters/key-01.wav`, `numbers/key-01.wav`,
  `modifier.wav`, `backspace.wav`, `enter.wav`, `space.wav`). One is
  picked at random per keystroke.
- **Sprite-based** (like the Mechanical pack): a single audio sprite
  plus a per-key offset map in
  [`lib/mechanical-sprite-map.ts`](./lib/mechanical-sprite-map.ts).

Add a folder under `public/sounds/`, register it in
`lib/sound-packs.ts`, and add the id to the `SoundPackId` union in
`types/index.ts` — it will show up in Settings automatically.

## Code of Conduct

By participating, you agree to abide by our
[Code of Conduct](./CODE_OF_CONDUCT.md).
