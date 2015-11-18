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

const { inject: { service } } = Ember;

export default Component.extend(EKOnFocusMixin, {
  layout,

  classNameBindings: ['choice.class'],
  classNames: ['et-choice-option'],
  tagName: 'button',

  config: service('ember-theater/config'),

  setupKeys: on('init', function() {
    const downKeys = get(this, 'config.keys.moveDown');
    const upKeys = get(this, 'config.keys.moveUp');

    downKeys.forEach((key) => this.on(keyDown(key), () => this.attrs.focusDown()));
    upKeys.forEach((key) => this.on(keyDown(key), () => this.attrs.focusUp()));
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
