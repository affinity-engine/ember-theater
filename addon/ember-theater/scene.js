import Ember from 'ember';

const { get } = Ember;
const { RSVP: { resolve } } = Ember;
const { inject: { service } } = Ember;

export default Ember.Object.extend({
  stageManager: service('ember-theater/stage-manager'),

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
