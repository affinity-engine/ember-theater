import Ember from 'ember';

const {
  inject,
  on,
  TextField
} = Ember;

export default TextField.extend({
  acceptsKeyResponder: true,
  classNames: ['et-choice-input'],
  keyboard: inject.service(),

  closeInput: on('focusOut', function() {
    this.attrs.toggleInput();
  }),

  focus: on('didInsertElement', function() {
    this.$().focus();
  }),

  insertNewline() {
    this.attrs.choose();
  },

  makeKeyResponder: on('focusIn', function() {
    this.becomeKeyResponder(true);
  }),

  unmakeKeyResponder: on('willDestroyElement', function() {
    this.resignKeyResponder();
  })
});
