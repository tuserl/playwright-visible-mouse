const manager = require("../lib/browserManager.js");
manager.setUrl("https://riki.edu.vn/");

async function runGuestWorkflow() {
  const { btn, link, field, mouse, pause, text, page } = await manager.launch({ mode: "maximized" });

  await link("HỌC ONLINE").click();
  await field("Nhập email tại đây").type("admin@system.com");
  await field("Nhập email tại đây").press("Backspace");
  await field("Nhập email tại đây").press("Control+A");
  //await field("Nhập email tại đây").clear();
  await field("Nhập mật khẩu tại đây").type("Admin@123");

  //reload page
  await page.reload();

  await btn("ĐĂNG NHẬP").click();

  const loginError = await text("Tài khoản hoặc mật khẩu không đúng !").exists();
  console.log("Login error exists:", loginError);

  await pause();                    // stop here for inspection
  await mouse.moveToPosition(45, 0);
}

runGuestWorkflow();
