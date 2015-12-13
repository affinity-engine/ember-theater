import gatherModules from 'ember-theater/utils/ember-theater/director/gather-modules';
import injectSceneProxy from 'ember-theater/utils/ember-theater/director/inject-scene-proxy';

export function initialize(application) {
  const directions = gatherModules('ember-theater\/director\/directions');

  directions.forEach((direction, directionName) => {
    application.register(`direction:${directionName}`, direction, { singleton: false });
    injectSceneProxy(application, 'direction', directionName);
  });
}

export default {
  name: 'ember-theater/director/register-directions',
  initialize: initialize
};
