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
  componentPath: 'ember-theater/director/directable/character',
  layer: 'theater.stage.foreground.character',

  config: multitonService('ember-theater/config', 'theaterId'),
  fixtureStore: multitonService('ember-theater/fixture-store', 'theaterId'),

  setup(fixtureOrId) {
    const fixtureStore = get(this, 'fixtureStore');
    const fixture = typeOf(fixtureOrId) === 'object' ? fixtureOrId : fixtureStore.find('characters', fixtureOrId);
    const id = get(fixture, 'id');
    const expressionId = get(fixture, 'defaultExpressionId');

    this.initialExpression(expressionId);

    set(this, 'attrs.fixture', fixture);
    set(this, 'id', id);

    return this;
  },

  initialExpression(fixtureOrId) {
    const fixture = this._findExpression(fixtureOrId);

    set(this, 'attrs.expression', fixture);

    return this;
  },

  name(name) {
    set(this, 'attrs.name', name);

    return this;
  },

  position(position, duration = 0, options = {}) {
    const effect = get(this, `config.attrs.director.positions.text.${position}`) || get(this, `config.attrs.director.positions.${position}`);

    this.transition(effect, duration, options);

    return this;
  },

  transition(effect, duration, options = {}) {
    this._addToQueue();

    const transitions = get(this, 'attrs.transitions') || set(this, 'attrs.transitions', Ember.A());

    transitions.pushObject(merge({ duration, effect }, options));

    return this;
  },

  Expression(fixtureOrId) {
    const direction = this._createDirection('expression');
    const fixture = this._findExpression(fixtureOrId);
    const attrs = get(this, 'attrs');

    return direction.setup(fixture, attrs);
  },

  Text(text) {
    const direction = this._createDirection('text');
    const attrs = get(this, 'attrs');

    return direction.setup(text, attrs);
  },

  _findExpression(fixtureOrId) {
    const fixtureStore = get(this, 'fixtureStore');

    return typeOf(fixtureOrId) === 'object' ? fixtureOrId : fixtureStore.find('expressions', fixtureOrId);
  }
});
