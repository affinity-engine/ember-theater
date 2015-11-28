import Ember from 'ember';
import { Direction } from 'ember-theater';

const {
  get,
  isPresent,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  stageManager: service('ember-theater/stage-manager'),

  perform(resolve, id, effectOrOptions, optionsOnly) {
    const effectIsPresent = typeOf(effectOrOptions) === 'string';
    const options = Ember.Object.create(effectIsPresent ? optionsOnly : effectOrOptions);
    const effect = effectIsPresent ?
      effectOrOptions :
      isPresent(get(options, 'fadeWith')) ? 'fadeWith' : 'play';
    const audio = this.store.peekRecord('ember-theater/sound', id).audio;

    const fadeWithId = get(options, 'fadeWith');
    const fadeWithAudio = isPresent(fadeWithAudio) ?
      this.store.peekRecord('ember-theater/sound', fadeWithId).audio :
      undefined;

    const properties = {
      audio,
      effect,
      fadeWithAudio,
      options,
      layer: get(options, 'layer') || 'theater.backstage.sound'
    };

    get(this, 'stageManager').handleDirectable(id, 'sound', properties, resolve);
  }
});
