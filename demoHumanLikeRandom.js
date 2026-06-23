const { chromium } = require("playwright");
const DemoMouse = require("./lib/demoMouse");

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 40, // 🌟 FIXED: Kept at 0 so the micro-steps inside Bezier curves remain fluid and natural
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
  await guestMouse.clickHumanRandom(signInButton); // 🌟 UPDATED: Using completely unique curve variants

  const secondInput = guestPage.getByPlaceholder("you@example.com").nth(0);
  const thirdInput = guestPage.getByPlaceholder("Enter your password").nth(0);

  await guestMouse.type(secondInput, "admin@system.com", 50);
  await guestMouse.type(thirdInput, "Admin@123", 50);

  await guestMouse.clickHumanRandom(signInButton); // 🌟 UPDATED: Using completely unique curve variants

  const userButton = guestPage.getByRole("button", { name: "Users" });
  await guestMouse.clickHumanRandom(userButton); // 🌟 UPDATED: Using completely unique curve variants

  // 🌟 Simulated Human Idle Phase
  // Instead of freezing unnaturally, the mouse wanders to a random layout position
  console.log("Simulating casual human drift/look around...");
  await guestMouse.randomMoveHuman();
  await guestPage.waitForTimeout(600);

  console.log("Performing a second casual mouse adjustments drift...");
  await guestMouse.randomMoveHuman();
  await guestPage.waitForTimeout(400);

  // Instead of parking at a fixed predictable 45,0 every single execution, 
  // we use the random generator to park the cursor safely out of the way.
  console.log("Parking cursor at a completely randomized idle coordinate...");
  await guestMouse.randomMoveHuman();

  // await guestPage.waitForTimeout(1000);
  // console.log("Parking cursor smoothly using Bezier curves at 45, 0...");
  // await guestMouse.moveToPositionHuman(45, 0); // 🌟 UPDATED: Eased Bezier trajectory

  // ============================================================================
  // 🌟 INTERACTIVE MANUAL DRAG CONTROL PHASE
  // ============================================================================
  console.log("\n------------------------------------------------------------");
  console.log("🔓 UNLOCKING: Script is giving up control.");
  console.log("👉 Go ahead! Click down directly on the fake cursor and DRAG it!");
  console.log("------------------------------------------------------------\n");

  // Arguments: isLocked = false, notFollowUser = true (Requires a Click + Drag)
  await guestMouse.setLockState(false, false);
  //await guestMouse.setLockState(false, true);

  // Increased the wait window to 10 seconds so you have plenty of time to test dragging it
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("Closing browser cleanly...");
  //  await browser.close();
})();
