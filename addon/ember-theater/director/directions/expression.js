import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  set
} = Ember;

export default Direction.extend({
  setup(fixture, character) {
    this._addToQueue();

    set(this, 'attrs.expression', fixture);
    set(this, 'attrs.character', character);

    return this;
  },

  Text(text) {
    const direction = this._createDirection('text');
    const attrs = get(this, 'attrs');

    return direction.setup(text, attrs);
  },

  _perform(meta, resolve) {
    const stageManager = get(this, 'stageManager');
    const instanceId = get(this, 'attrs.instance') || 0;
    const characterId = get(this, 'attrs.character.fixture.id');
    const directable = stageManager.findDirectableWithId(characterId, 'ember-theater/director/directable/character', instanceId);
    const character = get(directable, 'component');
    const expression = get(this, 'attrs.expression');
    const attrs = get(this, 'attrs');

    character.changeExpression(resolve, expression, attrs);
  }
});
