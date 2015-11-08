import Ember from 'ember';
import gatherModuleNames from 'ember-theater/utils/gather-module-names';
import config from 'ember-get-config';

const { String: { camelize } } = Ember;
const modulePrefix = config.modulePrefix;

const directionNames = gatherModuleNames('ember-theater\/directions');

export function initialize(container, application) {
  directionNames.forEach((directionName) => {
    const direction = requirejs(`${modulePrefix}\/ember-theater\/directions\/${directionName}`).default;

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
