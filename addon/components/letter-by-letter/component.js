import Ember from 'ember';
import layout from './template';
import WindowResizeMixin from 'ember-theater/mixins/window-resize';

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
  visibleWordIndex: -1,

  addWord() {
    this.incrementProperty('visibleWordIndex');
    const nextWord = this.get('words').objectAt(this.get('visibleWordIndex'));

    if (nextWord) {
      this.get('visibleWords').pushObject(nextWord);
    } else {
      return this.attrs.completePage();
    }

    run.next(() => {
      if (this.textHasOverflown()) {
        this.removeWord();
        this.attrs.completePage();
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

  createBuffer: on('didReceiveAttrs', function() {
    const { text, visibleWordIndex } = this.getProperties('text', 'visibleWordIndex');
    if (!text || visibleWordIndex > -1) { return; }

    this.get('visibleWords').clear();
    this.set('words', Ember.A(text.split(' ')));
    this.addWord();
  }),

  checkPageTurn: on('didReceiveAttrs', function() {
    if (this.get('triggerPageTurn')) {
      if (this.get('words.length') <= this.get('visibleWordIndex')) {
        this.attrs.completeText();
      } else {
        this.attrs.turnPage();

        Ember.$.Velocity.animate(this.$('.letter-by-letter'), { opacity: 0 }, { duration: 100 }).then(() => {
          this.get('visibleWords').clear();
          Ember.$.Velocity.animate(this.$('.letter-by-letter'), { opacity: 1 }, { duration: 0 });
          this.addWord();
        });
      }
    }
  }),

  handleWindowResize() {
    if (!this.get('pageCompleted')) { return; }

    run.next(() => {
      if (this.textHasOverflown()) {
        this.removeWord();
      } else {
        this.addWord();
      }
    });
  },

  removeWord() {
    this.get('visibleWords').pop();
    this.decrementProperty('visibleWordIndex');
    this.notifyPropertyChange('visibleWords');

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
    incrementCurrentWord() {
      this.addWord();
    }
  }
});
