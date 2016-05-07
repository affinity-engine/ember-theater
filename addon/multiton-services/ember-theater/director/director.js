import Ember from 'ember';
import { MultitonService } from 'ember-multiton-service';
import multiton from 'ember-multiton-service';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  get,
  getProperties,
  isPresent
} = Ember;

const { RSVP: { resolve } } = Ember;

export default MultitonService.extend(MultitonIdsMixin, {
  direct(script, factory, args) {
    if (get(script, 'isAborted')) { return resolve(); }

    const { theaterId, windowId } = getProperties(this, 'theaterId', 'windowId');
    const direction = factory.create({ script, theaterId, windowId });

    return direction._setup(...args);
  }
});
