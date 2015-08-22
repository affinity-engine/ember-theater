import Ember from 'ember';
import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';
import layerName from 'ember-theater/utils/layer-name';

const { get } = Ember;

export default EmberTheaterDirection.extend({
  componentType: 'ember-theater-directable-filter',

  perform() {
    const line = this.get('line');
    const filterId = get(line, 'id');
    const effect = filterId ? `url('/filters/${filterId}.svg#${filterId}')` : get(line, 'effect');
    const queryString = get(line, 'layer').split(/\.|\//).reduce((queryString, name) => {
      return `${queryString} .${layerName(name)}`;
    }, '');
    const $layer = Ember.$(queryString);

    $layer.css({
      filter: effect,
      '-webkit-filter': effect
    });

    get(line, 'resolve')();
  }
});
