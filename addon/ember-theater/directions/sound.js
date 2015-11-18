import Ember from 'ember';
import { Direction } from 'ember-theater';

const {
  get,
  isPresent,
  set,
  typeOf
} = Ember;

export default Direction.extend({
  perform(resolve, id, effectOrOptions, optionsOnly) {
    const effectIsPresent = typeOf(effectOrOptions) === 'string';
    const options = Ember.Object.create(effectIsPresent ? optionsOnly : effectOrOptions);
    const effect = effectIsPresent ?
      effectOrOptions :
      isPresent(get(options, 'fadeWith')) ? 'fadeWith' : 'play';
    const audio = this.store.peekRecord('ember-theater/sound', id).audio;

    this._bindLoop(audio, options);
    this._bindFadeWith(effect, options);

    audio[effect](...this._buzzOptionsAdapter(options));

    audio.bindOnce(`ended.${this.id}`, () => {
      resolve();
    });
  },

  _bindLoop(audio, options) {
    if (isPresent(options) && get(options, 'loop')) {
      audio.loop();
    }
  },

  _bindFadeWith(effect, options) {
    if (effect === 'fadeWith') {
      const id = get(options, 'fadeWith');
      const audio = this.store.peekRecord('ember-theater/sound', id).audio;

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
