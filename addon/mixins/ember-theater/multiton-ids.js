import Ember from 'ember';

const {
  Mixin,
  computed,
  get,
  isPresent
} = Ember;

export default Mixin.create({
  theaterId: computed('_multitonKeys.[]', {
    get() {
      const keys = get(this, '_multitonKeys');

      return isPresent(keys) ? keys[0] : undefined;
    }
  }),

  windowId: computed('_multitonKeys.[]', {
    get() {
      const keys = get(this, '_multitonKeys');

      return isPresent(keys) ? keys[1] : undefined;
    }
  })
});
