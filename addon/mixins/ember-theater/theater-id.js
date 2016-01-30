import Ember from 'ember';

const { Mixin } = Ember;
const { computed: { alias } } = Ember;

export default Mixin.create({
  theaterId: alias('_multitonServiceKey')
});
