import Ember from 'ember';
import { Direction } from 'ember-theater';
import layerName from 'ember-theater/utils/layer-name';

const {
  get,
  run
} = Ember;

export default Direction.extend({
  perform() {
    const line = this.get('line');
    const filterId = get(line, 'id');
    const effect = filterId ? `url('/filters/${filterId}.svg#${filterId}')` : get(line, 'effect');
    const duration = get(line, 'options.duration') ? get(line, 'options.duration') : 0;
    const keyframeName = Ember.guidFor(this);
    const queryString = get(line, 'layer').split(/\.|\//).reduce((queryString, name) => {
      return `${queryString} .${layerName(name)}`;
    }, '');
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
      get(line, 'resolve')();
    }, duration);
    
    document.styleSheets[0].insertRule( keyframes, 0 );

    $layer.css('animation-name', keyframeName);
  }
});
