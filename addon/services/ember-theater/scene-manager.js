import Ember from 'ember';

const {
  get,
  isEmpty,
  isPresent,
  observer,
  Service,
  set,
  setProperties
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  saveStateManager: service('ember-theater/save-state-manager'),
  sceneRecorder: service('ember-theater/scene-recorder'),

  setInitialSceneId: observer('sceneId', function() {
    const {
      initialSceneId,
      sceneId
    } = this.getProperties('initialSceneId', 'sceneId');

    if (isEmpty(initialSceneId) && isPresent(sceneId)) {
      this.set('initialSceneId', sceneId);
    }
  }),

  resetScene() {
    const initialSceneId = this.get('initialSceneId');

    this.toScene(initialSceneId);
  },

  liftCurtains: async function() {
    if (isEmpty(this.get('scene'))) {
      const options = { autosave: false };
      const autosave = await this.get('saveStateManager.autosave');
      let sceneId = autosave.get('activeState.sceneId');

      if (isEmpty(sceneId)) {
        sceneId = this.get('sceneId');
        options.autosave = true;
      }

      this.toScene(sceneId, options);
    }
  },

  toScene: async function(sceneId, options = {}) {
    const oldScene = this.get('scene');

    if (isPresent(oldScene)) { oldScene.abort(); }

    const saveStateManager = this.get('saveStateManager');

    const sceneFactory = this.get('container').lookupFactory(`scene:${sceneId}`);
    const scene = sceneFactory.create({
      id: sceneId,
      options
    });

    const isLoading = get(options, 'loading');

    set(this, 'isLoading', isLoading);
    get(this, 'sceneRecorder').resetIndex();

    if (!isLoading) {
      saveStateManager.clearSceneRecord();
    }

    if (get(options, 'autosave') !== false) {
      const autosave = await saveStateManager.get('autosave');

      saveStateManager.appendActiveState({
        sceneId,
        sceneName: get(scene, 'name') || sceneId
      });
      saveStateManager.updateRecord(autosave);
    }

    this.set('scene', scene);
  }
});
