import Ember from 'ember';
import layout from './template';
import layerName from 'ember-theater/utils/layer-name';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  classNames: ['et-layer'],
  classNameBindings: ['layerName'],
  layout: layout,

  layerName: computed('name', function() {
    return layerName(this.get('name'));
  }),

  actions: {
    destroyDirectable(directable) {
      this.get('directables').removeObject(directable);
      directable.destroy();
    }
  }
});
