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
  serviceMap: computed(() => Ember.Object.create()),

  getService(path, key) {
    return get(this, `serviceMap.${key}.${path}`);
  },

  addService(path, key) {
    const multitonService = getOwner(this).lookup(`multiton-service:${path}`, { singleton: false });
    const serviceMap = get(this, 'serviceMap');

    if (isBlank(get(serviceMap, key))) {
      set(serviceMap, key, Ember.Object.create());
    }

    set(multitonService, '_multitonServiceKey', key);

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
