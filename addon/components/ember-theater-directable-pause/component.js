import Ember from 'ember';
import DirectableComponentMixin from '../../mixins/directable-component';

const {
  Component,
  inject,
  on,
  run
} = Ember;

export default Component.extend(DirectableComponentMixin, {
  keyboard: inject.service(),

  setup: on('didInsertElement', function() {
    const line = this.get('line');

    if (line.key) {
      this._setupKeyPressWatcher();
    }

    if (line.duration) {
      run.later(() => {
        this._resolve();
      }, line.duration);
    }
  }),

  teardown: on('willDestroyElement', function() {
    this._resolve();
  }),

  _resolve() {
    this._unbindKey();
    this.get('line.resolve')();
  },

  _setupKeyPressWatcher() {
    const key = this.get('line.key');

    this.get('keyboard').listenFor(key, this, '_resolve');
  },

  _unbindKey() {
    const key = this.get('line.key');

    if (key) {
      this.get('keyboard').stopListeningFor(key, this, '_resolve');
    }
  }
});