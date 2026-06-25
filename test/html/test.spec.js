const { test, expect } = require("@playwright/test");
const path = require("path");
const manager = require("../../lib/browserManager");

// Enable parallel execution for test cases
test.describe.configure({ mode: "parallel" });

// Set timeout for each test case to 60 seconds
test.setTimeout(60000);

test("Full form and UI interaction", async () => {
  // 1. Setup: Resolve absolute path and launch browser
  const absolutePath = path.resolve(__dirname, "./index.html");
  const fileUrl = `file://${absolutePath}`;

  const {
    btn, field, checkbox, radio, select,
    link, img, tableCell, text, selectOption, setInteractionMode, InteractionMode
  } = await manager.launch({ url: fileUrl });


  setInteractionMode(InteractionMode.NORMAL);
  // 2. Form Inputs & Interactions
  await field("Email").type("test@example.com");
  await expect(field("Email").loc).toHaveValue("test@example.com");

  await field("Password").type("password123");

  await checkbox("Remember me").click();
  await expect(checkbox("Remember me").loc).toBeChecked();

  await radio("Male").click();
  await expect(radio("Male").loc).toBeChecked();

  // 3. Dropdown Selection
  await selectOption("Country", "jp");
  await expect(select("Country").loc).toHaveValue("jp");

  // 4. Navigation
  await link("Home").click();


  setInteractionMode(InteractionMode.HUMAN);

  // 5. Image Validation & Interaction
  await expect(img("Company logo").loc).toBeVisible();
  await img("Company logo").click();

  // 6. Table Interaction & Validation
  await expect(tableCell("Alice", "Age").loc).toBeVisible();
  await expect(tableCell("Alice", "Age").loc).toHaveText("22");
  await tableCell("Alice", "Age").click();

  // 7. Submit and Final Validation
  await btn("Submit").click();

  // Verify the "Login Successful" text appears using Auto-Waiting
  await expect(text("Login Successful").loc).toBeVisible();
});
