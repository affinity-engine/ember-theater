import Ember from 'ember';

const {
  computed,
  get,
  getOwner,
  getProperties
} = Ember;

export default function multiService(path, ...keyAttributes) {
  return computed(...keyAttributes, {
    get() {
      const multitonProperties = getProperties(this, ...keyAttributes);
      const multitonKeys = Object.keys(multitonProperties).map((key) => get(multitonProperties, key));
      const owner = getOwner(this);
      const manager = owner.lookup('service:multiton-service-manager');

      return manager.getService(path, ...multitonKeys) || manager.addService(path, ...multitonKeys);
    }
  }).readOnly();
}
