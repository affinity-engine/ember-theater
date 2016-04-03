import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  getProperties,
  isPresent,
  set,
  setProperties
} = Ember;

export default Direction.extend({
  setup(min = 0, max = 1) {
    this._entryPoint();

    const attrs = get(this, 'attrs');

    setProperties(attrs, {
      min,
      max
    });

    return this;
  },

  int(int = true) {
    set(this, 'attrs.int', true);

    return this;
  },

  _perform(priorSceneRecord, resolve) {
    if (isPresent(priorSceneRecord)) {
      set(this, 'result', priorSceneRecord);
    } else {
      this._generateRandomNumber();
    }

    resolve(this);
  },

  _generateRandomNumber() {
    const attrs = get(this, 'attrs');
    const {
      int,
      max,
      min
    } = getProperties(attrs, 'int', 'max', 'min');

    const number = int ? this._generateInt(min, max) : this._generateFloat(min, max);

    set(this, 'result', number);
  },

  _generateInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  _generateFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
});
