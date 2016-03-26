import Ember from 'ember';

const {
  Service,
  computed,
  get,
  getOwner,
  isBlank,
  set
} = Ember;

export default Service.extend({
  factories: computed(() => Ember.Object.create()),
  serviceMap: computed(() => Ember.Object.create()),

  getService(path, key) {
    return get(this, `serviceMap.${key}.${path}`);
  },

  addService(path, key) {
    const serviceMap = get(this, 'serviceMap');
    const multitonService = getOwner(this).lookup(`multiton-service:${path}`).create({ _multitonServiceKey: key });

    if (isBlank(get(serviceMap, key))) {
      set(serviceMap, key, Ember.Object.create());
    }

    return set(serviceMap, `${key}.${path}`, multitonService);
  },

  removeServices(key) {
    const serviceMap = get(this, 'serviceMap');
    const service = get(serviceMap, key);
    const multitonKeys = Object.keys(service);

    multitonKeys.forEach((multitonKey) => {
      get(service, multitonKey).destroy();
    });

    Reflect.deleteProperty(serviceMap[key]);
  }
});
