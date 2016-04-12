import Ember from 'ember';

const {
  Evented,
  Mixin,
  get,
  on
} = Ember;

const { inject: { service } } = Ember;

export default Mixin.create(Evented, {
  messageBus: service('message-bus'),

  registerWithBus: on('init', function() {
    get(this, 'messageBus').register(this);
  }),

  unregisterWithBus: on('willDestroy', 'willDestroyElement', function() {
    get(this, 'messageBus').unregister(this);
  })
});
