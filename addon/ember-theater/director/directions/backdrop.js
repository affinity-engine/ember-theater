import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multiton from 'ember-multiton-service';

const {
  get,
  isEmpty,
  merge,
  set,
  typeOf
} = Ember;

export default Direction.extend({
  componentPath: 'ember-theater/director/directable/backdrop',
  layer: 'theater.stage.background.backdrop',

  config: multiton('ember-theater/config', 'theaterId'),
  fixtureStore: multiton('ember-theater/fixture-store', 'theaterId'),
  preloader: multiton('ember-theater/preloader', 'theaterId'),

  _setup(fixtureOrId) {
    this._entryPoint();

    const fixtureStore = get(this, 'fixtureStore');
    const fixture = typeOf(fixtureOrId) === 'object' ? fixtureOrId : fixtureStore.find('backdrops', fixtureOrId);
    const imageId = get(this, 'preloader').idFor(fixture, 'src');
    const id = get(fixture, 'id');

    set(fixture, '_imageId', imageId);
    set(this, 'attrs.fixture', fixture);
    set(this, 'id', id);

    if (isEmpty(get(this, '_$instance'))) {
      const transition = { type: 'transition', queue: 'main' };

      get(this, 'attrs.transitions').pushObject(transition);
      set(this, 'hasDefaultTransition', true);
    }

    return this;
  },

  _reset() {
    const fixture = get(this, 'attrs.fixture');

    return this._super({ fixture, transitions: Ember.A() });
  },

  caption(caption) {
    this._entryPoint();

    set(this, 'attrs.caption', caption);

    return this;
  },

  delay(delay, options = {}) {
    this._removeDefaultTransition();
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions');

    transitions.pushObject(merge({ delay, type: 'delay', queue: 'main' }, options));

    return this;
  },

  transition(effect, duration, options = {}) {
    this._removeDefaultTransition();
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions');

    transitions.pushObject(merge({ duration, effect, type: 'transition', queue: 'main' }, options));

    return this;
  },

  _removeDefaultTransition() {
    if (get(this, 'hasDefaultTransition')) {
      set(this, 'hasDefaultTransition', false);
      set(this, 'attrs.transitions', Ember.A())
    }
  }
});
