const { test, expect } = require("@playwright/test");
const manager = require("playwright-visible-mouse");
const { createLocator } = require("../../../index");

test.beforeEach(async ({ page }) => {
  await page.setContent(`
        <button id="saveBtn">Save</button>

        <input 
            id="username"
            name="username"
            placeholder="Enter username"
            aria-label="Username"
        />

        <input type="checkbox" aria-label="Accept">

        <img src="logo.png" alt="Company Logo">

        <div class="card active">
            Card Text
        </div>
    `);
});


test("text selector", async ({ page }) => {
  const btn = page.getByText("Save");

  await expect(btn).toBeVisible();
});


test("label selector", async ({ page }) => {
  const field = page.getByLabel("Username");

  await expect(field).toBeVisible();
});


test("placeholder selector", async ({ page }) => {
  const field = page.getByPlaceholder("Enter username");

  await expect(field).toBeVisible();
});


test("role selector", async ({ page }) => {
  const button = page.getByRole("button", {
    name: "Save"
  });

  await expect(button).toBeVisible();
});


test("id selector", async ({ page }) => {
  const input = page.locator("#username");

  await expect(input).toBeVisible();
});


test("name selector", async ({ page }) => {
  const input = page.locator('[name="username"]');

  await expect(input).toBeVisible();
});


test("class selector", async ({ page }) => {
  const div = page.locator(".card.active");

  await expect(div).toBeVisible();
});


test("alt selector", async ({ page }) => {
  const img = page.getByRole("img", {
    name: "Company Logo"
  });

  await expect(img).toBeVisible();
});

test("string selector uses default key", async ({ page }) => {

  await page.setContent(`
        <button>Save</button>
    `);

  const locator = createLocator(
    page,
    "Save",
    {
      defaultKey: "text",
      text: (v) => page.getByText(v)
    }
  );

  await expect(locator).toBeVisible();

});

test("class selector supports multiple classes", async ({ page }) => {

  await page.setContent(`
        <div class="card active">
            Content
        </div>
    `);

  const locator = createLocator(page, {
    class: "card active"
  });

  await expect(locator).toBeVisible();

});

test("selector priority uses first matching rule", async ({ page }) => {

  await page.setContent(`
        <input id="username" aria-label="User">
    `);

  const locator = createLocator(page, {
    id: "username",
    label: "User"
  });

  await expect(locator).toHaveAttribute(
    "id",
    "username"
  );

});

test("throws error for unsupported selector", async ({ page }) => {

  await expect(() =>
    createLocator(page, {
      xpath: "//input"
    })
  ).toThrow("Unsupported selector.");

});
