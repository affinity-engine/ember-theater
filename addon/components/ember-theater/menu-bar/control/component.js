import Ember from 'ember';
import layout from './template';

const {
  Component,
  on,
  run
} = Ember;

export default Component.extend({
  classNames: ['et-menu-bar-control-icon'],
  layout: layout,
  tagName: 'button',

  triggerOpen: on('focusIn', 'mouseEnter', function() {
    run.once(this, this.attrs.focusControl);
  }),

  triggerToggle: on('click', 'touchStart', function() {
    run.once(this, this.attrs.clickControl);
  })
});
