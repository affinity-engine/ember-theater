import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  merge,
  set
} = Ember;

const { run: { later } } = Ember;

export default Direction.extend({
  setup(fixture, character) {
    this._addToQueue();

    set(this, 'attrs.expression', fixture);
    set(this, 'attrs.character', character);

    return this;
  },

  transition() {
    this.transitionIn(...arguments);

    return this;
  },

  transitionIn(effect, duration, options = {}) {
    set(this, 'attrs.transitionIn', merge({ duration, effect }, options));

    return this;
  },

  transitionOut(effect, duration, options = {}) {
    set(this, 'attrs.transitionOut', merge({ duration, effect }, options));

    return this;
  },

  delay(delay) {
    set(this, 'attrs.delay', delay);

    return this;
  },

  Text(text) {
    const direction = this._createDirection('text');
    const character = get(this, 'attrs.character');

    return direction.setup(text, character);
  },

  _perform(meta, resolve) {
    const stageManager = get(this, 'stageManager');
    const instanceId = get(this, 'attrs.instance') || 0;
    const characterId = get(this, 'attrs.character.fixture.id');
    const directable = stageManager.findDirectableWithId(characterId, 'ember-theater/director/directable/character', instanceId);
    const character = get(directable, 'component');
    const expression = get(this, 'attrs.expression');
    const attrs = get(this, 'attrs');
    const delay = get(attrs, 'delay');

    later(() => {
      character.changeExpression(resolve, expression, attrs);
    }, delay);
  }
});
