import Ember from 'ember';
import layout from './template';
import WindowResizeMixin from '../../mixins/window-resize';

const {
  Component,
  computed,
  on,
  run
} = Ember;

export default Component.extend(WindowResizeMixin, {
  words: Ember.A(),
  classNames: ['letter-by-letter-container'],
  layout: layout,
  visibleWords: Ember.A(),
  visibleWordIndex: 0,

  windowResize: on('windowResize', function() {
    if (this.textHasOverflown()) {
      this.removeWord();
    } else {
      this.addWord();
    }
  }),

  body: computed({
    get() {
      return this.$('div.letter-by-letter');
    }
  }).readOnly(),

  bodyContainer: computed({
    get() {
      return this.$();
    }
  }).readOnly(),

  textHasOverflown() {
    const {
      body,
      bodyContainer
    } = this.getProperties('body', 'bodyContainer');

    return body.height() > bodyContainer.height();
  },

  removeWord() {
    const {
      words,
      visibleWords
    } = this.getProperties('words', 'visibleWords');

    const lastWord = visibleWords.pop();
    this.notifyPropertyChange('visibleWords');

    run.next(() => {
      if (this.textHasOverflown()) {
        this.removeWord();
      }
    })
  },

  addWord() {
    const nextWord = this.get('words').objectAt(this.get('visibleWordIndex'));

    if (nextWord) {
      this.get('visibleWords').pushObject(nextWord);
    } else {
      return this.attrs.pageComplete();
    }

    run.next(() => {
      if (this.textHasOverflown()) {
        this.removeWord();
        this.attrs.pageComplete();
      }
    });
  },

  createBuffer: on('didReceiveAttrs', function() {
    const { text, visibleWordIndex } = this.getProperties('text', 'visibleWordIndex');
    if (!text || visibleWordIndex > 0) { return; }

    this.set('words', Ember.A(text.split(' ')));
    this.addWord();
  }),

  checkPageTurn: on('didReceiveAttrs', function() {
    if (this.get('turnPage')) {
      if (this.get('words.length') <= this.get('visibleWordIndex')) {
        this.attrs.textComplete();
      } else {
        this.attrs.pageTurned();

        Ember.$.Velocity.animate(this.$('.letter-by-letter'), { opacity: 0 }, { duration: 100 }).then(() => {
          this.get('visibleWords').clear();
          Ember.$.Velocity.animate(this.$('.letter-by-letter'), { opacity: 1 }, { duration: 0 });
          this.addWord();
        });
      }
    }
  }),

  actions: {
    incrementCurrentWord() {
      this.incrementProperty('visibleWordIndex');
      this.addWord();
    }
  }
});
