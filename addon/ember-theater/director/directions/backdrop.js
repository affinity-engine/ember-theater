import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

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

  config: multitonService('ember-theater/config', 'theaterId'),
  fixtureStore: multitonService('ember-theater/fixture-store', 'theaterId'),

  setup(fixtureOrId) {
    this._addToQueue();

    const fixtureStore = get(this, 'fixtureStore');
    const fixture = typeOf(fixtureOrId) === 'object' ? fixtureOrId : fixtureStore.find('backdrops', fixtureOrId);
    const id = get(fixture, 'id');

    set(this, 'attrs.fixture', fixture);
    set(this, 'id', id);
    set(this, 'attrs.transitions', Ember.A());

    if (isEmpty(get(this, '_instanceComponent'))) {
      const transition = get(this, 'config.attrs.director.backdrop.transition') || get(this, 'config.attrs.globals.transition');

      get(this, 'attrs.transitions').pushObject(transition);
      set(this, 'hasDefaultTransition', true);
    }

    return this;
  },

  caption(caption) {
    this._addToQueue();

    set(this, 'attrs.caption', caption);

    return this;
  },

  stop(queue = true) {
    this._addToQueue();

    get(this, '_instanceComponent').stop(queue);

    return this;
  },

  transition(effect, duration, options = {}) {
    this._addToQueue();
    this._removeDefaultTransition();

    get(this, 'attrs.transitions').pushObject(merge({ duration, effect }, options));

    return this;
  },

  _removeDefaultTransition() {
    if (get(this, 'hasDefaultTransition')) {
      set(this, 'hasDefaultTransition', false);
      set(this, 'attrs.transitions', Ember.A())
    }
  }
});
