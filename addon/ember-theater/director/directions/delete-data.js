import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

const { inject } = Ember;

export default Direction.extend({
  saveStateManagers: inject.service('ember-theater/save-state-manager'),

  saveStateManager: multiService('saveStateManagers', 'theareId'),

  perform(resolve, key) {
    this.get('saveStateManager').deleteStateValue(key);

    resolve();
  }
});
