module.exports = {

  // "launch" -> framework owns the browser (old behavior, tiled windows etc.)
  // "attach" -> uses Playwright Test's own page/context (full trace viewer DOM support)
  mode: "attach",

  url: null,

  reuseBrowser: false,
  trace: "off", // // "on" | "off" | "retain-on-failure" | true | false

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
