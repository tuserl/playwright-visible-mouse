const DemoMouse = require('./lib/demoMouse');
//const BrowserManager = require('./lib/browserManager');

const {
  BrowserManager,
  createLocator,
  InteractionMode,
  UIElement
} = require("./lib/browserManager.js");

// Export the instance as default (Convenience)
module.exports = {
  BrowserManager,
  createLocator
};

const manager = new BrowserManager();

// default export
module.exports = manager;
module.exports.createLocator = createLocator;
module.exports.InteractionMode = InteractionMode;
module.exports.UIElement = UIElement;

// extra exports
module.exports.DemoMouse = DemoMouse;
module.exports.BrowserManager = BrowserManager;

//usage
//const manager = require("playwright-visible-mouse");
//const { DemoMouse } = require("playwright-visible-mouse");
/*
const {
  expectRequiredSelectIfPresent
} = require("playwright-visible-mouse/expectHelpers");

expectRequiredSelectIfPresent(state);
*/

