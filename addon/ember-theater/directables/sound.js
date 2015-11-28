import Ember from 'ember';
import { Direction } from 'ember-theater';

const {
  get,
  isPresent,
  setProperties,
  typeOf
} = Ember;

export default Direction.extend({
  componentType: 'ember-theater/director/sound',
  layer: 'theater.backstage.sound',

  parseArgs(id, effectOrOptions, optionsOnly) {
    const effectIsPresent = typeOf(effectOrOptions) === 'string';
    const options = Ember.Object.create(effectIsPresent ? optionsOnly : effectOrOptions);
    const effect = effectIsPresent ?
      effectOrOptions :
      isPresent(get(options, 'fadeWith')) ? 'fadeWith' : 'play';
    const audio = this.store.peekRecord('ember-theater/sound', id).audio;

    const fadeWithId = get(options, 'fadeWith');
    const fadeWithAudio = isPresent(fadeWithAudio) ?
      this.store.peekRecord('ember-theater/sound', id).audio :
      undefined;

    const properties = {
      audio,
      effect,
      fadeWithAudio,
      options
    };

    setProperties(this, properties);
  }
});
