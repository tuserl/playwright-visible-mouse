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


  function createAutoLaunch(launch, workerInfo) {
    const autoLaunch = {
      ...launch
    };

    console.log(
      `[DEBUG LAUNCH] autoTile=${launch.autoTile}, parallelIndex=${workerInfo.parallelIndex}`
    );

    if (launch.autoTile) {
      autoLaunch.tileIndex = workerInfo.parallelIndex;
    }

    return autoLaunch;
  }

  const sessionFixture = config.reuseBrowser
    ? [async ({ launch }, use, workerInfo) => {

      console.log(
        `[WORKER ${workerInfo.workerIndex + 1}, configured max = ${workerInfo.config.workers}] Browser session started`
      );

      const autoLaunch = createAutoLaunch(launch, workerInfo);

      await session.launch(autoLaunch);

      try {
        await use(session);
      } finally {
        console.log(
          `[WORKER ${workerInfo.workerIndex + 1}, configured max = ${workerInfo.config.workers}] Browser session closed`
        );

        await session.close();
      }

    }, { scope: "worker" }]

    : async ({ launch }, use, workerInfo) => {

      const autoLaunch = createAutoLaunch(launch, workerInfo);

      console.log(
        `[WORKER ${workerInfo.workerIndex + 1}, configured max = ${workerInfo.config.workers}] Browser launching`
      );

      await session.launch(autoLaunch);

      try {
        await use(session);
      } finally {
        console.log(
          `[WORKER ${workerInfo.workerIndex + 1}, configured max = ${workerInfo.config.workers}] Browser closed`
        );

        await session.close();
      }
    };

  const fixtures = {
    launch: [config.launch, { option: true }],

    session: sessionFixture,

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
    "page",
    "browser"
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
