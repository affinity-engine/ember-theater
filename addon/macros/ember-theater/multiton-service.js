import Ember from 'ember';

const {
  computed,
  get,
  getOwner
} = Ember;

export default function multiService(path, keyAttribute) {
  return computed(keyAttribute, {
    get() {
      const multitonKey = get(this, keyAttribute);
      const owner = getOwner(this);
      const manager = owner.lookup('service:multiton-service-manager');

      return manager.getService(path, multitonKey) || manager.addService(path, multitonKey);
    }
  }).readOnly();
}
