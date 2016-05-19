import Ember from 'ember';
import { MultitonService } from 'ember-multiton-service';
import { MultitonIdsMixin } from 'ember-theater';

const {
  computed,
  get,
  set
} = Ember;

export default MultitonService.extend(MultitonIdsMixin, {
  fixtureMap: computed(() => Ember.Object.create()),

  add(type, fixtures) {
    const collection = this.findAll(type) || this.instantiateCollection(type);

    fixtures.forEach((fixture) => set(fixture, '_type', type));

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
