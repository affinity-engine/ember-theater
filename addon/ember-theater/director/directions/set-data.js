import Ember from 'ember';
import { Direction } from 'ember-theater/ember-theater/director';

const { inject } = Ember;

export default Direction.extend({
  saveStateManager: inject.service('ember-theater/save-state-manager'),

  perform(resolve, key, value) {
    this.get('saveStateManager').setStateValue(key, value);

    resolve();
  }
});
