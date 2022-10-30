export default function createGetterName(propName: string) {
  return "get" + propName.charAt(0).toUpperCase() + propName.slice(1);
}