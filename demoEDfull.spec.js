const { test, expect } = require("@playwright/test");
const DemoMouse = require("./lib/demoMouse");

// 🌟 Configure the browser window to maximize globally within the test runner
test.use({
  viewport: null,
  launchOptions: {
    args: ["--start-maximized", "--no-sandbox"]
  }
});

test("should log in successfully and access the users dashboard", async ({ page }) => {
  await page.goto("http://localhost:3001");

  const guestMouse = new DemoMouse(page, "transparent");
  await guestMouse.install();
  await guestMouse.focus();

  // Login actions
  const signInButton = page.getByRole("button", { name: "Sign In" });
  await guestMouse.click(signInButton);

  await guestMouse.type(page.getByPlaceholder("you@example.com").nth(0), "admin@system.com", 50);
  await guestMouse.type(page.getByPlaceholder("Enter your password").nth(0), "Admin@123", 50);
  await guestMouse.click(signInButton);

  // 🌟 NATIVE TEST EXPECTATION
  const userButton = page.getByRole("button", { name: "Users" });

  // Playwright will automatically retry this line for up to 5 seconds
  await expect(userButton).toBeVisible();

  // Continue interaction
  await guestMouse.click(userButton);

  // Park cursor
  await guestMouse.moveToPosition(45, 0);
  await page.waitForTimeout(2000);
});
