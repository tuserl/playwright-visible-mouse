# playwright-visible-mouse

A Playwright testing framework extension that provides:

- Human-like mouse interaction
- Simplified UI element selectors
- Automatic fixture generation
- Configurable test sessions
- Reusable testing APIs

The framework is built on top of `@playwright/test`.

---

# Architecture

The framework flow:

```
BrowserManager
      |
      | returns API object
      v
Session.api
      |
      | Session.exposed defines exposed APIs
      v
createFramework.js
      |
      | automatically creates Playwright fixtures
      v
Playwright test
```

Example:

```
BrowserManager
      |
      v
session.api
      |
      v
Session.exposed
      |
      v
createFramework fixtures
      |
      v
test({ btn, field, mouse })
```

---

# Installation

```bash
npm install playwright-visible-mouse
```

---

# Basic Usage

```javascript
const {
  test,
  expect
} = require("playwright-visible-mouse")({

  url: "http://localhost:9999/CommissionWebApp/index.jsp",

  interactionMode: "HUMAN",

  notify: true,

  launch: {
    mode: "maximized",
    headless: false
  }

});


test("Login test", async ({
  field,
  btn,
  page
}) => {

  await field("Username")
    .type("admin");

  await btn("Login")
    .click();

  await expect(page)
    .toHaveURL(/dashboard/);

});
```

---

# Framework Concept

## BrowserManager

`BrowserManager` is responsible for creating the browser environment.

It returns the automation API:

```javascript
{
  browser,
  page,
  mouse,

  btn,
  field,
  text,
  checkbox,
  radio,

  notify,
  selectOption,

  InteractionMode,
  setInteractionMode
}
```

---

# Session

`Session` manages:

- Browser lifecycle
- Test navigation
- Interaction mode
- Notification setup


Example:

```javascript
session.api = {
  page,
  mouse,
  btn,
  field
}
```

---

# Exposing New APIs

To expose a new API:

## 1. Add it to BrowserManager

Example:

```javascript
return {

  ...,

  calendarPicker

};
```

---

## 2. Add it to `Session.exposed`

`framework/session.js`

```javascript
static exposed = [

  "btn",
  "field",
  "mouse",
  "calendarPicker"

];
```

---

## 3. Use it automatically in tests

No extra fixture code is required.

```javascript
test(
"calendar test",
async ({
  calendarPicker
}) => {

  await calendarPicker.open();

});
```

The framework automatically creates the fixture.

---

# Reserved Fixtures

Some names are reserved because they are already used by Playwright or the framework.

Example:

```javascript
const reservedFixtures = [
  "page",
  "session",
  "ui"
];
```

If an exposed API conflicts with a reserved fixture, add it to the reserved list.

Example:

```javascript
if (reservedFixtures.includes(key)) {
  continue;
}
```

This prevents accidentally overwriting:

- Playwright `page`
- Framework `session`
- Custom fixtures

---

# Available Built-in Fixtures

Example:

```javascript
test(
"Example",
async ({
  btn,
  field,
  mouse,
  text,
  page
}) => {

});
```

Available APIs depend on `Session.exposed`.

Default:

```javascript
[
  "btn",
  "field",
  "text",
  "checkbox",
  "radio",
  "select",
  "img",
  "link",
  "mouse",
  "notify",
  "InteractionMode",
  "setInteractionMode",
  "tableCell",
  "selectOption",
  "selectOptionOrGetState",
  "pause"
]
```

---

# UI Element Helpers

## Button

```javascript
await btn("Submit").click();
```

Uses:

```javascript
page.getByRole("button")
```

---

## Field

```javascript
await field("Email")
  .type("test@example.com");
```

---

## Text

```javascript
const value =
await text({
  class:"price"
})
.loc.textContent();
```

---

## Checkbox

```javascript
await checkbox("Remember me")
.click();
```

---

## Radio

```javascript
await radio("Male")
.click();
```

---

# Mouse Interaction

The framework supports human-like mouse movement.

Example:

```javascript
await mouse.randomMoveHuman();
```

Useful for:

- Demonstrations
- UI testing
- Human simulation

---

# Interaction Mode

Available modes:

```javascript
InteractionMode.HUMAN
InteractionMode.NORMAL
InteractionMode.INSTANT
```

Change mode:

```javascript
setInteractionMode(
  InteractionMode.NORMAL
);
```

---

# Notifications

Enable:

```javascript
notify:true
```

The framework automatically shows the test name.

Manual notification:

```javascript
await notify(
  "Test completed"
);
```

---

# Configuration

Example:

```javascript
require(
"playwright-visible-mouse"
)({

url:"http://localhost:9999",

interactionMode:"HUMAN",

notify:true,

launch:{
  headless:false,
  slowMo:0
}

});
```

---

# Writing Business Helpers

For complex flows, create reusable functions.

Example:

```javascript
async function calculateCommission(
  ui,
  employee,
  item,
  customer,
  price
){

  await ui.selectOption(
    "itemType",
    item
  );

  await ui.field("Price")
    .type(price);

  await ui.btn("Calculate")
    .click();

}
```

Usage:

```javascript
test(
"commission",
async ({ ui }) => {

 await calculateCommission(
   ui,
   "SALARIED",
   "BONUS",
   "REGULAR",
   10000
 );

});
```

---

# Design Philosophy

This framework follows:

- Convention over configuration
- Automatic fixture generation
- Minimal test boilerplate
- Reusable UI automation APIs

The test writer should focus on:

```
What to test
```

instead of:

```
How to initialize Playwright
```

---

# Internal Structure

```
src
 |
 |-- lib
 |    |
 |    |-- browserManager.js
 |
 |-- framework
      |
      |-- config.js
      |-- session.js
      |-- createFramework.js
```

---

# Development Workflow

When adding a new automation feature:

```
BrowserManager
      |
      v
Add API
      |
      v
Session.exposed
      |
      v
Fixture automatically created
      |
      v
Use in tests
```

No manual fixture wiring is required.
