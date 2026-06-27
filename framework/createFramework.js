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

      if (config.beforeEach) {
        await config.beforeEach({
          ...session.api,
          page: session.api.page,
          testInfo
        });
      }

      try {
        await use(session.api.page);
      } finally {
        await session.afterEach();

        if (config.afterEach) {
          await config.afterEach({
            ...session.api,
            page: session.api.page,
            testInfo
          });
        }
      }
    },

    ui: async ({ session, page }, use, testInfo) => {
      await use({
        ...session.api,
        page,
        testInfo
      });
    }
  };

  const reservedFixtures = [
    "session",
    "page"
  ];

  for (const key of Session.exposed) {
    if (reservedFixtures.includes(key)) {
      continue;
    }
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
