import Ember from 'ember';
import { TextTag } from 'ember-theater';

const { get } = Ember;

export default TextTag.extend({
  /**
    Clears all the preceding text.

    @method perform
    @param {Object} context
    @param {Number} index
  */

  perform(context, index) {
    const $words = get(context, '$words');
    const nextWord = $words.eq(index + 1);

    $words.each(function(wordIndex) {
      if (wordIndex <= index) {
        context.$(this).empty();
      }
    });

    context.scrollToWord(nextWord);
  }
});
