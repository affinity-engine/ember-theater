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

  _setup(fixtureOrId) {
    this._entryPoint();

    const fixtureStore = get(this, 'fixtureStore');
    const fixture = typeOf(fixtureOrId) === 'object' ? fixtureOrId : fixtureStore.find('characters', fixtureOrId);
    const id = get(fixture, 'id');
    const expressionFixtureOrId = get(fixture, 'defaultExpression');

    set(this, 'attrs.fixture', fixture);
    set(this, 'id', id);

    this.initialExpression(expressionFixtureOrId);

    if (isEmpty(get(this, '_$instance'))) {
      const transition = { type: 'transition', queue: 'main' };

      get(this, 'attrs.transitions').pushObject(transition);
      set(this, 'hasDefaultTransition', true);
    }

    return this;
  },

  _reset() {
    const attrs = get(this, 'attrs');

    return this._super({ transitions: Ember.A(), ...getProperties(attrs, 'fixture', 'name', 'namePosition') });
  },

  delay(delay, options = {}) {
    this._removeDefaultTransition();
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions');

    transitions.pushObject(merge({ delay, type: 'delay', queue: 'main' }, options));

    return this;
  },

  expression(fixtureOrId, options = {}) {
    if (get(this, 'hasDefaultTransition')) {
      return this.initialExpression(fixtureOrId)
    } else {
      return this._changeExpression(fixtureOrId, options);
    }
  },

  _changeExpression(fixtureOrId, options) {
    this._removeDefaultTransition();
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions')
    const expression = this._findExpression(fixtureOrId);

    transitions.pushObject(merge({ expression, type: 'crossFade', queue: 'expression' }, options));

    return this;
  },

  initialExpression(expressionFixtureOrId) {
    const fixture = this._findExpression(expressionFixtureOrId);

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

  position(positions, duration = 0, options = {}) {
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

  transition(effect, duration, options = {}) {
    this._removeDefaultTransition();
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions');

    transitions.pushObject(merge({ duration, effect, type: 'transition', queue: 'main' }, options));

    return this;
  },

  Text(text) {
    this._removeFromQueueIfDefault();

    const direction = this._createDirection('text');

    return direction._setup(text, this);
  },

  _findExpression(fixtureOrIdOrAlias) {
    const character = get(this, 'attrs.fixture');
    const fixtureOrId = get(character, `expressions.${fixtureOrIdOrAlias}`) || fixtureOrIdOrAlias;
    const fixtureStore = get(this, 'fixtureStore');
    const expression = typeOf(fixtureOrId) === 'object' ? fixtureOrId : fixtureStore.find('expressions', fixtureOrId);
    const imageId = get(this, 'preloader').idFor(expression, 'src');

    set(expression, '_imageId', imageId);

    return expression;
  },

  _removeDefaultTransition() {
    if (get(this, 'hasDefaultTransition')) {
      set(this, 'hasDefaultTransition', false);
      set(this, 'attrs.transitions', Ember.A());
    }
  },

  _removeFromQueueIfDefault() {
    if (get(this, 'hasDefaultTransition')) {
      get(this, 'queue').removeObject(this);
    }
  }
});
