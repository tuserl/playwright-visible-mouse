const manager = require("./lib/browserManager");
manager.setUrl("http://localhost:3001");

async function runGuestWorkflow() {
  const { btn, field, page, mouse } = await manager.launch({ mode: 'fullscreen' });

  await btn("Sign In").click();
  await field("you@example.com").type("admin@system.com");
  await field("Enter your password").type("Admin@123");
  await btn("Sign In").click();

  await btn("Users").click();
  await page.waitForTimeout(500);
  await mouse.moveToPosition(45, 0);
}

async function runAMWorkflow() {
  const { btn, field, mouse } = await manager.launch({ mode: 'tiled', side: 'right' });

  await btn("Sign In").click();
  await field("you@example.com").type("am@gmail.com");
  await field("Enter your password").type("12345678");
  await btn("Sign In").click();

  await btn("Pending Courses").click();
  await mouse.moveToPosition(45, 0);
}

// Execute everything automatically
manager.runWorkflows([runGuestWorkflow, runAMWorkflow]);
