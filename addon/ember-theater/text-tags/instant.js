import Ember from 'ember';
import { TextTag } from 'ember-theater';

const { set } = Ember;

export default TextTag.extend({
  /**
    Provide a description of what your text tag does.

    @method perform
    @param {Object} context
    @param {Number} index
    @param {Boolean} isClosingTag
  */

  perform(context, index, isClosingTag) {
    if (isClosingTag) {
      set(context, 'instantWriteText', false);
    } else {
      set(context, 'instantWriteText', true);
    }

    context.writeWord(index + 1);

    this.destroy();
  }
});
