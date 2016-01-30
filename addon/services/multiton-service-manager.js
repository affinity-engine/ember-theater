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
  services: computed(() => Ember.Object.create()),

  addService(path, key) {
    const multitonService = getOwner(this).lookup(`multiton-service:${path}`);
    const services = get(this, 'services');

    if (isBlank(get(services, key))) {
      set(services, key, Ember.Object.create());
    }

    set(multitonService, '_multitonServiceKey', key);

    return set(services, `${key}.${path}`, multitonService);
  },

  removeServices(key) {
    const services = get(this, 'services');
    const service = services[key];
    const multitonKeys = Object.keys(service);

    multitonKeys.forEach((key) => {
      service[key].destroy();
    });

    delete services[key];
  }
});
