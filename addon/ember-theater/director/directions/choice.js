import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  merge,
  set
} = Ember;

export default Direction.extend({
  componentPath: 'ember-theater/director/directable/choice',
  layer: 'theater.prompt.choice',

  fixtureStore: multitonService('ember-theater/fixture-store', 'theaterId'),

  setup(choices) {
    this._addToQueue();

    set(this, 'attrs.choices', choices);

    return this;
  },

  classNames(classNames) {
    set(this, 'attrs.classNames', Ember.Object.create(classNames));

    return this;
  },

  header(header) {
    set(this, 'attrs.header', header);

    return this;
  },

  keyboardPriority(keyboardPriority) {
    set(this, 'attrs.keyboardPriority', keyboardPriority);

    return this;
  },

  keys(keys) {
    set(this, 'attrs.keys', keys);

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
  }
});
