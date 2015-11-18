import Ember from 'ember';
import { Directable } from 'ember-theater';

const {
  get,
  isPresent,
  setProperties,
  typeOf
} = Ember;

export default Directable.extend({
  componentType: 'ember-theater/director/character',
  layer: 'theater.stage.foreground.character',

  parseArgs(expressionOrId, effectOrOptions, optionsOnly) {
    const expressionIsPresent = typeOf(expressionOrId) === 'object';
    const effectIsPresent = isPresent(optionsOnly);

    const id = expressionIsPresent ? get(expressionOrId, 'id') : expressionOrId;
    const character = this.store.peekRecord('ember-theater/character', id);

    const expressionId = get(expressionOrId, 'expression');
    const initialExpression = isPresent(expressionId) ?
      this.store.peekRecord('ember-theater/character-expression', expressionId) :
      get(character, 'defaultExpression');

    const properties = {
      id,
      character,
      initialExpression,
      effect: effectIsPresent ? effectOrOptions : 'transition.fadeIn',
      options: effectIsPresent ? optionsOnly : effectOrOptions
    };

    setProperties(this, properties);
  }
});
