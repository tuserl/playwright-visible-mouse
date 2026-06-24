const { loadMouseConfig } = require("../mouseConfig");

function run() {
  try {
    const config = loadMouseConfig();

    console.log("✅ Config is valid\n");
    console.log(JSON.stringify(config, null, 2));
  } catch (err) {
    console.error("❌ Config validation failed\n");
    console.error(err.message);
    process.exit(1);
  }
}

run();
