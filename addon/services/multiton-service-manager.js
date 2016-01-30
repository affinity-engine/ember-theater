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

  addService(path, key) {
    const multitonService = getOwner(this).lookup(`multiton-service:${path}`);
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

    multitonKeys.forEach((key) => {
      get(service, key).destroy();
    });

    delete serviceMap[key];
  }
});
