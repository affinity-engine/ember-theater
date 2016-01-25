import Ember from 'ember';

const {
  Mixin,
  computed,
  get,
  merge,
  set
} = Ember;

export default Mixin.create({
  instanceMap: computed(() => Ember.Object.create()),

  findOrCreateInstance(id) {
    return get(this, `instanceMap.${id}`) || this.createInstance(id);
  },

  createInstance(id, args = {}) {
    const factory = get(this, 'factory');
    const instance = factory.create(merge({ theaterId: id, container: this.container }, args));

    return set(this, `instanceMap.${id}`, instance);
  }
});
