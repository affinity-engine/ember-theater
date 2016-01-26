import Ember from 'ember';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

const { set } = Ember;
const { inject: { service } } = Ember;

export default Ember.Object.extend({
  directors: service('ember-theater/director'),

  director: multiService('directors'),

  abort() {
    set(this, 'isAborted', true);
  }
});
