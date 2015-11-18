import Ember from 'ember';
import { Directable } from 'ember-theater';

const {
  get,
  isPresent,
  setProperties,
  typeOf
} = Ember;

export default Directable.extend({
  componentType: 'ember-theater/director/text',
  layer: 'theater.prompt.text',

  parseArgs(characterOrText, textOrOptions = {}, optionsOnly = {}) {
    const characterIsPresent = typeOf(textOrOptions) === 'string' ||
      isPresent(get(textOrOptions, 'id')) ||
      isPresent(get(textOrOptions, 'text'));

    const character = characterIsPresent ?
      this.store.peekRecord('ember-theater/character', characterOrText) :
      null;

    const properties = {
      character,
      text: characterIsPresent ? textOrOptions : characterOrText,
      options: characterIsPresent ? optionsOnly : textOrOptions
    };

    setProperties(this, properties);
  }
});
