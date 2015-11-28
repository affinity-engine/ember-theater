import Ember from 'ember';

const { get } = Ember;
const { RSVP: { resolve } } = Ember;
const { inject: { service } } = Ember;

export default Ember.Object.extend({
  stageDirector: service('ember-theater/stage-director'),

  abort() {
    this.set('isAborted', true);
  },

  proxyDirection(type, factory, args) {
    if (get(this, 'isAborted')) { return resolve(); }

    const stageDirector = get(this, 'stageDirector');

    return stageDirector.direct(factory, type, args);
  }
});
