import Ember from 'ember';
import layout from './template';

const {
  Component,
  on
} = Ember;

export default Component.extend({
  classNameBindings: ['choice.class'],
  classNames: ['et-choice-option'],
  layout: layout,
  tagName: 'button',

  handleAction: on('click', 'submit', function() {
    if (this.get('choice.inputable')) {
      this.attrs.toggleInput();
    } else {
      this.attrs.choose();
    }
  })
});
