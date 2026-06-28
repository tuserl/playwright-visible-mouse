Default:

const { test } = require("playwright-visible-mouse")({
  launch: {
    mode: "split2"
  }
});

test.use({
  launch: {
    tileIndex: 1,
    slowMo: 300
  }
});

Reuse one browser:

const { test } = require("playwright-visible-mouse")({
  reuseBrowser: true,
  launch: {
    mode: "split2",
    tileIndex: 0
  }
});



Per-test launch overrides are not supported when reuseBrowser is enabled.
Configure launch options in the framework initialization instead.

npx playwright test --workers=1
