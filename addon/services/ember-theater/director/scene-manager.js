import Ember from 'ember';

const {
  Service,
  get,
  set
} = Ember;

const { computed: { alias } } = Ember;
const { inject: { service } } = Ember;

export default Service.extend({
  config: service('ember-theater/config'),
  curtainPulley: service('ember-theater/director/scene/curtain-pulley'),
  recorder: service('ember-theater/director/scene/recorder'),
  transitionManager: service('ember-theater/director/scene/transition-manager'),

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
    const scene = get(this, 'transitionManager').toScene(id, options);

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
});
