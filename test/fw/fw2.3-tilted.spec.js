
const { test, expect } = require("playwright-visible-mouse")({
  url: "http://localhost:3001/login",
  interactionMode: "HUMAN",
  notify: true,
  launch: {
    mode: "split2",
    headless: false
  }
});

async function login(ui, email, password, expectResult) {
  const { btn, field, selectOptionOrGetState, text, page, mouse, notifyWait, InteractionMode, setInteractionMode } = ui;
  setInteractionMode(process.env.INTERACTION_MODE_TEST);

  await field("you@example.com").type(email);
  await field("Enter your password").type(password);
  await btn("Sign In").click();

  const result = await text(expectResult).exists(6000);
  await notifyWait(`${result} ~ (〃￣︶￣)人(￣︶￣〃)`);
  return result;
}
test.describe.configure({ mode: "parallel" });

//================================= TEST CASES =========================================


test.use({ launch: { tileIndex: 0 } });

test("TC-LOGIN-001: Login with empty email and password", async ({ ui }) => {
  expect(await login(ui, "", "", "Please fill in all fields.")).toBe(true);
});

test.describe("Tile 1", () => {
  test.use({ launch: { tileIndex: 1 } });

  test("TC-LOGIN-002: Login with empty email", async ({ ui }) => {
    expect(await login(ui, "", "11111111", "Please fill in all fields.")).toBe(true);
  });
});

test("TC-LOGIN-003: Login with empty email and password", async ({ ui }) => {
  expect(await login(ui, "", "", "Please fill in all fields.")).toBe(true);
});

