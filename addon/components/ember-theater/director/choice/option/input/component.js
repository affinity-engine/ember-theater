import Ember from 'ember';
import { keyDown, keyUp } from 'ember-keyboard';

const {
  on,
  TextField
} = Ember;

export default TextField.extend({
  classNames: ['et-choice-input'],

  setKeys: on('didReceiveAttrs', function() {
    const cancelKeys = get(this, 'cancelKeys');

    cancelKeys.forEach((key) => this.on(keyUp(key), this.attrs.toggleInput));
  }),

  focus: on('didInsertElement', function() {
    this.$().focus();
  }),

  complete: on(keyDown('Enter'), function() {
    this.attrs.choose();
  })
});
