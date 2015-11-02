import Ember from 'ember';
import layout from './template';
import layerName from 'ember-theater/utils/layer-name';

const {
  Component,
  computed,
  inject
} = Ember;

export default Component.extend({
  classNames: ['et-layer'],
  classNameBindings: ['layerName'],
  emberTheaterStageManager: inject.service(),
  layout: layout,

  layerDirections: computed('directions.[]', {
    get() {
      return this.get('directions').filter((direction) => {
        return direction.get('layer') === this.get('name');
      });
    }
  }).readOnly(),

  layerName: computed('name', {
    get() {
      return layerName(this.get('name'));
    }
  }).readOnly(),

  childLayers: computed('directions.[]', {
    get() {
      const name = this.get('name');
      const parentName = name ? `${name}.` : '';

      const childLayerDirections = this.get('directions').filter((direction) => {
        return direction.get('layer').replace(name, '').length > 1;
      })
      
      const childLayerNames = Ember.A(childLayerDirections.map((direction) => {
        return direction.get('layer');
      })).uniq();

      return childLayerNames.reduce((layers, layer) => {
        const subName = layer.replace(parentName, '').split('.')[0];
        const childLayerName = name ? `${name}.${subName}` : subName;
        const childLayer = childLayerDirections.filter((direction) => {
          return direction.get('layer') === layer;
        });

        if (layers[childLayerName]) {
          layers[childLayerName] = layers[childLayerName].concat(childLayer);
        } else {
          layers[childLayerName] = childLayer;
        }

        return layers;
      }, {});
    }
  }).readOnly(),

  actions: {
    destroyDirection(direction) {
      this.get('emberTheaterStageManager').removeDirection(direction);
    }
  }
});
