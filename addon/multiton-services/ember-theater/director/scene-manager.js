import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-subscriber';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  get,
  on,
  set
} = Ember;

const { computed: { alias } } = Ember;

export default Ember.Object.extend(BusSubscriberMixin, MultitonIdsMixin, {
  curtainPulley: multitonService('ember-theater/director/scene/curtain-pulley', 'theaterId', 'windowId'),
  recorder: multitonService('ember-theater/director/scene/recorder', 'theaterId', 'windowId'),
  transitionManager: multitonService('ember-theater/director/scene/transition-manager', 'theaterId', 'windowId'),

  sceneRecord: alias('recorder.sceneRecord'),

  loadLatestScene() {
    get(this, 'curtainPulley').loadLatestScene();
  },

  loadScene(save, sceneId, options) {
    get(this, 'curtainPulley').loadScene(save, sceneId, options);
  },

  resetGame() {
    get(this, 'curtainPulley').resetGame();
  },

  rewindToScene: on('et:gameIsRewinding', function(point) {
    this.toScene(get(point, 'lastObject.sceneId'), {
      autosave: false
    });
  }),

  toScene(id, options = {}) {
    get(this, 'transitionManager').toScene(id, options);
  },

  setinitialScene(initialScene) {
    set(this, 'initialScene', initialScene);
  },

  setScript(script) {
    set(this, 'script', script);
  },

  advanceSceneRecord() {
    return get(this, 'recorder').advance();
  },

  recordSceneRecordEvent(promise, script) {
    get(this, 'recorder').record(promise, script);
  },

  resetSceneRecord() {
    return get(this, 'recorder').resetRecord();
  }
});
