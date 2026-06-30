const { BrowserManager } = require("../lib/browserManager");

class Session {

  static exposed = [
    "browser",
    "page",
    "btn",
    "field",
    "text",
    "checkbox",
    "radio",
    "select",
    "img",
    "link",
    "mouse",
    "notify",
    "notifyWait",
    "InteractionMode",
    "setInteractionMode",
    "tableCell",
    "selectOption",
    "selectOptionOrGetState",
    "pause"
  ];


  constructor(config) {
    this.config = config;
    this.manager = new BrowserManager();
    this.api = null;
  }

  // attach to a Playwright-Test-owned page instead of launching your own browser.
  // This is what gives trace-viewer DOM support, because the page/context already belongs to Playwright Test's tracing pipeline.
  async attach(page) {
    this.api = await this.manager.attach(page, {
      name: this.config.launch?.name ?? "Browser",
      showCursor: this.config.launch?.showCursor ?? true
    });
  }

  async launch(launchOverrides = {}) {
    this.manager.setUrl(this.config.url);

    this.api = await this.manager.launch({
      ...this.config.launch,
      ...launchOverrides
    });
  }

  async beforeEach(testInfo) {
    if (this.config.mode === "launch") {
      // only force-navigate in launch mode; in attach mode Playwright Test's
      // own page fixture is already managed, so just go to the configured url.
      await this.api.page.goto(this.config.url);
    } else {
      await this.api.page.goto(this.config.url);
    }

    await this.api.setInteractionMode(
      this.api.InteractionMode[this.config.interactionMode]
    );

    if (this.config.notify) {
      await this.api.notify(testInfo.title);
    }
  }

  async afterEach() {
    if (this.config.notify) {
      //      //not need now but keep here
      //      await this.api.page.waitForTimeout(this.config.notifyDelay);
    }
  }

  async close() {
    // Only close the browser if WE own it (launch mode).
    // In attach mode Playwright Test owns the browser lifecycle — closing it
    // here would break the test runner / trace export.
    if (this.config.mode === "launch" && this.api?.browser) {
      await this.api.browser.close();
    }
  }
}

module.exports = Session;
