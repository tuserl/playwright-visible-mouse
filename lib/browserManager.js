const { chromium } = require('playwright');
const DemoMouse = require('./demoMouse');

// Enum for interaction modes
const InteractionMode = {
  HUMAN: 'HUMAN',
  NORMAL: 'NORMAL',
  INSTANT: 'INSTANT'
};

class UIElement {
  constructor(locator, mouse, name = "Element", getModeFn) {
    this.locator = locator;
    this.mouse = mouse;
    this.name = name;
    this.getModeFn = getModeFn;
  }

  getIndex(index) {
    return new UIElement(this.locator.nth(index), this.mouse, `${this.name}[${index}]`, this.getModeFn);
  }

  get loc() { return this.locator; }

  async exists(timeout = 1000) {
    try { await this.locator.waitFor({ state: "visible", timeout }); return true; }
    catch { return false; }
  }

  async click() {
    try {
      await this.locator.waitFor({ state: "visible" });
      const mode = this.getModeFn();
      if (mode === InteractionMode.INSTANT) await this.locator.click();
      else if (mode === InteractionMode.HUMAN) await this.mouse.clickHumanRandom(this.locator);
      else await this.mouse.click(this.locator);
    } catch (e) { throw new Error(`Failed to click ${this.name}: ${e.message}`); }
  }

  async type(text) {
    try {
      const mode = this.getModeFn();
      if (mode === InteractionMode.INSTANT) await this.locator.fill(text);
      else if (mode === InteractionMode.HUMAN) await this.mouse.typeHumanRandom(this.locator, text, 50);
      else { await this.mouse.moveTo(this.locator); await this.locator.fill(text); }
    } catch (e) { throw new Error(`Failed to type into ${this.name}: ${e.message}`); }
  }
}

class BrowserManager {
  constructor() {
    this.baseUrl = 'http://localhost:3001';
    this.mode = InteractionMode.HUMAN;
  }

  setUrl(url) { this.baseUrl = url; return this; }
  setInteractionMode(mode) { if (Object.values(InteractionMode).includes(mode)) this.mode = mode; }

  async launch(options = {}) {
    const url = options.url || this.baseUrl;
    const {
      name = 'Browser',
      mode = 'maximized',
      tileIndex = 0,
      showCursor = true,
      slowMo = 0
    } = options;

    const args = ["--no-sandbox"];
    const screenWidth = 1920;
    const screenHeight = 1080;

    // Window Geometry Logic
    if (mode === 'split2') {
      const w = screenWidth / 2;
      args.push(`--window-position=${tileIndex === 0 ? 0 : w},0`, `--window-size=${w},${screenHeight}`);
    } else if (mode === 'split4') {
      const w = screenWidth / 2;
      const h = screenHeight / 2;
      const positions = [[0, 0], [w, 0], [0, h], [w, h]];
      args.push(`--window-position=${positions[tileIndex][0]},${positions[tileIndex][1]}`, `--window-size=${w},${h}`);
    } else {
      args.push("--start-maximized");
    }

    const browser = await chromium.launch({ headless: false, args, slowMo });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    await page.goto(url);

    // Initializations
    await page.evaluate((name) => {
      console.log(`%c [PROCESS START]: ${name} is active `, 'background: #222; color: #bada55; font-size: 14px;');
    }, name);

    if (!showCursor) await page.evaluate(() => document.body.classList.add('hide-cursor'));

    const mouse = new DemoMouse(page, "transparent");
    await mouse.install();
    await mouse.focus();

    const getMode = () => this.mode;

    return {
      browser, page, mouse,
      InteractionMode,
      setInteractionMode: (mode) => this.setInteractionMode(mode),
      btn: (name) => new UIElement(page.getByRole("button", { name }), mouse, `Button(${name})`, getMode),
      link: (name) => new UIElement(page.getByRole("link", { name }), mouse, `Link(${name})`, getMode),
      field: (ph) => new UIElement(page.getByPlaceholder(ph).nth(0), mouse, `Field(${ph})`, getMode),
      text: (content) => new UIElement(page.getByText(content), mouse, `Text(${content})`, getMode),
      img: (alt) => new UIElement(page.getByRole("img", { name: alt }), mouse, `Image(${alt})`, getMode),
      checkbox: (label) => new UIElement(page.getByLabel(label, { exact: true }), mouse, `Checkbox(${label})`, getMode),
      radio: (label) => new UIElement(page.getByLabel(label, { exact: true }), mouse, `Radio(${label})`, getMode),
      select: (label) => new UIElement(page.getByLabel(label), mouse, `Select(${label})`, getMode),
      tableCell: (rowText, colName) => {
        const row = page.locator("table tbody tr").filter({ hasText: rowText });
        return new UIElement(row.locator("td").nth(1), mouse, `Cell(${rowText}, ${colName})`, getMode);
      },
      selectOption: async (label, value) => {
        const dropdown = new UIElement(page.getByLabel(label), mouse, `Select(${label})`, getMode);
        await dropdown.click();
        await page.waitForTimeout(500);
        await page.getByLabel(label).selectOption(value);
        await page.waitForTimeout(300);
      },
      pause: async () => { console.log("--- 🛑 PAUSED ---"); return new Promise(() => { }); }
    };
  }
}

module.exports = new BrowserManager();
