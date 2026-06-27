const DemoMouse = require("./lib/demoMouse");

const {
  BrowserManager,
  createLocator,
  InteractionMode,
  UIElement
} = require("./lib/browserManager");

const createFramework = require("./framework/createFramework");


// old singleton manager
const manager = new BrowserManager();


// new API
function exported(options) {
  return createFramework(options);
}


// default export
module.exports = exported;


// new API exports
module.exports.BrowserManager = BrowserManager;
module.exports.createLocator = createLocator;
module.exports.InteractionMode = InteractionMode;
module.exports.UIElement = UIElement;
module.exports.DemoMouse = DemoMouse;


// old API compatibility
module.exports.manager = manager;


// allow:
// const manager = require("playwright-visible-mouse");
module.exports.setUrl = (...args) =>
  manager.setUrl(...args);

module.exports.launch = (...args) =>
  manager.launch(...args);


// Now both old and new work
