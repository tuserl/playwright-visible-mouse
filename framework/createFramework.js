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

      await use(session.api.page);

      await session.afterEach();

    }

  };

  for (const key of [
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
    "InteractionMode",
    "tableCell",
    "selectOption",
    "selectOptionOrGetState",
    "pause"
  ]) {

    fixtures[key] = async ({ session }, use) => {
      await use(session.api[key]);
    };

  }

  const test = base.test.extend(fixtures);

  return {
    test,
    expect: base.expect
  };
};
