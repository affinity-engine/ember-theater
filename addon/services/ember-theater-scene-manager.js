import Ember from 'ember';

const {
  get,
  inject,
  isEmpty,
  isPresent,
  observer,
  Service
} = Ember;

export default Service.extend({
  emberTheaterSaveStateManager: inject.service(),

  updateSceneRecord(key, value) {
    this.get('emberTheaterSaveStateManager').updateSceneRecord(key, value);
  },

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
      const autosave = await this.get('emberTheaterSaveStateManager.autosave');
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

    const saveStateManager = this.get('emberTheaterSaveStateManager');
    const sceneRecord = saveStateManager.get('sceneRecord');

    const sceneFactory = this.get('container').lookupFactory(`scene:${sceneId}`);
    const scene = sceneFactory.create({
      id: sceneId,
      isLoading: options.loading,
      options,
      sceneRecord
    })

    if (!options.loading) {
      saveStateManager.clearSceneRecord();
    }

    if (get(options, 'autosave') !== false) {
      const autosave = await saveStateManager.get('autosave');

      saveStateManager.appendActiveState({ sceneId });
      saveStateManager.updateRecord(autosave);
    }

    this.set('scene', scene);
  }
});
