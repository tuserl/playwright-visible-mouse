const { test, expect } = require("@playwright/test");
const path = require("path");

const manager = require("../../index");


test.describe.configure({ mode: "parallel" });

test.setTimeout(60000);


test("Full form and UI interaction", async () => {

  const absolutePath = path.resolve(
    __dirname,
    "./index.html"
  );

  const {
    page,
    btn,
    field,
    checkbox,
    radio,
    select,
    link,
    img,
    tableCell,
    text,
    selectOption,
    setInteractionMode,
    InteractionMode,
    browser

  } = await manager.launch({
    url: `file://${absolutePath}`,
    slowMo: 0,
    showCursor: true
  });


  setInteractionMode(
    InteractionMode.NORMAL
  );


  // ---------------------
  // Form inputs
  // ---------------------

  await field("Email")
    .type("test@example.com");

  await expect(
    field("Email").loc
  )
    .toHaveValue("test@example.com");


  await field("Password")
    .type("password123");


  await checkbox("Remember me")
    .click();

  await expect(
    checkbox("Remember me").loc
  )
    .toBeChecked();



  await radio("Male")
    .click();

  await expect(
    radio("Male").loc
  )
    .toBeChecked();



  // ---------------------
  // Dropdown
  // ---------------------

  await selectOption(
    "Country",
    "jp"
  );


  await expect(
    select("Country").loc
  )
    .toHaveValue("jp");



  // ---------------------
  // Navigation
  // ---------------------

  await link("Home")
    .click();



  // ---------------------
  // Image interaction
  // ---------------------

  await expect(
    img("Company logo").loc
  )
    .toBeVisible();


  await img("Company logo")
    .click();



  // ---------------------
  // Table interaction
  // ---------------------

  let cell;


  // row text + column text

  cell = await tableCell(
    "Alice",
    "Age"
  );

  await expect(cell.loc)
    .toHaveText("22");

  await cell.click();



  // row index + column index

  cell = await tableCell(
    0,
    1
  );

  await cell.click();



  // row text + column index

  cell = await tableCell(
    "Alice",
    0
  );

  await cell.click();



  // row index + column text

  cell = await tableCell(
    0,
    "Name"
  );

  await cell.click();



  // ---------------------
  // Submit
  // ---------------------

  await btn("Submit")
    .click();


  await expect(
    text("Login Successful").loc
  )
    .toBeVisible();


  await browser.close();

});
