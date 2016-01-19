import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  layer: 'meta.sound',

  preloader: service('preloader'),
  fixtureStore: service('ember-theater/fixture-store'),
  stageManager: service('ember-theater/director/stage-manager'),

  perform(resolve, id, effectOrOptions = {}, optionsOnly = {}) {
    const effectIsPresent = typeOf(effectOrOptions) === 'string';
    const options = effectIsPresent ? optionsOnly : effectOrOptions;
    const effect = effectIsPresent ? effectOrOptions : 'play';
    const sound = get(this, 'fixtureStore').find('sounds', id);
    const audioId = get(this, 'preloader').idFor(sound, 'src');
    const layer = get(options, 'layer') || get(this, 'layer');
    const autoResolve = get(this, 'autoResolve');

    const properties = {
      autoResolve,
      audioId,
      effect,
      options,
      layer
    };

    get(this, 'stageManager').handleDirectable(id, 'sound', properties, resolve);
  }
});
