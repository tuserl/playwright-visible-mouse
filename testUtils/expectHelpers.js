const { expect } = require("@playwright/test");

function expectRequiredSelectIfPresent(state) {
  if (!state) return;

  expect(state.isRequired).toBe(true);
  expect(state.value).toBe("");
}

module.exports = {
  expectRequiredSelectIfPresent
};
