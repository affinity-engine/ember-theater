import Ember from 'ember';
import layout from './template';

const { Component } = Ember;

export default Component.extend({
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
