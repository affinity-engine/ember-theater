import Ember from 'ember';
import { Direction } from 'ember-theater';

const {
  get,
  isPresent,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  preloader: service('preloader'),
  stageManager: service('ember-theater/stage-manager'),

  perform(resolve, id, effectOrOptions = {}, optionsOnly = {}) {
    const effectIsPresent = typeOf(effectOrOptions) === 'string';
    const options = effectIsPresent ? optionsOnly : effectOrOptions;
    const effect = effectIsPresent ? effectOrOptions : 'play';
    const sound = this.store.peekRecord('ember-theater/sound', id);
    const audioId = get(this, 'preloader').idFor(sound, 'path');

    const properties = {
      audioId,
      effect,
      options,
      layer: get(options, 'layer') || 'theater.backstage.sound'
    };

    get(this, 'stageManager').handleDirectable(id, 'sound', properties, resolve);
  }
});
