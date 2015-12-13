export default function layerName(name) {
  return `et-layer-${name.replace(/\./g, '-')}`;
}
