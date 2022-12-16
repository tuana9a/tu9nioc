import Bean from "./bean";

export type BeanPool = Map<string, Bean>;

export interface AddBeanOpts {
  auto?: boolean;
  ignoreDeps?: string[];
  dependOns?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Instance = any;

export type Klass = {
  new(...args: unknown[]): Instance;
  name: string;
}

export interface BeanConstructOpts {
  klass?: Klass;
  name?: string;
  ignoreDeps?: string[];
  dependOns?: string[];
}

export interface IocOpts {
  getter?: boolean;
  setter?: boolean;
  autoLowerCaseBeanName?: boolean;
  autoSnakeCaseBeanName?: boolean;
}

export interface WalkOpts {
  absolute?: boolean;
  fileNameFilter?(fileName: string): boolean;
  dirNameFilter?(dirName: string): boolean;
}

