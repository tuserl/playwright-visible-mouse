#!/usr/bin/env node

const args = process.argv.slice(2);
const cmd = args[0];

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

  case "g":
  case "generate": {
    const schematic = args[1];
    const name = args[2];

    if (!schematic || !name) {
      console.log(
        "Usage: playwright-visible-mouse g <schematic> <name>"
      );
      process.exit(1);
    }

    require("../lib/cli/generate")({
      schematic,
      name,
      options: args.slice(3),
    });

    break;
  }

  default:
    console.log(`
playwright-visible-mouse CLI

Commands:

  init
  validate
  doctor
  set-image

  g <type> <name>

Examples:

  npx playwright-visible-mouse g test LoginTest
`);
}
