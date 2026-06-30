const { BrowserManager } = require("../lib/browserManager");

function normalizeTrace(trace) {
  if (trace === true) return "on";
  if (trace === false) return "off";
  if (trace == null) return null; // not explicitly set
  // Playwright's own values include "on-first-retry", "on-all-retries", etc.
  // collapse anything we don't specially handle down to "on".
  if (trace === "off" || trace === "retain-on-failure") return trace;
  return "on";
}


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
    this.context = null;
    // null = not explicitly set, fall back to Playwright's own --trace / config at runtime
    this.explicitTraceMode = normalizeTrace(config.trace);
  }

  // attach to a Playwright-Test-owned page instead of launching your own browser.
  // This is what gives trace-viewer DOM support, because the page/context already belongs to Playwright Test's tracing pipeline.
  async attach(page, context = null) {
    this.context = context;
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

  // Resolves effective trace mode for THIS test: explicit framework config wins,
  // otherwise fall back to whatever Playwright itself was told (--trace on, or
  // playwright.config.js's use.trace / project.use.trace).
  _resolveTraceMode(testInfo) {
    if (this.explicitTraceMode != null) return this.explicitTraceMode;
    const pwTrace = testInfo?.project?.use?.trace;
    return normalizeTrace(pwTrace) ?? "off";
  }

  async beforeEach(testInfo) {
    this.traceMode = this._resolveTraceMode(testInfo);

    // Manual per-test trace when the context is being reused across tests.
    if (this.config.reuseBrowser && this.context && this.traceMode !== "off") {
      await this.context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true
      });
    }

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

  async afterEach(testInfo) {
    if (this.config.reuseBrowser && this.context && this.traceMode !== "off") {
      const tracePath = testInfo.outputPath("trace.zip");
      await this.context.tracing.stop({ path: tracePath });

      const failed = testInfo.status !== testInfo.expectedStatus;
      const shouldKeep =
        this.traceMode === "on" ||
        (this.traceMode === "retain-on-failure" && failed);

      if (shouldKeep) {
        testInfo.attachments.push({
          name: "trace",
          path: tracePath,
          contentType: "application/zip"
        });
      } else {
        try { fs.unlinkSync(tracePath); } catch { /* already gone, ignore */ }
      }
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
