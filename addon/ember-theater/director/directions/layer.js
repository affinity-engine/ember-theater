import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multiton from 'ember-multiton-service';

const {
  get,
  getProperties,
  merge,
  set
} = Ember;

export default Direction.extend({
  layerManager: multiton('ember-theater/director/layer-manager', 'theaterId', 'windowId'),

  _setup(layer) {
    this._entryPoint();

    set(this, 'attrs.layer', layer);

    return this;
  },

  _reset() {
    const attrs = get(this, 'attrs');

    return this._super({ transitions: Ember.A(), ...getProperties(attrs, 'layer') });
  },

  filter(filter, duration, options = {}) {
    this._entryPoint();

    this.transition(filter, duration, options, 'filter');

    return this;
  },

  transition(effect, duration, options = {}, type = 'transition') {
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions');

    transitions.pushObject(merge({ duration, effect, type, queue: 'main' }, options));

    return this;
  },

  _perform(priorSceneRecord, resolve) {
    const {
      attrs,
      layerManager
    } = getProperties(this, 'attrs', 'layerManager');

    const layer = get(attrs, 'layer');

    set(this, '_shouldReset', true);

    layerManager.handleDirectable(layer, { attrs, direction: this, priorSceneRecord }, resolve);
  }
});
