import Ember from 'ember';

const {
  Service,
  get,
  getProperties,
  isEmpty
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  config: service('ember-theater/config'),
  saveStateManager: service('ember-theater/save-state-manager'),
  sceneManager: service('ember-theater/director/scene-manager'),

  resetGame: async function() {
    await get(this, 'saveStateManager').resetAutosave();

    this.loadLatestScene();
  },

  loadLatestScene: async function() {
    const saveStateManager = get(this, 'saveStateManager');
    const options = { autosave: false, isLoading: true };
    const save = await saveStateManager.getMostRecentSave();

    let sceneId = get(save, 'activeState.sceneId');

    if (isEmpty(sceneId)) {
      sceneId = get(this, 'config.director.initialScene');
      options.autosave = true;
    }

    this.loadScene(save, sceneId, options);
  },

  loadScene(save, sceneId, options) {
    const {
      config,
      saveStateManager,
      sceneManager
    } = getProperties(this, 'config', 'saveStateManager', 'sceneManager');

    saveStateManager.loadRecord(save);
    config.resetConfig();

    sceneManager.toScene(sceneId, options);
  }
});
