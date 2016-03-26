import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  get,
  isPresent
} = Ember;

const { RSVP: { resolve } } = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  direct(script, factory, args) {
    if (get(script, 'isAborted')) { return resolve(); }

    const theaterId = get(this, 'theaterId');
    const direction = factory.create({ script, theaterId });

    return direction.setup(...args);
  }
});
