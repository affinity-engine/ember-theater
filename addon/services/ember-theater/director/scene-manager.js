import Ember from 'ember';

const {
  Service,
  get,
  set
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  config: service('ember-theater/config'),
  curtainPulley: service('ember-theater/director/scene/curtain-pulley'),
  recorder: service('ember-theater/director/scene/recorder'),
  transitionManager: service('ember-theater/director/scene/transition-manager'),

  liftCurtains: async function() {
    const { id, options } = await get(this, 'curtainPulley').liftCurtains();

    this.toScene(id, options);
  },

  resetScene() {
    const id = get(this, 'config.initial.sceneId');

    this.toScene(id);
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

  resetSceneRecord() {
    const isLoading = get(this, 'isLoading');

    get(this, 'recorder').reset(isLoading);
  }
});
