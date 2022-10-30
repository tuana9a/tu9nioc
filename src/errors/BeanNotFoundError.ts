export default class BeanNotFoundError extends Error {
  constructor(name: string) {
    super(`Bean with name "${name}" not found`);
  }
}
