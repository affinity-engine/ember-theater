import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const { inject } = Ember;

export default Direction.extend({
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theareId'),

  perform(resolve, key) {
    this.get('saveStateManager').deleteStateValue(key);

    resolve();
  }
});
