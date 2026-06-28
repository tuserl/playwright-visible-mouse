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

  async launch(launchOverrides = {}) {
    this.manager.setUrl(this.config.url);

    this.api = await this.manager.launch({
      ...this.config.launch,
      ...launchOverrides
    });
  }

  async beforeEach(testInfo) {
    await this.api.page.goto(this.config.url);

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
    if (this.api?.browser)
      await this.api.browser.close();
  }
}

module.exports = Session;
