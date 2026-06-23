const { chromium } = require("playwright");
const DemoMouse = require("./lib/demoMouse");

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 40, // 🌟 Keeping this at 0 so the Bezier paths remain fluid
    // 🌟 FORCE CHROMIUM WINDOW LARGE
    args: ["--start-maximized", "--no-sandbox"]
  });

  browser.on("disconnected", () => {
    console.log("Browser window closed. Terminating Node process...");
    process.exit(0);
  });

  // 🌟 BREAKS OUT OF FIXED WINDOWS DEFAULTS
  const guestPage = await (
    await browser.newContext({
      viewport: null,              // Tells context to fill the window space
      deviceScaleFactor: undefined // Stops Playwright from constraining the container layout
    })
  ).newPage();

  await guestPage.goto("http://localhost:3001");

  // Initialize your custom mouse wrapper
  const guestMouse = new DemoMouse(guestPage, "transparent");
  await guestMouse.install();

  // USER INTERACTION
  await guestMouse.focus();

  const signInButton = guestPage.getByRole("button", { name: "Sign In" });
  await guestMouse.clickHuman(signInButton); // 🌟 UPDATED: Organic path & target jitter

  const secondInput = guestPage.getByPlaceholder("you@example.com").nth(0);
  const thirdInput = guestPage.getByPlaceholder("Enter your password").nth(0);

  // Note: The library's .type() method will use your original linear pacing 
  // but we are engaging it with the input fields here.
  await guestMouse.type(secondInput, "admin@system.com", 50);
  await guestMouse.type(thirdInput, "Admin@123", 50);

  await guestMouse.clickHuman(signInButton); // 🌟 UPDATED: Organic path & target jitter

  const userButton = guestPage.getByRole("button", { name: "Users" });
  await guestMouse.clickHuman(userButton); // 🌟 UPDATED: Organic path & target jitter

  await guestPage.waitForTimeout(500);

  console.log("Parking cursor smoothly using Bezier curves at 45, 0...");
  await guestMouse.moveToPositionHuman(45, 0); // 🌟 UPDATED: Eased Bezier trajectory

  // Leave window open for 3 seconds to review the behavior
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("Closing browser cleanly...");
  await browser.close();
})();
