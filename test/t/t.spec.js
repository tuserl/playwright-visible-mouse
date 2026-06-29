const { test } = require('@playwright/test');
const { BrowserManager } = require('../../lib/browserManager'); // Adjust path to your class

test('my test using Playwright Test tracer', async ({ page }) => {

  // Do not call page.setViewportSize() in your test code.
  //  await page.setViewportSize({ width: 500, height: 500 });
  await page.goto('http://localhost:3001/');
  // 1. Instantiate the manager
  const bm = new BrowserManager();

  // 2. Attach to the page managed by Playwright Test instead of launching a new browser
  const ui = await bm.attach(page);

  // 3. Interact using your framework (all traces will be captured perfectly!)
  await ui.btn('Get Started').click();
  await ui.field({ placeholder: 'you@example.com' }).type('admin');
  await ui.notifyWait("BAKA");
});
