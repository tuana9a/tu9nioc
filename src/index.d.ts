type BeanPool = Map<string, Bean<unknown>>;

interface WalkOpts {
  absolute?: boolean;
  fileNameFilter?(fileName: string): boolean;
  dirNameFilter?(dirName: string): boolean;
}

interface BeanConstructOpts {
  klass?: unknown;
  name?: string;
  ignoreDeps?: string[];
  dependOns?: string[];
}

interface IocOpts {
  getter?: boolean;
  setter?: boolean;
}

interface AddBeanOpts {
  auto?: boolean;
  ignoreDeps?: string[];
  dependOns?: string[];
}

export class Bean<T> {
  constructor(opts: BeanConstructOpts);
  klass: unknown;
  name: string;
  dependOns: string[];
  ignoreDeps: string[];
  auto: boolean;
  instance: T;
  createInstance(): T;
  getInstance(): T;
  setInstance(instance: T): void;
  getDependOns(): string[];
  addIgnoreDeps(): void;
  getIgnoreDeps(): string[];
  injectTo(otherBean: Bean<unknown>, injectOnProp?: string): void;
  injectedBy(otherBean: Bean<unknown>, injectOnProp: string): void;
}

export class IocContainer {
  constructor(opts?: IocOpts);
  beanPool: BeanPool;
  getBeanPool(): BeanPool;
  addBeanWithoutClass(instance: unknown, name: string, opts?: AddBeanOpts): void;
  addBean(klass: unknown, name: string, opts?: AddBeanOpts): void;
  getBean(name: string): Bean<unknown>;
  autoScan(dir: string, opts: WalkOpts): void;
  initInstances(): void;
  startInjection(): void;
  di(): void;
}

export const ioc: IocContainer;
