import Ember from 'ember';
import EmberTheaterDirection from 'ember-theater/models/ember-theater-direction';

const { inject } = Ember;

export default EmberTheaterDirection.extend({
  store: inject.service(),

  perform(line) {
    const audio = this.get('store').peekRecord('ember-theater-sound', line.id).audio;
    const effect = line.effect ? line.effect : 'play';

    if (line.loop) { audio.loop(); }
    if (effect === 'fadeWith') {
      const fadeAudio = this.get('store').peekRecord('ember-theater-sound', line.options.id).audio;
      line.options.sound = fadeAudio;
    } 

    audio[effect](...this._buzzOptionsAdapter(line.options));

    line.resolve();
  },

  _buzzOptionsAdapter(options) {
    if (!options) { return []; }
    return [
      'sound',
      'volume',
      'duration',
      'seconds',
      'percent',
      'speed',
      'property',
      'value',
      'event',
      'callback'
    ].filter((key) => {
      return options[key] !== undefined;
    }).map((key) => {
      return options[key];
    });
  }
});
