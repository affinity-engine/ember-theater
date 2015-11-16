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
    const effectIsPresent = isPresent(optionsOnly);
    const backdrop = this.store.peekRecord('ember-theater/backdrop', id);

    const properties = {
      id,
      backdrop,
      effect: effectIsPresent ? effectOrOptions : 'transition.fadeIn',
      options: effectIsPresent ? optionsOnly : effectOrOptions
    };

    setProperties(this, properties);
  }
});
