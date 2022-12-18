import { Component } from "../../src/decorators";
import { Class1 } from "./Class1";
import { Missing } from "./Missing";

@Component("class2", { ignoreDeps: ["missing"] })
export class Class2 {
  constructor(public class1: Class1, public missing: Missing) { }
}
