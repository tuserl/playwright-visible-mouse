module.exports = {
  testEnvironment: "node",

  collectCoverage: true,

  collectCoverageFrom: [
    "index.js",
    "lib/**/*.js",
    "!**/node_modules/**",
    "!**/test/**",
    "!lib/templates/**",      // Ignore template files
    // or "!lib/templates/page.js"
  ],

  coverageDirectory: "coverage",

  testMatch: [
    "**/*.test.js"
  ]
};
