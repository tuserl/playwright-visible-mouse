const { chromium } = require("playwright");
const DemoMouse = require("./lib/demoMouse");

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
  });

  // --- CHANGED HERE: Define your custom width and height inside newContext ---
  const adminPage = await (
    await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  ).newPage();

  const teacherPage = await (
    await browser.newContext({ viewport: { width: 1280, height: 720 } })
  ).newPage();

  await adminPage.goto("http://localhost:3000");
  await teacherPage.goto("http://localhost:3000");

  const adminMouse = new DemoMouse(adminPage, "red");
  const teacherMouse = new DemoMouse(teacherPage, "blue");

  await adminMouse.install();
  await teacherMouse.install();

  // ADMIN INTERACTION
  await adminMouse.focus();
  await adminMouse.moveTo("#role");
  await adminPage.fill("#role", "Admin");
  await adminMouse.click("#submit");

  // TEACHER INTERACTION
  await teacherMouse.focus();
  await teacherMouse.moveTo("#role");
  await teacherPage.fill("#role", "Teacher");
  await teacherMouse.click("#submit");

  // Take screenshots and save them locally
  await adminPage.screenshot({ path: "admin.png" });
  await teacherPage.screenshot({ path: "teacher.png" });
  console.log("Screenshots saved successfully!");

  // Wait for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Close the browser instance
  await browser.close();
  console.log("Browser closed.");
})();