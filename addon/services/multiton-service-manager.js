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

  getService(path, ...keys) {
    return get(this, `serviceMap.${keys.join('.')}.${path}`);
  },

  addService(path, ...keys) {
    const serviceMap = get(this, 'serviceMap');
    const multitonService = getOwner(this).lookup(`multiton-service:${path}`).create({ _multitonServiceKeys: Ember.A(keys) });

    const joinedKeys = keys.reduce((joinedKeys, key) => {
      if (isBlank(get(serviceMap, `${joinedKeys}${key}`))) {
        set(serviceMap, `${joinedKeys}${key}`, Ember.Object.create());
      }

      return `${joinedKeys}${key}.`
    }, '');

    return set(serviceMap, `${joinedKeys}${path}`, multitonService);
  },

  removeServices(...keys) {
    const joinedKeys = keys.join('.');
    const serviceMap = get(this, 'serviceMap');
    const service = get(serviceMap, joinedKeys);
    const multitonKeys = Object.keys(service);

    multitonKeys.forEach((multitonKey) => {
      get(service, multitonKey).destroy();
    });

    Reflect.deleteProperty(serviceMap[joinedKeys]);
  }
});
