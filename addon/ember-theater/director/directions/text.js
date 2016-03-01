import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  merge,
  set
} = Ember;

export default Direction.extend({
  componentPath: 'ember-theater/director/directable/text',
  layer: 'theater.prompt.text',

  fixtureStore: multitonService('ember-theater/fixture-store', 'theaterId'),

  setup(text, character) {
    this._addToQueue();

    set(this, 'attrs.text', text);
    set(this, 'attrs.character', character);

    return this;
  },

  classNames(classNames) {
    set(this, 'attrs.classNames', Ember.Object.create(classNames));

    return this;
  },

  instant(instant = true) {
    set(this, 'attrs.instant', instant);

    return this;
  },

  keys(keys) {
    set(this, 'attrs.keys', { accept: keys });

    return this;
  },

  scrollable(scrollable = true) {
    set(this, 'attrs.scrollable', scrollable);

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

  typeAnimation(typeAnimation) {
    set(this, 'attrs.typeAnimation', typeAnimation);

    return this;
  },

  typeSpeed(typeSpeed) {
    set(this, 'attrs.typeSpeed', typeSpeed);

    return this;
  }
});
