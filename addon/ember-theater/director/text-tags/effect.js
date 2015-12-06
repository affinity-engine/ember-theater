import Ember from 'ember';
import { TextTag } from 'ember-theater/ember-theater/director';

const { set } = Ember;

export default TextTag.extend({
  /**
    Changes to text effect to object provided.

    @method start
    @param {Object} context
    @param {Number} index
    @param {String} effectString
  */

  start(context, index, ...args) {
    const effectString = `(${args.join('')})`;
    const effect = eval(effectString);

    set(context, 'textEffect', effect);
    context.writeWord(index + 1);

    this.destroy();
  }
});
