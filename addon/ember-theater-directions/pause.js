import Ember from 'ember';
import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';

const { run } = Ember;

export default EmberTheaterDirection.extend({
  perform(line) {
    if (line.keyPress) {
      this._setupKeyPressWatcher();
      this.set('pauseKeyPress', line.resolve);
    }

    if (line.duration) {
      run.later(() => {
        line.resolve();
      }, line.duration);
    }
  },

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
