import Ember from 'ember';

const {
  Component,
  on
} = Ember;

export default Component.extend({
  classNames: ['et-menu-bar-control-icon'],
  tagName: 'button',

  acceptsKeyResponder: true,
  
  becomeKeyResponderOnFocus: on('focusIn', function() {
    this.becomeKeyResponder();
  }),

  resignKeyResponderOnFocusOut: on('focusOut', function() {
    this.resignKeyResponder();
  }),

  toggleOpen: on('click', 'insertNewLine', 'touchEnd', function() {
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
