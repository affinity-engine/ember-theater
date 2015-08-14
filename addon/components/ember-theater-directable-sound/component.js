import Ember from 'ember';

const {
  Component,
  computed,
  inject,
  on
} = Ember;

export default Component.extend({
  store: inject.service(),

  audio: computed('line', {
    get() {
      const line = this.get('line');

      return this.get('store').peekRecord('ember-theater-sound', line.id).audio;
    }
  }).readOnly(),

  setup: on('didInsertElement', function() {
    const line = this.get('line');
    const audio = this.get('audio');
    const effect = line.effect ? line.effect : 'play';

    if (line.loop) { audio.loop(); }
    if (effect === 'fadeWith') {
      const fadeAudio = this.get('store').peekRecord('ember-theater-sound', line.options.id).audio;
      line.options.sound = fadeAudio;
    } 

    audio[effect](...this._buzzOptionsAdapter(line.options));

    audio.bindOnce(`ended.${this.id}`, () => {
      line.resolve();
    });
  }),

  teardown: on('willDestroyElement', function() {
    const audio = this.get('audio');

    audio.unbind(`ended.${this.id}`);
    audio.fadeOut();
  }),

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
