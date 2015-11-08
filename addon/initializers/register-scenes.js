import gatherModules from 'ember-theater/utils/gather-modules';
import config from 'ember-get-config';

const modulePrefix = config.modulePrefix;
const scenes = gatherModules('ember-theater\/scenes');

export function initialize(container, application) {
  scenes.forEach((scene, sceneName) => {
    application.register(`scene:${sceneName}`, scene);
  });
}

export default {
  name: 'register-scenes',
  initialize: initialize
};
