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

  const mode = config.mode || "launch";

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


  const reservedFixtures = [
    "session",
    "page",
    "browser"
  ];

  let fixtures;

  if (mode === "attach") {
    // ===================== ATTACH MODE =====================
    // Uses Playwright Test's own `page` fixture, so tracing (trace: 'on' in
    // playwright.config.js) captures full DOM snapshots correctly.
    const sessionFixture = async ({ page }, use, testInfo) => {
      const session = new Session(config);
      await session.attach(page);
      await session.beforeEach(testInfo);

      if (config.beforeEach) {
        await config.beforeEach({ ...session.api, testInfo });
      }

      try {
        await use(session);
      } finally {
        await session.afterEach();
        if (config.afterEach) {
          await config.afterEach({ ...session.api, testInfo });
        }
        await session.close(); // no-op in attach mode, kept for symmetry
      }
    };

    fixtures = {
      session: sessionFixture,
      ui: async ({ session, page }, use, testInfo) => {
        await use({ ...session.api, page, testInfo });
      }
    };
  }
  else {
    // ===================== LAUNCH MODE (original behavior) =====================

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

    fixtures = {
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


  // Common: wire up every exposed API as its own fixture, regardless of mode
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

  // This is where EVERYTHING is registered.
  const test = base.test.extend(fixtures);

  return {
    test,
    expect: base.expect
  };
};
