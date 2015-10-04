import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,

  actions: {
    cancel() {
      this.attrs.cancel();
    },

    confirm() {
      this.attrs.confirm();
    }
  }
});
