import Ember from 'ember';
import { TextTag } from 'ember-theater';

const { run: { later } } = Ember;

export default TextTag.extend({
  /**
    Calls the resolve action on the text component, typically closing it. Will
    trigger immediately, unless provided a duration.

    @method perform
    @param {Object} context
    @param {Number} index
    @param {String} [duration]
  */

  perform(context, index, duration) {
    later(() => {
      context.resolve();
    }, duration || 0);
  }
});
