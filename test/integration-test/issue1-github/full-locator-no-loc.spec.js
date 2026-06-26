const { test, expect } = require("@playwright/test");
const path = require("path");

const manager = require("../../../index");


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
  // field
  // ---------------------

  const email = field("Email");

  await email.type("test@gmail.com");

  expect(
    await email.loc.inputValue()
  )
    .toBe("test@gmail.com");



  // ---------------------
  // id
  // ---------------------

  await field({
    id: "emailInput"
  })
    .type("id@test.com");



  // ---------------------
  // placeholder
  // ---------------------

  await field({
    placeholder: "Password"
  })
    .type("123456");



  // ---------------------
  // name
  // ---------------------

  await field({
    name: "username"
  })
    .type("Alice");



  // ---------------------
  // checkbox
  // ---------------------

  const remember = checkbox("Remember me");

  await remember.click();

  expect(
    await remember.loc.isChecked()
  )
    .toBe(true);



  // ---------------------
  // radio
  // ---------------------

  const male = radio("Male");

  await male.click();

  expect(
    await male.loc.isChecked()
  )
    .toBe(true);



  // ---------------------
  // select
  // ---------------------

  await selectOption(
    {
      name: "Country"
    },
    "jp"
  );


  expect(
    await select({
      name: "Country"
    }).loc.inputValue()
  )
    .toBe("jp");



  // ---------------------
  // button
  // ---------------------

  await btn({
    class: "primary submit-btn"
  })
    .click();



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
  // image
  // ---------------------

  expect(
    await img("Company logo").exists()
  )
    .toBe(true);



  // ---------------------
  // text
  // ---------------------

  expect(
    await text("Welcome User").exists()
  )
    .toBe(true);



  // ---------------------
  // table
  // ---------------------

  let cell;


  cell = await tableCell(
    "Bob",
    "Age"
  );

  expect(
    await cell.loc.textContent()
  )
    .toBe("22");



  cell = await tableCell(
    1,
    1
  );

  expect(
    await cell.loc.textContent()
  )
    .toBe("22");



  cell = await tableCell(
    "Alice",
    0
  );

  expect(
    await cell.loc.textContent()
  )
    .toBe("Alice");



  cell = await tableCell(
    1,
    "Country"
  );

  expect(
    await cell.loc.textContent()
  )
    .toBe("Japan");



  // ---------------------
  // final
  // ---------------------

  expect(
    await text("Login Successful").exists()
  )
    .toBe(true);



  await browser.close();

});
