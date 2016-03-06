import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  set
} = Ember;

export default Direction.extend({
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),

  setup(key) {
    this._entryPoint();

    set(this, 'attrs.key', key);

    return this;
  },

  _perform(meta, resolve) {
    const key = get(this, 'attrs.key');

    get(this, 'saveStateManager').deleteStateValue(key);

    resolve();
  }
});
