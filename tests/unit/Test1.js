const { ioc } = require("../../dist");

class Test1 {
  test2;
  test3;
}

ioc.addBean(Test1, "test1", { ignoreDeps: ["test3"] });

module.exports = Test1;
