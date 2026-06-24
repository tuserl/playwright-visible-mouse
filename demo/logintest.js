const manager = require("../lib/browserManager");
//manager.setUrl("url");

async function runWorkflows() {
  // 1. Define flows with unique credentials and a 'doLogin' flag
  const flows = [
    { name: "Admin", index: 0, login: { email: "admin@system.com", pass: "Admin@123", doLogin: true } },
    { name: "Admin", index: 1, login: { email: "admin@system.com", pass: "Admin@1234", doLogin: true } },
  ];

  const tasks = flows.map(async (f) => {
    const { page, btn, field, mouse } = await manager.launch({
      mode: 'split2',
      tileIndex: f.index,
      name: f.name,
      slowMo: 10
    });

    // 2. Conditional login logic
    if (f.login.doLogin) {
      console.log(`test-case ${f.index} :`, `🔑 Attempting login for ${f.name}...`);

      let result = "UNKNOWN";
      try {

        //================ ACTION ====================
        await btn("Sign In").click();
        await field("you@example.com").type(f.login.email);
        await field("Enter your password").type(f.login.pass);
        await btn("Sign In").click();


        const loginSuccess = await btn("Users").exists(3000);

        if (loginSuccess) {
          result = "PASS";
        } else {
          result = "FAIL";
        }

        logResult(f.index, result);

        await mouse.moveToPosition(40, 0);
        await mouse.setLockState(false, false);
        //await page.waitForTimeout(2000);
        //await mouse.hide();

        //================ ACTION ====================

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

const color = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m"
};


function logResult(testCase, result) {
  const statusColor =
    result === "PASS"
      ? color.green
      : result === "FAIL"
        ? color.red
        : color.yellow;

  console.log(
    `${statusColor}TC-${testCase}: ${result}${color.reset}`
  );
}

runWorkflows();
