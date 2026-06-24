const fs = require("fs");
const path = require("path");
const { loadMouseConfig } = require("../mouseConfig");

function checkPlaywright() {
  try {
    require("playwright");
    return true;
  } catch {
    return false;
  }
}

function run() {
  console.log("🩺 Running playwright-visible-mouse doctor...\n");

  // 1. Playwright check
  const pw = checkPlaywright();
  console.log("Playwright:", pw ? "✅ installed" : "❌ missing");

  // 2. Config check
  let config = {};
  try {
    config = loadMouseConfig();
    console.log("Config:", "✅ valid");
  } catch (err) {
    console.log("Config:", "❌ invalid");
    console.log(err.message);
  }

  // 3. Image file check
  const checkFile = (file) => {
    if (!file) return "⚪ skipped";

    if (file.startsWith("data:") || file.startsWith("http")) {
      return "🌐 remote/base64 OK";
    }

    const exists = fs.existsSync(path.resolve(process.cwd(), file));
    return exists ? "✅ exists" : "❌ missing file";
  };

  console.log("Idle image:", checkFile(config.idleImage));
  console.log("Click image:", checkFile(config.clickImage));

  console.log("\n🧪 Doctor check complete.");
}

run();
