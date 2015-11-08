import Ember from 'ember';
import { Directable } from 'ember-theater';

const { setProperties } = Ember;

export default Directable.extend({
  componentType: 'ember-theater/director/dialogue',
  layer: 'theater.text.dialogue',

  parseArgs(character, text, options) {
    setProperties(this, {
      character,
      text,
      options
    });
  }
});
