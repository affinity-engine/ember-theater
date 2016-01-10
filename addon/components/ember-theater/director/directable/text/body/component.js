import Ember from 'ember';
import layout from './template';
import WindowResizeMixin from 'ember-theater/mixins/ember-theater/window-resize';
import {
  keyDown,
  EKMixin,
  EKOnInsertMixin
} from 'ember-keyboard';
import animate from 'ember-theater/utils/ember-theater/animate';

const customTagClass = 'et-text-tag';
const wordClass = 'et-text-word';
const letterClass = 'et-text-letter';

const htmlTagRegex = '<.*?>';
const customTagRegex = '\\(\\([#\\/].*?\\)\\)';

const {
  Component,
  computed,
  get,
  isBlank,
  on,
  set,
  setProperties
} = Ember;

const { String: { htmlSafe } } = Ember;
const { run: { later } } = Ember;
const { or } = computed;

export default Component.extend(EKMixin, EKOnInsertMixin, WindowResizeMixin, {
  activeWordIndex: 0,
  classNames: ['et-text-body-container'],
  layout: layout,

  isInstant: or('instantWritePage', 'instantWriteText'),

  parentElement: computed({
    get() {
      return this.$().parent();
    }
  }).readOnly(),

  words: computed('text', {
    get() {
      // the first part of the regex matches html tags (eg, `<strong>`), the second part et-text-tags,
      // and the last part matches and removes spaces.
      const regex = new RegExp(`${htmlTagRegex}|${customTagRegex}|[^<\\s]+`, 'g');

      return Ember.A(get(this, 'text').match(regex));
    }
  }).readOnly(),

  formattedText: computed('words.[]', {
    get() {
      return htmlSafe(get(this, 'words').map((word) => {
        // test if the word is actually a tag
        return new RegExp(htmlTagRegex).test(word) ? word :
          new RegExp(customTagRegex).test(word) ?
          `<span class="${customTagClass} ${wordClass}" aria-hidden="true">${word}</span>` :
          `<span class="${wordClass}">${word}</span>`;
      }).join(' '));
    }
  }).readOnly(),

  $words: computed('formattedText', {
    get() {
      return this.$(`span.${wordClass}`);
    }
  }).readOnly(),

  advanceText() {
    if (get(this, 'pageLoaded')) {
      this.turnPage();
    } else {
      set(this, 'instantWritePage', true);
    }
  },

  turnPage() {
    const nextPageFirstWord = this.nextPageFirstWord();

    this.scrollToWord(nextPageFirstWord);

    if (isBlank(nextPageFirstWord)) {
      this.resolve();
    } else {
      set(this, 'currentPageFirstWord', nextPageFirstWord);
    }
  },

  resolve() {
    this.attrs.resolve();
  },

  nextPageFirstWord() {
    const $words = get(this, '$words');
    const $container = this.$().parent();
    const offsetBottom = $container.offset().top + $container.height();

    return $words.filter(function() {
      // note, jquery `filter` sets `this` to the current item in the array
      return Ember.$(this).offset().top >= offsetBottom;
    })[0];
  },

  setupKeyHandlers: on('didReceiveAttrs', function() {
    const keys = get(this, 'keys');

    keys.forEach((key) => {
      this.on(keyDown(key), this.advanceText);
    });
  }),

  scrollToFirstWord: on('didRender', function() {
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

  writeWord(index) {
    const $words = get(this, '$words');
    const $word = $words.eq(index);
    const nextPageFirstWord = this.nextPageFirstWord();

    // stop if the word has already been written
    if ($word.css('opacity') === '1') { return; }

    if ((isBlank(nextPageFirstWord) && index < $words.length) || index < $words.index(nextPageFirstWord)) {
      set(this, 'pageLoaded', false);
    } else if (!get(this, 'instantWriteText')) {
      setProperties(this, {
        instantWritePage: false,
        pageLoaded: true
      });

      // stop if past the last word in whole text or the last word on the current page
      return;
    } else if (index >= $words.length) {
      set(this, 'pageLoaded', true);

      return;
    }

    if ($word.hasClass(customTagClass)) {
      this.executeCustomTag($word.text(), index);
    } else if (get(this, 'isInstant')) {
      this.writeWord(index + 1);
    } else {
      const letters = $word.text().split('');

      $word.html(letters.map((letter) => `<span class="${letterClass}">${letter}</span>`).join(''));
      this.writeLetter($word, letters.length, 0, index);
    }

    $word.css('opacity', 1);
  },

  writeLetter($word, wordLength, characterIndex, wordIndex) {
    if (get(this, 'isInstant')) {
      const text = $word.text().trim();

      $word.html(text);
    }

    const duration = 1000 / get(this, 'textSpeed');
    const style = get(this, 'textStyle');
    const $letter = $word.find(`span.${letterClass}:eq(${characterIndex})`);

    $letter.css({ opacity: 1 });
    animate($letter, style, { duration: 0 });
    animate($letter, 'reverse', { duration: duration * 4 });

    later(() => {
      if (characterIndex + 1 < wordLength) {
        this.writeLetter($word, wordLength, characterIndex + 1, wordIndex);
      } else {
        this.writeWord(wordIndex + 1);
      }
    }, duration);
  },

  executeCustomTag(text, index) {
    const [, openingOrClosing, content] = text.match(/\(\((#|\/)(.*?)\)\)/);
    const args = content.split(' ');
    const tagName = args.shift();
    const tag = this[tagName].create();
    const method = openingOrClosing === '#' ? 'start' : 'stop';

    tag[method](this, index, ...args.join(' ').split('|'));
  }
});
