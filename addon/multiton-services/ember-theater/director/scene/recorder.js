import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-subscriber';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  Evented,
  get,
  isBlank,
  isPresent,
  on,
  set
} = Ember;

const { computed: { alias } } = Ember;

export default Ember.Object.extend(BusSubscriberMixin, Evented, MultitonIdsMixin, {
  setupEvents: on('init', function() {
    const windowId = get(this, 'windowId');

    this.on(`et:${windowId}:directionCompleted`, this, this._update);
  }),

  setRecord(sceneRecord = {}) {
    return set(this, 'sceneRecord', sceneRecord);
  },

  _update(key, value) {
    set(this, `sceneRecord.${key}`, value);
  }
});
