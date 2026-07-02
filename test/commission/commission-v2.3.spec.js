const { test, expect } = require("playwright-visible-mouse")({
  //  mode: "attach",
  url: "http://localhost:9999/CommissionWebApp/index.jsp",
  interactionMode: "HUMAN",
  notify: true,
  reuseBrowser: true,
  //  trace: "off",
  launch: {
    mode: "split2",
    autoTile: true,
    headless: false
  }
});

const { expectRequiredSelectIfPresent } = require("../../testUtils/expectHelpers");
const EmployeeType = Object.freeze({ SALARIED: "SALARIED", NON_SALARIED: "NON_SALARIED" });
const ItemType = Object.freeze({ STANDARD: "STANDARD", BONUS: "BONUS", OTHER: "OTHER" });
const CustomerType = Object.freeze({ REGULAR: "REGULAR", NON_REGULAR: "NON_REGULAR" });

async function calculateCommission(ui, employeeType, itemType, customerType, itemPrice) {
  const { btn, field, selectOptionOrGetState, text, page, mouse, notifyWait, InteractionMode, setInteractionMode } = ui;
  expectRequiredSelectIfPresent(await selectOptionOrGetState("employeeType", employeeType));
  setInteractionMode(InteractionMode.NORMAL);
  expectRequiredSelectIfPresent(await selectOptionOrGetState("itemType", itemType));
  expectRequiredSelectIfPresent(await selectOptionOrGetState("customerType", customerType));
  if (itemPrice != null) await field("Enter item price...").type(itemPrice.toString());
  await btn("Calculate Commission").click();
  /*await mouse.randomMoveHuman();
  //await page.waitForTimeout(500);
  await mouse.randomMoveHuman();*/
  if (!(await btn("Calculate Again").exists(1000))) return null;
  const result = parseFloat((await text({ class: "commission-value" }).loc.textContent()).replace(/[$,]/g, ""));
  await notifyWait(`${ui.testInfo.title}: $${result} ~ (〃￣︶￣)人(￣︶￣〃)`);
  return result;
}
test.describe.configure({ mode: "parallel" });

//================================= TEST CASES =========================================

test("TC01", async ({ ui }) => {
  expect(await calculateCommission(ui, null, ItemType.STANDARD, CustomerType.REGULAR, 1000))
    .toBe(null);
});


test("TC02", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.SALARIED, null, CustomerType.REGULAR, 1000))
    .toBe(null);
});

/*
test("TC03", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.SALARIED, ItemType.STANDARD, null, 1000))
    .toBe(null);
});

test("TC04", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.SALARIED, ItemType.STANDARD, CustomerType.REGULAR, null))
    .toBe(null);
});

test("TC05", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.SALARIED, ItemType.STANDARD, CustomerType.REGULAR, 0))
    .toBe(null);
});

test("TC06", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.NON_SALARIED, ItemType.OTHER, CustomerType.NON_REGULAR, 10000))
    .toBe(1000);
});

test("TC07", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.NON_SALARIED, ItemType.OTHER, CustomerType.NON_REGULAR, 10001))
    .toBe(500.05);
});

test("TC08", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.SALARIED, ItemType.BONUS, CustomerType.REGULAR, 10000))
    .toBe(0);
});

test("TC09", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.SALARIED, ItemType.BONUS, CustomerType.NON_REGULAR, 1000))
    .toBe(50);
});

test("TC10", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.SALARIED, ItemType.BONUS, CustomerType.NON_REGULAR, 10000))
    .toBe(25);
});

test("TC11", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.NON_SALARIED, ItemType.BONUS, CustomerType.NON_REGULAR, 1000))
    .toBe(100);
});

test("TC12", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.NON_SALARIED, ItemType.BONUS, CustomerType.NON_REGULAR, 10000))
    .toBe(75);
});

test("TC13", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.SALARIED, ItemType.OTHER, CustomerType.NON_REGULAR, 1000))
    .toBe(0);
});

*/
