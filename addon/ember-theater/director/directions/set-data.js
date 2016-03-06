import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  getProperties,
  set
} = Ember;

export default Direction.extend({
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),

  setup(key, value) {
    this._entryPoint();

    set(this, 'attrs.key', key);
    set(this, 'attrs.value', value);

    return this;
  },

  _perform(meta, resolve) {
    const attrs = get(this, 'attrs');
    const {
      key,
      value
    } = getProperties(attrs, 'key', 'value');

    get(this, 'saveStateManager').setStateValue(key, value);

    resolve();
  }
});
