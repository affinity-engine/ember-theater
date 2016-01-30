import Ember from 'ember';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  computed
} = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  components: computed(() => Ember.A())
});
