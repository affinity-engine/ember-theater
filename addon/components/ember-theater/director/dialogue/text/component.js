import Ember from 'ember';
import layout from './template';
import WindowResizeMixin from 'ember-theater/mixins/window-resize';
import { keyDown, EKOnInsertMixin } from 'ember-keyboard';
import animate from 'ember-theater/utils/animate';

const wordClass = 'et-text-word';
const letterClass = 'et-text-letter';

const {
  Component,
  computed,
  get,
  isBlank,
  isPresent,
  on,
  set,
  setProperties
} = Ember;

const { String: { htmlSafe } } = Ember;
const { run: { later } } = Ember;

export default Component.extend(EKOnInsertMixin, WindowResizeMixin, {
  activeWordIndex: 0,
  classNames: ['et-dialogue-body-container'],
  layout: layout,

  advanceText: on(keyDown(' '), function() {
    if (get(this, 'pageLoaded')) {
      this.turnPage();
    } else {
      set(this, 'instaWritingPage', true);
    }
  }),

  turnPage() {
    const nextPageFirstWord = this.nextPageFirstWord();

    this.scrollToWord(nextPageFirstWord);

    if (isBlank(nextPageFirstWord)) {
      return this.attrs.completeText();
    } else {
      set(this, 'currentPageFirstWord', nextPageFirstWord);
    }
  },

  nextPageFirstWord() {
    const $words = get(this, '$words');
    const $container = this.$().parent();
    const offsetBottom = $container.offset().top + $container.height();

    return $words.filter(function() {
      // note, jquery `filter` sets `this` to the current item in the array
      return $(this).offset().top >= offsetBottom;
    })[0];
  },

  scrollToFirstWord: on('didInsertElement', function() {
    const $words = get(this, '$words');
    const firstWord = $words.first();

    this.scrollToWord(firstWord);

    set(this, 'currentPageFirstWord', firstWord);
  }),

  windowResize: on('windowResize', function() {
    const currentPageFirstWord = get(this, 'currentPageFirstWord');

    this.scrollToWord(currentPageFirstWord);
  }),

  scrollToWord(word) {
    const $words = get(this, '$words');
    const $container = this.$();
    const $word = this.$(word);
    const scrollTop = $word.offset().top - $container.offset().top + $container.scrollTop();

    $container.scrollTop(scrollTop);

    this.writeWord($words.index($word));
  },

  words: computed('text', {
    get() {
      // the first half the regex matches tags (eg, `<strong>`), while the second half matches and
      // removes all spaces.
      return get(this, 'text').match(/<.*?>|[^<\s]+/g);
    }
  }).readOnly(),

  formattedText: computed('words', {
    get() {
      return htmlSafe(get(this, 'words').map((word) => {
        // test if the word is actually a tag
        return /<.*?./.test(word) ? word : `<span class="${wordClass}">${word}</span>`;
      }).join(' '));
    }
  }).readOnly(),

  $words: computed('formattedText', {
    get() {
      return this.$(`span.${wordClass}`);
    }
  }).readOnly(),

  writeWord(index) {
    const $words = get(this, '$words');
    const $word = $words.eq(index);
    const nextPageFirstWord = this.nextPageFirstWord();

    // stop if the word has already been written
    if ($word.css('opacity') === '1') { return; }

    if ((isBlank(nextPageFirstWord) && index < $words.length) || index < $words.index(nextPageFirstWord)) {
      set(this, 'pageLoaded', false);
    } else {
      // stop if last word in whole dialogue or last word in page
      
      return setProperties(this, {
        instaWritingPage: false,
        pageLoaded: true
      });
    }

    const letters = $word.text().split('');

    $word.css('opacity', 1);

    if (get(this, 'instaWritingPage')) {
      this.writeWord(index + 1);
    } else {
      $word.html(letters.map((letter) => `<span class="${letterClass}">${letter}</span>`).join(''));
      this.writeLetter($word, letters.length, 0, index);
    }
  },

  writeLetter($word, wordLength, characterIndex, wordIndex) {
    const duration = get(this, 'instaWritingPage') ? 0 : get(this, 'textSpeed');
    const $letter = $word.find(`span.${letterClass}:eq(${characterIndex})`);

    animate($letter, {
      opacity: [1, 0],
      translateY: [0, '-0.3vh'],
      translateX: [0, '-0.2vh']
    }, { duration });

    later(() => {
      characterIndex++;

      if (characterIndex < wordLength) {
        this.writeLetter($word, wordLength, characterIndex, wordIndex);
      } else {
        this.writeWord(wordIndex + 1);
      }
    }, duration / 10);
  }
});
