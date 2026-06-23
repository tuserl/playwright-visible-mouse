const { test, expect } = require("@playwright/test");
const BrowserManager = require("./lib/browserManager");
const DemoMouse = require("./lib/demoMouse");

// Force concurrency
test.describe.configure({ mode: "parallel" });

// ============================================================================
// WORKSPACE 1: LEFT SIDE
// ============================================================================
test("Guest Mouse - System Admin Flow (Left)", async () => {
  // Use Manager to launch instead of test.use blocks
  const { page, mouse } = await BrowserManager.launch({ mode: 'tiled', side: 'left' });

  await page.goto("http://localhost:3001");
  await mouse.install();
  await mouse.focus();

  // Interaction
  const signInButton = page.getByRole("button", { name: "Sign In" });
  await mouse.click(signInButton);
  await mouse.type(page.getByPlaceholder("you@example.com").nth(0), "admin@system.com", 50);
  await mouse.type(page.getByPlaceholder("Enter your password").nth(0), "Admin@123", 50);
  await mouse.click(signInButton);

  await expect(page.getByRole("button", { name: "Users" })).toBeVisible();
  await mouse.click(page.getByRole("button", { name: "Users" }));

  await page.waitForTimeout(3500); // Leave visible for capture
});

// ============================================================================
// WORKSPACE 2: RIGHT SIDE
// ============================================================================
test("AM Mouse - Course Manager Flow (Right)", async () => {
  const { page, mouse } = await BrowserManager.launch({ mode: 'tiled', side: 'right' });

  await page.goto("http://localhost:3001");
  await mouse.install();
  await mouse.focus();

  // Interaction
  const signInButton = page.getByRole("button", { name: "Sign In" });
  await mouse.click(signInButton);
  await mouse.type(page.getByPlaceholder("you@example.com").nth(0), "am@gmail.com", 50);
  await mouse.type(page.getByPlaceholder("Enter your password").nth(0), "12345678", 50);
  await mouse.click(signInButton);

  await expect(page.getByRole("button", { name: "Pending Courses" })).toBeVisible();
  await mouse.click(page.getByRole("button", { name: "Pending Courses" }));

  await page.waitForTimeout(3500);
});
