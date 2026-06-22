const { chromium } = require("playwright");
const DemoMouse = require("./lib/demoMouse");

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 0,
    args: ["--start-maximized", "--no-sandbox"]
  });

  browser.on("disconnected", () => {
    console.log("Browser window closed. Terminating Node process...");
    process.exit(0);
  });

  // 🌟 WORKFLOW 1: Guest Mouse
  async function runGuestWorkflow() {
    const guestPage = await (
      await browser.newContext({ viewport: null, deviceScaleFactor: undefined })
    ).newPage();

    await guestPage.goto("http://localhost:3001");
    const guestMouse = new DemoMouse(guestPage, "transparent");
    await guestMouse.install();
    await guestMouse.focus();

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

    await guestMouse.moveToPosition(45, 0);
  }

  // 🌟 WORKFLOW 2: AM Mouse
  async function runAMWorkflow() {
    const AMPage = await (
      await browser.newContext({ viewport: null, deviceScaleFactor: undefined })
    ).newPage();

    await AMPage.goto("http://localhost:3001");
    const AMMouse = new DemoMouse(AMPage, "transparent");
    await AMMouse.install();
    await AMMouse.focus();

    const signInButton = AMPage.getByRole("button", { name: "Sign In" });
    await AMMouse.click(signInButton);

    const secondInput = AMPage.getByPlaceholder("you@example.com").nth(0);
    const thirdInput = AMPage.getByPlaceholder("Enter your password").nth(0);

    await AMMouse.type(secondInput, "am@gmail.com", 50);
    await AMMouse.type(thirdInput, "12345678", 50);
    await AMMouse.click(signInButton);
    await AMPage.waitForTimeout(500);

    await AMMouse.moveToPosition(45, 0);
  }

  // 🌟 THE MAGIC LINK: This triggers both window functions to run side-by-side!
  console.log("Launching both workflows simultaneously...");
  await Promise.all([
    runGuestWorkflow(),
    runAMWorkflow()
  ]);

  // Keep windows open for 3 seconds before ending the process
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("All tasks complete.");
})();
