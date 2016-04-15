import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  getProperties,
  merge,
  set
} = Ember;

export default Direction.extend({
  componentPath: 'ember-theater/director/directable/menu',
  layer: 'theater.prompt.menu',

  fixtureStore: multitonService('ember-theater/fixture-store', 'theaterId'),

  _setup(choices, text) {
    this._entryPoint();

    set(this, 'attrs.choices', choices);
    set(this, 'attrs.text', text);

    return this;
  },

  _reset() {
    const attrs = get(this, 'attrs');

    return this._super({ ...getProperties(attrs, 'choices', 'text') });
  },

  classNames(classNames) {
    this._entryPoint();

    set(this, 'attrs.classNames', classNames);

    return this;
  },

  header(header) {
    this._entryPoint();

    set(this, 'attrs.header', header);

    return this;
  },

  keyboardPriority(keyboardPriority) {
    this._entryPoint();

    set(this, 'attrs.keyboardPriority', keyboardPriority);

    return this;
  },

  keys(keys) {
    this._entryPoint();

    set(this, 'attrs.keys', keys);

    return this;
  },

  transition() {
    this._entryPoint();

    this.transitionIn(...arguments);

    return this;
  },

  transitionIn(effect, duration, options = {}) {
    this._entryPoint();

    set(this, 'attrs.transitionIn', merge({ duration, effect }, options));

    return this;
  },

  transitionOut(effect, duration, options = {}) {
    this._entryPoint();

    set(this, 'attrs.transitionOut', merge({ duration, effect }, options));

    return this;
  }
});
