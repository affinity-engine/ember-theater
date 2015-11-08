import Ember from 'ember';
import { Directable } from 'ember-theater';

const {
  isPresent,
  setProperties
} = Ember;

export default Directable.extend({
  componentType: 'ember-theater/director/backdrop',
  layer: 'theater.stage.background.backdrop',

  parseArgs(id, effectOrOptions, optionsOnly) {
    const effect = isPresent(optionsOnly) ? effectOrOptions : 'transition.fadeIn';
    const options = isPresent(optionsOnly) ? optionsOnly : effectOrOptions;

    setProperties(this, {
      id,
      effect,
      options
    });
  }
});
