```
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

```


Per-test launch overrides are not supported when reuseBrowser is enabled.
Configure launch options in the framework initialization instead.

`npx playwright test --workers=1``

```
test.describe("Tile 1", () => {
  test.use({ launch: { tileIndex: 1 } });

  test("TC-LOGIN-002: Login with empty email", async ({ ui }) => {
    expect(await login(ui, "", "11111111", 1, "Please fill in all fields.")).toBe(true);
  });
});
```

```
TC-LOGIN-001
 └── launch {tileIndex:0}
     └── session
         └── browser

TC-LOGIN-002
 └── launch {tileIndex:1}
     └── session
         └── browser
```

```
// Default all tests to monitor 0
test.use({
  launch: {
    tileIndex: 0
  }
});

// Special cases
test.describe("Second browser", () => {
  test.use({
    launch: {
      tileIndex: 1
    }
  });

  test("...", async ({ui}) => {});
});
```
