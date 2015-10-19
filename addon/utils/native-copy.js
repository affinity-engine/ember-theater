export default function nativeCopy(object) {
  return JSON.parse(JSON.stringify(object));
}
