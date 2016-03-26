import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  Evented,
  Mixin,
  get,
  on
} = Ember;

export default Mixin.create(Evented, TheaterIdMixin, {
  messageBus: multitonService('ember-theater/message-bus', 'theaterId'),

  registerWithBus: on('init', function() {
    get(this, 'messageBus').register(this);
  }),

  unregisterWithBus: on('willDestroy', function() {
    get(this, 'messageBus').unregister(this);
  })
});
