import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  merge,
  get,
  getProperties,
  set
} = Ember;

export default Direction.extend({
  componentPath: 'ember-theater/director/directable/text',
  layer: 'theater.prompt.text',

  fixtureStore: multitonService('ember-theater/fixture-store', 'theaterId'),

  _setup(text, character) {
    this._entryPoint();

    set(this, 'attrs.text', text);
    set(this, 'attrs.character', character);

    return this;
  },

  _reset() {
    const attrs = get(this, 'attrs');

    return this._super(getProperties(attrs, 'text', 'character'));
  },

  classNames(classNames) {
    this._entryPoint();

    set(this, 'attrs.classNames', classNames);

    return this;
  },

  instant(instant = true) {
    this._entryPoint();

    set(this, 'attrs.instant', instant);

    return this;
  },

  keyboardPriority(keyboardPriority) {
    this._entryPoint();

    set(this, 'attrs.keyboardPriority', keyboardPriority);

    return this;
  },

  keys(keys) {
    this._entryPoint();

    set(this, 'attrs.keys', { accept: keys });

    return this;
  },

  scrollable(scrollable = true) {
    this._entryPoint();

    set(this, 'attrs.scrollable', scrollable);

    return this;
  },

  textTransition(textTransition) {
    this._entryPoint();

    set(this, 'attrs.textTransition', textTransition);

    return this;
  },

  textSpeed(textSpeed) {
    this._entryPoint();

    set(this, 'attrs.textSpeed', textSpeed);

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
  },

  Menu(choices) {
    this._removeFromQueue();

    const direction = this._createDirection('menu');

    return direction._setup(choices, this);
  },

  _removeFromQueue() {
    get(this, 'queue').removeObject(this);
  }
});
