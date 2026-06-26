const { chromium } = require('playwright');
const DemoMouse = require('./demoMouse');

// ---------------------------
// Private helper
// ---------------------------
async function getColumnIndex(page, columnName) {
  return await page
    .locator("table thead th")
    .evaluateAll((headers, name) =>
      headers.findIndex(
        (h) => h.textContent.trim() === name
      ),
      columnName
    );
}

function createLocator(page, options, defaults = {}) {
  if (typeof options === "string") {
    options = { [defaults.defaultKey]: options };
  }

  if (options.text)
    return defaults.text(options.text);

  if (options.label)
    return page.getByLabel(options.label, { exact: true });

  if (options.placeholder)
    return page.getByPlaceholder(options.placeholder);

  if (options.role)
    return page.getByRole(options.role, { name: options.name });

  if (options.id)
    return page.locator(`#${options.id}`);

  if (options.name)
    return page.locator(`[name="${options.name}"]`);

  if (options.class)
    return page.locator(`.${options.class.split(" ").join(".")}`);

  if (options.alt)
    return page.getByRole("img", { name: options.alt });

  throw new Error("Unsupported selector.");
}

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

  async press(key) {
    try {
      const mode = this.getModeFn();

      if (mode === InteractionMode.HUMAN) {
        await this.mouse.moveTo(this.locator);
        await this.locator.focus();
      }

      await this.locator.press(key);
    } catch (e) {
      throw new Error(`Failed to press ${key} on ${this.name}: ${e.message}`);
    }
  }

  async clear() {
    try {
      const mode = this.getModeFn();

      if (mode === InteractionMode.HUMAN) {
        await this.mouse.clickHumanRandom(this.locator);
      }

      await this.locator.clear();
    } catch (e) {
      throw new Error(`Failed to clear ${this.name}: ${e.message}`);
    }
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
      //else { await this.mouse.moveTo(this.locator); await this.locator.fill(text); }
      else { await this.mouse.moveTo(this.locator); await this.mouse.type(this.locator, text, 50); }
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

    const selectElement = (selector) =>
      new UIElement(
        createLocator(page, selector, {
          defaultKey: "label",
          text: (v) => page.getByLabel(v),
        }),
        mouse,
        "Select",
        getMode
      );

    const selectOption = async (selector, value) => {
      const dropdown = selectElement(selector);

      await dropdown.click();
      await dropdown.loc.selectOption(value);
    };


    return {
      browser, page, mouse,
      InteractionMode,
      setInteractionMode: (mode) => this.setInteractionMode(mode),

      btn: (selector) =>
        new UIElement(
          createLocator(page, selector, {
            defaultKey: "text",
            text: (v) => page.getByRole("button", { name: v }).or(page.getByRole("link", { name: v }))
          }),
          mouse,
          "Button",
          getMode
        ),

      link: (selector) =>
        new UIElement(
          createLocator(page, selector, {
            defaultKey: "text",
            text: (v) => page.getByRole("link", { name: v }),
          }),
          mouse,
          `Link`,
          getMode
        ),

      field: (selector) =>
        new UIElement(
          createLocator(page, selector, {
            defaultKey: "placeholder",
          }),
          mouse,
          "Field",
          getMode
        ),

      text: (selector) =>
        new UIElement(
          createLocator(page, selector, {
            defaultKey: "text",
            text: (v) => page.getByText(v),
          }),
          mouse,
          "Text",
          getMode
        ),


      img: (selector) =>
        new UIElement(
          createLocator(page, selector, {
            defaultKey: "alt",
          }),
          mouse,
          "Image",
          getMode
        ),

      checkbox: (selector) =>
        new UIElement(
          createLocator(page, selector, {
            defaultKey: "label",
            text: (v) => page.getByLabel(v, { exact: true }),
          }),
          mouse,
          "Checkbox",
          getMode
        ),

      radio: (selector) =>
        new UIElement(
          createLocator(page, selector, {
            defaultKey: "label",
            text: (v) => page.getByLabel(v, { exact: true }),
          }),
          mouse,
          "Radio",
          getMode
        ),

      select: selectElement,

      selectOption,

      selectOptionOrGetState: async (fieldName, value = null) => {
        if (value != null) {
          await selectOption({ name: fieldName }, value);
          return null;
        }

        const dropdown = page.locator(`select[name="${fieldName}"]`);

        return {
          isRequired: await dropdown.evaluate(el => el.required),
          value: await dropdown.inputValue()
        };
      },

      tableCell: async (row, column) => {
        let rowLocator;

        if (typeof row === "number") {
          rowLocator = page
            .locator("table tbody tr")
            .nth(row);
        } else {
          if (typeof row === "string") {
            row = { text: row };
          }

          rowLocator = createLocator(
            page.locator("table tbody tr"),
            row,
            {
              defaultKey: "text",
              text: (v) =>
                page.locator("table tbody tr").filter({ hasText: v }),
            }
          );
        }

        let cell;

        if (typeof column === "number") {
          cell = rowLocator.locator("td").nth(column);
        } else {
          const index = await getColumnIndex(page, column);
          cell = rowLocator.locator("td").nth(index);
        }

        return new UIElement(
          cell,
          mouse,
          "Cell",
          getMode
        );
      },

      pause: async () => { console.log("--- 🛑 PAUSED ---"); return new Promise(() => { }); }
    };
  }
}

module.exports = {
  BrowserManager,
  createLocator
};
