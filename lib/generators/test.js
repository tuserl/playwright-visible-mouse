const fs = require("fs");
const path = require("path");

module.exports = function (name) {

  const templatePath = path.join(
    __dirname,
    "../templates/test.spec.js"
  );

  let content = fs.readFileSync(
    templatePath,
    "utf8"
  );

  const functionName =
    name.charAt(0).toLowerCase() + name.slice(1);

  content = content.replace(
    /__FUNCTION_NAME__/g,
    functionName
  );

  fs.writeFileSync(
    `${name}.spec.js`,
    content
  );
};
