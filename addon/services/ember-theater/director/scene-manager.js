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

  liftCurtains() {
    get(this, 'curtainPulley').liftCurtains();
  },

  loadScene(save, options) {
    get(this, 'curtainPulley').loadScene(save, options);
  },

  resetScene() {
    get(this, 'curtainPulley').resetScene();
  },

  toScene(id, options = {}) {
    const scene = get(this, 'transitionManager').toScene(id, options);

    set(this, 'scene', scene);
  },

  setIsLoading(isLoading) {
    set(this, 'isLoading', isLoading);
  },

  advanceSceneRecord() {
    return get(this, 'recorder').advance();
  },

  recordSceneRecordEvent(promise) {
    get(this, 'recorder').record(promise);
  },

  setSceneRecord(value = Ember.Object.create()) {
    set(this, 'sceneRecord', value);
  },

  resetSceneRecord() {
    const isLoading = get(this, 'isLoading');

    get(this, 'recorder').reset(isLoading);
  }
});
