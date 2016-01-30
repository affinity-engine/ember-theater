import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import layerName from 'ember-theater/utils/ember-theater/director/layer-name';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  typeOf
} = Ember;

export default Direction.extend({
  layerManager: multitonService('ember-theater/director/layer-manager', 'theaterId'),

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
