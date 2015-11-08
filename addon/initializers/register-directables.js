import Ember from 'ember';
import gatherModules from 'ember-theater/utils/gather-modules';

const { get } = Ember;
const { String: { camelize } } = Ember;

export function initialize(container, application) {
  const directables = gatherModules('ember-theater\/directables');

  directables.forEach((directable, directableName) => {
    application.register(`directable:${directableName}`, directable, { singleton: false });
    registerDirectableProxy(application, directableName);
  });
}

function registerDirectableProxy(application, directableName) {
  const directableProxy = function directableProxy(line) {
    // the scene is the context here 
    const factory = get(this, 'container').lookupFactory(`directable:${directableName}`);

    return this.proxyDirectable(directableName, factory, line);
  };

  application.register(`directable:${directableName}-proxy`, directableProxy, { instantiate: false });
  application.inject('scene', camelize(directableName), `directable:${directableName}-proxy`);
};

export default {
  name: 'register-directables',
  initialize: initialize
};
