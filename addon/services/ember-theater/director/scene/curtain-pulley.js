import Ember from 'ember';
import multiService from 'ember-theater/macros/ember-theater/multi-service';
import MultiServiceMixin from 'ember-theater/mixins/ember-theater/multi-service';

const {
  Service,
  get,
  getProperties,
  isEmpty
} = Ember;

const { inject: { service } } = Ember;

const CurtainPulley = Ember.Object.extend({
  configs: service('ember-theater/config'),
  saveStateManagers: service('ember-theater/save-state-manager'),
  sceneManagers: service('ember-theater/director/scene-manager'),

  config: multiService('configs'),
  saveStateManager: multiService('saveStateManagers'),
  sceneManager: multiService('sceneManagers'),

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
      configs,
      saveStateManager,
      sceneManager
    } = getProperties(this, 'configs', 'saveStateManager', 'sceneManager');

    saveStateManager.loadRecord(save);
    // configs.resetConfig();

    sceneManager.toScene(sceneId, options);
  }
});

export default Service.extend(MultiServiceMixin, {
  factory: CurtainPulley
});
