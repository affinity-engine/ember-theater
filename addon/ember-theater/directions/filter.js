import Ember from 'ember';
import { Direction } from 'ember-theater';
import layerName from 'ember-theater/utils/layer-name';

const {
  get,
  inject,
  run,
  typeOf
} = Ember;

export default Direction.extend({
  emberTheaterLayerManager: inject.service(),

  perform(resolve, layerOrEffect, effectOrOptions = {}, optionsOnly = {}) {
    const layerIsPresent = typeOf(effectOrOptions) === 'string' || typeOf(effectOrOptions) === 'array';
    
    const layer = layerIsPresent ? layerOrEffect : '';
    const effect = layerIsPresent ? effectOrOptions : layerOrEffect;
    const options = layerIsPresent ? optionsOnly : effectOrOptions;

    const duration = get(options, 'duration') || 0;

    // const filterId = get(line, 'id');
    // const effect = filterId ? `url('/filters/${filterId}.svg#${filterId}')` : get(line, 'effect');

    get(this, 'emberTheaterLayerManager').addFilter(resolve, effect, options, layerName(layer));
  }
});
