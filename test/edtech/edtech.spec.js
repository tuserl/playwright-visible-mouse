const { test, expect } = require("playwright-visible-mouse")({
  mode: "attach",                          // <-- NEW: use Playwright's own page (trace DOM works)
  url: "http://localhost:3001/login",
  interactionMode: "HUMAN",
  notify: true,
  launch: {
    showCursor: true
  },
});

test.describe.configure({ mode: "parallel" });

async function login(ui, email, password, expectResult) {
  const { btn, page, field, text, notifyWait, setInteractionMode } = ui;
  setInteractionMode(process.env.INTERACTION_MODE_TEST);

  await field("you@example.com").type(email);
  await field("Enter your password").type(password);
  await btn("Sign In").click();

  console.log("TEST:", ui.testInfo.title);
  await page.waitForTimeout(1000);

  let result = await text(expectResult).exists(6000);
  if (!result) {
    result = await btn(expectResult).exists(3000);
  }
  await notifyWait(`${result} ~ (〃￣︶￣)人(￣︶￣〃)`);
  return result;
}

test.describe('Scenario C: Email Format Validation', () => {
  test("TC-LOGIN-EMAIL-001: Verify login rejects invalid email format", async ({ ui }) => {
    expect(await login(ui, "userexample.com", "ValidPass123", "Invalid email")).toBe(true);
  });
  test("TC-LOGIN-EMAIL-002: Verify login rejects email without domain", async ({ ui }) => {
    expect(await login(ui, "user@", "ValidPass123", "Invalid email")).toBe(true);
  });
  test("TC-LOGIN-EMAIL-003: Verify login rejects email without username", async ({ ui }) => {
    expect(await login(ui, "@example.com", "ValidPass123", "Invalid email")).toBe(true);
  });
});
