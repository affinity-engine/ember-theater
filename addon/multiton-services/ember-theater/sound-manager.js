import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  get,
  merge
} = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  config: multitonService('ember-theater/config', 'theaterId'),

  createInstance(id) {
    return createjs.Sound.createInstance(id);
  },

  on(instance, event, callback) {
    instance.on(event, callback);
  },

  play(instance, options) {
    instance.paused = false;
    instance.play();

    this.loop(instance, options);
  },

  stop(instance) {
    instance.stop();
  },

  pause(instance) {
    instance.paused = true;
  },

  unpause(instance) {
    instance.paused = false;
  },

  position(instance, options) {
    instance.position = get(options, 'position');
  },

  loop(instance, options) {
    const loop = get(options, 'loop') === true ? -1 : get(options, 'loop');

    instance.loop = loop;
  },

  mute(instance) {
    instance.muted = true;
  },

  unmute(instance) {
    instance.muted = false;
  },

  volume(instance, options) {
    this.stopFade(instance);

    instance.volume = get(options, 'volume');
  },

  fadeTo(instance, options, callback = Ember.K) {
    this.stopFade(instance);

    const fromVolume = instance.volume;
    const toVolume = get(options, 'volume');
    const volumeDistance = toVolume - fromVolume;

    const duration = get(options, 'duration') || get(this, 'config.attrs.sound.duration') || 1000;
    const stepSize = volumeDistance / (duration / 10);

    instance.currentFade = setInterval(() => {
      instance.volume += stepSize;

      if (instance.volume >= 1) {
        this.stopFade(instance);

        return callback();
      }
    }, 10);
  },

  fadeIn(instance, options = {}) {
    instance.volume = 0;

    merge(options, { volume: get(options, 'volume') || 1 });

    this.fadeTo(instance, options);
    this.play(instance, options);
  },

  fadeOut(instance, options = {}) {
    merge(options, { volume: 0 });

    this.fadeTo(instance, options, () => {
      this.stop(instance);
    });
  },

  stopFade(instance) {
    clearInterval(instance.currentFade);
  }
});
