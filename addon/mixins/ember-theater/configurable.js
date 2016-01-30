import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Mixin
} = Ember;

const { inject: { service } } = Ember;

export default Mixin.create({
  config: multitonService('ember-theater/config', 'theaterId')
});
