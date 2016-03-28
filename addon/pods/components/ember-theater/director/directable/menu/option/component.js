import Ember from 'ember';
import layout from './template';

const { Component } = Ember;

const { computed: { and } } = Ember;
const { run: { next } } = Ember;

export default Component.extend({
  layout: layout,

  classNameBindings: ['menu.classNames'],

  isInput: and('menu.inputable', 'inputOpen'),

  actions: {
    choose(menu) {
      this.attrs.choose(menu);
    },

    toggleInput() {
      this.toggleProperty('inputOpen');
      next(() => this.$('button').focus());
    }
  }
});
