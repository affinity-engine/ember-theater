import Ember from 'ember';
import layout from './template';

const { Component } = Ember;

const { computed: { and } } = Ember;
const { run: { next } } = Ember;

export default Component.extend({
  layout: layout,

  classNameBindings: ['choice.classNames'],

  isInput: and('choice.inputable', 'inputOpen'),

  actions: {
    choose(choice) {
      this.attrs.choose(choice);
    },

    toggleInput() {
      this.toggleProperty('inputOpen');
      next(() => this.$('button').focus());
    }
  }
});
