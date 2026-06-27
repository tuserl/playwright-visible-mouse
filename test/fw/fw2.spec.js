const { test, expect } = require("playwright-visible-mouse")({
  url: "http://localhost:9999/CommissionWebApp/index.jsp",

  interactionMode: "HUMAN",

  notify: true,

  launch: {
    headless: false
  }
});

test("TC01", async ({ field, btn, page }) => {

  await field("Price").type("100");

  await btn("Calculate Commission").click();

  await expect(page).toHaveURL(/CommissionWebApp/);

});
