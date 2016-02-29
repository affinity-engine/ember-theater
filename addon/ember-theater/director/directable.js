import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default Ember.Object.extend({
  layer: computed('options.layer', {
    get() {
      return get(this, 'options.layer') || 'theater';
    }
  })
});
