export default function gatherTypes(appInstance, type) {
  return Object.keys(appInstance.__container__.registry.knownForType(type)).map((direction) => {
    return direction.split(':')[1];
  });
}
