import Ember from 'ember';
import gatherModules from 'ember-theater/utils/gather-modules';

const { String: { camelize } } = Ember;

const directions = gatherModules('ember-theater\/directions');

export function initialize(container, application) {
  directions.forEach((direction, directionName) => {
    application.register(`direction:${directionName}`, direction, { singleton: false });
    registerDirectionHandler(application, directionName);
  });
}

// creates a function on all scenes that will trigger the direction
const registerDirectionHandler = function registerDirectionHandler(application, directionName) {
  const methodName = camelize(directionName);

  const directionHandler = function directionHandler(...args) {
    // the scene is the context here 
    return this.handleDirection(directionName, args);
  };

  application.register(`direction:${directionName}-handler`, directionHandler, { instantiate: false });
  application.inject('scene', methodName, `direction:${directionName}-handler`);
};

export default {
  name: 'register-directions',
  initialize: initialize
};
