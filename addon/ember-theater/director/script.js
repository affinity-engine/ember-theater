import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-publisher';

const {
  Evented,
  get,
  on,
  set,
  typeOf
} = Ember;

export default Ember.Object.extend(BusPublisherMixin, BusSubscriberMixin, Evented, {
  _sceneRecordIndex: -1,

  director: multitonService('ember-theater/director/director', 'theaterId', 'windowId'),

  _setupEvents: on('init', function() {
    const windowId = get(this, 'windowId');

    this.on(`et:${windowId}:scriptsMustAbort`, this, this._abort);
  }),

  _abort() {
    set(this, 'isAborted', true);
  },

  _incrementSceneRecordIndex() {
    this.incrementProperty('_sceneRecordIndex');
  },

  _getPriorSceneRecord() {
    const sceneRecordIndex = get(this, '_sceneRecordIndex');

    return get(this, `sceneRecord.${sceneRecordIndex}`);
  },

  _record(promise) {
    const sceneRecordIndex = get(this, '_sceneRecordIndex');

    promise.then((direction) => {
      if (get(this, 'isAborted')) { return; }

      const isDirection = typeOf(direction) === 'instance' && get(direction, '_isDirection');
      const value = isDirection ? get(direction, 'result') || '_RESOLVED' : direction;

      this.publish(`et:${get(this, 'windowId')}:directionCompleted`, sceneRecordIndex, value);
    })
  }
});
