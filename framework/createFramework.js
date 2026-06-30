const base = require("@playwright/test");
const defaults = require("./config");
const Session = require("./session");


function normalizeTraceForPW(trace) {
  if (trace === true) return "on";
  if (trace === false || trace == null) return "off";
  return trace; // "on" | "off" | "retain-on-failure" | "on-first-retry" | ...
}

function computeTileArgs(cfg, workerInfo) {
  const args = [];
  const screenWidth = cfg.screenWidth || 1920;
  const screenHeight = cfg.screenHeight || 1080;

  let tileIndex = cfg.tileIndex || 0;
  if (cfg.autoTile) tileIndex = workerInfo.parallelIndex;

  if (cfg.mode === "split2") {
    tileIndex %= 2;
    const w = Math.floor(screenWidth / 2);
    args.push(
      `--window-position=${tileIndex === 0 ? 0 : w},0`,
      `--window-size=${w},${screenHeight}`
    );
  } else if (cfg.mode === "split4") {
    tileIndex %= 4;
    const w = Math.floor(screenWidth / 2);
    const h = Math.floor(screenHeight / 2);
    const positions = [[0, 0], [w, 0], [0, h], [w, h]];
    args.push(
      `--window-position=${positions[tileIndex][0]},${positions[tileIndex][1]}`,
      `--window-size=${w},${h}`
    );
  } else {
    args.push("--start-maximized");
  }

  console.log(
    `[DEBUG TILE] mode=${cfg.mode}, autoTile=${cfg.autoTile}, tileIndex=${tileIndex}, parallelIndex=${workerInfo.parallelIndex}`
  );

  return args;
}

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
    "browser",
    "context",
    "_sharedContext",
    "_sharedPage",
    "_sharedSession"
  ];

  let fixtures;

  if (mode === "attach") {
    // Tiling applies regardless of reuseBrowser — it's a worker-scoped launchOptions override.
    const launchOptionsFixture = [async ({ launchOptions }, use, workerInfo) => {
      const cfg = config.launch || {};
      const args = computeTileArgs(cfg, workerInfo);
      await use({
        ...launchOptions,
        headless: cfg.headless ?? launchOptions.headless,
        slowMo: cfg.slowMo ?? launchOptions.slowMo,
        args: [...(launchOptions.args || []), "--no-sandbox", ...args]
      });
    }, { scope: "worker" }];
    if (config.reuseBrowser) {
      // ===== ATTACH + REUSE BROWSER =====
      // The actual context/page are created ONCE per worker via these
      // internal worker-scoped fixtures (can't be named "context"/"page" —
      // those names are reserved at test-scope by Playwright Test itself).
      fixtures = {
        launchOptions: launchOptionsFixture,
        viewport: [null, { option: true }],

        _sharedContext: [async ({ browser }, use) => {
          const context = await browser.newContext();
          try { await use(context); } finally { await context.close(); }
        }, { scope: "worker" }],

        _sharedPage: [async ({ _sharedContext }, use) => {
          const page = await _sharedContext.newPage();
          try { await use(page); } finally { await page.close(); }
        }, { scope: "worker" }],

        _sharedSession: [async ({ _sharedPage, _sharedContext }, use) => {
          const session = new Session(config);
          await session.attach(_sharedPage, _sharedContext);
          await use(session);
        }, { scope: "worker" }],

        // Override the built-in test-scoped `context`/`page` fixtures so that
        // every test just gets a reference to the one shared per-worker instance.
        context: async ({ _sharedContext }, use) => {
          await use(_sharedContext);
        },

        page: async ({ _sharedPage }, use) => {
          await use(_sharedPage);
        },

        session: async ({ _sharedSession }, use) => {
          await use(_sharedSession);
        },

        ui: async ({ session, page }, use, testInfo) => {
          await session.beforeEach(testInfo);
          try {
            await use({ ...session.api, page, testInfo });
          } finally {
            await session.afterEach(testInfo);
          }
        }
      };

    } else {
      // ===== ATTACH, FRESH CONTEXT PER TEST (original attach mode) =====
      fixtures = {
        launchOptions: launchOptionsFixture,
        viewport: [null, { option: true }],

        // let config.trace drive Playwright's own built-in tracing,
        // so you don't have to pass --trace on every run.
        // config.trace drives Playwright's own built-in tracing
        ...(config.trace !== undefined
          ? { trace: [normalizeTraceForPW(config.trace), { option: true, scope: "worker" }] }
          : {}),

        session: async ({ page }, use, testInfo) => {
          const session = new Session(config);
          await session.attach(page);
          await session.beforeEach(testInfo);

          if (config.beforeEach) await config.beforeEach({ ...session.api, testInfo });

          try {
            await use(session);
          } finally {
            await session.afterEach(testInfo);
            if (config.afterEach) await config.afterEach({ ...session.api, testInfo });
            await session.close();
          }
        },

        ui: async ({ session, page }, use, testInfo) => {
          await use({ ...session.api, page, testInfo });
        }
      };
    }
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
