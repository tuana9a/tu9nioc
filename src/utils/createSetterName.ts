export default function createSetterName(propName: string) {
  return "set" + propName.charAt(0).toUpperCase() + propName.slice(1);
}
