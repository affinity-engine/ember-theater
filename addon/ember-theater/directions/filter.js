import Ember from 'ember';
import { Direction } from 'ember-theater';
import layerName from 'ember-theater/utils/layer-name';

const {
  get,
  inject,
  run
} = Ember;

export default Direction.extend({
  emberTheaterLayerManager: inject.service(),

  perform(resolve, line) {
    const filterId = get(line, 'id');
    const effect = filterId ? `url('/filters/${filterId}.svg#${filterId}')` : get(line, 'effect');
    const duration = get(line, 'options.duration') ? get(line, 'options.duration') : 0;
    const layer = get(line, 'layer') ? get(line, 'layer') : '';

    this.get('emberTheaterLayerManager').addFilter(effect, duration, layerName(layer));
  }
});
