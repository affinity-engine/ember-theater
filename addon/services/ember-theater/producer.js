import Ember from 'ember';

const {
  Service,
  computed,
  get,
  getProperties,
  on
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  components: computed(() => Ember.A()),

  config: service('ember-theater/config'),

  initializeComponents: on('init', function() {
    const {
     components,
     config
    } = getProperties(this, 'components', 'config');

    const initialComponents = get(config, 'producer.components');

    components.pushObjects(initialComponents);
  })
});
