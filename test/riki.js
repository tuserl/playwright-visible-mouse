const { chromium } = require("playwright");
const DemoMouse = require("../lib/demoMouse");

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
      locale: 'en-US',
      timezoneId: 'America/New_York',
      permissions: ['geolocation'],
      bypassCSP: true,
      storageState: undefined,
      deviceScaleFactor: undefined // Stops Playwright from constraining the container layout
    })
  ).newPage();

  await guestPage.goto("https://riki.edu.vn/");
  //await guestPage.goto("https://learningpath.click");

  //  await guestPage.goto("https://www.google.com/");

  // Initialize your custom mouse wrapper
  const guestMouse = new DemoMouse(guestPage, "transparent");
  await guestMouse.install();

  // USER INTERACTION
  await guestMouse.focus();

  //  await page.locator('input[name="btnK"]').click();
  //const searchButton = guestPage.locator('input[name="btnK"]');
  //  const searchButton = guestPage.locator('input[name="btnK"]').first();
  //  await guestMouse.clickHumanRandom(searchButton);


  // Method 1: Using the role and name attribute (Recommended)

  //  const googleButton = guestPage.locator('input[name="btnK"]').first();
  //  const googleButton = guestPage.getByRole('button', { name: 'Tìm trên Google' });

  //const googleButton = guestPage.getByRole('button', { name: 'Tìm trên Google' })
  //  .filter({ hasNot: guestPage.locator(':hidden') })
  //  .first();


  // Add these waits before calling the mouse function
  //  await googleButton.waitFor({ state: 'attached' }); // Wait until it's in the DOM
  //  await googleButton.scrollIntoViewIfNeeded();        // Ensure it's visible to the eye
  //  await googleButton.waitFor({ state: 'visible' });   // Ensure it has width/height > 0


  const DongButton = guestPage.getByRole("button", { name: "Đóng" });
  await guestMouse.clickHumanRandom(DongButton);

  const HocButton = guestPage.getByRole("link", { name: "HỌC ONLINE" });
  await guestMouse.clickHumanRandom(HocButton);


  const secondInput = guestPage.getByPlaceholder("Nhập email tại đây").nth(0);
  const thirdInput = guestPage.getByPlaceholder("Nhập mật khẩu tại đây").nth(0);

  await guestMouse.type(secondInput, "admin@system.com", 50);
  await guestMouse.type(thirdInput, "Admin@123", 50);


  const signInButton = guestPage.getByRole("button", { name: "ĐĂNG NHẬP" });
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
