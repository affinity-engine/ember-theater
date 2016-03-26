import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  get,
  set
} = Ember;

const { computed: { alias } } = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  curtainPulley: multitonService('ember-theater/director/scene/curtain-pulley', 'theaterId'),
  recorder: multitonService('ember-theater/director/scene/recorder', 'theaterId'),
  transitionManager: multitonService('ember-theater/director/scene/transition-manager', 'theaterId'),

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
