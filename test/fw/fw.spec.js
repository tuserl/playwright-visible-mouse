const { test, expect } = require("@playwright/test");
const { createSuite } = require("playwright-visible-mouse");

const suite = createSuite({

  url: "http://localhost:9999/CommissionWebApp/index.jsp",

  interactionMode: "NORMAL",

  notify: true

});

test("TC06", async () => {

  await suite.field("Price").type("100");

  await suite.btn("Calculate Commission").click();

});


test("TC07", async () => {

  await suite.field("Price").type("300");

  await suite.btn("Calculate Commission").click();

});
