import Ember from 'ember';
import { Directable } from 'ember-theater';

const {
  isPresent,
  setProperties,
  typeOf
} = Ember;

export default Directable.extend({
  componentType: 'ember-theater/director/choice',
  layer: 'theater.text.choice',

  parseArgs(headerOrChoices, choicesOrOptions, optionsOnly) {
    const header = typeOf(headerOrChoices) === 'string' ? headerOrChoices : undefined;
    const choices = typeOf(headerOrChoices) === 'string' ? choicesOrOptions : headerOrChoices;
    const options = isPresent(optionsOnly) ? optionsOnly : isPresent(header) ? undefined : choicesOrOptions;

    setProperties(this, {
      choices,
      header,
      options
    });
  }
});
