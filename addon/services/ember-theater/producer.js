import Ember from 'ember';

const {
  Service,
  computed,
  get,
  getProperties,
  on,
  set
} = Ember;

const { inject: { service } } = Ember;
const { String: { camelize } } = Ember;

export default Service.extend({
  components: computed(() => Ember.A()),

  config: service('ember-theater/config'),

  initializeComponents: on('init', function() {
    const {
     components,
     config
    } = getProperties(this, 'components', 'config');
    const initialComponents = get(config, 'initial.components');

    components.pushObjects(initialComponents);

    initialComponents.forEach((component) => {
      const camelizedName = camelize(component.replace('/', '-'));
      const subComponents = get(config, `initial.${camelizedName}`);

      set(this, camelizedName, Ember.A(subComponents));
    });
  })
});
