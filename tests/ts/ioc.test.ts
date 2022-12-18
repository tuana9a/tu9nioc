import { describe, expect, test } from "@jest/globals";
import { ioc } from "../../src";
import { Class1 } from "./Class1";
import { Class2 } from "./Class2";
import { Class3 } from "./sub/Class3";

describe("ioc container test", () => {
  test("Component annotation work", () => {
    ioc.scan("./tests/unit", {
      absolute: true,
      fileNameFilter: (fileName) => fileName.match(/Test.\.js/),
    });
    expect(() => {
      ioc.di();
    }).not.toThrow();

    const c1: Class1 = ioc.getBean(Class1).getInstance();
    const c2: Class2 = ioc.getBean(Class2).getInstance();
    const c3: Class3 = ioc.getBean(Class3).getInstance();

    expect(c1.class2).toBe(c2);
    expect(c1.class3).toBe(c3);
    expect(c2.class1).toBe(c1);
    expect(c3.class2).toBe(c2);
    expect(c2.missing).toBeUndefined();
  });
});