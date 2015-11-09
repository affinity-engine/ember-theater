import Ember from 'ember';
import { Directable } from 'ember-theater';

const {
  get,
  isPresent,
  setProperties,
  typeOf
} = Ember;

export default Directable.extend({
  componentType: 'ember-theater/director/dialogue',
  layer: 'theater.text.dialogue',

  parseArgs(characterOrText, textOrOptions, optionsOnly) {
    let character, text, options;

    // 10 megabucks to anyone who can devise a cleaner approach to this
    // Note that character and text can come as either strings or objects
    if (isPresent(optionsOnly)) {
      character = characterOrText;
      text = textOrOptions;
      options = optionsOnly;
    } else if (isPresent(textOrOptions)) {
      if (typeOf(textOrOptions) === 'string' || (typeOf(textOrOptions) === 'object' && isPresent(get(textOrOptions, 'id')))) {
        character = characterOrText;
        text = textOrOptions;
      } else {
        text = characterOrText;
        options = textOrOptions;
      }
    } else {
      text = characterOrText;
    }

    setProperties(this, {
      character,
      text,
      options
    });
  }
});
