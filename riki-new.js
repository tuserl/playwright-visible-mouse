const manager = require("./lib/browserManager");
manager.setUrl("https://riki.edu.vn/");

async function runGuestWorkflow() {
  const { btn, link, field, page, mouse, pause } = await manager.launch({ mode: 'fullscreen' });

  await btn("Đóng").getIndex(0).click();
  //  await btn("Đóng").click();
  await link("HỌC ONLINE").click();
  await field("Nhập email tại đây").type("admin@system.com");
  await field("Nhập mật khẩu tại đây").type("Admin@123");
  await btn("ĐĂNG NHẬP").click();

  await pause();

  await mouse.moveToPosition(45, 0);
}
async function runGuest1Workflow() {
  const { browser, btn, link, field, page, mouse } = await manager.launch({ mode: 'fullscreen' });

  await btn("Đóng").getIndex(0).click();
  //  await btn("Đóng").click();
  await link("HỌC ONLINE").click();
  await field("Nhập email tại đây").type("admin@system.com");
  await field("Nhập mật khẩu tại đây").type("Admin@123");
  await btn("ĐĂNG NHẬP").click();

  await page.waitForTimeout(500);
  await mouse.moveToPosition(45, 0);

  await browser.close();
}

runGuestWorkflow();

runGuest1Workflow();
