import Ember from 'ember';
import layout from './template';
import layerName from 'ember-theater/utils/ember-theater/director/layer-name';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Component,
  computed,
  get,
  getProperties,
  isPresent,
  observer,
  on,
  set
} = Ember;

const { alias } = computed;
const { Handlebars: { SafeString } } = Ember;

export default Component.extend({
  layout,

  attributeBindings: ['animationName:animation-name', 'style'],
  classNames: ['et-layer'],
  classNameBindings: ['layerName'],

  layerManager: multitonService('ember-theater/director/layer-manager', 'theaterId', 'windowId'),
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId', 'windowId'),

  animation: alias('layerFilter.animation'),
  animationName: alias('layerFilter.animationName'),

  setFilter: on('didInsertElement', function() {
    this.element.addEventListener('animationend', () => {
      const { layerFilter: {
        effect,
        resolve
      } } = getProperties(this, 'layerFilter');

      // there's a brief moment after an animation ends before which Ember changes the css through
      // `set(this, 'filter', effect)`. To get around this, we manually set the `filter` with jquery,
      // knowing that Ember will overwrite our changes with `attributeBindings: ['style']`.
      this.$().css({ filter: effect, '-webkit-filter': effect });
      set(this, 'filter', effect);

      if (isPresent(resolve)) { resolve(); }
    });
  }),

  resetFilter: observer('layerFilter.effect', function() {
    // we need to manually reset the filter whenever the effect changes, or else the new effect will
    // not display
    set(this, 'filter', null);
  }),

  style: computed('animation', 'keyframeName', 'filter', {
    get() {
      const {
        animation,
        animationName,
        filter
      } = getProperties(this, 'animation', 'animationName', 'filter');

      return new SafeString(`
      animation: ${animation};
      animation-name: ${animationName};
      filter: ${filter};
      -webkit-filter: ${filter};
      `.replace(/\n|\s{2}/g, ''));
    }
  }).readOnly(),

  layerFilter: computed('layerManager.filters.@each.layer', 'layerName', {
    get() {
      const name = get(this, 'layerName');

      return get(this, 'layerManager.filters').find((filter) => {
        return get(filter, 'layer') === name;
      }) || {};
    }
  }).readOnly(),

  layerDirectables: computed('directables.@each.layer', 'name', {
    get() {
      return get(this, 'directables').filter((directable) => {
        return get(directable, 'layer') === get(this, 'name');
      });
    }
  }).readOnly(),

  layerName: computed('name', {
    get() {
      return layerName(get(this, 'name'));
    }
  }).readOnly(),

  childLayers: computed('directables.@each.layer', {
    get() {
      const name = this.get('name');
      const parentName = name ? `${name}.` : '';

      const childLayerDirectables = this.get('directables').filter((directable) => {
        return directable.get('layer').replace(name, '').length > 1;
      });

      const childLayerNames = Ember.A(childLayerDirectables.map((directable) => {
        return directable.get('layer');
      })).uniq();

      return childLayerNames.reduce((layers, layer) => {
        const subName = layer.replace(parentName, '').split('.')[0];
        const childLayerName = name ? `${name}.${subName}` : subName;
        const childLayer = childLayerDirectables.filter((directable) => {
          return directable.get('layer') === layer;
        });

        if (layers[childLayerName]) {
          layers[childLayerName] = layers[childLayerName].concat(childLayer);
        } else {
          layers[childLayerName] = childLayer;
        }

        return layers;
      }, {});
    }
  }).readOnly()
});
