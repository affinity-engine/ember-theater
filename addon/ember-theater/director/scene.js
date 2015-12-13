import Ember from 'ember';

const { set } = Ember;
const { inject: { service } } = Ember;

export default Ember.Object.extend({
  director: service('ember-theater/director'),

  abort() {
    set(this, 'isAborted', true);
  }
});
