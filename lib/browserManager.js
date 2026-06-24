const { chromium } = require('playwright');
const DemoMouse = require('./demoMouse');

class UIElement {
  constructor(locator, mouse, name = "Element") {
    this.locator = locator;
    this.mouse = mouse;
    this.name = name;
  }
  getIndex(index) { return new UIElement(this.locator.nth(index), this.mouse, `${this.name}[${index}]`); }

  async exists(timeout = 1000) {
    try {
      await this.locator.waitFor({
        state: "visible",
        timeout
      });
      return true;
    } catch {
      return false;
    }
  }

  async click() {
    try { await this.mouse.clickHumanRandom(this.locator); }
    catch (e) { throw new Error(`Failed to click ${this.name}: ${e.message}`); }
  }

  async type(text) {
    try { await this.mouse.typeHumanRandom(this.locator, text, 50); }
    catch (e) { throw new Error(`Failed to type into ${this.name}: ${e.message}`); }
  }
}

class BrowserManager {
  constructor() {
    this.baseUrl = 'http://localhost:3001';
  }

  setUrl(url) { this.baseUrl = url; return this; }

  async launch(options = {}) {
    const url = options.url || this.baseUrl;
    const {
      name = 'Browser',
      mode = 'maximized', // 'maximized', 'split2', 'split4'
      tileIndex = 0,      // 0-3 for split4, 0-1 for split2
      showCursor = true,
      slowMo = 0
    } = options;

    const args = ["--no-sandbox"];
    const screenWidth = 1920;
    const screenHeight = 1080;

    // Calculate window geometry
    if (mode === 'split2') {
      const w = screenWidth / 2;
      args.push(`--window-position=${tileIndex === 0 ? 0 : w},0`, `--window-size=${w},${screenHeight}`);
    }
    else if (mode === 'split4') {
      const w = screenWidth / 2;
      const h = screenHeight / 2;
      const positions = [[0, 0], [w, 0], [0, h], [w, h]];
      args.push(`--window-position=${positions[tileIndex][0]},${positions[tileIndex][1]}`, `--window-size=${w},${h}`);
    }
    else {
      args.push("--start-maximized");
    }

    const browser = await chromium.launch({ headless: false, args, slowMo: slowMo });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    await page.goto(url);

    // Stylish console notification in browser
    await page.evaluate((name) => {
      console.log(`%c [PROCESS START]: ${name} is active `, 'background: #222; color: #bada55; font-size: 14px;');
    }, name);

    if (!showCursor) {
      await page.evaluate(() => document.body.classList.add('hide-cursor'));
    }

    const mouse = new DemoMouse(page, "transparent");
    await mouse.install();
    await mouse.focus();

    return {
      browser, page, mouse,
      btn: (name) => new UIElement(page.getByRole("button", { name }), mouse, `Button(${name})`),
      link: (name) => new UIElement(page.getByRole("link", { name }), mouse, `Link(${name})`),
      field: (ph) => new UIElement(page.getByPlaceholder(ph).nth(0), mouse, `Field(${ph})`),

      pause: async () => {
        console.log("--- 🛑 PAUSED: Inspection Mode Active ---");
        return new Promise(() => { });
      }
    };
  }
}

module.exports = new BrowserManager();
