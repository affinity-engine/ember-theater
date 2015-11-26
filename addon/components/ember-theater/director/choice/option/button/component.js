import Ember from 'ember';
import layout from './template';
import {
  keyDown,
  EKOnFocusMixin
} from 'ember-keyboard';

const {
  Component,
  get,
  getProperties,
  on
} = Ember;

const { inject: { service } } = Ember;

export default Component.extend(EKOnFocusMixin, {
  layout,

  classNameBindings: ['choice.class'],
  classNames: ['et-choice-option'],
  tagName: 'button',

  setupKeys: on('init', function() {
    const { moveDownKeys, moveUpKeys } = getProperties(this, 'moveDownKeys', 'moveUpKeys');

    moveDownKeys.forEach((key) => this.on(keyDown(key), () => this.attrs.focusDown()));
    moveUpKeys.forEach((key) => this.on(keyDown(key), () => this.attrs.focusUp()));
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
