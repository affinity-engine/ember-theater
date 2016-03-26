import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import layerName from 'ember-theater/utils/ember-theater/director/layer-name';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  getProperties,
  set
} = Ember;

export default Direction.extend({
  layerManager: multitonService('ember-theater/director/layer-manager', 'theaterId'),

  setup(layer, effect, duration = 500) {
    this._entryPoint();

    set(this, 'attrs.layer', layer);
    set(this, 'attrs.effect', effect);
    set(this, 'attrs.duration', duration);

    return this;
  },

  destroy(destroy = true) {
    set(this, 'destroy', destroy);

    return this;
  },

  _perform(priorSceneRecord, resolve) {
    const attrs = get(this, 'attrs');
    const {
      effect,
      layer
    } = getProperties(attrs, 'effect', 'layer');

    // const filterId = get(line, 'id');
    // const effect = filterId ? `url('/filters/${filterId}.svg#${filterId}')` : get(line, 'effect');

    get(this, 'layerManager').addFilter(resolve, effect, attrs, layerName(layer));
  }
});
