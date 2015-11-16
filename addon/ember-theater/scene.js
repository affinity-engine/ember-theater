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
  stageManager: inject.service('ember-theater/stage-manager'),

  abort() {
    this.set('isAborted', true);
  },

  proxyDirectable(type, factory, args) {
    if (get(this, 'isAborted')) { return resolve(); }

    const stageManager = get(this, 'stageManager');

    return stageManager.handleDirectable(factory, type, args);
  },

  proxyDirection(type, factory, args) {
    if (get(this, 'isAborted')) { return resolve(); }

    const stageManager = get(this, 'stageManager');

    return stageManager.handleDirection(factory, type, args);
  }
});
