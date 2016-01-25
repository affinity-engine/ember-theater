import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

const {
  get,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  layer: 'meta.sound',

  preloader: service('preloader'),
  fixtureStores: service('ember-theater/fixture-store'),
  stageManagers: service('ember-theater/director/stage-manager'),

  fixtureStore: multiService('fixtureStores', 'theaterId'),
  stageManager: multiService('stageManagers', 'theaterId'),

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
