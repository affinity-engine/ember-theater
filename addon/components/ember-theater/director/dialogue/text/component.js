import Ember from 'ember';
import layout from './template';
import WindowResizeMixin from 'ember-theater/mixins/window-resize';
import { keyDown, EKOnInsertMixin } from 'ember-keyboard';
import animate from 'ember-theater/utils/animate';

const {
  Component,
  computed,
  on,
  run
} = Ember;

export default Component.extend(EKOnInsertMixin, WindowResizeMixin, {
  activeWordIndex: 0,
  classNames: ['et-dialogue-body'],
  layout: layout,
  visibleWords: computed(() => Ember.A()),
  words: computed(() => Ember.A()),

  advanceText: on(keyDown(' '), 'Enter', function() {
    if (this.get('pageComplete')) {
      this.setProperties({
        pageComplete: false,
        wordByWord: false
      });

      if (this.get('words.length') === 0) {
        this.attrs.completeText();
      } else {
        animate(this.$('.letter-by-letter'), { opacity: 0 }, { duration: 100 }).then(() => {
          this.get('visibleWords').clear();
          animate(this.$('.letter-by-letter'), { opacity: 1 }, { duration: 0 });
          this.set('activeWordIndex', 0);
          this.addWord();
        });
      }
    } else {
      this.setProperties({
        pageComplete: true,
        wordByWord: true
      });
    }
  }),

  addWord() {
    const nextWord = this.get('words').shift();

    if (nextWord) {
      this.get('visibleWords').pushObject(nextWord);
    }

    run.next(() => {
      if (this.textHasOverflown()) {
        this.removeWord();
      } else if (nextWord) {
        this.addWord();
      }
    });
  },

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

  createBuffer: on('didInitAttrs', function() {
    const text = this.get('text');
    if (!text || this.get('words.length') > 0 || this.get('visibleWords.length') > 0) { return; }

    this.get('visibleWords').clear();
    this.set('words', Ember.A(text.split(' ')));
    this.addWord();
  }),

  handleWindowResize() {
    if (!this.get('pageComplete')) { return; }

    run.next(() => {
      if (this.textHasOverflown()) {
        this.removeWord();
      } else {
        this.addWord();
      }
    });
  },

  removeWord() {
    const word = this.get('visibleWords').popObject();
    this.get('words').unshiftObject(word);

    run.next(() => {
      if (this.textHasOverflown()) {
        this.removeWord();
      }
    });
  },

  textHasOverflown() {
    const {
      body,
      bodyContainer
    } = this.getProperties('body', 'bodyContainer');

    return body.height() > bodyContainer.height();
  },

  windowResize: on('windowResize', function() {
    run.debounce(this, this.handleWindowResize, 100);
  }),

  actions: {
    textComplete() {
      this.set('pageComplete', true);
    }
  }
});
