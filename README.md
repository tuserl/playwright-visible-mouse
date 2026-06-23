# Playwright Visible Mouse

A Playwright helper library that shows a **visible on-screen cursor** while your script runs. The fake cursor moves smoothly, plays click animations, and stays in sync with real Playwright mouse actions — ideal for demos, tutorials, and screen recordings.

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

```bash
npm install playwright-visible-mouse
npx playwright install chromium
```

If you cloned this repo locally:

```bash
npm install
npx playwright install chromium
```

---

## Quick start (recommended)

Create a file, for example `my-demo.js`:

```javascript
const manager = require("./lib/browserManager");

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
const manager = require("./lib/browserManager");
// or from npm: const { BrowserManager: manager } = require("playwright-visible-mouse");
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

## Example: single workflow

From `riki-new.js` — one browser, login flow, cursor parked top-left:

```javascript
const manager = require("./lib/browserManager");
manager.setUrl("https://riki.edu.vn/");

async function runGuestWorkflow() {
  const { btn, link, field, mouse, pause } = await manager.launch({ mode: "maximized" });

  await btn("Đóng").getIndex(0).click();
  await link("HỌC ONLINE").click();
  await field("Nhập email tại đây").type("admin@system.com");
  await field("Nhập mật khẩu tại đây").type("Admin@123");
  await btn("ĐĂNG NHẬP").click();

  await pause();                    // stop here for inspection
  await mouse.moveToPosition(45, 0);
}

runGuestWorkflow();
```

---

## Example: four roles at once (`split4`)

From `split4.js` — four browsers in a grid, each with different login credentials:

```javascript
const manager = require("./lib/browserManager");

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
const DemoMouse = require("./lib/demoMouse");

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
├── lib/
│   ├── browserManager.js   # BrowserManager + btn/link/field helpers
│   ├── demoMouse.js        # Visible cursor core class
│   ├── demoMouse.css       # Cursor layout and animations
│   ├── mouseAssets.css     # Cursor image URLs / base64
│   ├── humanMouse.js       # Human-like movement methods
│   └── mouseUtils.js       # Path generation utilities
├── index.js                # Package entry point
├── riki-new.js             # Example: single-browser login demo
├── split4.js               # Example: 4 parallel role logins
└── demo.js                 # Example: raw DemoMouse usage
```

---

## Run the included examples

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

---

## License

ISC
