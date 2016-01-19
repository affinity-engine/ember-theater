import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  isPresent,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  layer: 'theater.stage.foreground.character',

  fixtureStore: service('ember-theater/fixture-store'),
  stageManager: service('ember-theater/director/stage-manager'),

  perform(resolve, expressionOrId, effectOrOptions, optionsOnly) {
    const expressionIsPresent = typeOf(expressionOrId) === 'object';
    const effectIsPresent = isPresent(optionsOnly);
    const fixtureStore = get(this, 'fixtureStore');

    const id = expressionIsPresent ? get(expressionOrId, 'id') : expressionOrId;
    const character = fixtureStore.find('characters', id);
    const effect = effectIsPresent ? effectOrOptions : 'transition.fadeIn';

    const expressionId = get(expressionOrId, 'expression');
    const initialExpression = isPresent(expressionId) ?
      fixtureStore.find('characterExpressions', expressionId) :
      fixtureStore.find('characterExpressions', get(character, 'defaultExpressionId'));

    const options = effectIsPresent ? optionsOnly || {} : effectOrOptions || {};
    const layer = get(options, 'layer') || get(this, 'layer');
    const autoResolve = get(this, 'autoResolve');

    const properties = {
      autoResolve,
      character,
      effect,
      id,
      initialExpression,
      layer,
      options
    };

    get(this, 'stageManager').handleDirectable(id, 'character', properties, resolve);
  }
});
