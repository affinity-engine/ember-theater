import Ember from 'ember';
import { onKeyDown } from 'ember-keyboard';

const {
  on,
  TextField
} = Ember;

export default TextField.extend({
  classNames: ['et-choice-input'],

  closeInput: on('focusOut', function() {
    this.attrs.toggleInput();
  }),

  focus: on('didInsertElement', function() {
    this.$().focus();
  }),

  complete: onKeyDown('Enter', function() {
    this.attrs.choose();
  })
});
