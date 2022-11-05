const { IocContainer } = require("../../dist");

describe("test IocContainer", () => {
  test("can handle cycling deps", () => {
    class Test1 {
      test2;
    }

    class Test2 {
      test1;
    }

    const ioc = new IocContainer();
    ioc.addClass(Test1, "test1");
    ioc.addClass(Test2, "test2");
    ioc.di();

    const test1 = ioc.getBean("test1").getInstance();
    const test2 = ioc.getBean("test2").getInstance();

    expect(test1.test2).toBe(test2);
    expect(test2.test1).toBe(test1);
  });

  test("normal usage", () => {
    class Test1 {
      test2;
    }

    class Test2 {
      test3;
    }

    class Test3 { }

    const ioc = new IocContainer();
    ioc.addClass(Test1, "test1");
    ioc.addClass(Test2, "test2");
    ioc.addClass(Test3, "test3");
    ioc.di();

    const test1 = ioc.getBean("test1").getInstance();
    const test2 = ioc.getBean("test2").getInstance();
    const test3 = ioc.getBean("test3").getInstance();

    expect(test1.test2).toBe(test2);
    expect(test2.test3).toBe(test3);
  });

  test("add bean manually", () => {
    class Test1 {
      test2;
    }

    class Test2 {
      test1;
    }

    let test1 = new Test1();

    const ioc = new IocContainer();
    ioc.addBean(test1, "test1");
    ioc.addClass(Test2, "test2");
    ioc.di();

    test1 = ioc.getBean("test1").getInstance();
    const test2 = ioc.getBean("test2").getInstance();

    expect(test1.test2).toBe(test2);
    expect(test2.test1).toBe(test1);
  });

  test("allow to ignore deps", () => {
    class Test1 {
      test2;
      test3;
    }

    class Test2 {
      test1;
    }

    const ioc = new IocContainer();
    ioc.addClass(Test1, "test1", { ignoreDeps: ["test3"] });
    ioc.addClass(Test2, "test2");
    ioc.di();

    const test1 = ioc.getBean("test1").getInstance();
    const test2 = ioc.getBean("test2").getInstance();

    expect(test1.test2).toBe(test2);
    expect(test2.test1).toBe(test1);
    expect(test1.test3).toBeFalsy();
  });

  test("auto scan to import", () => {
    const { ioc } = require("../../dist");
    ioc.autoScan("./tests/unit", {
      absolute: true,
      fileNameFilter: (fileName) => fileName.match(/Test.\.js/),
    });
    expect(() => {
      ioc.di();
    }).not.toThrow();

    const test1 = ioc.getBean("test1").getInstance();
    const test2 = ioc.getBean("test2").getInstance();

    expect(test2.test1).toBe(test1);
    expect(test1.test2).toBe(test2);
    expect(test1.test3).toBeFalsy();
  });

  test("allow to ignore all missing deps", () => {
    class Test1 {
      test2;
      test3;
    }

    class Test2 {
      test1;
    }

    const ioc = new IocContainer();
    ioc.addClass(Test1, "test1", { ignoreDeps: ["test3", "__all"] });
    ioc.addClass(Test2, "test2");

    expect(() => {
      ioc.di();
    }).not.toThrow();

    const test1 = ioc.getBean("test1").getInstance();
    const test2 = ioc.getBean("test2").getInstance();

    expect(test2.test1).toBe(test1);
    expect(test1.test3).toBeFalsy();
    expect(test1.test2).toBeFalsy();
  });

  test("getter", () => {
    class Test1 {
      test2;
    }

    class Test2 {
      test1;
    }

    const ioc = new IocContainer({ getter: true });
    ioc.addClass(Test1, "test1");
    ioc.addClass(Test2, "test2");
    ioc.di();

    const test1 = ioc.getBean("test1").getInstance();
    const test2 = ioc.getBean("test2").getInstance();

    expect(test1.test2).toBe(test2);
    expect(test2.test1).toBe(test1);
    expect(() => {
      expect(test1.getTest2()).toBe(test2);
      expect(test2.getTest1()).toBe(test1);
    }).not.toThrow();
  });

  test("setter", () => {
    class Test1 {
      test2;
    }

    class Test2 {
      test1;
    }

    const test3 = new Test2();
    test3.test1 = "not-a-real-test1";

    const ioc = new IocContainer({ setter: true });
    ioc.addClass(Test1, "test1");
    ioc.addClass(Test2, "test2");
    ioc.di();

    const test1 = ioc.getBean("test1").getInstance();
    const test2 = ioc.getBean("test2").getInstance();

    expect(test1.test2).toBe(test2);
    expect(test2.test1).toBe(test1);
    expect(() => {
      test1.setTest2(test3);
      expect(test1.test2.test1).toBe("not-a-real-test1");
    }).not.toThrow();
  });
});
