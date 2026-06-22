const { test, expect, chromium } = require("@playwright/test"); // 🌟 Added chromium import
const DemoMouse = require("./lib/demoMouse");

// 🌟 FORCE CONCURRENCY: Tells the test runner to execute both tests at the exact same time
test.describe.configure({ mode: "parallel" });

// ============================================================================
// WORKSPACE 1: LEFT SIDE TILING
// ============================================================================
test("Guest Mouse - System Admin Flow (Left Screen)", async () => {
  // Manually launch browser inside the test to bypass describe-block limitations
  const browserLeft = await chromium.launch({
    headless: false,
    args: ["--window-position=0,0", "--window-size=960,1080", "--no-sandbox"],
  });

  const context = await browserLeft.newContext({ viewport: null, deviceScaleFactor: undefined });
  const page = await context.newPage();

  await page.goto("http://localhost:3001");

  const guestMouse = new DemoMouse(page, "transparent");
  await guestMouse.install();
  await guestMouse.focus();

  const signInButton = page.getByRole("button", { name: "Sign In" });
  await guestMouse.click(signInButton);

  const emailInput = page.getByPlaceholder("you@example.com").nth(0);
  const passwordInput = page.getByPlaceholder("Enter your password").nth(0);

  await guestMouse.type(emailInput, "admin@system.com", 50);
  await guestMouse.type(passwordInput, "Admin@123", 50);
  await guestMouse.click(signInButton);

  // Assertions work exactly the same way
  const userButton = page.getByRole("button", { name: "Users" });
  await expect(userButton).toBeVisible();

  await guestMouse.click(userButton);
  await page.waitForTimeout(500);

  await guestMouse.moveToPosition(45, 0);
  await page.waitForTimeout(3000); // Leave visible for capture buffers

  // Clean up the browser instance manually at the end of the test
  await browserLeft.close();
});

// ============================================================================
// WORKSPACE 2: RIGHT SIDE TILING
// ============================================================================
test("AM Mouse - Course Manager Flow (Right Screen)", async () => {
  const browserRight = await chromium.launch({
    headless: false,
    args: ["--window-position=960,0", "--window-size=960,1080", "--no-sandbox"],
  });

  const context = await browserRight.newContext({ viewport: null, deviceScaleFactor: undefined });
  const page = await context.newPage();

  await page.goto("http://localhost:3001");

  const AMMouse = new DemoMouse(page, "transparent");
  await AMMouse.install();
  await AMMouse.focus();

  const signInButton = page.getByRole("button", { name: "Sign In" });
  await AMMouse.click(signInButton); // 🌟 FIXED: Changed from guestMouse to AMMouse

  const emailInput = page.getByPlaceholder("you@example.com").nth(0);
  const passwordInput = page.getByPlaceholder("Enter your password").nth(0);

  await AMMouse.type(emailInput, "am@gmail.com", 50);
  await AMMouse.type(passwordInput, "12345678", 50);
  await AMMouse.click(signInButton);

  const PCButton = page.getByRole("button", { name: "Pending Courses" });
  await expect(PCButton).toBeVisible();

  await AMMouse.click(PCButton);
  await page.waitForTimeout(500);

  await AMMouse.moveToPosition(45, 0);
  await page.waitForTimeout(3000);

  await browserRight.close();
});
