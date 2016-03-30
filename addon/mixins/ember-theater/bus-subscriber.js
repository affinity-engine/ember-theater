import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  Evented,
  Mixin,
  get,
  on
} = Ember;

export default Mixin.create(Evented, MultitonIdsMixin, {
  messageBus: multitonService('ember-theater/message-bus', 'theaterId'),

  registerWithBus: on('init', function() {
    get(this, 'messageBus').register(this);
  }),

  unregisterWithBus: on('willDestroy', 'willDestroyElement', function() {
    get(this, 'messageBus').unregister(this);
  })
});
