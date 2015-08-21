import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  classNameBindings: ['layerName'],
  layout: layout,

  layerName: computed('name', function() {
    return `ember-theater-layer__${this.get('name')}`;
  }),

  actions: {
    destroyDirectable(directable) {
      this.get('directables').removeObject(directable);
      directable.destroy();
    }
  }
});
