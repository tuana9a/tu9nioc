const { ioc } = require("../../../dist");

class Test3 {
  test2;
}

ioc.addClass(Test3, "test3");

module.exports = Test3;
