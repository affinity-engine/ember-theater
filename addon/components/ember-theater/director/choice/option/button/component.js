import Ember from 'ember';
import layout from './template';
import {
  keyDown,
  EKOnFocusMixin
} from 'ember-keyboard';


const {
  Component,
  get,
  on
} = Ember;

export default Component.extend(EKOnFocusMixin, {
  layout,

  classNameBindings: ['choice.class'],
  classNames: ['et-choice-option'],
  tagName: 'button',

  moveFocusDown: on(keyDown('ArrowDown'), keyDown('s'), function() {
    this.attrs.focusDown();
  }),

  moveFocusUp: on(keyDown('ArrowUp'), keyDown('w'), function() {
    this.attrs.focusUp();
  }),

  setFocus: on('didRender', function() {
    if (get(this, 'activeIndex') === get(this, 'index')) {
      this.$().focus();
    }
  }),

  handleAction: on('click', 'submit', function() {
    if (get(this, 'choice.inputable')) {
      this.attrs.toggleInput();
    } else {
      this.attrs.choose();
    }
  })
});
