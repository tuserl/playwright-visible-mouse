const manager = require("playwright-visible-mouse");
manager.setUrl("https://riki.edu.vn/");

async function runGuestWorkflow() {
  const { btn, link, field, text, mouse, pause } = await manager.launch({ mode: "maximized" });

  // Wait up to 2s to see if "Đóng" button appears, then click the first match
  if (await btn("Đóng").exists(2000))
    await btn("Đóng").getIndex(0).click();

  await link("HỌC ONLINE").click();
  await field("Nhập email tại đây").type("admin@system.com");
  await field("Nhập mật khẩu tại đây").type("Admin@123");
  await btn("ĐĂNG NHẬP").click();

  const loginError = await text("Tài khoản hoặc mật khẩu không đúng !").exists(10000);
  console.log("Login error exists:", loginError);

  await pause();                    // stop here for inspection
  await mouse.moveToPosition(45, 0);
}

runGuestWorkflow();
