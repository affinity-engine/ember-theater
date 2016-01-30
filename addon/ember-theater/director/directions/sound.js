import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  layer: 'meta.sound',

  preloader: service('preloader'),
  fixtureStore: multitonService('ember-theater/fixture-store', 'theaterId'),
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId'),

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
