const BrowserManager = require("./lib/browserManager");

(async () => {
  console.log("Spawning tiled workspaces...");

  // 1. Launch both windows using the Manager
  const [guest, am] = await Promise.all([
    BrowserManager.launch({ mode: 'tiled', side: 'left' }),
    BrowserManager.launch({ mode: 'tiled', side: 'right' })
  ]);

  // 2. Guest Workflow
  const signInButtonG = guest.page.getByRole("button", { name: "Sign In" });
  await guest.mouse.click(signInButtonG);

  await guest.mouse.type(guest.page.getByPlaceholder("you@example.com").nth(0), "admin@system.com", 50);
  await guest.mouse.type(guest.page.getByPlaceholder("Enter your password").nth(0), "Admin@123", 50);
  await guest.mouse.click(signInButtonG);

  await guest.mouse.click(guest.page.getByRole("button", { name: "Users" }));
  await guest.page.waitForTimeout(500);
  await guest.mouse.moveToPosition(45, 0);

  // 3. AM Workflow
  const signInButtonA = am.page.getByRole("button", { name: "Sign In" });
  await am.mouse.click(signInButtonA);

  await am.mouse.type(am.page.getByPlaceholder("you@example.com").nth(0), "am@gmail.com", 50);
  await am.mouse.type(am.page.getByPlaceholder("Enter your password").nth(0), "12345678", 50);
  await am.mouse.click(signInButtonA);
  await am.page.waitForTimeout(500);

  await am.mouse.click(am.page.getByRole("button", { name: "Pending Courses" }));
  await am.page.waitForTimeout(500);
  await am.mouse.moveToPosition(45, 0);

  // 4. Cleanup
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await guest.browser.close();
  await am.browser.close();
})();
