const base = require("@playwright/test");
const createSuite = require("./createSuite");

let suite = null;

function configure(options) {
  suite = createSuite(options);
}

const test = base.test.extend({
  page: async ({ }, use) => {
    await use(suite.page);
  },

  btn: async ({ }, use) => {
    await use(suite.btn);
  },

  field: async ({ }, use) => {
    await use(suite.field);
  },

  text: async ({ }, use) => {
    await use(suite.text);
  },

  checkbox: async ({ }, use) => {
    await use(suite.checkbox);
  },

  radio: async ({ }, use) => {
    await use(suite.radio);
  },

  select: async ({ }, use) => {
    await use(suite.select);
  },

  mouse: async ({ }, use) => {
    await use(suite.mouse);
  },

  notify: async ({ }, use) => {
    await use(suite.notify);
  },

  session: async ({ }, use) => {
    await use(suite);
  }
});

module.exports = {
  test,
  expect: base.expect,
  configure
};
