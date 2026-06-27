const { test } = require("@playwright/test");

const defaults = require("./config");
const Session = require("./session");

function createSuite(options = {}) {

  const config = {

    ...defaults,

    ...options,

    launch: {
      ...defaults.launch,
      ...(options.launch || {})
    }

  };

  const session = new Session(config);

  test.beforeAll(async () => {

    await session.launch();

  });

  test.beforeEach(async ({ }, testInfo) => {

    await session.setup(testInfo);

  });

  test.afterEach(async () => {

    await session.cleanup();

  });

  test.afterAll(async () => {

    await session.close();

  });

  return new Proxy({}, {

    get(target, prop) {

      return session.api[prop];

    }

  });

}

module.exports = createSuite;
