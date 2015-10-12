import Ember from 'ember';
import layout from './template';

const { Component } = Ember;

export default Component.extend({
  activeWordIndex: 0,
  classNames: ['letter-by-letter'],
  layout: layout,

  actions: {
    incrementActiveWordIndex() {
      this.incrementProperty('activeWordIndex');

      if (this.get('activeWordIndex') === this.get('words.length')) {
        this.attrs.textComplete();
      }
    }
  }
});
