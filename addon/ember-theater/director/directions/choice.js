import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  layer: 'theater.prompt.choice',

  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId'),

  perform(resolve, headerOrChoices, choicesOrOptions, optionsOnly) {
    const headerIsPresent = typeOf(headerOrChoices) === 'string';

    const header = headerIsPresent ? headerOrChoices : null;
    const choices = headerIsPresent ? choicesOrOptions : headerOrChoices;
    const options = headerIsPresent ? optionsOnly || {} : choicesOrOptions || {};
    const layer = get(options, 'layer') || get(this, 'layer');
    const autoResolve = get(this, 'autoResolve');
    const autoResolveResult = get(this, 'autoResolveResult');

    const properties = {
      autoResolve,
      autoResolveResult,
      choices,
      header,
      layer,
      options
    };

    get(this, 'stageManager').handleDirectable(null, 'choice', properties, resolve);
  }
});
