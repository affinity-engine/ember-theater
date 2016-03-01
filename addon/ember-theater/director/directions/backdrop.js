import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  merge,
  set,
  typeOf
} = Ember;

export default Direction.extend({
  componentPath: 'ember-theater/director/directable/backdrop',
  layer: 'theater.stage.background.backdrop',

  fixtureStore: multitonService('ember-theater/fixture-store', 'theaterId'),

  setup(fixtureOrId) {
    this._addToQueue();

    const fixtureStore = get(this, 'fixtureStore');
    const fixture = typeOf(fixtureOrId) === 'object' ? fixtureOrId : fixtureStore.find('backdrops', fixtureOrId);
    const id = get(fixture, 'id');

    set(this, 'attrs.fixture', fixture);
    set(this, 'id', id);

    return this;
  },

  caption(caption) {
    set(this, 'attrs.caption', caption);

    return this;
  },

  transition(effect, duration, options = {}) {
    this._addToQueue();

    set(this, 'attrs.transition', merge({ duration, effect }, options));

    return this;
  }
});
