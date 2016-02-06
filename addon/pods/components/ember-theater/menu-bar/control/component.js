import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

import {
  keyDown,
  EKMixin
} from 'ember-keyboard';

const {
  Component,
  get,
  isPresent,
  on
} = Ember;

export default Component.extend(EKMixin, {
  keyboardFirstResponder: true,
  keyboardLaxPriority: true,
  classNames: ['et-menu-bar-control-icon'],
  tagName: 'button',

  config: multitonService('ember-theater/config', 'theaterId'),

  setupFocusKeystroke: on('init', function() {
    const type = get(this, 'type');
    const keys = get(this, `config.attrs.menuBar.${type}.keys.open`);

    keys.forEach((key) => this.on(keyDown(key), (event) => {
      this.toggleOpen();
      event.preventDefault();
    }));
  }),

  toggleOpen: on('click', 'touchEnd', function() {
    this.attrs.openMenu();
  }),

  startHovering: on('focusIn', 'mouseEnter', function() {
    if (isPresent(this.startHoverEffect)) {
      this.startHoverEffect();
    }
  }),

  stopHovering: on('focusOut', 'mouseLeave', function() {
    if (isPresent(this.stopHoverEffect)) {
      this.stopHoverEffect();
    }
  })
});
