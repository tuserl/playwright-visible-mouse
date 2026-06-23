const DemoMouse = require('./lib/demoMouse');
const BrowserManager = require('./lib/browserManager');

// 1. Export the instance as default (Convenience)
module.exports = BrowserManager;

// 2. Attach classes as properties (Flexibility)
module.exports.DemoMouse = DemoMouse;
module.exports.BrowserManager = BrowserManager;

//usage
//const manager = require("playwright-visible-mouse");
//const { DemoMouse } = require("playwright-visible-mouse");


//module.exports = {
//  DemoMouse,
//  BrowserManager
//};

//usage
//const { DemoMouse, BrowserManager } = require('playwright-visible-mouse');
