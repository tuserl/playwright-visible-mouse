const manager = require("./lib/browserManager");
manager.setUrl("http://localhost:3001");

async function runAdminWorkflow() {
  const { btn, link, field, page, mouse, pause } = await manager.launch({ mode: 'fullscreen', showCursor: false });


  await mouse.show();

  await page.waitForTimeout(1000);

  await mouse.hide();

  await pause();

  await mouse.moveToPosition(45, 0);
}

runAdminWorkflow();
