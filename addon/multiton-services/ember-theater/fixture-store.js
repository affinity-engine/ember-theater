import Ember from 'ember';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const { get } = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  find(type, id) {
    return get(this, type).findBy('id', id);
  }
});
