import gatherModules from 'ember-theater/utils/gather-modules';
import injectSceneProxy from 'ember-theater/utils/inject-scene-proxy';

export function initialize(container, application) {
  const directables = gatherModules('ember-theater\/directables');

  directables.forEach((directable, directableName) => {
    application.register(`directable:${directableName}`, directable, { singleton: false });
    injectSceneProxy(application, 'directable', directableName);
  });

  application.inject('directable', 'store', 'service:store');
}

export default {
  name: 'register-directables',
  initialize: initialize
};
