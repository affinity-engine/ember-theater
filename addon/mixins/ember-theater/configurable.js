import Ember from 'ember';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

const {
  Mixin
} = Ember;

const { inject: { service } } = Ember;

export default Mixin.create({
  configs: service('ember-theater/config'),
  config: multiService('configs', 'theaterId')
});
