import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  stageManager: service('ember-theater/director/stage-manager'),

  perform(resolve, headerOrChoices, choicesOrOptions, optionsOnly) {
    const headerIsPresent = typeOf(headerOrChoices) === 'string';
    const options = headerIsPresent ? optionsOnly || {} : choicesOrOptions || {};

    const properties = {
      autoResolve: get(this, 'autoResolve'),
      autoResolveResult: get(this, 'autoResolveResult'),
      options,
      header: headerIsPresent ? headerOrChoices : null,
      choices: headerIsPresent ? choicesOrOptions : headerOrChoices,
      layer: get(options, 'layer') || 'theater.prompt.choice'
    };

    get(this, 'stageManager').handleDirectable(null, 'choice', properties, resolve);
  }
});
