import Ember from 'ember';
import { keyDown, keyUp } from 'ember-keyboard';

const {
  on,
  TextField
} = Ember;

export default TextField.extend({
  classNames: ['et-choice-input'],

  closeInput: on('focusOut', keyUp('Escape'), function() {
    this.attrs.toggleInput();
  }),

  focus: on('didInsertElement', function() {
    this.$().focus();
  }),

  complete: on(keyDown('Enter'), function() {
    this.attrs.choose();
  })
});
