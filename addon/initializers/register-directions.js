import gatherModules from 'ember-theater/utils/gather-modules';
import injectSceneProxy from 'ember-theater/utils/inject-scene-proxy';

export function initialize(container, application) {
  const directions = gatherModules('ember-theater\/directions');

  directions.forEach((direction, directionName) => {
    application.register(`direction:${directionName}`, direction, { singleton: false });
    injectSceneProxy(application, 'direction', directionName);
  });
}

export default {
  name: 'register-directions',
  initialize: initialize
};
