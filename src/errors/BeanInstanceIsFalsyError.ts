export default class BeanInstanceIsFalsyError extends Error {
  constructor(name: string) {
    super(`Instance of Bean "${name}" is falsy`);
  }
}
