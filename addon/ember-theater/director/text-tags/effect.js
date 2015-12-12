import Ember from 'ember';
import { TextTag } from 'ember-theater/ember-theater/director';
import animate from 'ember-theater/utils/animate';

const { get } = Ember;

export default TextTag.extend({
  /**
    Changes to text effect to object provided.

    @method start
    @param {Object} context
    @param {Number} index
    @param {String,Object} effectString
    @param {Object} optionsString
  */

  start(context, index, effectString, optionsString) {
    const effect = eval(`(${effectString})`);
    const options = eval(`(${optionsString})`);
    const element = get(context, 'parentElement');

    animate(element, effect, options);

    context.writeWord(index + 1);

    this.destroy();
  }
});
