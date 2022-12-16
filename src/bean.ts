import { BeanConstructOpts, Instance, Klass } from "./types";
import { createSetterName, createGetterName } from "./utils";

export default class Bean {
  klass: Klass;
  name: string;
  dependOns: string[]; // TODO: in the future
  ignoreDeps: string[];
  instance: Instance;

  constructor(opts?: BeanConstructOpts) {
    this.klass = opts?.klass;
    this.name = opts?.name || opts?.klass?.name;
    this.dependOns = opts?.dependOns || [];
    this.ignoreDeps = opts?.ignoreDeps || [];
  }

  createInstance() {
    return this.klass ? new this.klass() : null;
  }

  getInstance() {
    return this.instance;
  }

  setInstance(instance: Instance) {
    this.instance = instance;
  }

  getDependOns(): string[] {
    if (this.ignoreDeps.includes("__all")) {
      return [];
    }
    return Object.keys(this.getInstance())/* TODO: return this.dependOns; */
      .filter((x) => !this.ignoreDeps.includes(x));
  }

  addIgnoreDeps(depNames: string[] = []) {
    this.ignoreDeps.push(...depNames);
  }

  getIgnoreDeps() {
    return this.ignoreDeps;
  }

  injectTo(otherBean: Bean, injectOnProp?: string) {
    injectOnProp = injectOnProp || this.name;
    const otherInstance = otherBean.getInstance();
    const thisInstance = this.getInstance();

    otherInstance[injectOnProp] = thisInstance;
  }

  injectedBy(otherBean: Bean, injectOnProp: string) {
    const otherInstance = otherBean.getInstance();
    const thisInstance = this.getInstance();
    thisInstance[injectOnProp] = otherInstance;
  }

  injectSetter(propName: string) {
    const thisInstance = this.getInstance();
    const methodName = createSetterName(propName);
    thisInstance[methodName] = function (value: unknown) {
      this[propName] = value;
    };
  }

  injectGetter(propName: string) {
    const thisInstance = this.getInstance();
    const methodName = createGetterName(propName);
    thisInstance[methodName] = function () {
      const value = this[propName];
      return value;
    };
  }
}
