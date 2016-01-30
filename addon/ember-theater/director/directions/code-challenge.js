import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  get
} = Ember;

export default Direction.extend({
  layer: 'theater.prompt.code-challenge',

  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId'),

  perform(resolve, snippets, options = {}) {
    const layer = get(options, 'layer') || get(this, 'layer');
    const autoResolve = get(this, 'autoResolve');
    const autoResolveResult = get(this, 'autoResolveResult');

    const properties = {
      autoResolve,
      autoResolveResult,
      snippets,
      layer,
      options
    };

    get(this, 'stageManager').handleDirectable(null, 'code-challenge', properties, resolve);
  }
});
