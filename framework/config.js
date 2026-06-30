module.exports = {

  // "launch" -> framework owns the browser (old behavior, tiled windows etc.)
  // "attach" -> uses Playwright Test's own page/context (full trace viewer DOM support)
  mode: "launch",

  url: null,

  reuseBrowser: false,

  launch: {
    mode: "maximized",
    headless: false,
    slowMo: 0,
    showCursor: true
  },

  interactionMode: "HUMAN",

  notify: true,

  notifyDelay: 3500

};
