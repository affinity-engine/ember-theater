import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  guidFor,
  isPresent,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  stageManager: service('ember-theater/director/stage-manager'),

  perform(resolve, characterOrText, textOrOptions = {}, optionsOnly = {}) {
    const characterIsPresent = typeOf(textOrOptions) === 'string' ||
      isPresent(get(textOrOptions, 'id')) ||
      isPresent(get(textOrOptions, 'text'));

    const character = characterIsPresent ?
      this.store.peekRecord('ember-theater/character', characterOrText) :
      null;

    const options = characterIsPresent ? optionsOnly : textOrOptions;

    const properties = {
      autoResolve: get(this, 'autoResolve'),
      character,
      options,
      text: characterIsPresent ? textOrOptions : characterOrText,
      layer: get(options, 'layer') || 'theater.prompt.text'
    };

    get(this, 'stageManager').handleDirectable(guidFor(this), 'text', properties, resolve);
  }
});
