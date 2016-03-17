import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import DirectionQueue from '../direction-queue';

const {
  get,
  getProperties,
  isEmpty,
  merge,
  set,
  typeOf
} = Ember;

export default Direction.extend({
  componentPath: 'ember-theater/director/directable/character',
  layer: 'theater.stage.foreground.character',

  config: multitonService('ember-theater/config', 'theaterId'),
  fixtureStore: multitonService('ember-theater/fixture-store', 'theaterId'),
  preloader: multitonService('ember-theater/preloader', 'theaterId'),

  setup(fixtureOrId) {
    this._entryPoint();

    const fixtureStore = get(this, 'fixtureStore');
    const fixture = typeOf(fixtureOrId) === 'object' ? fixtureOrId : fixtureStore.find('characters', fixtureOrId);
    const id = get(fixture, 'id');
    const expressionId = get(fixture, 'defaultExpressionId');

    this.initialExpression(expressionId);

    set(this, 'attrs.fixture', fixture);
    set(this, 'id', id);

    if (isEmpty(get(this, '_$instance'))) {
      const transition = get(this, 'config.attrs.director.character.transition') || get(this, 'config.attrs.globals.transition');

      get(this, 'attrs.transitions').pushObject(transition);
      set(this, 'hasDefaultTransition', true);
    }

    return this;
  },

  _reset() {
    const attrs = get(this, 'attrs');

    return this._super({ transitions: Ember.A(), ...getProperties(attrs, 'fixture', 'name', 'namePosition') });
  },

  initialExpression(fixtureOrId) {
    this._entryPoint();

    const fixture = this._findExpression(fixtureOrId);

    set(this, 'attrs.expression', fixture);

    return this;
  },

  name(name) {
    this._entryPoint();

    set(this, 'attrs.name', name);

    return this;
  },

  namePosition(namePosition) {
    this._entryPoint();

    set(this, 'attrs.namePosition', namePosition);

    return this;
  },

  position(positions, duration, options = {}) {
    this._entryPoint();

    const effect = positions.split(' ').reduce((effect, position) => {
      return merge(effect,
        get(this, `fixture.positions.character.${position}`) ||
        get(this, `fixture.positions.${position}`) ||
        get(this, `config.attrs.director.positions.character.${position}`) ||
        get(this, `config.attrs.director.positions.${position}`)
      )
    }, {});

    this.transition(effect, duration, options);

    return this;
  },

  stop(queue = true) {
    this._entryPoint();
    this._removeFromQueueIfDefault();

    get(this, '_$instance').velocity('stop', queue);

    return this;
  },

  transition(effect, duration, options = {}) {
    this._entryPoint();
    this._removeDefaultTransition();

    const transitions = get(this, 'attrs.transitions') || set(this, 'attrs.transitions', Ember.A());

    transitions.pushObject(merge({ duration, effect }, options));

    return this;
  },

  Expression(fixtureOrId) {
    this._entryPoint();
    this._removeFromQueueIfDefault();

    const direction = this._createDirection('expression');
    const fixture = this._findExpression(fixtureOrId);

    return direction.setup(fixture, this);
  },

  Text(text) {
    this._entryPoint();
    this._removeFromQueueIfDefault();

    const direction = this._createDirection('text');

    return direction.setup(text, this);
  },

  _findExpression(fixtureOrId) {
    const fixtureStore = get(this, 'fixtureStore');
    const fixture = typeOf(fixtureOrId) === 'object' ? fixtureOrId : fixtureStore.find('expressions', fixtureOrId);
    const imageId = get(this, 'preloader').idFor(fixture, 'src');

    set(fixture, '_imageId', imageId);

    return fixture;
  },

  _removeDefaultTransition() {
    if (get(this, 'hasDefaultTransition')) {
      set(this, 'hasDefaultTransition', false);
      set(this, 'attrs.transitions', Ember.A())
    }
  },

  _removeFromQueueIfDefault() {
    if (get(this, 'hasDefaultTransition')) {
      get(this, 'queue').removeObject(this);
    }
  }
});
