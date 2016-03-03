import Ember from 'ember';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

export default Ember.Object.extend(TheaterIdMixin, {
  isFocused: null
});
