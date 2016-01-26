import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default function multiService(objectKey, idKey = 'theaterId') {
  return computed(objectKey, idKey, {
    get() {
      const object = get(this, objectKey);
      const id = get(this, idKey);

      return object.findOrCreateInstance(id);
    }
  });
}
