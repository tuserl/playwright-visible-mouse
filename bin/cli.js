#!/usr/bin/env node

const cmd = process.argv[2];

switch (cmd) {
  case "init":
    require("../lib/cli/init");
    break;

  case "validate":
    require("../lib/cli/validate");
    break;

  case "doctor":
    require("../lib/cli/doctor");
    break;

  case "set-image":
    require("../lib/cli/setImage");
    break;

  default:
    console.log(`
playwright-visible-mouse CLI

Commands:
  init         Create config
  validate     Validate config
  doctor       Check environment
  set-image    Update sprite image
    `);
}
