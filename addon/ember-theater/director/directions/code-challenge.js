import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

const {
  get
} = Ember;

const { inject: { service } } = Ember;

export default Direction.extend({
  layer: 'theater.prompt.code-challenge',

  stageManagers: service('ember-theater/director/stage-manager'),

  stageManager: multiService('stageManagers'),

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
