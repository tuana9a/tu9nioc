import { ioc } from ".";
import { Klass } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Component(klass?: Klass | string): any {
  if ((klass as Klass).name) {
    ioc.addClass(klass as Klass);
    return klass;
  }
  return function (klass1: Klass) {
    ioc.addClass(klass1, klass as string);
    return klass1;
  };
}