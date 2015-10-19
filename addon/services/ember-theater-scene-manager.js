import Ember from 'ember';
import ModulePrefixMixin from 'ember-theater/mixins/module-prefix';

const {
  get,
  inject,
  isEmpty,
  isPresent,
  observer,
  Service
} = Ember;

export default Service.extend(ModulePrefixMixin, {
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

    const modulePrefix = this.get('modulePrefix');
    const sceneFactory = require(`${modulePrefix}/ember-theater/scenes/${sceneId}`)['default'];
    const scene = sceneFactory.create({
      container: this.get('container'),
      id: sceneId,
      isLoading: options.loading,
      options,
      sceneRecord
    })

    if (get(options, 'autosave') !== false) {
      const autosave = await saveStateManager.get('autosave');

      saveStateManager.appendActiveState({ sceneId });
      saveStateManager.updateRecord(autosave);
      saveStateManager.clearSceneRecord();
    }

    this.set('scene', scene);
  }
});
