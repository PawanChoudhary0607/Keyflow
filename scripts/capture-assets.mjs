#!/usr/bin/env node
/**
 * KeyFlow — repository asset capture
 * -----------------------------------
 * Produces, from the REAL running app (no mocks, no placeholders):
 *
 *   assets/screenshots/home.png
 *   assets/screenshots/test.png
 *   assets/screenshots/settings.png
 *   assets/screenshots/results.png
 *   assets/screenshots/dark-theme.png
 *   assets/screenshots/light-theme.png
 *   assets/demo.gif
 *
 * Usage (from the repo root, after `npm install` — see SETUP.md):
 *   npm run capture:assets
 *
 * Env vars:
 *   KEYFLOW_URL       base URL to hit (default http://localhost:3000)
 *   CAPTURE_SERVER    "start" (default, builds + runs `next start`, clean
 *                     chrome, no dev overlay) or "dev" (`next dev`, faster
 *                     to boot, but shows the Next.js dev indicator)
 */

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath);

const ROOT = process.cwd();
const BASE_URL = process.env.KEYFLOW_URL || "http://localhost:3000";
const SERVER_MODE = process.env.CAPTURE_SERVER || "start"; // "start" | "dev"

const SCREENSHOT_DIR = path.join(ROOT, "assets", "screenshots");
const GIF_OUTPUT = path.join(ROOT, "assets", "demo.gif");
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "keyflow-capture-"));

const SCREENSHOT_VIEWPORT = { width: 1440, height: 960 };
const DEMO_VIEWPORT = { width: 1200, height: 750 };

function log(msg) {
  console.log(`[capture] ${msg}`);
}

function sh(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: ROOT, stdio: "inherit", shell: process.platform === "win32", ...opts });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`))));
    child.on("error", reject);
  });
}

function probe(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await probe(url)) return true;
    await new Promise((r) => setTimeout(r, 750));
  }
  throw new Error(`Timed out waiting for ${url} to come up`);
}

/**
 * Reuses a server that's already running on BASE_URL, otherwise starts one
 * itself (production build by default) and returns the child process handle
 * so we can shut it down when we're done — or `null` if we reused an
 * existing server (in which case we leave it running for you).
 */
async function ensureServerRunning() {
  if (await probe(BASE_URL)) {
    log(`Found an app already running at ${BASE_URL} — reusing it.`);
    return null;
  }

  if (SERVER_MODE === "dev") {
    log("Starting `next dev`…");
    const child = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "dev"], {
      cwd: ROOT,
      stdio: "inherit",
    });
    await waitForServer(BASE_URL, 120_000);
    log("Dev server ready.");
    return child;
  }

  log("Building production bundle (`npm run build`)…");
  await sh(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"]);

  log("Starting `next start`…");
  const child = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "start"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  await waitForServer(BASE_URL, 60_000);
  log("Production server ready.");
  return child;
}

async function resetAppState(page) {
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => window.localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
}

async function settle(page, ms = 550) {
  await page.waitForTimeout(ms);
}

/** Reads the currently-rendered target words straight out of the typing card DOM. */
async function readTargetWords(page) {
  return page.evaluate(() => {
    const container = document.querySelector('main div[style*="max-height"]');
    if (!container) return [];
    return Array.from(container.children).map((el) => el.textContent || "");
  });
}

async function focusTypingInput(page) {
  const overlay = page.getByText("Click here or press any key to focus");
  if (await overlay.isVisible().catch(() => false)) {
    await overlay.click();
  }
  // Clicking the visual card is not a reliable way to focus its sr-only
  // input in Chromium automation. Focus the actual controlled input before
  // sending keystrokes.
  const input = page.locator('input[aria-label="Typing input"]');
  await input.focus();
  await page.waitForFunction(
    (selector) => document.activeElement === document.querySelector(selector),
    'input[aria-label="Typing input"]',
  );
  log("Typing input focused.");
}

/** Types full words (each followed by a space) — used to advance/finish a test. */
async function waitForWordCommit(page, word, index) {
  const input = page.locator('input[aria-label="Typing input"]');
  try {
    await page.waitForFunction(
      (selector) => document.querySelector(selector)?.value === "",
      'input[aria-label="Typing input"]',
      { timeout: 2_000 },
    );
  } catch {
    const value = await input.inputValue().catch(() => "<unavailable>");
    throw new Error(`Word ${index + 1} (\"${word}\") did not commit; input value is \"${value}\".`);
  }
  log(`Committed word ${index + 1}: ${word}`);
}

async function typeWords(page, words, { delay = 42 } = {}) {
  for (const [index, word] of words.entries()) {
    await page.keyboard.type(word, { delay });
    const input = page.locator('input[aria-label="Typing input"]');
    await input.waitFor({ state: "attached" });
    const typedValue = await input.inputValue();
    if (typedValue !== word) {
      throw new Error(`Word ${index + 1} (\"${word}\") was not entered; input value is \"${typedValue}\".`);
    }
    await page.keyboard.press("Space", { delay: 90 });
    // This is a React-controlled input. Do not begin the next word until
    // its space handler has committed the word and cleared the input.
    await waitForWordCommit(page, word, index);
  }
}

async function captureScreenshots(browser) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const context = await browser.newContext({
    viewport: SCREENSHOT_VIEWPORT,
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();

  // ---- 1. Home (default state, "time" mode, keyboard on by default) ----
  await resetAppState(page);
  await settle(page, 900);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "home.png") });
  log("Saved screenshots/home.png");

  // ---- 2 & 4. Typing session (mid-test) -> finish -> Results ----
  await resetAppState(page);
  await page.goto(`${BASE_URL}/?mode=words`, { waitUntil: "networkidle" });
  await settle(page);
  // Switch to the smallest word count so the test finishes quickly and
  // deterministically (still a fully real, played-out test).
  await page.getByRole("tab", { name: "10", exact: true }).click();
  await settle(page, 400);

  await focusTypingInput(page);
  const words = await readTargetWords(page);
  const half = Math.ceil(words.length / 2);

  await typeWords(page, words.slice(0, half));
  // Type roughly half of the next word (leave it mid-character) so the
  // screenshot shows a live caret, colored characters, and an active key
  // on the virtual keyboard.
  const nextWord = words[half] ?? "";
  const partial = nextWord.slice(0, Math.max(1, Math.floor(nextWord.length / 2)));
  const visiblePartial = partial.slice(0, -1);
  await page.keyboard.type(visiblePartial, { delay: 40 });
  await page.keyboard.down(partial.slice(-1) || "a");
  await settle(page, 120);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "test.png") });
  await page.keyboard.up(partial.slice(-1) || "a");
  log("Saved screenshots/test.png");

  // Finish from the value Chromium actually produced while the key was held.
  // This avoids either skipping or duplicating the screenshot's active key.
  const partialValue = await page.locator('input[aria-label="Typing input"]').inputValue();
  await page.keyboard.type(nextWord.slice(partialValue.length), { delay: 40 });
  await page.keyboard.press("Space", { delay: 90 });
  await waitForWordCommit(page, nextWord, half);
  await typeWords(page, words.slice(half + 1));

  await settle(page, 700);
  log(`Completion check: url=${page.url()} result saved=${await page.evaluate(() => Boolean(localStorage.getItem("keyflow:latest-result")))}`);
  await page.waitForURL(/\/results/, { timeout: 30000 });
  await settle(page, 900);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "results.png"), fullPage: true });
  log("Saved screenshots/results.png");

  // ---- 3. Settings panel (Appearance / Font / Sound all visible together) ----
  await resetAppState(page);
  await settle(page, 500);
  await page.getByRole("button", { name: "Open settings" }).click();
  await settle(page, 500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "settings.png") });
  log("Saved screenshots/settings.png");

  // ---- 5. Dark theme homepage ----
  await resetAppState(page);
  await page.getByRole("button", { name: "Open settings" }).click();
  await settle(page, 400);
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await settle(page, 300);
  await page.getByRole("button", { name: "Close settings" }).click();
  await settle(page, 600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "dark-theme.png") });
  log("Saved screenshots/dark-theme.png");

  // ---- 6. Light theme homepage ----
  await page.getByRole("button", { name: "Open settings" }).click();
  await settle(page, 400);
  await page.getByRole("button", { name: "Light", exact: true }).click();
  await settle(page, 300);
  await page.getByRole("button", { name: "Close settings" }).click();
  await settle(page, 600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "light-theme.png") });
  log("Saved screenshots/light-theme.png");

  await context.close();
}

async function recordDemo(browser) {
  const videoDir = path.join(TMP_DIR, "video");
  fs.mkdirSync(videoDir, { recursive: true });

  const context = await browser.newContext({
    viewport: DEMO_VIEWPORT,
    deviceScaleFactor: 1,
    colorScheme: "dark",
    recordVideo: { dir: videoDir, size: DEMO_VIEWPORT },
  });
  const page = await context.newPage();

  // 1. Open homepage
  await resetAppState(page);
  await settle(page, 1400);

  // 2. Change theme (color palette)
  await page.getByRole("button", { name: "Open settings" }).click();
  await settle(page, 700);
  await page.getByRole("button", { name: /^Theme/ }).click();
  await settle(page, 500);
  await page.getByRole("button", { name: "Dusk", exact: true }).click();
  await settle(page, 900);
  await page.getByRole("button", { name: "Back" }).click();
  await settle(page, 400);

  // 3. Change font
  await page.getByRole("button", { name: /^Font/ }).click();
  await settle(page, 500);
  await page.getByRole("button", { name: "Fira Code", exact: true }).click();
  await settle(page, 700);
  await page.getByRole("button", { name: "Back" }).click();
  await settle(page, 400);

  // 4. Settings panel already open — pause here so the viewer can read it,
  //    then toggle keyboard visibility off/on ("Enable keyboard").
  await page.getByRole("switch", { name: "Show Keyboard" }).click();
  await settle(page, 500);
  await page.getByRole("switch", { name: "Show Keyboard" }).click();
  await settle(page, 700);

  // 5. Close settings, start typing
  await page.getByRole("button", { name: "Close settings" }).click();
  await settle(page, 700);

  await page.goto(`${BASE_URL}/?mode=words`, { waitUntil: "networkidle" });
  await settle(page, 600);
  await page.getByRole("tab", { name: "10", exact: true }).click();
  await settle(page, 500);

  await focusTypingInput(page);
  const words = await readTargetWords(page);

  // 6 & 7. Typing + live virtual-keyboard animation
  await typeWords(page, words, { delay: 70 });

  // 8. Results
  await settle(page, 700);
  log(`Demo completion check: url=${page.url()} result saved=${await page.evaluate(() => Boolean(localStorage.getItem("keyflow:latest-result")))}`);
  await page.waitForURL(/\/results/, { timeout: 30000 });
  await settle(page, 2200);

  await context.close(); // flushes the video file to disk

  const files = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
  if (files.length === 0) throw new Error("Playwright did not produce a video file.");
  return path.join(videoDir, files[0]);
}

function webmToGif(webmPath, gifPath) {
  const palette = path.join(TMP_DIR, "palette.png");
  const filters = "fps=12,scale=800:-1:flags=lanczos";

  return new Promise((resolve, reject) => {
    ffmpeg(webmPath)
      .outputOptions([`-vf`, `${filters},palettegen=stats_mode=diff`])
      .output(palette)
      .on("error", reject)
      .on("end", () => {
        ffmpeg(webmPath)
          .input(palette)
          .complexFilter([`${filters}[x];[x][1:v]paletteuse=dither=bayer`])
          .output(gifPath)
          .on("error", reject)
          .on("end", resolve)
          .run();
      })
      .run();
  });
}

async function main() {
  const serverProcess = await ensureServerRunning();

  const browser = await chromium.launch();
  try {
    await captureScreenshots(browser);

    log("Recording demo sequence (~20-30s of real interaction)…");
    const webmPath = await recordDemo(browser);

    log("Converting recording to assets/demo.gif…");
    fs.mkdirSync(path.dirname(GIF_OUTPUT), { recursive: true });
    await webmToGif(webmPath, GIF_OUTPUT);
    log("Saved assets/demo.gif");
  } finally {
    await browser.close();
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
    if (serverProcess) {
      log("Shutting down the server we started.");
      serverProcess.kill();
    }
  }

  log("Done. All assets written under assets/.");
}

main().catch((err) => {
  console.error("[capture] FAILED:", err);
  process.exitCode = 1;
});
