import Ember from 'ember';

const {
  Component,
  on,
  run
} = Ember;

export default Component.extend({
  setup: on('didInsertElement', function() {
    const line = this.get('line');

    if (line.keyPress) {
      this._setupKeyPressWatcher();
      this.set('pauseKeyPress', line.resolve);
    }

    if (line.duration) {
      run.later(() => {
        line.resolve();
      }, line.duration);
    }
  }),

  teardown: on('willDestroyElement', function() {
    const line = this.get('line');

    Ember.$('body').off('.pause');
    line.resolve();
  }),

  _resolveKeyPress(event) {
    if (event.which === 32 && this.get('pauseKeyPress')) {
      Ember.$('body').off('.pause');
      this.get('pauseKeyPress')();
    }
  },

  _setupKeyPressWatcher() {
    Ember.$('body').on('keypress.pause', (event) => {
      this._resolveKeyPress(event);
    });
  }
});
