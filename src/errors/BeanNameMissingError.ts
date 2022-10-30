export default class BeanNameMissingError extends Error {
  constructor(klass: unknown) {
    super(`Bean of class "${klass}" is missing`);
  }
}
  