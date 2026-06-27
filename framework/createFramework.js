const base = require("@playwright/test");
const defaults = require("./config");
const Session = require("./session");

module.exports = function (options = {}) {

  const config = {
    ...defaults,
    ...options,
    launch: {
      ...defaults.launch,
      ...(options.launch || {})
    }
  };

  const session = new Session(config);

  const fixtures = {
    session: [async ({ }, use) => {
      await session.launch();
      await use(session);
      await session.close();
    }, { scope: "worker" }],
    page: async ({ session }, use, testInfo) => {
      await session.beforeEach(testInfo);
      try {
        await use(session.api.page);
      } finally {
        await session.afterEach();
      }
    },
    ui: async ({ session, page }, use) => {
      await use({
        btn: session.api.btn,
        field: session.api.field,
        text: session.api.text,
        page,
        mouse: session.api.mouse,
        notify: session.api.notify,
        InteractionMode: session.api.InteractionMode,
        setInteractionMode: session.api.setInteractionMode,
        selectOptionOrGetState:
          session.api.selectOptionOrGetState
      });
    }
  };

  for (const key of Session.exposed) {

    fixtures[key] = async ({ session }, use) => {
      if (!session.api[key]) {
        throw new Error(
          `Missing API export: ${key}`
        );
      }

      await use(session.api[key]);
    };

  }
  const test = base.test.extend(fixtures);

  return {
    test,
    expect: base.expect
  };
};
