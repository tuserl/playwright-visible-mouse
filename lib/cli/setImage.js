#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const configPath = path.join(
  process.cwd(),
  "playwright-visible-mouse.json"
);

function resolveFile(input) {
  if (!input) return null;

  const normalized = input.replace(/\\/g, "/");
  return path.isAbsolute(normalized)
    ? normalized
    : path.resolve(process.cwd(), normalized);
}

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    console.log("❌ config not found. Run: init");
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function setImage(type, filePath) {
  const resolved = resolveFile(filePath);

  if (!fs.existsSync(resolved)) {
    console.log("❌ file not found:", resolved);
    process.exit(1);
  }

  const config = loadConfig();

  const relative = path.relative(process.cwd(), resolved);

  if (type === "idle") {
    config.idleImage = relative;
  } else if (type === "click") {
    config.clickImage = relative;
  } else {
    console.log("❌ invalid type. use: idle | click");
    process.exit(1);
  }

  saveConfig(config);

  console.log(`✅ Updated ${type} image → ${relative}`);
}

function init() {
  if (fs.existsSync(configPath)) {
    console.log("Config already exists");
    return;
  }

  const template = {
    isArrow: false,
    idleImage: "",
    clickImage: ""
  };

  saveConfig(template);

  console.log("✅ Created playwright-visible-mouse.json");
}

function usage() {
  console.log(`
Usage:
  npx playwright-visible-mouse init
  npx playwright-visible-mouse set-image idle <path>
  npx playwright-visible-mouse set-image click <path>
`);
}

// ---------------- CLI ROUTER ----------------

const args = process.argv.slice(2);

const command = args[0];

if (command === "init") {
  init();
  process.exit(0);
}

if (command === "set-image") {
  const type = args[1];
  const filePath = args.slice(2).join(" ");

  if (!type || !filePath) {
    usage();
    process.exit(1);
  }

  setImage(type, filePath);
  process.exit(0);
}

usage();
