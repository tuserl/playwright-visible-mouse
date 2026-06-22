const { chromium } = require("playwright");
const DemoMouse = require("./lib/demoMouse");

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000,
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

  const guestMouse = new DemoMouse(guestPage, "transparent");
  await guestMouse.install();

  // USER INTERACTION
  await guestMouse.focus();

  for (let index = 0; index < 1; index++) {
    const signInButton = guestPage.getByRole("button", { name: "Sign In" });
    await guestMouse.click(signInButton);

    const secondInput = guestPage.getByPlaceholder("you@example.com").nth(0);
    const thirdInput = guestPage.getByPlaceholder("Enter your password").nth(0);

    await guestMouse.type(secondInput, "admin@system.com", 50);
    await guestMouse.type(thirdInput, "Admin@123", 50);

    await guestMouse.click(signInButton);

    const userButton = guestPage.getByRole("button", { name: "Users" });
    await guestMouse.click(userButton);

    await guestPage.waitForTimeout(500);
  }

  console.log("Parking cursor at 45, 0...");
  await guestMouse.moveToPosition(45, 0);

  // Wait for 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("Closing browser cleanly...");
  await browser.close();
})();
