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
