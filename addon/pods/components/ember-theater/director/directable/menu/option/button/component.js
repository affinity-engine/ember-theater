import Ember from 'ember';
import layout from './template';

const {
  Component,
  get,
  on
} = Ember;

export default Component.extend({
  layout,

  classNameBindings: ['menu.class'],
  classNames: ['et-menu-option'],
  tagName: 'button',

  handleAction: on('click', 'submit', function() {
    if (get(this, 'menu.inputable')) {
      this.attrs.toggleInput();
    } else {
      this.attrs.choose();
    }
  })
});
