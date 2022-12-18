import { Component } from "../../../src/decorators";
import { Class2 } from "../Class2";

@Component
export class Class3 {
  constructor(public class2: Class2) { }

  getClass2() {
    return this.class2;
  }
}
