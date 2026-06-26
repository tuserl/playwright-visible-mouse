const { test, expect } = require("@playwright/test");
const path = require("path");
const manager = require("../../index");


test("Full locator coverage", async () => {

  const file = path.resolve(__dirname, "./index1.html");

  const {
    page,
    btn,
    field,
    checkbox,
    radio,
    select,
    link,
    img,
    text,
    tableCell,
    selectOption,
    setInteractionMode,
    InteractionMode

  } = await manager.launch({
    url: `file://${file}`,
    slowMo: 0
  });


  setInteractionMode(InteractionMode.NORMAL);


  // ---------------------
  // placeholder locator
  // ---------------------

  await field("Email").type("a@test.com");

  await expect(
    field("Email").loc
  ).toHaveValue("a@test.com");


  // ---------------------
  // id locator
  // ---------------------

  await field({
    id: "emailInput"
  }).type("id@test.com");


  // ---------------------
  // placeholder
  // ---------------------

  await field({
    placeholder: "Password"
  })
    .type("123456");


  // ---------------------
  // name locator
  // ---------------------

  await field({
    name: "username"
  })
    .type("Alice");


  // ---------------------
  // label locator
  // ---------------------

  await checkbox("Remember me").click();

  await expect(
    checkbox("Remember me").loc
  ).toBeChecked();


  // ---------------------
  // radio label
  // ---------------------

  await radio("Male").click();

  await expect(
    radio("Male").loc
  ).toBeChecked();


  // ---------------------
  // select
  // ---------------------

  await selectOption(
    "Country",
    "jp"
  );

  await expect(
    select("Country").loc
  ).toHaveValue("jp");


  // ---------------------
  // class locator
  // ---------------------

  await btn({
    class: "primary submit-btn"
  })
    .click();


  // ---------------------
  // role locator
  // ---------------------

  await btn({
    role: "button",
    name: "Save Button"
  })
    .click();


  // ---------------------
  // link
  // ---------------------

  await link("Home").click();


  // ---------------------
  // image alt
  // ---------------------

  await expect(
    img("Company logo").loc
  )
    .toBeVisible();


  // ---------------------
  // text locator
  // ---------------------

  await expect(
    text("Welcome User").loc
  )
    .toBeVisible();


  // ---------------------
  // table all combinations
  // ---------------------

  let cell;


  // row text + column text
  cell = await tableCell(
    "Alice",
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
  // submit result
  // ---------------------

  await expect(
    text("Login Successful").loc
  )
    .toBeVisible();


});
