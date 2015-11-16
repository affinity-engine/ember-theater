import Ember from 'ember';
import { Direction } from 'ember-theater';

const { get } = Ember;
const { inject: { service } } = Ember;

export default Direction.extend({
  stageManager: service('ember-theater/stage-manager'),
  /**
    Provide a description of what your direction does.

    @method perform
    @for Scene
    @param {*} exampleParam
  */

  perform(resolve, characterId, expressionId, ...args) {
    const stageManager = get(this, 'stageManager');
    const directable = stageManager.findDirectableWithId(characterId, 'character');
    const character = get(directable, 'component');
    const expression = this.store.peekRecord('ember-theater/character-expression', expressionId);

    character.changeExpression(resolve, expression, ...args);
  }
});
