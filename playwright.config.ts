/**
 * This config exists so `npx playwright install` / editor tooling picks up
 * the project correctly, and so the capture script's browser launch options
 * stay consistent with anything you later add as real Playwright *tests*.
 *
 * The actual asset-capture flow (scripts/capture-assets.mjs) does NOT run
 * through the Playwright test runner — it needs a single long-lived browser
 * session that does screenshots AND a real-time video recording in one pass,
 * which the test runner's per-test isolation model isn't a good fit for. It
 * uses the `playwright` core package directly instead. Keeping this config
 * around costs nothing and means `npx playwright test` still works if you
 * add real tests later.
 */
export default {
  timeout: 60_000,
  use: {
    baseURL: process.env.KEYFLOW_URL || "http://localhost:3000",
    viewport: { width: 1440, height: 960 },
    colorScheme: "dark",
  },
};
