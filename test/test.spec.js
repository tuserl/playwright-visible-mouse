const { test, expect } = require("@playwright/test");
const manager = require("../lib/browserManager");

// Enable parallel execution for test cases
test.describe.configure({ mode: "parallel" });

// Set timeout for each test case
test.setTimeout(60000);


// ================= FUNCTION =================
// Login workflow with email and password parameters
async function login(email, password) {

  const { btn, link, field, text } =
    await manager.launch({ mode: "maximized" });

  // ACTION
  await link("HỌC ONLINE").click();

  await field("Nhập email tại đây")
    .type(email);

  await field("Nhập mật khẩu tại đây")
    .type(password);

  await btn("ĐĂNG NHẬP").click();

  // Return whether error message appears
  return await text(
    "Tài khoản hoặc mật khẩu không đúng !"
  ).exists(6000);
}


// ================= SETUP =================
// Run before every test case
test.beforeEach(async () => {
  manager.setUrl("http://riki.edu.vn");
});


// ================= TEST CASES =================

// Test Case 1: Invalid login credentials
test("Guest login failure", async () => {

  const loginError = await login(
    "admin@system.com",
    "Admin@123"
  );

  // ASSERTION
  expect(loginError).toBe(true);

});


// Test Case 2: Valid login credentials
test("Guest login success", async () => {

  const loginError = await login(
    "valid@email.com",
    "correctPassword"
  );

  // ASSERTION
  expect(loginError).toBe(false);

});


// Run and generate HTML report
//npx playwright test test/test.spec.js --headed --reporter=html

// Test Case Structure
/*
Test Case
│
├── Setup
│
├── Action / Function Flow
│
└── Assertion (Expected Result)
*/