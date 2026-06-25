# Writing Test Cases

This guide shows how to write Playwright test cases using **playwright-visible-mouse** 

The recommended pattern: **Setup → Action → Assertion**.

---

## Prerequisites

Install dependencies and Chromium:

```bash
npm install playwright-visible-mouse @playwright/test
npx playwright install chromium
```

---

## Run a test

Run one spec file with the browser visible and an HTML report:

```bash
npx playwright test test/test.spec.js --headed --reporter=html
```

| Flag | What it does |
|------|----------------|
| `--headed` | Opens a visible browser window (not headless) |
| `--reporter=html` | Writes an HTML report to `playwright-report/` |

Open the report after the run:

```bash
npx playwright show-report
```

Other useful commands:

```bash
# Run all spec files in the project
npx playwright test --headed --reporter=html

# Run one test by name
npx playwright test test/test.spec.js -g "Guest login success" --headed

# Run with Playwright UI (interactive)
npx playwright test test/test.spec.js --ui
```

---

## Test case structure

Every test case follows the same shape:

```text
Test Case
│
├── Setup          → shared config (URL, timeout, beforeEach)
│
├── Action         → steps the user would perform (login, click, type)
│
└── Assertion      → check the expected result (pass / fail)
```

Keep **actions** in a reusable function when several tests share the same flow (e.g. login with different credentials).

---

## Minimal example

Create `test/my-login.spec.js`:

```javascript
const { test, expect } = require("@playwright/test");
const manager = require("playwright-visible-mouse");

test.beforeEach(async () => {
  manager.setUrl("https://example.com");
});

test("user can sign in", async () => {
  const { btn, field } = await manager.launch({ mode: "maximized" });

  await btn("Sign In").click();
  await field("you@example.com").type("admin@system.com");
  await field("Enter your password").type("Admin@123");
  await btn("Sign In").click();

  const dashboardVisible = await btn("Users").exists(5000);
  expect(dashboardVisible).toBe(true);
});
```

Run it:

```bash
npx playwright test test/my-login.spec.js --headed --reporter=html
```

When working inside this repo, use a relative import instead:

```javascript
const manager = require("../lib/browserManager");
```

---

## Full example (from `test/test.spec.js`)

This file runs **two test cases in parallel** — one expects login to fail, one expects success.

```javascript
const { test, expect } = require("@playwright/test");
const manager = require("playwright-visible-mouse");

test.describe.configure({ mode: "parallel" });
test.setTimeout(60000);

async function login(email, password) {
  const { btn, link, field, text } =
    await manager.launch({ mode: "maximized" });

  await link("HỌC ONLINE").click();
  await field("Nhập email tại đây").type(email);
  await field("Nhập mật khẩu tại đây").type(password);
  await btn("ĐĂNG NHẬP").click();

  return await text(
    "Tài khoản hoặc mật khẩu không đúng !"
  ).exists(6000);
}

test.beforeEach(async () => {
  manager.setUrl("http://riki.edu.vn");
});

test("Guest login failure", async () => {
  const loginError = await login("admin@system.com", "Admin@123");
  expect(loginError).toBe(true);
});

test("Guest login success", async () => {
  const loginError = await login("valid@email.com", "correctPassword");
  expect(loginError).toBe(false);
});
```

Run:

```bash
npx playwright test test/test.spec.js --headed --reporter=html
```

---

## Step-by-step breakdown

### 1. Import Playwright Test and the manager

```javascript
const { test, expect } = require("@playwright/test");
const manager = require("playwright-visible-mouse");
```

- `test` — define test cases
- `expect` — assertions (same as Jest-style matchers)
- `manager` — launches browser + visible mouse + helpers

### 2. Configure the suite (optional)

```javascript
test.describe.configure({ mode: "parallel" }); // run tests at the same time
test.setTimeout(60000);                          // 60 seconds per test
```

### 3. Setup — run before each test

```javascript
test.beforeEach(async () => {
  manager.setUrl("https://your-app.com");
});
```

You can also pass a URL per launch:

```javascript
await manager.launch({ url: "https://your-app.com", mode: "maximized" });
```

### 4. Action — reusable workflow function

Extract shared steps into a function. Return whatever you need to assert later.

```javascript
async function login(email, password) {
  const { btn, field } = await manager.launch({ mode: "maximized" });

  await btn("Sign In").click();
  await field("you@example.com").type(email);
  await field("Enter your password").type(password);
  await btn("Sign In").click();

  return await btn("Users").exists(5000);
}
```

### 5. Assertion — expected result

```javascript
test("login shows dashboard", async () => {
  const success = await login("admin@system.com", "Admin@123");
  expect(success).toBe(true);
});
```

Use Playwright's built-in matchers when you already have `page`:

```javascript
await expect(page.getByRole("button", { name: "Users" })).toBeVisible();
```

---

## Helpers returned by `manager.launch()`

| Helper | Usage | Description |
|--------|--------|-------------|
| `btn(name)` | `await btn("Sign In").click()` | Button by visible label |
| `link(name)` | `await link("Home").click()` | Link by accessible name |
| `field(placeholder)` | `await field("Email").type("a@b.com")` | Input by placeholder text |
| `text(content)` | `await text("Error message").exists(3000)` | Check if text appears on page |
| `mouse` | `await mouse.moveToPosition(45, 0)` | Low-level cursor control |
| `page` | `await page.waitForTimeout(1000)` | Raw Playwright page |
| `browser` | `await browser.close()` | Close browser when finished |
| `pause()` | `await pause()` | Stop script for manual inspection |

### `exists(timeout)` — common assertion helper

Waits up to `timeout` ms for an element to become visible. Returns `true` or `false` (does not throw).

```javascript
const hasError = await text("Invalid password").exists(3000);
expect(hasError).toBe(true);

const loggedIn = await btn("Dashboard").exists(5000);
expect(loggedIn).toBe(true);
```

### `getIndex(n)` — when multiple elements match

```javascript
await btn("Close").getIndex(0).click();
```

---

## Launch options in tests

```javascript
await manager.launch({
  mode: "maximized",   // "maximized" | "split2" | "split4"
  tileIndex: 0,        // window slot for split2 (0–1) or split4 (0–3)
  name: "Admin test",  // label in browser console
  slowMo: 20,          // slow down actions (good for demos / debugging)
  showCursor: true,    // false = hide fake cursor on start
  url: "https://..."   // override manager.setUrl()
});
```

### Parallel tests with split layout

Run multiple roles side-by-side (one browser per test):

```javascript
test("Admin login", async () => {
  const { btn, field } = await manager.launch({
    mode: "split2",
    tileIndex: 0,
    name: "Admin"
  });
  // ...
});

test("Learner login", async () => {
  const { btn, field } = await manager.launch({
    mode: "split2",
    tileIndex: 1,
    name: "Learner"
  });
  // ...
});
```

Use `test.describe.configure({ mode: "parallel" })` so both run at the same time.

---

## Alternative: DemoMouse + Playwright `page` fixture

If you prefer Playwright's built-in `page` instead of `BrowserManager.launch()`, attach `DemoMouse` manually:

```javascript
const { test, expect } = require("@playwright/test");
const { DemoMouse } = require("playwright-visible-mouse");

test.use({
  viewport: null,
  launchOptions: {
    args: ["--start-maximized", "--no-sandbox"]
  }
});

test("login with visible mouse", async ({ page }) => {
  await page.goto("http://localhost:3001");

  const mouse = new DemoMouse(page);
  await mouse.install();
  await mouse.focus();

  await mouse.click(page.getByRole("button", { name: "Sign In" }));
  await mouse.type(page.getByPlaceholder("you@example.com"), "admin@system.com", 50);
  await mouse.type(page.getByPlaceholder("Enter your password"), "Admin@123", 50);
  await mouse.click(page.getByRole("button", { name: "Sign In" }));

  await expect(page.getByRole("button", { name: "Users" })).toBeVisible();
});
```

| Approach | Best for |
|----------|----------|
| `BrowserManager` + `btn` / `field` | Readable tests, Java-style fluent API |
| `DemoMouse` + `{ page }` fixture | Standard Playwright test projects, fixtures, tracing |

---

## Optional: `playwright.config.js`

Create this in your project root to avoid passing flags every time:

```javascript
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  reporter: [["html", { open: "never" }]],
  use: {
    headless: false,
    viewport: null,
    launchOptions: {
      args: ["--start-maximized", "--no-sandbox"]
    }
  }
});
```

Then run:

```bash
npx playwright test test/test.spec.js --reporter=html
npx playwright show-report
```

Note: when using `BrowserManager.launch()`, the manager opens its **own** browser. The config above mainly helps with specs that use Playwright's `{ page }` fixture. For manager-based tests, `--headed` and `--reporter=html` on the command line are enough.

---

## Tips

1. **One test = one clear outcome** — e.g. "login fails with wrong password", not "login and navigate and edit profile".
2. **Reuse action functions** — `login(email, pass)` keeps tests short and consistent.
3. **Use `exists()` for boolean checks** — good for error messages or optional UI.
4. **Use `expect(...).toBeVisible()`** when you have a `page` locator and want Playwright retries.
5. **Set `test.setTimeout()`** — login flows with visible mouse movement need more time than default.
6. **Park the cursor** — `await mouse.moveToPosition(45, 0)` before assertions or screenshots so the cursor does not cover UI.
7. **HTML report** — use `--reporter=html` during development; open with `npx playwright show-report`.

---

## File layout

```text
your-project/
├── test/
    └── test.spec.js          # your test cases (*.spec.js)

```

Example specs in this repo:

| File | Description |
|------|-------------|
| `test/test.spec.js` | BrowserManager + parallel login tests |

Check out html element testing: [test folder](https://github.com/tuserl/playwright-visible-mouse/tree/main/test/html)

---

## Related docs

- [Configuration](./configuration.md) — cursor images and `playwright-visible-mouse.json`
- [README](../README.md) — library usage, API reference, examples
