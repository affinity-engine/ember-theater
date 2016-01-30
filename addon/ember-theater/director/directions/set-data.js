import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

export default Direction.extend({
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theareId'),

  perform(resolve, key, value) {
    this.get('saveStateManager').setStateValue(key, value);

    resolve();
  }
});
