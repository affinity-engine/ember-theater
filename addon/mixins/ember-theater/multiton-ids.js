import Ember from 'ember';

const { Mixin } = Ember;
const { computed: { reads } } = Ember;

export default Mixin.create({
  theaterId: reads('_multitonServiceKeys.firstObject'),
  windowId: reads('_multitonServiceKeys.lastObject')
});
