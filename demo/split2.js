const manager = require("../index");
manager.setUrl("http://localhost:3001");

async function runWorkflows() {
  // 1. Define flows with unique credentials and a 'doLogin' flag
  const flows = [
    { name: "Admin", index: 0, login: { email: "admin@system.com", pass: "Admin@123", doLogin: true } },
    { name: "Academic Manager", index: 1, login: { email: "am@gmail.com", pass: "12345678", doLogin: true } },
  ];

  const tasks = flows.map(async (f) => {
    const { page, btn, field, mouse } = await manager.launch({
      mode: 'split2',
      tileIndex: f.index,
      name: f.name,
      slowMo: 20
    });

    // 2. Conditional login logic
    if (f.login.doLogin) {
      console.log(`🔑 Attempting login for ${f.name}...`);

      try {

        //================ ACTION ====================
        await btn("Sign In").click();
        await field("you@example.com").type(f.login.email);
        await field("Enter your password").type(f.login.pass);
        await btn("Sign In").click();

        await mouse.moveToPosition(40, 0);
        await mouse.setLockState(false, false);
        //await page.waitForTimeout(2000);
        //await mouse.hide();

        //================ ACTION ====================

        console.log(`✅ ${f.name} logged in successfully.`);
      } catch (err) {
        console.error(`❌ Failed to login ${f.name}: ${err.message}`);
      }
    } else {
      console.log(`ℹ️ ${f.name} skipped login.`);
    }
  });

  await Promise.all(tasks);
  console.log("🚀 All workflows processed.");
}

runWorkflows();
