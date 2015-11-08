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
    const id = typeOf(characterOrId) === 'object' ? get(characterOrId, 'id') : characterOrId;
    const character = typeOf(characterOrId) !== 'object' ? characterOrId : undefined;
    const effect = isPresent(optionsOnly) ? effectOrOptions : 'transition.fadeIn';
    const options = isPresent(optionsOnly) ? optionsOnly : effectOrOptions;

    setProperties(this, {
      id,
      character,
      effect,
      options
    });
  }
});
