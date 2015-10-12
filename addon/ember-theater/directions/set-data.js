import Ember from 'ember';
import { Direction } from 'ember-theater';

const { inject } = Ember;

export default Direction.extend({
  emberTheaterSaveStateManager: inject.service(),

  perform(resolve, key, value) {
    this.get('emberTheaterSaveStateManager').setStateValue(key, value);

    resolve();
  }
});
