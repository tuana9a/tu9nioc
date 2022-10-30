export default class BeanAlreadyExistError extends Error {
  constructor(name: string) {
    super(`Bean "${name}" is already existed`);
  }
}