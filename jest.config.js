module.exports = {
  testEnvironment: "node",

  collectCoverage: true,

  collectCoverageFrom: [
    "index.js",
    "lib/**/*.js",
    "!**/node_modules/**",
    "!**/test/**"
  ],

  coverageDirectory: "coverage",

  testMatch: [
    "**/*.test.js"
  ]
};
