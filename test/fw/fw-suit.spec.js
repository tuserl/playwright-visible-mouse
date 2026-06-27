const { test, expect, configure } = require("playwright-visible-mouse");

configure({
  url: "http://localhost:9999/CommissionWebApp/index.jsp",

  interactionMode: "HUMAN",

  notify: true,

  launch: {
    headless: false
  }
});

test("TC06", async ({ field, btn }) => {

  await field("Price").type("100");

  await btn("Submit").click();

});



/*
No session.
No hooks.
 */
