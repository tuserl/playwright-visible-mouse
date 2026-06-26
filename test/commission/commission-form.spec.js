const { test, expect } = require("@playwright/test");
const manager = require("../../lib/browserManager.js");
//test.describe.configure({ mode: "parallel" });

test.beforeEach(async () => {
  manager.setUrl("http://localhost:9999/CommissionWebApp/index.jsp");
});

const EmployeeType = Object.freeze({
  SALARIED: "SALARIED",
  NON_SALARIED: "NON_SALARIED"
});

const ItemType = Object.freeze({
  STANDARD: "STANDARD",
  BONUS: "BONUS",
  OTHER: "OTHER"
});

const CustomerType = Object.freeze({
  REGULAR: "REGULAR",
  NON_REGULAR: "NON_REGULAR"
});


const {
  expectRequiredSelectIfPresent
} = require("../../testUtils/expectHelpers");


async function calculateCommission(employeeType, itemType, customerType, itemPrice) {
  const { btn, field, selectOption, selectOptionOrGetState, text, page } = await manager.launch({ mode: "maximized" });

  expectRequiredSelectIfPresent(await selectOptionOrGetState("employeeType", employeeType));

  expectRequiredSelectIfPresent(await selectOptionOrGetState("itemType", itemType));

  expectRequiredSelectIfPresent(await selectOptionOrGetState("customerType", customerType));

  await field("Enter item price...").type(itemPrice.toString());

  await btn("Calculate Commission").click();

  if (!(await btn("Calculate Again").exists(1000))) {
    return null;
  }

  const price = parseFloat(
    (await text({ class: "commission-value" }).loc.textContent())
      .replace(/[$,]/g, "")
  );

  await page.waitForTimeout(2000);

  return price;
}

//================================= TEST CASE =========================================

test("TC01", async () => {
  await (calculateCommission(null, ItemType.OTHER, CustomerType.NON_REGULAR, 10000));
});


test("TC06", async () => {
  const price = await (calculateCommission(EmployeeType.NON_SALARIED, ItemType.OTHER, CustomerType.NON_REGULAR, 10000));

  expect(price).toBe(1000);
});

