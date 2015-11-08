import config from 'ember-get-config';

export default function gatherModuleNames(subRoute) {
  const modulePrefix = config.modulePrefix;
  const paths = Object.keys(requirejs.entries);
  const regexp = new RegExp(`${modulePrefix}\/${subRoute}\/(.*)`);

  return paths.filter((path) => {
    return regexp.test(path);
  }).map((path) => {
    return regexp.exec(path)[1];
  });
}
