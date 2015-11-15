import Ember from 'ember';
import { TextTag } from 'ember-theater';
import { keyDown } from 'ember-keyboard';

const {
  get,
  getProperties,
  isPresent,
  setProperties
} = Ember;

const { run: { later } } = Ember;

export default TextTag.extend({
  /**
    Pauses the text until one of the component's designated keys is pressed or
    the provided duration elapses. Note that it temporarily disables the component's
    standard keyboard bindings to avoid conflict.

    @method perform
    @param {Object} context
    @param {Number} index
    @param {String} [duration]
  */

  perform(context, index, duration) {
    setProperties(this, { context, index });

    const keys = get(context, 'keys');

    keys.forEach((key) => {
      context.off(keyDown(key), context.advanceText);
      context.on(keyDown(key), this, this._resolve);
    });

    if (isPresent(duration)) {
      later(() => {
        this._resolve();
      }, duration);
    }
  },

  _resolve() {
    const { context, index, isDestroyed } = getProperties(this, 'context', 'index', 'isDestroyed');

    if (isDestroyed) { return; }

    const keys = get(context, 'keys');

    keys.forEach((key) => {
      context.off(keyDown(key), this, this._resolve);
      context.on(keyDown(key), context.advanceText);
    });

    context.writeWord(index + 1);
    this.destroy();
  }
});
