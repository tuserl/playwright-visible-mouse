# Playwright Visible Mouse

A Playwright helper library that shows a **visible on-screen cursor** while your script runs. The cursor moves smoothly, plays click animations, and stays in sync with real Playwright mouse actions — ideal for demos, tutorials, and screen recordings.

The recommended way to write scripts is through **`BrowserManager`**: short, readable calls like `btn("Sign In").click()` and `field("Email").type("hello@mail.com")`. If you have used Java-style page objects or fluent builders, this should feel familiar.

<p align="center">
  <img width="426" height="240" alt="Demo preview" src="https://github.com/user-attachments/assets/dfb6a899-4418-49ce-ac12-5c4d24127c49" />
</p>

---

## What you get

| Feature | Description |
|--------|-------------|
| Visible cursor | Animated sprite on the page that follows automation |
| Human-like movement | Curved paths and random micro-delays (not robotic straight lines) |
| Simple element API | `btn`, `link`, `field` helpers — find elements by visible label/text |
| Multi-window layouts | Run 2 or 4 browsers side-by-side on one screen (`split2`, `split4`) |
| Demo controls | Show/hide cursor, pause for inspection, park cursor off-screen |

---

## Requirements

- [Node.js](https://nodejs.org/) 18+
- Google Chrome / Chromium (installed via Playwright)

---

## Installation

### Create a new project

```bash
mkdir yourProjectName
cd yourProjectName
npm init -y
````

**From npm** (use this in your own project):

```bash
npm install playwright-visible-mouse
npx playwright install chromium
```

**From a local clone** (this repo):

```bash
npm install
npx playwright install chromium
```

---

## Using as an npm package

The package entry point is [`index.js`](index.js). It exports a ready-to-use **`BrowserManager` singleton** as the default, plus named exports when you need more control.

### Import styles

```javascript
// ✅ Recommended — default export is the manager singleton
const manager = require("playwright-visible-mouse");

// Same singleton, named export
const { BrowserManager } = require("playwright-visible-mouse");
BrowserManager.setUrl("https://example.com");

// Low-level cursor class (when you manage Playwright yourself)
const { DemoMouse } = require("playwright-visible-mouse");
```

| Import | What you get |
|--------|----------------|
| `require("playwright-visible-mouse")` | `BrowserManager` singleton — call `.setUrl()` and `.launch()` directly |
| `{ BrowserManager }` | Same singleton instance as the default export |
| `{ DemoMouse }` | The `DemoMouse` class — pass a Playwright `page` and call `.install()` |

All three can be combined in one line:

```javascript
const manager = require("playwright-visible-mouse");
const { DemoMouse } = require("playwright-visible-mouse");
```

After install, write scripts in any folder — no need to copy `lib/` into your project.

---

## Quick start (recommended)

Create a file, for example `my-demo.js`:

```javascript
const manager = require("playwright-visible-mouse");

// 1. Set the site you want to open
manager.setUrl("https://example.com");

async function runDemo() {
  // 2. Launch browser — returns ready-to-use helpers
  const { btn, link, field, page, mouse, browser } = await manager.launch({
    mode: "maximized",  // or "split2", "split4"
    slowMo: 50          // optional: slow down actions (ms)
  });

  // 3. Interact using visible text on the page
  await btn("Sign In").click();
  await field("you@example.com").type("admin@system.com");
  await field("Enter your password").type("Admin@123");
  await btn("Sign In").click();

  // 4. Move cursor to top-left corner (keeps it out of the way for recording)
  await mouse.moveToPosition(45, 0);

  // 5. Close when done (optional — omit to leave browser open)
  await browser.close();
}

runDemo();
```

Run it:

```bash
node my-demo.js
```

---

## BrowserManager API

Import the manager once. It is a singleton — `setUrl` applies to every `launch()` call until you change it.

```javascript
const manager = require("playwright-visible-mouse");
```

When working inside this repo without publishing, you can also use:

```javascript
const manager = require("./lib/browserManager");
```

### `manager.setUrl(url)`

Sets the default URL opened by `launch()`.

```javascript
manager.setUrl("https://riki.edu.vn/");
```

### `manager.launch(options)`

Opens Chromium (always visible, never headless) and returns helpers.

**Options**

| Option | Default | Description |
|--------|---------|-------------|
| `url` | value from `setUrl()` | Page to open |
| `name` | `"Browser"` | Label shown in the browser console |
| `mode` | `"maximized"` | Window layout — see below |
| `tileIndex` | `0` | Which tile when using `split2` or `split4` |
| `showCursor` | `true` | `false` hides the fake cursor on start |
| `slowMo` | `0` | Playwright delay between actions (milliseconds) |

**Window modes**

| Mode | Behavior |
|------|----------|
| `"maximized"` | Full screen (default) |
| `"split2"` | Two windows, left and right. Use `tileIndex: 0` or `1` |
| `"split4"` | Four windows in a 2×2 grid. Use `tileIndex: 0`–`3` |

**Return value** — destructure what you need:

```javascript
const {
  browser,   // Playwright Browser — call browser.close() when finished
  page,      // Playwright Page — low-level access if needed
  mouse,     // DemoMouse instance — move/hide/show cursor
  btn,       // (name) => UIElement — buttons by accessible name
  link,      // (name) => UIElement — links by accessible name
  field,     // (placeholder) => UIElement — inputs by placeholder text
  pause      // () => never resolves — stops script for manual inspection
} = await manager.launch({ mode: "maximized" });
```

---

## Element helpers (`btn`, `link`, `field`)

These wrap Playwright locators and always use **human-like** mouse movement and typing under the hood.

### Click a button

```javascript
await btn("ĐĂNG NHẬP").click();
await btn("Sign In").click();
```

### Click a link

```javascript
await link("HỌC ONLINE").click();
```

### Type into an input field

Find the field by its **placeholder** text:

```javascript
await field("Nhập email tại đây").type("admin@system.com");
await field("Enter your password").type("Admin@123");
```

### When there are multiple matches — pick by index

```javascript
await btn("Đóng").getIndex(0).click();  // first matching button
await btn("Đóng").getIndex(1).click();  // second matching button
```

Each helper returns a `UIElement` with:

| Method | Description |
|--------|-------------|
| `.click()` | Move cursor to element and click |
| `.type(text)` | Click field, then type text character by character |
| `.getIndex(n)` | Select the n-th matching element (0-based) |

---

## Mouse controls

The `mouse` object from `launch()` is a `DemoMouse` instance.

### Move cursor

```javascript
// Move to pixel coordinates (x, y)
await mouse.moveToPosition(45, 0);

// Move to a Playwright locator or CSS selector
await mouse.moveTo("#submit");
await mouse.moveTo(page.getByRole("button", { name: "Save" }));
```

### Show / hide cursor

```javascript
await mouse.hide();
await mouse.show();
```

Press **Escape** in the browser to toggle visibility manually.

### Lock / unlock cursor behavior

```javascript
// locked = true  → script controls cursor (automation mode)
// locked = false → user can interact; second arg enables drag mode
await mouse.setLockState(false, false);  // follow real mouse clicks
await mouse.setLockState(false, true);   // drag the fake cursor manually
await mouse.setLockState(true, false);   // back to automation mode
```

### Pause the script (inspection mode)

```javascript
await pause();  // script stops here until you kill the process (Ctrl+C)
```

Useful when you want to inspect the page after login without closing the browser.

---

| When you need… | Use |
|----------------|-----|
| Click/type by visible label | `btn()`, `link()`, `field()` |
| Human-like move/click on a specific element | `mouse.clickHumanRandom(locator)` |
| Move cursor to x/y | `mouse.moveToPosition(x, y)` |
| Hide/show cursor, pause, lock mode | `mouse.hide()`, `mouse.show()`, `pause()`, `mouse.setLockState()` |
| Anything Playwright supports | `page.*` |

`mouse` exposes all `DemoMouse` methods — see [DemoMouse methods](#demomouse-methods) below.

---

## Example: single workflow

From `riki-new.js` — one browser, login flow, cursor parked top-left:

```javascript
const manager = require("playwright-visible-mouse");
manager.setUrl("https://riki.edu.vn/");

async function runGuestWorkflow() {
  const { btn, link, field, text, mouse, pause } = await manager.launch({ mode: "maximized" });

  // Wait up to 2s to see if "Đóng" button appears, then click the first match
  if (await btn("Đóng").exists(2000))
    await btn("Đóng").getIndex(0).click();

  await link("HỌC ONLINE").click();
  await field("Nhập email tại đây").type("admin@system.com");
  await field("Nhập mật khẩu tại đây").type("Admin@123");
  await btn("ĐĂNG NHẬP").click();

  const loginError = await text("Tài khoản hoặc mật khẩu không đúng !").exists(10000);
  console.log("Login error exists:", loginError);

  await pause();                    // stop here for inspection
  await mouse.moveToPosition(45, 0);
}

runGuestWorkflow();
```

---

## Example: four roles at once (`split4`)

From `split4.js` — four browsers in a grid, each with different login credentials:

```javascript
const manager = require("playwright-visible-mouse");

async function runWorkflows() {
  const flows = [
    { name: "Admin",           index: 0, login: { email: "admin@system.com",   pass: "Admin@123", doLogin: true } },
    { name: "Academic Manager", index: 1, login: { email: "am@gmail.com",       pass: "12345678",  doLogin: true } },
    { name: "Course Provider",  index: 2, login: { email: "cp@gmail.com",       pass: "12345678",  doLogin: true } },
    { name: "Learner",          index: 3, login: { email: "learner@gmail.com",  pass: "12345678",  doLogin: true } }
  ];

  const tasks = flows.map(async (f) => {
    const { btn, field, mouse } = await manager.launch({
      mode: "split4",
      tileIndex: f.index,
      name: f.name,
      slowMo: 20
    });

    if (f.login.doLogin) {
      await btn("Sign In").click();
      await field("you@example.com").type(f.login.email);
      await field("Enter your password").type(f.login.pass);
      await btn("Sign In").click();

      await mouse.moveToPosition(40, 0);
      await mouse.setLockState(false, false);
    }
  });

  await Promise.all(tasks);
  console.log("All workflows processed.");
}

runWorkflows();
```

Each flow gets its own browser window in a quarter of the screen. All four run in parallel.

---

## Lower-level usage: `DemoMouse` directly

If you already manage Playwright yourself, use `DemoMouse` without `BrowserManager`:

```javascript
const { chromium } = require("playwright");
const { DemoMouse } = require("playwright-visible-mouse");

(async () => {
  const browser = await chromium.launch({ headless: false, args: ["--start-maximized"] });
  const page = await (await browser.newContext({ viewport: null })).newPage();
  await page.goto("http://localhost:3001");

  const mouse = new DemoMouse(page);
  await mouse.install();
  await mouse.focus();

  await mouse.click(page.getByRole("button", { name: "Sign In" }));
  await mouse.type(page.getByPlaceholder("you@example.com"), "admin@system.com", 50);
  await mouse.moveToPosition(45, 0);

  await browser.close();
})();
```

## Mixing High-Level and Low-Level APIs

You do not have to choose a single approach. `launch()` always returns **`mouse`** (a `DemoMouse`) and **`page`** (Playwright). Keep using `btn` / `field` for normal steps, and drop to `mouse` or `page` in the same file when you need finer control.

```javascript
const manager = require("playwright-visible-mouse");
manager.setUrl("https://example.com");

async function run() {
  const { btn, field, mouse, page } = await manager.launch({ slowMo: 30 });

  // --- high-level (recommended for most steps) ---
  await btn("Sign In").click();
  await field("you@example.com").type("admin@system.com");
  await field("Enter your password").type("Admin@123");
  await btn("Sign In").click();

  // --- low-level mouse (same script, more control) ---
  await mouse.clickHumanRandom(page.getByRole("button", { name: "Users" }));
  await mouse.moveToPosition(45, 0);   // park cursor top-left for recording
  await mouse.setLockState(false, false); // let user click around

  // --- raw Playwright (escape hatch) ---
  await page.waitForTimeout(1000);
  await page.getByText("Settings").click();
}

run();
```

### DemoMouse methods

| Method | Description |
|--------|-------------|
| `install()` | Inject cursor into the page (call once after `goto`) |
| `focus()` | Bring browser window to front |
| `moveTo(target)` | Move to locator or selector (straight path) |
| `moveToPosition(x, y)` | Move to coordinates |
| `click(target)` | Move, animate click, perform Playwright click |
| `type(target, text, delay)` | Click field and type with delay between keys |
| `show()` / `hide()` | Toggle cursor visibility |
| `setLockState(locked, notFollowUser)` | Control automation vs manual mode |

### Human-like methods (from `humanMouse.js`)

These are mixed into `DemoMouse` and used automatically by `btn` / `field` helpers:

| Method | Description |
|--------|-------------|
| `clickHumanRandom(target)` | Curved path + random landing point inside element |
| `typeHumanRandom(target, text, delay)` | Human typing with jittered delays |
| `moveToPositionHumanRandom(x, y)` | Curved movement to coordinates |
| `randomMoveHuman()` | Move to a random point on screen |

---

## Custom cursor appearance

Edit `lib/mouseAssets.css` to change the cursor image:

```css
:root {
  --anime-idle-img: url('http://localhost:3002/icon.png');
  --anime-click-img: url('http://localhost:3002/icon1.png');
}
```

Layout and animations live in `lib/demoMouse.css`.

---

## Project layout

```text
playwright-visible-mouse/
│
├── index.js                          # npm entry — default export = BrowserManager singleton
├── package.json
├── playwright-visible-mouse.json     # optional config (cursor images, arrow mode)
│
├── bin/
│   └── cli.js                        # CLI: init | validate | doctor | set-image
│
├── lib/                              # core library (published to npm)
│   ├── browserManager.js             # BrowserManager + btn / link / field helpers
│   ├── demoMouse.js                  # visible cursor class
│   ├── demoMouse.css                 # cursor layout and animations
│   ├── demoMouse-arrow.css           # arrow-style cursor theme
│   ├── humanMouse.js                 # human-like movement methods
│   ├── mouseUtils.js                 # curved path generation
│   ├── mouseConfig.js                # loads playwright-visible-mouse.json
│   ├── configSchema.js               # config validation
│   └── cli/
│       ├── init.js                   # create config file
│       ├── validate.js               # validate config
│       ├── doctor.js                 # check Playwright / Node setup
│       └── setImage.js               # update cursor sprite images
│
├── docs/
│   └── configuration.md              # full config reference
│
├── demo/                             # extra examples (repo only)
│   ├── logintest.js
│   └── logintestspec.js
│
├── test/                             # ad-hoc test scripts (repo only)
│   ├── google.js
│   ├── riki.js
│   └── riki-draft.js
│
├── riki-new.js                       # example: single-browser login
├── split4.js                         # example: 4 parallel role logins
├── mouse-visibility.js               # example: show / hide cursor
└── demo.js                           # example: raw DemoMouse usage
```

**Published to npm:** `index.js`, `lib/`, and `bin/` (see `package.json` `"files"`).

**Repo only:** root example scripts, `demo/`, `test/`, and `docs/` — useful for learning and development, not shipped in the package.

Configure cursor images via `playwright-visible-mouse.json` or the CLI (`npx playwright-visible-mouse init`). See [Custom cursor appearance](#custom-cursor-appearance) and [`docs/configuration.md`](docs/configuration.md).

---

## Run the included examples

These scripts live in the repo and use local `require("./lib/...")` paths. In your own project, use `require("playwright-visible-mouse")` instead (see [Using as an npm package](#using-as-an-npm-package)).

```bash
node riki-new.js
node split4.js
node mouse-visibility.js
node demo.js
```

Make sure the target URL is reachable. For `split4.js`, set `manager.setUrl("your-app-url")` before running, or pass `url` inside each `launch()` call.

---

## Tips for beginners

1. **Start with `BrowserManager`** — you rarely need to touch Playwright directly.
2. **Use visible text** — `btn("Sign In")` and `field("Email")` match what users see on screen.
3. **Use `getIndex(0)`** when a label appears more than once (e.g. two "Close" buttons).
4. **Park the cursor** with `moveToPosition(45, 0)` before ending a recording so it does not cover UI.
5. **Use `slowMo: 20`** (or higher) when recording so actions are easier to follow.
6. **Use `pause()`** to freeze the script and inspect the page; press Ctrl+C in the terminal to exit.
7. **Full documentation** is available in the repository: [docs](https://github.com/tuserl/playwright-visible-mouse/tree/main/docs)
---

## License

ISC
