import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  isPresent,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  preloader: service('preloader'),
  stageManager: service('ember-theater/director/stage-manager'),

  perform(resolve, id, effectOrOptions = {}, optionsOnly = {}) {
    const effectIsPresent = typeOf(effectOrOptions) === 'string';
    const options = effectIsPresent ? optionsOnly : effectOrOptions;
    const effect = effectIsPresent ? effectOrOptions : 'play';
    const sound = this.store.peekRecord('ember-theater/sound', id);
    const audioId = get(this, 'preloader').idFor(sound, 'src');

    const properties = {
      autoResolve: get(this, 'autoResolve'),
      audioId,
      effect,
      options,
      layer: get(options, 'layer') || 'theater.backstage.sound'
    };

    get(this, 'stageManager').handleDirectable(id, 'sound', properties, resolve);
  }
});
