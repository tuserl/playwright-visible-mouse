❯ npx playwright test demoEDfull-mulrole-split.spec.js
Cannot use({ launchOptions }) in a describe group, because it forces a new worker.
Make it top-level in the test file or put in the configuration file.

   at demoEDfull-mulrole-split.spec.js:18

  16 | test.describe("Left Workspace Setup", () => {
  17 |   // Scoped browser override for the left half of your screen
> 18 |   test.use({
     |        ^
  19 |     launchOptions: {
  20 |       headless: false,
  21 |       args: ["--window-position=0,0", "--window-size=960,1080", "--no-sandbox"],
Cannot use({ launchOptions }) in a describe group, because it forces a new worker.
Make it top-level in the test file or put in the configuration file.

   at demoEDfull-mulrole-split.spec.js:60

  58 | test.describe("Right Workspace Setup", () => {
  59 |   // Scoped browser override for the right half of your screen
> 60 |   test.use({
     |        ^
  61 |     launchOptions: {
  62 |       headless: false,
  63 |       args: ["--window-position=960,0", "--window-size=960,1080", "--no-sandbox"],

╭─ pwsh  ~\src\t\playwright\playwright-visible-mouse   main ?4                   



hit a strict Playwright guardrail! Playwright is complaining because launchOptions controls the physical browser executable itself. Playwright doesn't allow you to change browser executable configurations inside a describe block because it breaks how it assigns worker processes.

To get around this and still achieve your beautiful Hyprland-style split screen within the test runner, we can manually spin up the browser instances using chromium.launch() inside each test. This completely bypasses the fixture limitation.
