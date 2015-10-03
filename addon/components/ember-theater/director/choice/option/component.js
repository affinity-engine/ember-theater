import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  layout: layout,

  isInput: computed('choice.inputable', 'inputOpen', {
    get() {
      return this.get('choice.inputable') && this.get('inputOpen');
    }
  }),

  actions: {
    choose(choice) {
      this.attrs.choose(choice);
    },

    toggleInput() {
      this.toggleProperty('inputOpen');
    }
  }
});
