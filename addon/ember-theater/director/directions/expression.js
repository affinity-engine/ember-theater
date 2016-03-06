import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  getProperties,
  merge,
  set
} = Ember;

const { run: { later } } = Ember;

export default Direction.extend({
  setup(fixture, character) {
    this._entryPoint();

    set(this, 'attrs.expression', fixture);
    set(this, 'attrs.character', character);

    return this;
  },

  _reset() {
    const attrs = get(this, 'attrs');

    return this._super(getProperties(attrs, 'expression', 'character'));
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

  Text(text) {
    const direction = this._createDirection('text');
    const character = get(this, 'attrs.character');

    return direction.setup(text, character);
  },

  _perform(meta, resolve) {
    const attrs = get(this, 'attrs');
    const character = get(attrs, 'character.directable.component');
    const expression = get(attrs, 'expression');
    const delay = get(attrs, 'delay');

    later(() => {
      character.changeExpression(resolve, expression, attrs);
    }, delay);
  }
});
