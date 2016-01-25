import Ember from 'ember';
import MultiServiceMixin from 'ember-theater/mixins/ember-theater/multi-service';

const {
  Service,
  computed,
  get,
  getProperties,
  on,
  set
} = Ember;

const { inject: { service } } = Ember;

const Producer = Ember.Object.extend({
  components: computed(() => Ember.A())
});

export default Service.extend(MultiServiceMixin, {
  factory: Producer
});
