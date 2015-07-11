import Ember from 'ember';
import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';

const { run } = Ember;

export default EmberTheaterDirection.create({
  // `keyPress` is not recognized on this component, so we need to set it up manually on the body.
  resolveKeyPress(event) {
    if (event.which === 32 && this.get('pauseKeyPress')) {
      Ember.$('body').off('.pause');
      this.get('pauseKeyPress')();
    }
  },

  setupKeyPressWatcher() {
    Ember.$('body').on('keypress.pause', (event) => {
      this.resolveKeyPress(event);
    });
  },

  perform(line) {
    if (line.keyPress) {
      this.setupKeyPressWatcher();
      this.set('pauseKeyPress', line.resolve);
    }
    if (line.duration) {
      run.later(() => {
        line.resolve();
      }, line.duration);
    }
  }
});
