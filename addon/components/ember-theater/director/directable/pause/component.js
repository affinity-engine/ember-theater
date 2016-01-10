import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/ember-theater/director/directable-component';
import {
  EKMixin,
  EKOnInsertMixin,
  keyUp
} from 'ember-keyboard';

const {
  Component,
  get,
  getProperties,
  isPresent,
  on,
  run
} = Ember;

export default Component.extend(DirectableComponentMixin, EKMixin, EKOnInsertMixin, {
  handleautoResolve: on('didInitAttrs', function() {
    if (get(this, 'autoResolve')) {
      this._resolve();
    }
  }),

  setup: on('didInsertElement', function() {
    const directable = get(this, 'directable');
    const {
      duration,
      keys
    } = getProperties(directable, 'duration', 'keys');

    if (isPresent(keys)) {
      this._setupKeyPressWatcher(keys);
    }

    if (isPresent(duration)) {
      run.later(() => {
        this._resolve();
      }, duration);
    }
  }),

  _teardown: on('willDestroyElement', function() {
    this._resolve();
  }),

  _resolve() {
    get(this, 'directable.resolve')();
  },

  _setupKeyPressWatcher(keys) {
    keys.forEach((key) => {
      this.on(keyUp(key), this._resolve);
    });
  }
});
