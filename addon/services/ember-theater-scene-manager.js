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

  startSceneChange() {
    this.set('sceneChangeUnderway', true);
  },

  endSceneChange() {
    this.set('sceneChangeUnderway', false);
  },

  setInitialSceneId: observer('scene.id', function() {
    const {
      initialSceneId,
      scene
    } = this.getProperties('initialSceneId', 'scene');
    const sceneId = scene.id;

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

  toScene: async function(sceneId, options) {
    if (this.get('sceneChangeUnderway')) { return; }

    const modulePrefix = this.get('modulePrefix');
    const sceneFactory = require(`${modulePrefix}/ember-theater/scenes/${sceneId}`)['default'];
    const scene = sceneFactory.create({
      container: this.get('container'),
      id: sceneId,
      options: options
    })

    if (isEmpty(options) || get(options, 'autosave') !== false) {
      const saveStateManager = this.get('emberTheaterSaveStateManager');
      const autosave = await saveStateManager.get('autosave');
      saveStateManager.appendActiveState({ sceneId });
      saveStateManager.updateRecord(autosave);
    }

    this.set('scene', scene);
  }
});
