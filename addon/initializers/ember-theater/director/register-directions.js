import Ember from 'ember';
import gatherModules from 'ember-theater/utils/gather-modules';

const {
  get,
  getOwner
} = Ember;

const { String: { camelize } } = Ember;

const injectDirectionProxy = function injectDirectionProxy(application, name) {
  const proxy = function proxy(...args) {
    // the scene is the context here
    const factory = getOwner(this).lookup(`direction:${name}`);

    return get(this, 'director').direct(this, factory, args);
  };

  application.register(`direction:${name}-proxy`, proxy, { instantiate: false });
  application.inject('scene', camelize(name), `direction:${name}-proxy`);
};

export function initialize(application) {
  const directions = gatherModules('ember-theater\/director\/directions');

  directions.forEach((direction, directionName) => {
    direction.type = directionName;
    application.register(`direction:${directionName}`, direction, { instantiate: false, singleton: false });
    injectDirectionProxy(application, directionName);
  });
}

export default {
  name: 'ember-theater/director/register-directions',
  initialize: initialize
};
