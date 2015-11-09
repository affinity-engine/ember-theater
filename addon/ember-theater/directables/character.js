import Ember from 'ember';
import { Directable } from 'ember-theater';

const {
  isPresent,
  setProperties,
  typeOf
} = Ember;

export default Directable.extend({
  componentType: 'ember-theater/director/character',
  layer: 'theater.stage.foreground.character',

  parseArgs(characterOrId, effectOrOptions, optionsOnly) {
    const characterIsPresent = typeOf(characterOrId) === 'object';
    const effectIsPresent = isPresent(optionsOnly);

    const properties = {
      id: characterIsPresent ? get(characterOrId, 'id') : characterOrId,
      character: characterIsPresent ? characterOrId : undefined,
      effect: effectIsPresent ? effectOrOptions : 'transition.fadeIn',
      options: effectIsPresent ? optionsOnly : effectOrOptions
    }

    setProperties(this, properties);
  }
});
