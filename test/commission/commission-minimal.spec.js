const { test, expect } = require("@playwright/test");
const manager = require("../../index");
const { expectRequiredSelectIfPresent } = require("../../testUtils/expectHelpers");

let session;

// can be enable or not depened on user want
//test.describe.configure({ mode: "parallel" });

manager.setUrl("http://localhost:9999/CommissionWebApp/index.jsp");

// 1. Launch ONCE for the entire test file
test.beforeAll(async () => {
  session = await manager.launch({ mode: "maximized", headless: false });
});

test.beforeEach(async ({ }, testInfo) => {
  // Navigate
  await session.page.goto("http://localhost:9999/CommissionWebApp/index.jsp");

  await session.setInteractionMode(session.InteractionMode.HUMAN);
  await session.notify(testInfo.title);
});

// 3. Close ONCE after all tests are finished
test.afterAll(async () => {
  if (session && session.browser) {
    await session.browser.close();
  }
});


async function testFunc() {
  const { btn, field, selectOptionOrGetState, text, page, mouse, InteractionMode, setInteractionMode } = session;

  // if user enable notify
  await session.notify(`Result`);

  await page.waitForTimeout(3500); //always wait for 3.5 second if user enable this
  return null;
}

//================================= TEST CASES =========================================

test("TC06", async () => {
  const result = await testFunc();
  expect(result).toBe(null);
});

test("TC07", async () => {
  const result = await testFunc();
  expect(result).toBe(null);
});

