import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const { set } = Ember;
const { inject: { service } } = Ember;

export default Ember.Object.extend({
  director: multitonService('ember-theater/director/director', 'theaterId'),

  abort() {
    set(this, 'isAborted', true);
  }
});
