const base = require("@playwright/test");
const createSuite = require("./createSuite");

module.exports = function createFramework(options = {}) {

  const suite = createSuite(options);

  const test = base.test.extend({

    session: async ({ }, use) => {
      await use(suite);
    },

    page: async ({ }, use) => {
      await use(suite.page);
    },

    mouse: async ({ }, use) => {
      await use(suite.mouse);
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

    img: async ({ }, use) => {
      await use(suite.img);
    },

    link: async ({ }, use) => {
      await use(suite.link);
    },

    notify: async ({ }, use) => {
      await use(suite.notify);
    },

    InteractionMode: async ({ }, use) => {
      await use(suite.InteractionMode);
    }

  });

  return {

    test,

    expect: base.expect

  };

};
