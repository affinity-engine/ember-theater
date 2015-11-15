import Ember from 'ember';
import { TextTag } from 'ember-theater';

const {
  get,
  set
} = Ember;

export default TextTag.extend({
  /**
    Changes the textSpeed. If the provided speed starts with a '*', it'll multiply the speed by the
    following number. Note that lower numbers are faster, so multiply by a fraction (eg, `0.5`) to
    make the text go faster.

    @method perform
    @param {Object} context
    @param {Number} index
    @param {String} speed
  */

  perform(context, index, speed) {
    if (speed.charAt(0) === '*') {
      speed = parseInt(get(context, 'textSpeed'), 10) * parseFloat(speed.substring(1), 10);
    }

    set(context, 'textSpeed', speed);
    context.writeWord(index + 1);
  }
});
