const { chromium } = require("playwright");
const DemoMouse = require("./lib/demoMouse");

(async () => {
  // 🌟 WORKFLOW 1: Guest Mouse (Left Side)
  async function runGuestWorkflow() {
    const browserLeft = await chromium.launch({
      headless: false,
      slowMo: 0,
      // Tile to the left half of the screen: X=0, Y=0, Width=960, Height=1080
      args: ["--window-position=0,0", "--window-size=960,1080", "--no-sandbox"]
    });

    browserLeft.on("disconnected", () => process.exit(0));

    const guestPage = await (
      await browserLeft.newContext({ viewport: null, deviceScaleFactor: undefined })
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

    // Return instance for global cleanup tracking
    return browserLeft;
  }

  // 🌟 WORKFLOW 2: AM Mouse (Right Side)
  async function runAMWorkflow() {
    const browserRight = await chromium.launch({
      headless: false,
      slowMo: 0,
      // Tile to the right half of the screen: X=960, Y=0, Width=960, Height=1080
      args: ["--window-position=960,0", "--window-size=960,1080", "--no-sandbox"]
    });

    browserRight.on("disconnected", () => process.exit(0));

    const AMPage = await (
      await browserRight.newContext({ viewport: null, deviceScaleFactor: undefined })
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


    const PCButton = AMPage.getByRole("button", { name: "Pending Courses" });
    await AMMouse.click(PCButton);
    await AMPage.waitForTimeout(500);



    await AMMouse.moveToPosition(45, 0);

    return browserRight;
  }

  console.log("Spawning tiled workspaces...");

  // Fire both launches synchronously so they tile at the exact same moment
  const browsers = await Promise.all([
    runGuestWorkflow(),
    runAMWorkflow()
  ]);

  // Keep windows completely open for 3 seconds to review the dual animations
  await new Promise((resolve) => setTimeout(resolve, 3000));

  //  console.log("Demo run complete. Cleaning up workspace instances...");
  //  await Promise.all(browsers.map(b => b.close()));
})();
