const { BrowserManager } = require("../lib/browserManager");
const manager = new BrowserManager();

class Session {

  constructor(config) {
    this.config = config;
    this.instance = null;
  }

  async launch() {

    manager.setUrl(this.config.url);

    this.instance = await manager.launch(
      this.config.launch
    );

    return this.instance;
  }

  async goto() {
    await this.instance.page.goto(this.config.url);
  }

  async setup(testInfo) {

    await this.goto();

    await this.instance.setInteractionMode(
      this.instance.InteractionMode[
      this.config.interactionMode
      ]
    );

    if (this.config.notify) {
      await this.instance.notify(testInfo.title);
    }
  }

  async cleanup() {

    if (!this.config.notify)
      return;

    await this.instance.page.waitForTimeout(
      this.config.notifyDelay
    );
  }

  async close() {

    if (this.instance?.browser)
      await this.instance.browser.close();

  }

  get api() {
    return this.instance;
  }

}

module.exports = Session;
