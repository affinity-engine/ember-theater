import Ember from 'ember';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  computed,
  get
} = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
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
      subscriber.trigger(`bus:${name}`, ...messages);
    })
  }
});
