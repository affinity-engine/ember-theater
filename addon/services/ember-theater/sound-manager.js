import Ember from 'ember';

const {
  Service,
  get,
  merge
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  config: service('ember-theater/config'),

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

    const duration = get(options, 'duration') || get(this, 'config.sound.duration') || 1000;
    const stepSize = volumeDistance / (duration / 10);

    instance.currentFade = setInterval(() => {
      instance.volume += stepSize;

      if (instance.volume >= 1) {
        this.stopFade(instance);

        callback();
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
