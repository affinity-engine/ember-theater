import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

const {
  get,
  isPresent
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  layer: 'theater.stage.background.backdrop',

  fixtureStores: service('ember-theater/fixture-store'),
  stageManagers: service('ember-theater/director/stage-manager'),

  fixtureStore: multiService('fixtureStores', 'theaterId'),
  stageManager: multiService('stageManagers', 'theaterId'),

  perform(resolve, id, effectOrOptions, optionsOnly) {
    const effectIsPresent = isPresent(optionsOnly);

    const backdrop = get(this, 'fixtureStore').find('backdrops', id);
    const effect = effectIsPresent ? effectOrOptions : 'transition.fadeIn';
    const options = effectIsPresent ? optionsOnly || {} : effectOrOptions || {};
    const layer = get(options, 'layer') || get(this, 'layer');
    const autoResolve = get(this, 'autoResolve');

    const properties = {
      autoResolve,
      backdrop,
      effect,
      id,
      layer,
      options
    };

    get(this, 'stageManager').handleDirectable(id, 'backdrop', properties, resolve);
  }
});
