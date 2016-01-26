import Ember from 'ember';
import MultiServiceMixin from 'ember-theater/mixins/ember-theater/multi-service';

const {
  Service,
  get
} = Ember;

const FixtureStore = Ember.Object.extend({
  find(type, id) {
    return get(this, type).findBy('id', id);
  }
});

export default Service.extend(MultiServiceMixin, {
  factory: FixtureStore
});
