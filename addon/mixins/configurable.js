import Ember from 'ember';
import multiton from 'ember-multiton-service';

const {
  Mixin
} = Ember;

export default Mixin.create({
  config: multiton('ember-theater/config', 'theaterId')
});
