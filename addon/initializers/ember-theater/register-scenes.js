import gatherModules from 'ember-theater/utils/gather-modules';

export function initialize(container, application) {
  const scenes = gatherModules('ember-theater\/scenes');

  scenes.forEach((scene, sceneName) => {
    application.register(`scene:${sceneName}`, scene, { singleton: false });
  });
}

export default {
  name: 'register-scenes',
  initialize: initialize
};
