const manager = require("../lib/browserManager");

const color = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m"
};

function logResult(testCase, result) {
  const statusColor =
    result === "PASS"
      ? color.green
      : result === "FAIL"
        ? color.red
        : color.yellow;

  console.log(
    `${statusColor}${result === "PASS" ? "✅" : "❌"} TC-${testCase}: ${result}${color.reset}`
  );
}

function logExpectation(testCase, expected, actual) {
  const matched = expected === actual;

  console.log(
    `${matched ? color.green : color.red}` +
    `${matched ? "✔" : "✖"} TC-${testCase} ` +
    `(Expected: ${expected}, Actual: ${actual})` +
    `${color.reset}`
  );
}

async function runWorkflows() {
  const results = [];

  const flows = [
    {
      name: "Admin",
      index: 0,
      expected: "PASS",
      login: {
        email: "admin@system.com",
        pass: "Admin@123",
        doLogin: true
      }
    },
    {
      name: "Admin",
      index: 1,
      expected: "FAIL",
      login: {
        email: "admin@system.com",
        pass: "Admin@1234",
        doLogin: true
      }
    }
  ];

  const tasks = flows.map(async (f) => {
    const { page, btn, field, mouse } = await manager.launch({
      mode: "split2",
      tileIndex: f.index,
      name: f.name,
      slowMo: 10
    });

    let result = "FAIL";

    try {
      console.log(
        `${color.cyan}🔑 TC-${f.index}: Attempting login...${color.reset}`
      );

      // ================= ACTION =================
      await btn("Sign In").click();
      await field("you@example.com").type(f.login.email);
      await field("Enter your password").type(f.login.pass);
      await btn("Sign In").click();

      const loginSuccess = await btn("Users").exists(3000);

      result = loginSuccess ? "PASS" : "FAIL";

      logResult(f.index, result);
      logExpectation(f.index, f.expected, result);

      results.push({
        testCase: f.index,
        expected: f.expected,
        actual: result
      });

      await mouse.moveToPosition(40, 0);
      await mouse.setLockState(false, false);

      // ================= ACTION =================
    } catch (err) {
      result = "FAIL";

      logResult(f.index, result);

      console.error(
        `${color.red}❌ TC-${f.index} Error: ${err.message}${color.reset}`
      );

      results.push({
        testCase: f.index,
        expected: f.expected,
        actual: result
      });
    }
  });

  await Promise.all(tasks);

  // ================= SUMMARY =================

  let passed = 0;
  let failed = 0;

  console.log("\n");
  console.log(
    `${color.cyan}═══════════════════════════════════════${color.reset}`
  );
  console.log(
    `${color.cyan}             TEST SUMMARY${color.reset}`
  );
  console.log(
    `${color.cyan}═══════════════════════════════════════${color.reset}`
  );

  results
    .sort((a, b) => a.testCase - b.testCase)
    .forEach((r) => {
      const matched = r.expected === r.actual;

      if (matched) {
        passed++;
        console.log(
          `${color.green}✔ TC-${r.testCase} (Expected: ${r.expected}, Actual: ${r.actual})${color.reset}`
        );
      } else {
        failed++;
        console.log(
          `${color.red}✖ TC-${r.testCase} (Expected: ${r.expected}, Actual: ${r.actual})${color.reset}`
        );
      }
    });

  console.log(
    `${color.cyan}───────────────────────────────────────${color.reset}`
  );
  console.log(
    `${color.green}Passed : ${passed}${color.reset}`
  );
  console.log(
    `${color.red}Failed : ${failed}${color.reset}`
  );
  console.log(
    `${color.yellow}Total  : ${results.length}${color.reset}`
  );
  console.log(
    `${color.cyan}═══════════════════════════════════════${color.reset}`
  );

  console.log("🚀 All workflows processed.");
}

runWorkflows();
