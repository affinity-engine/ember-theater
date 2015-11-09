import Ember from 'ember';
import layout from './template';
import layerName from 'ember-theater/utils/layer-name';

const {
  Component,
  computed,
  guidFor,
  inject,
  isPresent,
  run
} = Ember;

export default Component.extend({
  attributeBindings: ['animationName:animation-name', 'style'],
  classNames: ['et-layer'],
  classNameBindings: ['layerName'],
  emberTheaterLayerManager: inject.service(),
  emberTheaterStageManager: inject.service(),
  layout: layout,

  style: computed('animation', 'filterAnimationName', 'filter', {
    get() {
      const {
        animation,
        filterAnimationName,
        filter
      } = this.getProperties('animation', 'filterAnimationName', 'filter');

      return `
      animation: ${animation};
      animation-name: ${filterAnimationName};
      filter: ${filter};
      -webkit-filter: ${filter};
      `
    }
  }).readOnly(),

  animationName: computed('emberTheaterLayerManager.filters.[]', {
    get() {
      const layerName = this.get('layerName');
      const filter = this.get('emberTheaterLayerManager.filters').find((filter) => {
        return filter.get('layer') === layerName;
      });

      if (isPresent(filter)) {
        const {
          duration,
          effect,
          previousFilter
        } = filter.getProperties('duration', 'effect', 'previousFilter');

        const keyframeName = guidFor(this);
        const animation = `keyframeName ${duration}ms linear 1`;
        const keyframes = `@keyframes ${keyframeName} {
        from {
        -webkit-filter: ${previousFilter};
        filter: ${previousFilter};
        }
        to {
        -webkit-filter: ${effect};
        filter: ${effect};
        }
        }`;

        document.styleSheets[0].insertRule( keyframes, 0 );

        if (duration > 0) {
          run.later(() => {
            this.set('filter', effect);
          }, duration);
        } else {
          this.set('filter', effect);
        }

        this.setProperties({
          animation,
          filterAnimationName: keyframeName
        });

        this.get('emberTheaterLayerManager').completeFilterTransition(layerName);
      }
    }
  }).readOnly(),

  layerDirectables: computed('directables.[]', {
    get() {
      return this.get('directables').filter((directable) => {
        return directable.get('layer') === this.get('name');
      });
    }
  }).readOnly(),

  layerName: computed('name', {
    get() {
      return layerName(this.get('name'));
    }
  }).readOnly(),

  childLayers: computed('directables.[]', {
    get() {
      const name = this.get('name');
      const parentName = name ? `${name}.` : '';

      const childLayerDirectables = this.get('directables').filter((directable) => {
        return directable.get('layer').replace(name, '').length > 1;
      })

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
