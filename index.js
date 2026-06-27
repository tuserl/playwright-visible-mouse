const DemoMouse = require("./lib/demoMouse");

const {
  BrowserManager,
  createLocator,
  InteractionMode,
  UIElement
} = require("./lib/browserManager");

const createFramework = require("./framework/createFramework");


function exported(options) {
  return createFramework(options);
}


// New framework API
module.exports = exported;


// Extra APIs
module.exports.BrowserManager = BrowserManager;
module.exports.createLocator = createLocator;
module.exports.InteractionMode = InteractionMode;
module.exports.UIElement = UIElement;
module.exports.DemoMouse = DemoMouse;
