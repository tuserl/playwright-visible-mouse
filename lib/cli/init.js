const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

async function init() {
  const filePath = path.join(
    process.cwd(),
    "playwright-visible-mouse.json"
  );

  if (fs.existsSync(filePath)) {
    console.log("⚠️ Config already exists");
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: "confirm",
      name: "isArrow",
      message: "Arrow mode?",
      default: false
    },
    {
      type: "input",
      name: "idleImage",
      message: "Idle image path (leave empty to skip):",
      default: ""
    },
    {
      type: "input",
      name: "clickImage",
      message: "Click image path (leave empty to skip):",
      default: ""
    }
  ]);

  const config = {
    isArrow: answers.isArrow,
    idleImage: answers.idleImage || "",
    clickImage: answers.clickImage || ""
  };

  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

  console.log("\n✅ Created playwright-visible-mouse.json");
  console.log(config);
}

init();
