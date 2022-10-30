const { Bean } = require("../../dist");

describe("test Bean", () => {
  test("can inject to each other", () => {
    class Test1 {
      test2;
    }

    class Test2 {
      test1;
    }

    const bean1 = new Bean({ klass: Test1, name: "test1" });
    const bean2 = new Bean({ klass: Test2, name: "test2" });

    bean1.setInstance(bean1.createInstance());
    bean2.setInstance(bean2.createInstance());

    bean1.injectTo(bean2, "test1");
    bean1.injectedBy(bean2, "test2");

    const test1 = bean1.getInstance();
    const test2 = bean2.getInstance();

    expect(test1.test2).toBe(test2);
    expect(test2.test1).toBe(test1);
  });
});
