import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const {
  get,
  isPresent,
  typeOf
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  layer: 'theater.prompt.text',

  fixtureStore: service('ember-theater/fixture-store'),
  stageManager: service('ember-theater/director/stage-manager'),

  perform(resolve, characterOrText, textOrOptions = {}, optionsOnly = {}) {
    const characterIsPresent = typeOf(textOrOptions) === 'string' ||
      isPresent(get(textOrOptions, 'id')) ||
      isPresent(get(textOrOptions, 'text'));

    const text = characterIsPresent ? textOrOptions : characterOrText;
    const character = characterIsPresent ?
      get(this, 'fixtureStore').find('characters', characterOrText) :
      null;

    const options = characterIsPresent ? optionsOnly : textOrOptions;
    const layer = get(options, 'layer') || get(this, 'layer');
    const autoResolve = get(this, 'autoResolve');
    const autoResolveResult = get(this, 'autoResolveResult');

    const properties = {
      autoResolve,
      autoResolveResult,
      character,
      layer,
      options,
      text
    };

    get(this, 'stageManager').handleDirectable(null, 'text', properties, resolve);
  }
});
