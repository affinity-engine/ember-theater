import Ember from 'ember';

const {
  computed,
  get,
  inject,
  isBlank,
  isPresent,
  on,
  RSVP,
  set
} = Ember;

export default Ember.Object.extend({
  emberTheaterStageManager: inject.service(),

  abort() {
    this.set('isAborted', true);
  },

  proxyDirectable(type, factory, args) {
    if (get(this, 'isAborted')) { return resolve(); }

    const stageManager = get(this, 'emberTheaterStageManager');

    return stageManager.handleDirectable(factory, type, args);
  },

  proxyDirection(type, factory, args) {
    if (get(this, 'isAborted')) { return resolve(); }

    const stageManager = get(this, 'emberTheaterStageManager');

    return stageManager.handleDirection(factory, type, args);
  }
});
