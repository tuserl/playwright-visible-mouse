//Still buggy
const manager = require("./lib/browserManager");
manager.setUrl("http://localhost:3001");

async function runAdminWorkflow() {
  const { browser } = await manager.launch({ mode: 'fullscreen' });
  // ... perform actions ...

  // Wait for user to close the window
  await new Promise((resolve) => browser.on('disconnected', resolve));
}

async function runAMWorkflow() {
  const { browser } = await manager.launch({ mode: 'fullscreen' });
  // ... perform actions ...

  await new Promise((resolve) => browser.on('disconnected', resolve));
}

async function main() {
  await runAdminWorkflow();
  await runAMWorkflow();
  console.log("All tasks finished.");
}

main();
