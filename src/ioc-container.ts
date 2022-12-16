import path from "path";
import Bean from "./bean";
import { BeanNotFoundError, BeanAlreadyExistError, BeanInstanceIsFalsyError } from "./errors";
import { IocOpts, BeanPool, AddBeanOpts, WalkOpts, Instance, Klass } from "./types";
import { walk } from "./utils";

export default class IocContainer {
  beanPool: BeanPool;
  opts?: IocOpts;
  errorBeans: Bean[];

  constructor(opts?: IocOpts) {
    this.opts = opts;
    this.beanPool = new Map<string, Bean>();
  }

  getBeanPool() {
    return this.beanPool;
  }

  /**
   * manually add existing instance to bean pool
   */
  addBean(instance: Instance, name: string, opts?: AddBeanOpts) {
    const beanPool = this.getBeanPool();

    if (beanPool.has(name)) {
      throw new BeanAlreadyExistError(name);
    }

    const bean = new Bean({
      name,
      ignoreDeps: opts?.ignoreDeps,
      dependOns: opts?.dependOns,
    });
    bean.setInstance(instance);
    beanPool.set(name, bean);
  }

  addClass(klass: Klass, name?: string, opts?: AddBeanOpts) {
    const beanPool = this.getBeanPool();
    name = name || klass.name;
    if (beanPool.has(name)) {
      throw new BeanAlreadyExistError(name);
    }

    const bean = new Bean({
      klass,
      name,
      ignoreDeps: opts?.ignoreDeps,
      dependOns: opts?.dependOns,
    });
    beanPool.set(name, bean);
  }

  getBean(name: string): Bean {
    const beanPool = this.getBeanPool();
    return beanPool.get(name);
  }

  autoScan(dir: string, opts?: WalkOpts) {
    const absoluteDir = path.resolve(dir);
    console.log(`[INFO] ioc.autoScan "${absoluteDir}"`);
    const files = walk(absoluteDir, opts);
    for (const filepath of files) {
      require(filepath);
    }
  }

  initInstances() {
    const beanNames = this.getBeanPool().keys();

    for (const beanName of beanNames) {
      const bean = this.getBean(beanName);
      const instance = bean.createInstance();

      // if bean was added without class
      // then klass can be null and we should ignore it
      if (!instance) continue;

      bean.setInstance(instance);
    }
  }

  startInjection() {
    const beanNames = this.getBeanPool().keys();

    for (const beanName of beanNames) {
      const bean = this.getBean(beanName);
      const beanInstance = bean.getInstance();

      if (!beanInstance) {
        throw new BeanInstanceIsFalsyError(beanName);
      }

      const dependOns: string[] = bean.getDependOns();

      for (const dependName of dependOns) {
        // take bean from bean pool to inject to current object
        const beanToInject = this.getBean(dependName);

        if (!beanToInject) {
          throw new BeanNotFoundError(dependName);
        }

        // current bean inject by other bean
        bean.injectedBy(beanToInject, dependName);
        if (this.opts?.getter) {
          bean.injectGetter(dependName);
        }
        if (this.opts?.setter) {
          bean.injectSetter(dependName);
        }
      }
    }
  }

  di() {
    this.initInstances();
    this.startInjection();
  }
}
