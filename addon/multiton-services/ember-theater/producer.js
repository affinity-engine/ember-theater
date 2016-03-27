import Ember from 'ember';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

export default Ember.Object.extend(MultitonIdsMixin, {
  isFocused: null
});
