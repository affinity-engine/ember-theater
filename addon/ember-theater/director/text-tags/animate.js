import Ember from 'ember';
import { TextTag } from 'ember-theater/ember-theater/director';

const { set } = Ember;

export default TextTag.extend({
  /**
    Changes to animate to object provided.

    @method start
    @param {Object} context
    @param {Number} index
    @param {String} animateString
  */

  start(context, index, animateString) {
    const animate = eval(`(${animateString})`);

    set(context, 'textAnimation', animate);
    context.writeWord(index + 1);

    this.destroy();
  }
});
