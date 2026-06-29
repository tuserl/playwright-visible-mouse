// playwright.config.js
module.exports = {
  use: {
    // Leave this out or set to a default, but do NOT force fullscreen/maximized
    // viewport: { width: 1280, height: 720 }, 
    viewport: null,

    // IMPORTANT: Set headless to false so you can actually see and resize the window
    headless: false,
    launchOptions: {
      args: ['--window-size=500,500'] // Starts the window at 500x500, but allows manual resizing
    },
  },
};
