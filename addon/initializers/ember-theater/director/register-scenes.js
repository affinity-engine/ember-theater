import gatherModules from 'ember-theater/utils/ember-theater/director/gather-modules';

export function initialize(application) {
  const scenes = gatherModules('ember-theater\/director\/scenes');

  scenes.forEach((scene, sceneName) => {
    application.register(`scene:${sceneName}`, scene, { singleton: false });
  });
}

export default {
  name: 'ember-theater/director/register-scenes',
  initialize: initialize
};
