const { test, expect } = require("@playwright/test");
const path = require("path");

const manager = require("../../index");


test("Full locator integration test", async () => {

  const file = path.resolve(
    __dirname,
    "./index.html"
  );


  const {
    field,
    btn,
    checkbox,
    radio,
    select,
    link,
    img,
    text,
    tableCell,
    selectOption,
    setInteractionMode,
    InteractionMode,
    browser
  } = await manager.launch({
    url: `file://${file}`,
    slowMo: 0,
    showCursor: true
  });


  setInteractionMode(
    InteractionMode.NORMAL
  );


  // ---------------------
  // field placeholder
  // ---------------------

  await field("Email")
    .type("test@gmail.com");

  await expect(
    field("Email").loc
  ).toHaveValue("test@gmail.com");


  // ---------------------
  // id selector
  // ---------------------

  await field({
    id: "emailInput"
  })
    .type("id@test.com");


  // ---------------------
  // placeholder selector
  // ---------------------

  await field({
    placeholder: "Password"
  })
    .type("123456");


  // ---------------------
  // name selector
  // ---------------------

  await field({
    name: "username"
  })
    .type("Alice");


  // ---------------------
  // checkbox
  // ---------------------

  await checkbox("Remember me")
    .click();

  await expect(
    checkbox("Remember me").loc
  ).toBeChecked();


  // ---------------------
  // radio
  // ---------------------

  await radio("Male")
    .click();

  await expect(
    radio("Male").loc
  ).toBeChecked();


  // ---------------------
  // select
  // ---------------------

  await selectOption(
    {
      name: "Country"
    },
    "jp"
  );


  await expect(
    select({
      name: "Country"
    }).loc
  )
    .toHaveValue("jp");



  // ---------------------
  // class selector
  // ---------------------

  await btn({
    class: "primary submit-btn"
  })
    .click();



  // ---------------------
  // role selector
  // ---------------------

  await btn({
    role: "button",
    name: "Save Button"
  })
    .click();



  // ---------------------
  // link
  // ---------------------

  await link("Home")
    .click();



  // ---------------------
  // image alt
  // ---------------------

  await expect(
    img("Company logo").loc
  )
    .toBeVisible();



  // ---------------------
  // text
  // ---------------------

  await expect(
    text("Welcome User").loc
  )
    .toBeVisible();



  // ---------------------
  // table tests
  // ---------------------

  let cell;


  // row text + column text

  cell = await tableCell(
    "Bob",
    "Age"
  );

  await expect(cell.loc)
    .toHaveText("22");



  // row index + column index

  cell = await tableCell(
    1,
    1
  );

  await expect(cell.loc)
    .toHaveText("22");



  // row text + column index

  cell = await tableCell(
    "Alice",
    0
  );

  await expect(cell.loc)
    .toHaveText("Alice");



  // row index + column text

  cell = await tableCell(
    1,
    "Country"
  );

  await expect(cell.loc)
    .toHaveText("Japan");



  // ---------------------
  // final assertion
  // ---------------------

  await expect(
    text("Login Successful").loc
  )
    .toBeVisible();


  await browser.close();

});
