import Ember from 'ember';
import { TextTag } from 'ember-theater/ember-theater/director';

const { set } = Ember;

export default TextTag.extend({
  /**
    Changes to style to object provided.

    @method start
    @param {Object} context
    @param {Number} index
    @param {String} styleString
  */

  start(context, index, styleString) {
    const style = eval(`(${styleString})`);

    set(context, 'textStyle', style);
    context.writeWord(index + 1);

    this.destroy();
  }
});
