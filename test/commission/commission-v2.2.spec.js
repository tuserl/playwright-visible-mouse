const { test, expect } = require("playwright-visible-mouse")({
  url: "http://localhost:9999/CommissionWebApp/index.jsp",
  interactionMode: "HUMAN",
  notify: true,
  launch: {
    mode: "maximized",
    headless: false
  }
});

const { expectRequiredSelectIfPresent } = require("../../testUtils/expectHelpers");
const EmployeeType = Object.freeze({ SALARIED: "SALARIED", NON_SALARIED: "NON_SALARIED" });
const ItemType = Object.freeze({ STANDARD: "STANDARD", BONUS: "BONUS", OTHER: "OTHER" });
const CustomerType = Object.freeze({ REGULAR: "REGULAR", NON_REGULAR: "NON_REGULAR" });

async function calculateCommission({ btn, field, selectOptionOrGetState, text, page, mouse, notify, InteractionMode, setInteractionMode }
  , employeeType, itemType, customerType, itemPrice) {
  expectRequiredSelectIfPresent(await selectOptionOrGetState("employeeType", employeeType));
  setInteractionMode(InteractionMode.NORMAL);
  expectRequiredSelectIfPresent(await selectOptionOrGetState("itemType", itemType));
  expectRequiredSelectIfPresent(await selectOptionOrGetState("customerType", customerType));
  if (itemPrice != null) await field("Enter item price...").type(itemPrice.toString());
  await btn("Calculate Commission").click();
  await mouse.randomMoveHuman();
  await page.waitForTimeout(500);
  await mouse.randomMoveHuman();
  if (!(await btn("Calculate Again").exists(1000))) return null;
  const result = parseFloat((await text({ class: "commission-value" }).loc.textContent()).replace(/[$,]/g, ""));
  await notify(`$${result} ~ (〃￣︶￣)人(￣︶￣〃)`);
  await page.waitForTimeout(3500);
  return result;
}

test("TC08", async ({ ui }) => {
  expect(await calculateCommission(ui, EmployeeType.SALARIED, ItemType.BONUS, CustomerType.REGULAR, 10000)).toBe(0);
});

