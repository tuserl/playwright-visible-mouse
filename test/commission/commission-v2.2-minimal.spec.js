const { test, expect } = require("playwright-visible-mouse")({
  url: "https://example.com",
  interactionMode: "HUMAN",
  notify: true,
  launch: {
    mode: "maximized",
    headless: false
  }
});

async function yourTestFunction(ui) {
  const { btn, field, selectOptionOrGetState, text, page, mouse, notifyWait, InteractionMode, setInteractionMode } = ui;
  btn("Learn more").click();
  const result = "test";
  await page.waitForTimeout(3000);
  await notifyWait(`${ui.testInfo.title}: $${result} ~ (〃￣︶￣)人(￣︶￣〃)`);
  return result;
}
//test.describe.configure({ mode: "parallel" });

//================================= TEST CASES =========================================

test("Your Test Case Name", async ({ ui }) => {
  expect(await yourTestFunction(ui))
    .toBe("test");
});

