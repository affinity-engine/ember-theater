import gatherModuleNames from 'ember-theater/utils/gather-module-names';
import config from 'ember-get-config';

const modulePrefix = config.modulePrefix;
const sceneNames = gatherModuleNames('ember-theater\/scenes');

export function initialize(container, application) {
  sceneNames.forEach((sceneName) => {
    const scene = requirejs(`${modulePrefix}\/ember-theater\/scenes\/${sceneName}`).default;

    application.register(`scene:${sceneName}`, scene);
  });
}

export default {
  name: 'register-scenes',
  initialize: initialize
};
