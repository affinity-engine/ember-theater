import config from 'ember-get-config';

export default function gatherModules(subRoute) {
  const modulePrefix = config.modulePrefix;
  const paths = Object.keys(requirejs.entries);
  const regexp = new RegExp(`${modulePrefix}\/${subRoute}\/(.*)`);

  return paths.filter((path) => {
    return regexp.test(path);
  }).reduce((modules, path) => {
    const moduleName = regexp.exec(path)[1];
    const module = requirejs(`${modulePrefix}\/${subRoute}\/${moduleName}`).default;

    modules.set(moduleName, module);

    return modules; 
  }, new Map());
}
