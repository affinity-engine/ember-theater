import Ember from 'ember';
import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';
import layerName from 'ember-theater/utils/layer-name';

const { get } = Ember;

export default EmberTheaterDirection.extend({
  componentType: 'ember-theater-directable-filter',

  perform() {
    const line = this.get('line');
    const filterId = get(line, 'id');
    const filterUrl = `/filters/${filterId}.svg#${filterId}`;
    const queryString = get(line, 'layer').split(/\.|\//).reduce((queryString, name) => {
      return `${queryString} .${layerName(name)}`;
    }, '');
    const $layer = Ember.$(queryString);

    $layer.css({
      filter: `url(${filterUrl})`,
      '-webkit-filter': `url(${filterUrl})`
    });

    get(line, 'resolve')();
  }
});
