// tests/demoMouse.spec.js

const { test, expect } = require("@playwright/test");
const DemoMouse = require("../lib/DemoMouse"); // adjust path

test.describe("DemoMouse", () => {
  let mouse;

  test.beforeEach(async ({ page }) => {
    mouse = new DemoMouse(page);

    await page.setContent(`
      <button id="btn">Click Me</button>
      <input id="input">
    `);

    await mouse.install();
  });

  test("install() should inject demo mouse", async ({ page }) => {
    await expect(page.locator("#demoMouseWrapper")).toBeAttached();
    await expect(page.locator("#demoMouse")).toBeAttached();
  });

  test("show() should remove hide-cursor class", async ({ page }) => {
    await mouse.hide();
    await mouse.show();

    const hidden = await page.evaluate(() =>
      document.body.classList.contains("hide-cursor")
    );

    expect(hidden).toBe(false);
  });

  test("hide() should add hide-cursor class", async ({ page }) => {
    await mouse.hide();

    const hidden = await page.evaluate(() =>
      document.body.classList.contains("hide-cursor")
    );

    expect(hidden).toBe(true);
  });

  test("setLockState(true) should lock mouse", async ({ page }) => {
    await mouse.setLockState(true);

    const state = await page.evaluate(() => ({
      locked: window.demoMouse.isLocked,
      follow: window.demoMouse.notFollowUser
    }));

    expect(state.locked).toBe(true);
    expect(state.follow).toBe(false);
  });

  test("setLockState(false, true) enables drag mode", async ({ page }) => {
    await mouse.setLockState(false, true);

    const result = await page.evaluate(() => {
      const el = document.getElementById("demoMouse");

      return {
        locked: window.demoMouse.isLocked,
        follow: window.demoMouse.notFollowUser,
        pointerEvents: el.style.pointerEvents,
        cursor: el.style.cursor
      };
    });

    expect(result.locked).toBe(false);
    expect(result.follow).toBe(true);
    expect(result.pointerEvents).toBe("auto");
    expect(result.cursor).toBe("grab");
  });

  test("moveToPosition() updates target position", async ({ page }) => {
    await mouse.moveToPosition(200, 150);

    const target = await page.evaluate(() => ({
      x: window.demoMouse.targetX,
      y: window.demoMouse.targetY
    }));

    expect(target.x).toBe(200);
    expect(target.y).toBe(150);
  });
});
