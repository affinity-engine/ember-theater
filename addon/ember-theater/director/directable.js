import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default Ember.Object.extend({
  componentType: computed('type', {
    get() {
      return `ember-theater/director/directable/${get(this, 'type')}`;
    }
  }).readOnly(),

  layer: computed('options.layer', {
    get() {
      return get(this, 'options.layer') || 'theater';
    }
  })
});
