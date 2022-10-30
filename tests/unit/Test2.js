const { ioc } = require("../../dist");

class Test2 {
  test1;
}

ioc.addBean(Test2, "test2");

module.exports = Test2;
