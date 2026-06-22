const { chromium } = require("playwright");
const DemoMouse = require("./lib/demoMouse");


(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000,
  });

  // --- CHANGED HERE: Define your custom width and height inside newContext ---
  const guestPage = await (
    await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  ).newPage();

  await guestPage.goto("localhost:3001");

  const guestMouse = new DemoMouse(guestPage, "transparent");

  await guestMouse.install();

  // USER INTERACTION
  await guestMouse.focus();

  for (let index = 0; index < 1; index++) {

    const signInButton = guestPage.getByRole("button", { name: "Sign In" });
    await guestMouse.click(signInButton);

    const secondInput = guestPage.getByPlaceholder("you@example.com").nth(0);
    const thirdInput = guestPage.getByPlaceholder("Enter your password").nth(0);
    // Syntaxes: type(locator, "text to type", millisecond_delay_between_letters)
    await guestMouse.type(secondInput, "admin@system.com", 50);
    await guestMouse.type(thirdInput, "Admin@123", 50);

    await guestMouse.click(signInButton);


    const userButton = guestPage.getByRole("button", { name: "Users" });
    await guestMouse.click(userButton);

    //const backHomeButton = guestPage.getByRole("button", { name: "Back to Home" });
    //await guestMouse.click(backHomeButton);


    await guestPage.waitForTimeout(500);

  }

  // Wait for 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Close the browser instance
  await browser.close();
  console.log("Browser closed.");
})();
