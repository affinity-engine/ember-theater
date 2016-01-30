import Ember from 'ember';

const { Mixin } = Ember;
const { computed: { alias } } = Ember;

export default Ember.Mixin.create({
  theaterId: alias('_multitonServiceKey')
});
