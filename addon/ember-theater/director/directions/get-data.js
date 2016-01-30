import { Direction } from 'ember-theater/ember-theater/director';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

export default Direction.extend({
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theareId'),

  perform(resolve, key) {
    const value = this.get('saveStateManager').getStateValue(key);

    resolve(value);
  }
});
