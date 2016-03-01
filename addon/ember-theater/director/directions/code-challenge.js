import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  merge,
  set
} = Ember;

export default Direction.extend({
  componentPath: 'ember-theater/director/directable/code-challenge',
  layer: 'theater.prompt.code-challenge',

  setup(snippets) {
    this._addToQueue();

    set(this, 'attrs.snippets', snippets);

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
