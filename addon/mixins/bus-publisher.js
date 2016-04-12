import Ember from 'ember';

const {
  Mixin,
  get
} = Ember;

const { inject: { service } } = Ember;

export default Mixin.create({
  messageBus: service('message-bus'),

  publish(name, ...messages) {
    get(this, 'messageBus').publish(name, ...messages);
  }
});
