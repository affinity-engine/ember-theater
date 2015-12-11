import Ember from 'ember';

const {
  Mixin,
  computed,
  get
} = Ember;

export default Mixin.create({
  keyboardPriority: computed('directable.options.keyboardPriority', {
    get() {
      return get(this, 'directable.options.keyboardPriority') || 0;
    }
  }).readOnly()
});
