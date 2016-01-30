import Ember from 'ember';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  computed,
  get,
  set
} = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  fixtureMap: computed(() => Ember.Object.create()),

  add(type, fixtures) {
    const collection = this.findAll(type) || this.instantiateCollection(type);

    return collection.pushObjects(fixtures);
  },

  instantiateCollection(type) {
    return set(this, `fixtureMap.${type}`, Ember.A());
  },

  find(type, id) {
    return this.findAll(type).findBy('id', id);
  },

  findAll(type) {
    return get(this, `fixtureMap.${type}`);
  }
});
