import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed
} = Ember;

const { alias } = computed;

export default Component.extend({
  classNames: ['letter-by-letter__word'],
  currentCharacter: 0,
  layout: layout,
  tagName: 'span',
  wordLength: alias('word.length'),

  actions: {
    incrementCurrentCharacter() {
      this.incrementProperty('currentCharacter');
      
      if (this.get('wordLength') === this.get('currentCharacter')) {
        this.attrs.incrementCurrentWord();
      }
    }
  }
});
