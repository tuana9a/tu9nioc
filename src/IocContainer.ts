import Bean from "./Bean";
import BeanInstanceIsFalsyError from "./errors/BeanInstanceIsFalsyError";
import BeanAlreadyExistError from "./errors/BeanAlreadyExistError";
import BeanNotFoundError from "./errors/BeanNotFoundError";
import AddBeanOpts from "./types/AddBeanOpts";
import BeanPool from "./types/BeanPool";
import IocOpts from "./types/IocOpts";
import WalkOpts from "./types/WalkOpts";
import walk from "./utils/walk";

export default class IocContainer {
  beanPool: BeanPool;
  opts?: IocOpts;
  errorBeans: Bean<any>[];

  constructor(opts?: IocOpts) {
    this.opts = opts;
    this.beanPool = new Map<string, any>();
  }

  getBeanPool() {
    return this.beanPool;
  }

  /**
   * manually add existing instance to bean pool
   */
  addBean(instance: any, name: string, opts?: AddBeanOpts) {
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

  addClass(klass: any, name?: string, opts?: AddBeanOpts) {
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

  getBean<T>(name: string): Bean<T> {
    const beanPool = this.getBeanPool();
    return beanPool.get(name);
  }

  autoScan(dir: string, opts?: WalkOpts) {
    const files = walk(dir, opts);
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
