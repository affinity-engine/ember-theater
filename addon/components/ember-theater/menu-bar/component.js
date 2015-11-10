import Ember from 'ember';
import layout from './template';

const {
  Component,
  on
} = Ember;

export default Component.extend({
  classNames: ['et-menu-bar-container'],
  layout: layout,
  
  actions: {
    toggleControlProperty(property) {
      this.toggleProperty(property);
    }
  }
});
