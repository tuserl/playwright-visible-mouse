const fs = require("fs");
const path = require("path");


module.exports = function (name) {

  const templatePath = path.join(
    __dirname,
    "../templates/page.js"
  );


  let content = fs.readFileSync(
    templatePath,
    "utf8"
  );


  content = content.replace(
    /\{\{\s*CLASS_NAME\s*\}\}/g,
    name
  );


  fs.writeFileSync(
    `${name}.js`,
    content
  );


  console.log(`Created ${name}.js`);
};
