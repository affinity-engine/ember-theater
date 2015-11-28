import Ember from 'ember';

const { get } = Ember;
const { RSVP: { resolve } } = Ember;
const { inject: { service } } = Ember;

export default Ember.Object.extend({
  stageManager: service('ember-theater/stage-manager'),

  abort() {
    this.set('isAborted', true);
  },

  proxyDirection(type, factory, args) {
    if (get(this, 'isAborted')) { return resolve(); }

    const stageManager = get(this, 'stageManager');

    return stageManager.handleDirection(factory, type, args);
  }
});
