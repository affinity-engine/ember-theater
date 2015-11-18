import Ember from 'ember';

const {
  get,
  inject,
  isBlank,
  isEmpty,
  isPresent,
  observer,
  Service,
  set,
  setProperties
} = Ember;

export default Service.extend({
  saveStateManager: inject.service('ember-theater/save-state-manager'),

  updateSceneRecord(key, value) {
    this.get('saveStateManager').updateSceneRecord(key, value);
  },

  advanceSceneRecord() {
    let sceneRecordResult = {};
    const sceneRecordsCount = this.incrementProperty('sceneRecordsCount');

    if (get(this, 'isLoading')) {
      const sceneRecord = get(this, 'saveStateManager.sceneRecord');
      const autoResolveResult = sceneRecord[sceneRecordsCount];

      if (isBlank(autoResolveResult)) {
        sceneRecordResult = { autoResolve: true, autoResolveResult };
      } else {
        set(this, 'isLoading', false);
      }
    }

    return sceneRecordResult;
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

    setProperties(this, {
      isLoading,
      sceneRecordsCount: -1
    });

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
