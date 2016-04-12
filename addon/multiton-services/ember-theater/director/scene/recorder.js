import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusSubscriberMixin from 'ember-theater/mixins/bus-subscriber';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  Evented,
  get,
  getProperties,
  isBlank,
  isPresent,
  on,
  set
} = Ember;

const { computed: { alias } } = Ember;

export default Ember.Object.extend(BusSubscriberMixin, Evented, MultitonIdsMixin, {
  setupEvents: on('init', function() {
    const { theaterId, windowId } = getProperties(this, 'theaterId', 'windowId');

    this.on(`et:${theaterId}:${windowId}:directionCompleted`, this, this._update);
  }),

  setRecord(sceneRecord = {}) {
    return set(this, 'sceneRecord', sceneRecord);
  },

  _update(key, value) {
    set(this, `sceneRecord.${key}`, value);
  }
});
