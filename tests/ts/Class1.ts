import { Component } from "../../src/decorators";
import { Class2 } from "./Class2";
import { Class3 } from "./sub/Class3";

@Component
export class Class1 {
  constructor(public class2: Class2, public class3: Class3) { }

  getClass2() {
    return this.class2;
  }
}
