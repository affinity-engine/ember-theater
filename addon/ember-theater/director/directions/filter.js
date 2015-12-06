import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import layerName from 'ember-theater/utils/layer-name';

const {
  get,
  inject,
  typeOf
} = Ember;

export default Direction.extend({
  layerManager: inject.service('ember-theater/director/layer-manager'),

  perform(resolve, layerOrEffect, effectOrOptions = {}, optionsOnly = {}) {
    const layerIsPresent = typeOf(effectOrOptions) === 'string' || typeOf(effectOrOptions) === 'array';

    const layer = layerIsPresent ? layerOrEffect : '';
    const effect = layerIsPresent ? effectOrOptions : layerOrEffect;
    const options = layerIsPresent ? optionsOnly : effectOrOptions;

    // const filterId = get(line, 'id');
    // const effect = filterId ? `url('/filters/${filterId}.svg#${filterId}')` : get(line, 'effect');

    get(this, 'layerManager').addFilter(resolve, effect, options, layerName(layer));
  }
});
