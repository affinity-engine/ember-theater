import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,

  actions: {
    destroyDirectable(directable) {
      this.get('directables').removeObject(directable);
      directable.destroy();
    }
  }
});
