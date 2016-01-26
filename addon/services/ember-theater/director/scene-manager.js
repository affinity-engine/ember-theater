import Ember from 'ember';
import multiService from 'ember-theater/macros/ember-theater/multi-service';
import MultiServiceMixin from 'ember-theater/mixins/ember-theater/multi-service';

const {
  Service,
  get,
  set
} = Ember;

const { computed: { alias } } = Ember;
const { inject: { service } } = Ember;

const SceneManager = Ember.Object.extend({
  curtainPulleys: service('ember-theater/director/scene/curtain-pulley'),
  recorders: service('ember-theater/director/scene/recorder'),
  transitionManagers: service('ember-theater/director/scene/transition-manager'),

  curtainPulley: multiService('curtainPulleys'),
  recorder: multiService('recorders'),
  transitionManager: multiService('transitionManagers'),

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

  setScene(scene) {
    set(this, 'scene', scene);
  },

  setIsLoading(isLoading) {
    set(this, 'isLoading', isLoading);
  },

  advanceSceneRecord() {
    const isLoading = get(this, 'isLoading');

    return get(this, 'recorder').advance(isLoading);
  },

  recordSceneRecordEvent(promise, scene) {
    get(this, 'recorder').record(promise, scene);
  },

  resetSceneRecord(isLoading) {
    const recorder = get(this, 'recorder');

    if (isLoading) {
      recorder.resetIndex();
    } else {
      recorder.resetRecord();
    }
  }

})

export default Service.extend(MultiServiceMixin, {
  factory: SceneManager
});
