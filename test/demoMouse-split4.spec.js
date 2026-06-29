const { test } = require("@playwright/test");
const DemoMouse = require("../lib/DemoMouse");

test.describe.configure({ mode: "parallel" });


const windows = [
  { x: 0, y: 0 },
  { x: 620, y: 0 },
  { x: 0, y: 450 },
  { x: 620, y: 450 }
];


async function setupMouse(page, worker) {
  const mouse = new DemoMouse(page);

  await page.goto("https://example.com");

  await mouse.install();
  await mouse.show();

  // move demo cursor
  await mouse.moveToPosition(
    300,
    200
  );

  await page.waitForTimeout(1000);

  return mouse;
}


for (let i = 0; i < 4; i++) {

  test(`Demo Window ${i + 1}`, async ({ page }, testInfo) => {

    const pos = windows[testInfo.workerIndex];

    // Move Chrome window using CDP
    const client = await page.context()
      .newCDPSession(page);

    const { windowId } =
      await client.send("Browser.getWindowForTarget");


    await client.send(
      "Browser.setWindowBounds",
      {
        windowId,
        bounds: {
          left: pos.x,
          top: pos.y,
          width: 600,
          height: 400,
          windowState: "normal"
        }
      }
    );


    await setupMouse(
      page,
      testInfo.workerIndex
    );


    await page.waitForTimeout(10000);
  });

}
