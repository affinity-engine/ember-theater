import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-publisher';

const {
  Evented,
  get,
  on,
  set
} = Ember;

export default Ember.Object.extend(BusPublisherMixin, BusSubscriberMixin, Evented, {
  sceneRecordIndex: -1,

  director: multitonService('ember-theater/director/director', 'theaterId', 'windowId'),

  setupEvents: on('init', function() {
    const windowId = get(this, 'windowId');

    this.on(`et:${windowId}:scriptsMustAbort`, this, this.abort);
  }),

  abort() {
    set(this, 'isAborted', true);
  },

  incrementSceneRecordIndex() {
    this.incrementProperty('sceneRecordIndex');
  },

  getPriorSceneRecord() {
    const sceneRecordIndex = get(this, 'sceneRecordIndex');

    return get(this, `sceneRecord.${sceneRecordIndex}`);
  },

  record(promise) {
    const sceneRecordIndex = get(this, 'sceneRecordIndex');

    promise.then((value) => {
      if (get(this, 'isAborted')) { return; }

      this.publish(`et:${get(this, 'windowId')}:directionCompleted`, sceneRecordIndex, value);
    })
  }
});
