import Bean from "./bean";
import { Component } from "./decorators";
import IocContainer from "./ioc-container";

export { IocContainer, Bean, Component };
export const ioc = new IocContainer();
