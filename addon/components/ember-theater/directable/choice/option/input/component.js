import Ember from 'ember';

const {
  inject,
  on,
  TextField
} = Ember;

export default TextField.extend({
  classNames: ['et-choice-input'],
  keyboard: inject.service(),

  closeInput: on('focusOut', function() {
    this.attrs.toggleInput();
  }),

  destroyKeyPressWatcher: on('willDestroyElement', function() {
    this.get('keyboard').stopListeningFor('Enter', this, '_resolveKeyPress');
  }),

  focus: on('didInsertElement', function() {
    this.$().focus();
  }),

  setupKeyPressWatcher: on('didInsertElement', function() {
    this.get('keyboard').listenFor('Enter', this, '_resolveKeyPress', {
      actOnInputElement: true
    });
  }),

  _resolveKeyPress() {
    this.attrs.choose();
  }
});
