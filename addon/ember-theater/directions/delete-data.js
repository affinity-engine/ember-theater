import Ember from 'ember';
import { Direction } from 'ember-theater';

const { inject } = Ember;

export default Direction.extend({
  saveStateManager: inject.service('ember-theater/save-state-manager'),

  perform(resolve, key) {
    this.get('saveStateManager').deleteStateValue(key);

    resolve();
  }
});
