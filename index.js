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


// default export
//const manager = new BrowserManager();
//for manager older
//module.exports = manager;

const createFramework = require("./framework/createFramework");
module.exports = createFramework;

function exported(options) {
  return createFramework(options);
}

// Old API
exported.manager = manager;
exported.BrowserManager = BrowserManager;
exported.createLocator = createLocator;
exported.InteractionMode = InteractionMode;
exported.UIElement = UIElement;
exported.DemoMouse = DemoMouse;

// New API
module.exports = exported;


// framework export
module.exports.createSuite = require("./framework/createSuite");
module.exports.test = require("./framework/test").test;
module.exports.expect = require("./framework/test").expect;
module.exports.configure = require("./framework/test").configure;


// usage
// const { test } = require("playwright-visible-mouse")({
//    url: "..."
//});
// const manager = require("playwright-visible-mouse").manager;

//module.exports.createLocator = createLocator;
//module.exports.InteractionMode = InteractionMode;
//module.exports.UIElement = UIElement;

// extra exports
//module.exports.DemoMouse = DemoMouse;
//module.exports.BrowserManager = BrowserManager;

//usage
//const manager = require("playwright-visible-mouse");
//const { DemoMouse } = require("playwright-visible-mouse");
/*
const {
  expectRequiredSelectIfPresent
} = require("playwright-visible-mouse/expectHelpers");

expectRequiredSelectIfPresent(state);
*/

