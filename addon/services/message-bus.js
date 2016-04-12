import Ember from 'ember';

const {
  Service,
  computed,
  get
} = Ember;

export default Service.extend({
  subscribers: computed(() => Ember.A()),

  register(subscriber) {
    const subscribers = get(this, 'subscribers');

    subscribers.removeObject(subscriber);
    subscribers.pushObject(subscriber);
  },

  unregister(subscriber) {
    get(this, 'subscribers').removeObject(subscriber);
  },

  publish(name, ...messages) {
    get(this, 'subscribers').forEach((subscriber) => {
      subscriber.trigger(name, ...messages);
    })
  }
});
