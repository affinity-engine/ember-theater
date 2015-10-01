import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  observer,
  on,
  run
} = Ember;

const {
  alias,
  and,
  not,
  or
} = computed;

export default Component.extend({
  activeCharacterByCharacter: and('characterByCharacter', 'isActive'),
  activeCharacterIndex: 0,
  classNames: ['letter-by-letter__word'],
  classNameBindings: ['isDisplayed:letter-by-letter__visible'],
  characterByCharacter: not('wordByWord'),
  isDisplayed: or('isActive', 'isComplete', 'wordByWord'),
  layout: layout,
  tagName: 'span',
  wordLength: alias('word.length'),

  checkForActivity: on('didReceiveAttrs', function() {
    if (this.get('index') === this.get('activeWordIndex') && !this.get('isComplete')) {
      this.set('isActive', true);
    } else if (this.get('wordByWord')) {
      this.resetMeta();
    }
  }),

  resetMeta() {
    this.setProperties({
      isComplete: true,
      activeCharacterIndex: 0,
      isActive: false
    });
  },

  wordChanged: observer('word', function() {
    this.set('isComplete', false);
  }),

  actions: {
    incrementActiveCharacterIndex() {
      const {
        wordLength,
        activeCharacterIndex
      } = this.getProperties('wordLength', 'activeCharacterIndex');

      this.incrementProperty('activeCharacterIndex');
      
      if (wordLength === activeCharacterIndex) {
        this.resetMeta();
      } else if (wordLength === activeCharacterIndex + 1) {
        this.attrs.incrementActiveWordIndex();
      } 
    }
  }
});
