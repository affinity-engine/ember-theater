import Ember from 'ember';
import { Direction } from 'ember-theater';

const { inject } = Ember;

export default Direction.extend({
  emberTheaterSaveStateManager: inject.service(),

  perform(resolve, key) {
    const value = this.get('emberTheaterSaveStateManager').getStateValue(key);

    resolve(value);
  }
});
