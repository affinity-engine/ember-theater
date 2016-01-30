// import gatherModules from 'ember-theater/utils/gather-modules';
// WE NEED TO FIGURE OUT HOW TO GET REQUIREJS TO PICK UP THE `multiton-services` DIRECTORY
function gatherModules(subRoute) {
  const paths = Object.keys(requirejs.entries);
  const regexp = new RegExp(`ember-theater\/${subRoute}\/(.*)`);

  return paths.filter((path) => {
    return regexp.test(path && !path.includes('.eslint'));
  }).reduce((modules, path) => {
    const moduleName = regexp.exec(path)[1];
    const module = requirejs(`ember-theater\/${subRoute}\/${moduleName}`).default;

    modules.set(moduleName, module);

    return modules;
  }, new Map());
}

export function initialize(application) {
  const multitonServices = gatherModules('multiton-services');

  multitonServices.forEach((multitonService, multitonServiceName) => {
    application.register(`multiton-service:${multitonServiceName}`);
  });
}

export default {
  name: 'register-multiton-initializers',
  initialize: initialize
};
