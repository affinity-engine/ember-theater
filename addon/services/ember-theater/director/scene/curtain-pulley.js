import Ember from 'ember';

const {
  Service,
  get,
  getProperties,
  isEmpty,
  isPresent,
  set
} = Ember;

const { inject: { service } } = Ember;

export default Service.extend({
  config: service('ember-theater/config'),
  saveStateManager: service('ember-theater/save-state-manager'),
  sceneManager: service('ember-theater/director/scene-manager'),

  resetScene: async function() {
    const saveStateManager = get(this, 'saveStateManager');

    await saveStateManager.resetAutosave();

    this.liftCurtains();
  },

  liftCurtains: async function() {
    const saveStateManager = get(this, 'saveStateManager');
    const options = { autosave: false, isLoading: true };
    const save = await saveStateManager.getMostRecentSave();
    let id = get(save, 'activeState.sceneId');

    if (isEmpty(id)) {
      id = get(this, 'config.initial.sceneId');
      options.autosave = true;
    }

    this.loadScene(save, options, id);
  },

  loadScene(save, options, id) {
    const {
      config,
      saveStateManager,
      sceneManager
    } = getProperties(this, 'config', 'saveStateManager', 'sceneManager');

    id = isPresent(id) ? id : get(save, 'activeState.sceneId');

    saveStateManager.loadRecord(save);
    config.resetConfig();

    sceneManager.toScene(id, options);
  }
});
