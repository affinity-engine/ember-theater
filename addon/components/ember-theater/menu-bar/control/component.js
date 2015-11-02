import Ember from 'ember';

const {
  Component,
  on
} = Ember;

export default Component.extend({
  classNames: ['et-menu-bar-control-icon'],
  tagName: 'button',

  toggleOpen: on('click', 'touchEnd', function() {
    this.toggleProperty('isOpen');
  }),

  startHovering: on('focusIn', 'mouseEnter', function() {
    this.startHoverEffect();
  }),

  stopHovering: on('focusOut', 'mouseLeave', function() {
    this.stopHoverEffect();
  }),

  actions: {
    closeMenu() {
      this.set('isOpen', false);
    }
  }
});
