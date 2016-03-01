import Ember from 'ember';
import gatherModules from 'ember-theater/utils/gather-modules';

const {
  get,
  getOwner
} = Ember;

const { String: { capitalize } } = Ember;

const injectDirectionProxy = function injectDirectionProxy(application, name) {
  const proxy = function proxy(...args) {
    // the scene is the context here
    const factory = getOwner(this).lookup(`direction:${name}`);

    return get(this, 'director').direct(this, factory, args);
  };

  const constantizedName = name.split('-').map((section) => capitalize(section)).join('');

  application.register(`direction:${name}-proxy`, proxy, { instantiate: false, singleton: false });
  application.inject('scene', constantizedName, `direction:${name}-proxy`);
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
