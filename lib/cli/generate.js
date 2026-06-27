module.exports = function ({ schematic, name }) {

  switch (schematic) {

    case "test":
      require("../generators/test")(name);
      break;


    case "page":
      require("../generators/page")(name);
      break;


    default:
      console.error(
        `Unknown generator: ${schematic}`
      );
  }

};
