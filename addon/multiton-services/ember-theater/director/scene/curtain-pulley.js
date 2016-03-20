import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  get,
  getProperties,
  isEmpty
} = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  config: multitonService('ember-theater/config', 'theaterId'),
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),
  soundManager: multitonService('ember-theater/sound-manager', 'theaterId'),

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
      sceneId = get(this, 'sceneManager.initialScene');
      options.autosave = true;
    }

    this.loadScene(save, sceneId, options);
  },

  loadScene(save, sceneId, options) {
    const {
      config,
      saveStateManager,
      sceneManager,
      soundManager
    } = getProperties(this, 'config', 'saveStateManager', 'sceneManager', 'soundManager');

    saveStateManager.loadRecord(save);
    config.resetConfig();
    soundManager.clearSounds();

    sceneManager.toScene(sceneId, options);
  }
});
