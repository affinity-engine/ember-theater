import Ember from 'ember';
import { Direction } from 'ember-theater';

const { inject } = Ember;

export default Direction.extend({
  emberTheaterSaveStateManager: inject.service(),

  perform(resolve, key) {
    this.get('emberTheaterSaveStateManager').deleteStateValue(key);

    resolve();
  }
});
