const manager = require("./lib/browserManager");
manager.setUrl("http://localhost:3001");

async function runAdminWorkflow() {
  const { btn, link, field, page, mouse, pause, name } = await manager.launch({ mode: 'fullscreen', showCursor: false, name: "Admin" });


  await mouse.hide();

  //how to close this windwos will open next flow
  await pause();

}

async function runAMWorkflow() {
  const { btn, link, field, page, mouse, pause, name } = await manager.launch({ mode: 'fullscreen', showCursor: false, name: "Academic Manager" });


  await mouse.hide();

  await pause();

  await mouse.moveToPosition(45, 0);
}


async function runCPWorkflow() {
  const { btn, link, field, page, mouse, pause, name } = await manager.launch({ mode: 'fullscreen', showCursor: false, name: "Course Provider" });


  await mouse.hide();

  await pause();

  await mouse.moveToPosition(45, 0);
}


async function runLearnerWorkflow() {
  const { btn, link, field, page, mouse, pause, name } = await manager.launch({ mode: 'fullscreen', showCursor: false, name: "Learner" });


  await mouse.hide();

  await pause();

  await mouse.moveToPosition(45, 0);
}


runAdminWorkflow();
runAMWorkflow();
runCPWorkflow();
runLearnerWorkflow();
