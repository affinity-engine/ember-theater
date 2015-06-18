import { pluralize } from 'ember-inflector';

export function initialize(container) {
  const modulePrefix = container.lookupFactory('config:environment').modulePrefix;
  ['ember-theater-backdrop', 'ember-theater-character-portrait'].forEach((modelName) => {
    const modelClass = window.require(`${modulePrefix}/models/${modelName}`).default;
    const models = window.require(`${modulePrefix}/fixtures/${pluralize(modelName)}`).default;
    modelClass.reopenClass({
      FIXTURES: models
    });
  });
}

export default {
  name: 'theater-fixtures',
  initialize: initialize
};
