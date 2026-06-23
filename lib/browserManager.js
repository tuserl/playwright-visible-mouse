const { chromium } = require('playwright');
const DemoMouse = require('./demoMouse');

class UIElement {
  constructor(locator, mouse, name = "Element") {
    this.locator = locator;
    this.mouse = mouse;
    this.name = name;
  }
  getIndex(index) { return new UIElement(this.locator.nth(index), this.mouse, `${this.name}[${index}]`); }

  async click() {
    try { await this.mouse.click(this.locator); }
    catch (e) { throw new Error(`Failed to click ${this.name}: ${e.message}`); }
  }

  async type(text) {
    try { await this.mouse.type(this.locator, text, 50); }
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
    const { mode = 'tiled', side = 'left', width = 960, height = 1080, showCursor = true } = options;



    const args = ["--no-sandbox"];
    if (mode === 'tiled') args.push(`--window-position=${side === 'left' ? 0 : 960},0`, `--window-size=${width},${height}`);
    else {
      args.push("--start-maximized");
    }

    const browser = await chromium.launch({ headless: false, args });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    await page.goto(url);

    await page.addStyleTag({
      content: `
      body.hide-cursor #demoMouseWrapper, 
      body.hide-cursor #demoMouse, 
      body.hide-cursor .click-ripple { 
        display: none !important; 
      }
    `
    });

    // Set initial state
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
      // This pause only stops the current function execution
      pause: async () => {
        console.log("--- 🛑 PAUSED: Inspection Mode Active ---");
        return new Promise(() => { });
      }
    };
  }
}

module.exports = new BrowserManager();
