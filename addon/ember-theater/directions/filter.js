import Ember from 'ember';
import { Direction } from 'ember-theater';
import layerName from 'ember-theater/utils/layer-name';

const {
  get,
  run
} = Ember;

export default Direction.extend({
  perform(resolve, line) {
    const filterId = get(line, 'id');
    const effect = filterId ? `url('/filters/${filterId}.svg#${filterId}')` : get(line, 'effect');
    const duration = get(line, 'options.duration') ? get(line, 'options.duration') : 0;
    const keyframeName = Ember.guidFor(this);
    const layer = get(line, 'layer') ? get(line, 'layer') : '';
    const queryString = `.${layerName(layer)}`;
    const $layer = Ember.$(queryString);
    const previousFilter = $layer.css('filter') !== 'none' ? $layer.css('filter') : $layer.css('-webkit-filter');

    $layer.first()[0].style['animation'] = `keyframeName ${duration}ms linear 1`;

    var keyframes = `@keyframes ${keyframeName} {
      from {
        -webkit-filter: ${previousFilter};
        filter: ${previousFilter};
      }
      to {
        -webkit-filter: ${effect};
        filter: ${effect};
      }
    }`;

    run.later(() => {
      $layer.css({
        '-webkit-filter': effect,
        'filter': effect
      });
      resolve();
    }, duration);
    
    document.styleSheets[0].insertRule( keyframes, 0 );

    $layer.css('animation-name', keyframeName);
  }
});
