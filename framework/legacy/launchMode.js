const Session = require("../session");

function createAutoLaunch(launch, workerInfo) {
  const autoLaunch = { ...launch };

  console.log(
    `[DEBUG LAUNCH] autoTile=${launch.autoTile}, parallelIndex=${workerInfo.parallelIndex}`
  );

  if (launch.autoTile) {
    autoLaunch.tileIndex = workerInfo.parallelIndex;
  }

  return autoLaunch;
}

function buildLaunchFixtures(config) {
  const sessionFixture = config.reuseBrowser
    ? [async ({ }, use, workerInfo) => {
      console.log(
        `[WORKER ${workerInfo.workerIndex + 1}, configured max = ${workerInfo.config.workers}] Browser session started`
      );

      const session = new Session(config);
      const autoLaunch = createAutoLaunch(config.launch, workerInfo);

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
      const session = new Session(config);
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

  return {
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
}

module.exports = { buildLaunchFixtures };
