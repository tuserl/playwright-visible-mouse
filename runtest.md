npx playwright test demoEDfull.spec.js --headed

npx playwright test demoEDfull.spec.js --headed --reporter=html

```
// playwright.config.js
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  // 🌟 Force an HTML report folder to be generated every single time
  reporter: [["html", { open: "always" }]], 

  use: {
    // 🌟 Keeps the browser visible by default so you don't need --headed
    headless: false, 
    viewport: null,
    launchOptions: {
      args: ["--start-maximized", "--no-sandbox"],
    },
  },
});
```

npx playwright show-report


npx playwright test demoEDfull-mulrole-split.spec.js
npx playwright test --headed --reporter=html demoBMsplit-async.spec.js
