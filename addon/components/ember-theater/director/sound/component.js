import Ember from 'ember';
import DirectableComponentMixin from 'ember-theater/mixins/directable-component';

const {
  Component,
  get,
  getProperties,
  inject,
  isPresent,
  on,
  set
} = Ember;

export default Component.extend(DirectableComponentMixin, {
  store: inject.service(),

  setup: on('didInsertElement', function() {
    const directable = get(this, 'directable');

    const {
      audio,
      effect,
      options
    } = getProperties(directable, 'audio', 'effect', 'options');

    this._bindLoop(audio, options);
    this._bindFadeWith(effect, options);

    audio[effect](...this._buzzOptionsAdapter(options));

    audio.bindOnce(`ended.${this.id}`, () => {
      this.resolveAndDestroy();
    });
  }),

  teardown: on('willDestroyElement', function() {
    const audio = this.get('directable.audio');
    const volume = audio.volume;

    audio.unbind(`ended.${this.id}`);
    audio.fadeOut(1000, () => {
      // it's necessary to manually return to the previous volume, or else subsequent
      // `play`s of the audio file will start at volume 0;

      audio.fadeTo(volume, 0);
      audio.stop();
    });
  }),

  _bindLoop(audio, options) {
    if (isPresent(options) && get(options, 'loop')) {
      audio.loop();
    }
  },

  _bindFadeWith(effect, options) {
    if (effect === 'fadeWith') {
      const audio = get(this, 'directable.fadeWithAudio');

      set(options, 'sound', audio);
    }
  },

  _buzzOptionsAdapter(options) {
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
      return isPresent(get(options, key));
    }).map((key) => {
      return get(options, key);
    });
  }
});
