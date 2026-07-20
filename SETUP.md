# KeyFlow — asset capture setup

These files add a self-contained Playwright automation that captures the 6
real screenshots and the demo GIF from your actual running app. No app code
is touched.

## 1. Copy these files into the repo

```
keyflow/
├── playwright.config.ts        ← new
├── package.json                ← edit (see step 2)
└── scripts/
    └── capture-assets.mjs      ← new
```

## 2. Add to `package.json`

Add these two devDependencies-block entries and one script entry (don't
overwrite the rest of your file — just merge these keys in):

```jsonc
{
  "scripts": {
    // ...your existing scripts...
    "capture:assets": "node scripts/capture-assets.mjs"
  },
  "devDependencies": {
    // ...your existing devDependencies...
    "playwright": "^1.48.0",
    "ffmpeg-static": "^5.2.0",
    "fluent-ffmpeg": "^2.1.3"
  }
}
```

## 3. Install (exact commands)

```bash
npm install
npx playwright install chromium --with-deps
```

`ffmpeg-static` downloads a prebuilt ffmpeg binary automatically during
`npm install` — no separate system ffmpeg install needed.

## 4. Run it — this is the one command

```bash
npm run capture:assets
```

What it does, automatically:
1. Checks if the app is already running at `http://localhost:3000` — if not,
   runs `npm run build && npm run start` itself (a real production build, so
   the screenshots don't show the Next.js dev overlay) and waits until it
   responds.
2. Drives a real Chromium browser through your actual UI — clicking the real
   settings sheet, real theme/font pickers, typing into the real hidden
   input that powers the typing engine, letting a real "words" mode test
   complete and land on the real `/results` page.
3. Saves:
   - `assets/screenshots/home.png`
   - `assets/screenshots/test.png`
   - `assets/screenshots/settings.png`
   - `assets/screenshots/results.png`
   - `assets/screenshots/dark-theme.png`
   - `assets/screenshots/light-theme.png`
4. Records a second real run of the same UI (home → theme change → font
   change → settings → keyboard toggle → typing → results, ~20-30s) as
   video, then converts it with ffmpeg (palette-optimized two-pass encode,
   12fps, 800px wide) to `assets/demo.gif`, sized for a GitHub README.
5. Shuts down the server it started (if it started one) and cleans up all
   temp files.

## Notes / things you may want to tweak

- **Server reuse**: if you already have `npm run dev` running on port 3000
  when you run the capture script, it detects that and uses it instead of
  starting its own server — just faster iteration while you tune the script.
  Set `CAPTURE_SERVER=dev` if you want the script to start `next dev` itself
  instead of building for production.
- **Settings screenshot**: the settings sheet shows one sub-view at a time
  (root / themes / fonts). The root view is what's captured for
  `settings.png` because it's the only view where the theme entry, font
  entry, and the full sound-pack section are all visible together in a
  single frame. If you'd rather have the literal themes *grid* (12 color
  swatches) as its own shot, duplicate the settings block in
  `captureScreenshots()` and add a `themes-panel.png`/`fonts-panel.png` —
  the script already knows how to navigate into those sub-views (see the
  `recordDemo()` function for the exact clicks).
- **Word list determinism**: the script reads the actual words rendered in
  the typing card from the DOM at runtime rather than hardcoding any text —
  so it stays correct even if you change `lib/word-list.ts`.
- Re-running the script clears `localStorage` before each screenshot
  scenario so results are deterministic regardless of what a previous run
  left behind.
