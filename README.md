<img width="426" height="240" alt="Video Project 1" src="https://github.com/user-attachments/assets/dfb6a899-4418-49ce-ac12-5c4d24127c49" />


```
npm install -D playwright
npx playwright install
npm install -D @playwright/test

node .\demoEDfull.js
```
---

# Playwright DemoMouse

A high-fidelity, visually animated custom cursor utility for Playwright automation scripts. `DemoMouse` mirrors your backend Playwright actions with a smooth, center-pivoted anime sprite or custom graphic, complete with click ripples, posture-tilt persistence across page reloads, and absolute fullscreen support. It is engineered specifically for creating seamless product demos, video tutorials, and automated presentation clips.

---

## 🚀 Features

* **State Persistence Across Reloads:** Tracks coordinates on the Node.js runtime environment to prevent the cursor from snapping back to $(0,0)$ on page refresh.
* **Center-Axis Rotation Physics:** Decouples the click hotspot ($0\%, 0\%$) from the display sprite axis ($center, center$), enabling heavy vertical breathing and $15^\circ+$ head tilts without dragging mouse click registration off-target.
* **Asset Isolation:** Uses a modular CSS Variable structure (`mouseAssets.css`) to isolate bulky Base64 strings or image asset paths away from layout styling.
* **Responsive Multi-Environment Support:** Adapts gracefully to custom viewports or native OS maximized/fullscreen presentation modes.
* **Realistic Interaction Pacing:** Features built-in, configurable micro-pauses for glides, hover-settles, and multi-frame click animations.

---

## 📁 File Structure

Ensure your project root matches the following setup:

```text
├── lib/
│   ├── demoMouse.js       # Core logic class
│   ├── demoMouse.css      # Layout animations & core rendering rules
│   └── mouseAssets.css    # Quarantine zone for base64 or URL asset tokens
├── .gitignore             # Optimized repository exception tracking
└── demo.js                # Core implementation / playback script

```

---

## 🛠️ Installation & Setup

### 1. Configure Assets (`lib/mouseAssets.css`)

Define the URLs or Base64 data strings for your cursor's resting state and active click states:

```css
:root {
  --anime-idle-img: url('http://localhost:3002/icon.png');
  --anime-click-img: url('http://localhost:3002/icon1.png');
}

```

---

## 💻 API Reference & Initialization

### Class: `DemoMouse`

#### `new DemoMouse(page, cursorColor)`

* `page` *(Page)*: The current Playwright page instance.
* `cursorColor` *(string)*: Color applied to the background mask container if an image layer isn't active (Defaults to `"transparent"`).

#### Methods

* `await mouse.install()`: Hooks into the page configuration lifecycle, binds browser-side animation nodes, and registers persistence handlers on page load/reload triggers.
* `await mouse.focus()`: Brings the native automated window target context safely to the frontend display.
* `await mouse.moveTo(target)`: Fluidly sweeps toward a targeted string selector or locator instance.
* `await mouse.moveToPosition(x, y)`: Parks or translates the tracking cursor directly onto explicit coordinate offsets.
* `await mouse.click(target)`: Triggers a sequential movement, changes visual states to indicate an input target, handles frame scaling transformations, and performs a native browser mouse click.
* `await mouse.type(target, text, delay)`: Targets an element, executes structural element focus, and inputs text sequentially with variable millisecond delays applied between individual character keys.

---

## 💡 Production Implementation Example

Below is a robust script (`demo.js`) utilizing `DemoMouse` in a maximized window format, handling inputs, forms, and absolute coordinate parking:

```javascript
const { chromium } = require("playwright");
const DemoMouse = require("./lib/demoMouse");

(async () => {
  // 1. Launch browser instance with specific operating system window modifiers
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000, 
    args: ["--start-maximized", "--no-sandbox"]
  });

  // 2. Configure a process kill-switch for manual window closure escape hooks
  browser.on("disconnected", () => {
    console.log("Browser window closed. Terminating process environment...");
    process.exit(0);
  });

  // 3. Clear explicit layout limits so viewport matches scale factors fluidly
  const guestPage = await (
    await browser.newContext({ 
      viewport: null,
      deviceScaleFactor: undefined 
    })
  ).newPage();

  await guestPage.goto("http://localhost:3001");

  // 4. Initialize and install the custom tracking system
  const guestMouse = new DemoMouse(guestPage, "transparent");
  await guestMouse.install();
  await guestMouse.focus();

  // 5. Interaction Sequence
  const signInButton = guestPage.getByRole("button", { name: "Sign In" });
  await guestMouse.click(signInButton);

  const emailInput = guestPage.getByPlaceholder("you@example.com").nth(0);
  const passwordInput = guestPage.getByPlaceholder("Enter your password").nth(0);
  
  // Custom delays between letters keep humanization visually balanced
  await guestMouse.type(emailInput, "yourmail", 50);
  await guestMouse.type(passwordInput, "yourpass", 50);

  await guestMouse.click(signInButton);

  const userButton = guestPage.getByRole("button", { name: "Users" });
  await guestMouse.click(userButton);

  await guestPage.waitForTimeout(500);

  // 6. Clear display lines by parking cursor away at coordinates (45, 0)
  console.log("Parking cursor safe at rest coordinates...");
  await guestMouse.moveToPosition(45, 0);

  // Maintain window lifespan layout for capture buffers before closing
  await guestPage.waitForTimeout(3000);

  console.log("Execution chain complete. Shutting down browser layer...");
  await browser.close();
})();

```
