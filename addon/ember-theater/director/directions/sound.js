import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multiton from 'ember-multiton-service';

const {
  get,
  getProperties,
  set,
  typeOf
} = Ember;

export default Direction.extend({
  componentPath: 'ember-theater/director/directable/sound',

  fixtureStore: multiton('ember-theater/fixture-store', 'theaterId'),
  preloader: multiton('ember-theater/preloader', 'theaterId'),
  soundManager: multiton('ember-theater/sound-manager', 'theaterId'),

  _setup(fixtureOrId) {
    this._entryPoint();

    const fixtureStore = get(this, 'fixtureStore');
    const fixture = typeOf(fixtureOrId) === 'object' ? fixtureOrId : fixtureStore.find('sounds', fixtureOrId);
    const audioId = get(this, 'preloader').idFor(fixture, 'src');
    const soundManager = get(this, 'soundManager');
    const soundInstance = soundManager.findOrCreateInstance(audioId);

    set(this, 'attrs.audioId', audioId);
    set(this, 'attrs.soundInstance', soundInstance);

    return this;
  },

  _reset() {
    const attrs = get(this, 'attrs');

    return this._super(getProperties(attrs, 'audioId', 'soundInstance'));
  },

  instance(instanceId) {
    const soundManager = get(this, 'soundManager');
    const audioId = get(this, 'attrs.audioId');
    const soundInstance = soundManager.findOrCreateInstance(audioId, instanceId);

    set(this, 'attrs.soundInstance', soundInstance);
  },

  on(event, callback) {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    soundInstance.on(event, callback);

    return this;
  },

  play() {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    soundInstance.paused = false;
    soundInstance.play();

    return this;
  },

  stop() {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    soundInstance.stop();

    return this;
  },

  pause() {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    soundInstance.paused = true;

    return this;
  },

  unpause() {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    soundInstance.paused = false;

    return this;
  },

  position(position) {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    soundInstance.position = position;

    return this;
  },

  loop(loop = true) {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    soundInstance.loop = loop === true ? -1 : loop;

    return this;
  },

  mute() {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    soundInstance.muted = true;

    return this;
  },

  unmute() {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    soundInstance.muted = false;

    return this;
  },

  volume(volume) {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    this.stopFade(soundInstance);

    soundInstance.volume = volume;

    return this;
  },

  fadeTo(volume, duration, callback = Ember.K) {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    this.stopFade(soundInstance);

    const fromVolume = soundInstance.volume;
    const toVolume = volume;
    const volumeDistance = toVolume - fromVolume;

    const fadeDuration = duration || get(this, 'config.attrs.sound.duration') || 1000;
    const stepSize = volumeDistance / (fadeDuration / 10);

    soundInstance.currentFade = setInterval(() => {
      soundInstance.volume += stepSize;

      if (soundInstance.volume >= 1) {
        this.stopFade(soundInstance);

        return callback();
      }
    }, 10);

    return this;
  },

  fadeIn(volume = 1, duration) {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    soundInstance.volume = 0;

    this.fadeTo(volume, duration);
    this.play();

    return this;
  },

  fadeOut(duration) {
    this._entryPoint();

    this.fadeTo(0, duration, () => {
      this.stop();
    });

    return this;
  },

  stopFade() {
    this._entryPoint();

    const soundInstance = get(this, 'attrs.soundInstance');

    clearInterval(soundInstance.currentFade);

    return this;
  },

  _perform(priorSceneRecord, resolve) {
    this.on('complete', () => {
      resolve();
    });
  }
});
