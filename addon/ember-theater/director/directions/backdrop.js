import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get,
  isPresent
} = Ember;

export default Direction.extend({
  layer: 'theater.stage.background.backdrop',

  fixtureStore: multitonService('ember-theater/fixture-store', 'theaterId'),
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId'),

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
