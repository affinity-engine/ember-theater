import Ember from 'ember';

const {
  isBlank,
  isPresent,
  on,
  tryInvoke
} = Ember;

export default Ember.Object.extend({
  layer: 'stage'
});
