import Ember from 'ember';

const { get } = Ember;
const { RSVP: { resolve } } = Ember;
const { inject: { service } } = Ember;

export default Ember.Object.extend({
  director: service('ember-theater/director'),

  abort() {
    this.set('isAborted', true);
  },

  proxyDirection(type, factory, args) {
    if (get(this, 'isAborted')) { return resolve(); }

    const director = get(this, 'director');

    return director.direct(factory, type, args);
  }
});
