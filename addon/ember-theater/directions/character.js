import Ember from 'ember';
import { Direction } from 'ember-theater';

const {
  get,
  isPresent,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  stageManager: service('ember-theater/stage-manager'),

  perform(resolve, expressionOrId, effectOrOptions, optionsOnly) {
    const expressionIsPresent = typeOf(expressionOrId) === 'object';
    const effectIsPresent = isPresent(optionsOnly);

    const id = expressionIsPresent ? get(expressionOrId, 'id') : expressionOrId;
    const character = this.store.peekRecord('ember-theater/character', id);

    const expressionId = get(expressionOrId, 'expression');
    const initialExpression = isPresent(expressionId) ?
      this.store.peekRecord('ember-theater/character-expression', expressionId) :
      get(character, 'defaultExpression');

    const options = effectIsPresent ? optionsOnly || {} : effectOrOptions || {};

    const properties = {
      id,
      character,
      initialExpression,
      options,
      effect: effectIsPresent ? effectOrOptions : 'transition.fadeIn',
      layer: get(options, 'layer') || 'theater.stage.foreground.character'
    };

    get(this, 'stageManager').handleDirectable(id, 'character', properties, resolve);
  }
});
