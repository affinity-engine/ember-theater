import Ember from 'ember';
import { Direction } from 'ember-theater';

const {
  get,
  isPresent
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  stageManager: service('ember-theater/stage-manager'),

  perform(resolve, id, effectOrOptions, optionsOnly) {
    const effectIsPresent = isPresent(optionsOnly);
    const backdrop = this.store.peekRecord('ember-theater/backdrop', id);
    const options = effectIsPresent ? optionsOnly || {} : effectOrOptions || {};

    const properties = {
      id,
      backdrop,
      options,
      effect: effectIsPresent ? effectOrOptions : 'transition.fadeIn',
      layer: get(options, 'layer') || 'theater.stage.background.backdrop'
    };

    get(this, 'stageManager').handleDirectable(id, 'backdrop', properties, resolve);
  }
});
