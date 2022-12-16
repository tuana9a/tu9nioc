export class IocError extends Error {
  __isIocError: boolean;
  constructor(message: string) {
    super(message);
    this.__isIocError = true;
  }
}

export class BeanAlreadyExistError extends IocError {
  constructor(name: string) {
    super(`Bean "${name}" is already existed`);
  }
}

export class BeanInstanceIsFalsyError extends IocError {
  constructor(name: string) {
    super(`Instance of Bean "${name}" is falsy`);
  }
}

export class BeanNameMissingError extends IocError {
  constructor(klass: unknown) {
    super(`Bean of class "${klass}" is missing`);
  }
}

export class BeanNotFoundError extends IocError {
  constructor(name: string) {
    super(`Bean with name "${name}" not found`);
  }
}
