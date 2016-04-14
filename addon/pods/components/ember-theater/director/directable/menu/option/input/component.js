import Ember from 'ember';
import { keyDown, keyUp } from 'ember-keyboard';

const {
  TextField,
  get,
  on
} = Ember;

export default TextField.extend({
  classNames: ['et-menu-input'],

  focus: on('didInsertElement', function() {
    this.$().focus();
  }),

  onFocusOut: on('focusOut', function() {
    this.attrs.toggleInput();
  }),

  complete: on(keyDown('Enter'), function() {
    this.attrs.choose();
  })
});
