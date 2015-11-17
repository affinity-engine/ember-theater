import Ember from 'ember';
import { TextTag } from 'ember-theater';

const { set } = Ember;

export default TextTag.extend({
  /**
    Instantly displays the text between this start and the stop.

    @method start
    @param {Object} context
    @param {Number} index
  */

  start(context, index) {
    set(context, 'instantWriteText', true);

    this.complete(context, index);
  },

  /**
    Returns text to normal speed.

    @method stop
    @param {Object} context
    @param {Number} index
  */

  stop(context, index) {
    set(context, 'instantWriteText', false);

    this.complete(context, index);
  },

  complete(context, index) {
    context.writeWord(index + 1);
    this.destroy();
  }
});
