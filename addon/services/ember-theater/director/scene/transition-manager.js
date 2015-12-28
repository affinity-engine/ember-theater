import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';

const {
  Service,
  get,
  isPresent
} = Ember;

const { inject: { service } } = Ember;
const { run: { later } } = Ember;

export default Service.extend({
  config: service('ember-theater/config'),
  layerManager: service('ember-theater/director/layer-manager'),
  saveStateManager: service('ember-theater/save-state-manager'),
  sceneManager: service('ember-theater/director/scene-manager'),
  stageManager: service('ember-theater/director/stage-manager'),

  toScene(id, options) {
    this._abortPreviousScene();

    const $director = Ember.$('.et-director');
    const duration = get(options, 'transitionOutDuration') || get(this, 'config.director.scene.transitionOutDuration');
    const effect = get(options, 'transitionOut') || get(this, 'config.director.scene.transitionOut');

    animate($director, effect, { duration }).then(() => {
      this._transitionScene(id, options);

      later(() => $director.removeAttr('style'));
    });
  },

  _abortPreviousScene() {
    const scene = get(this, 'sceneManager.scene');

    if (isPresent(scene)) { scene.abort(); }
  },

  _transitionScene(id, options) {
    const scene = this._buildScene(id, options);

    this._clearStage();
    this._setSceneManager(scene, options);
    this._updateAutosave(scene, options);

    scene.script();
  },

  _buildScene(id, options) {
    const factory = get(this, 'container').lookupFactory(`scene:${id}`);

    return factory.create({
      id,
      options
    });
  },

  _clearStage() {
    get(this, 'stageManager').clearDirectables();
    get(this, 'layerManager').clearFilters();
  },

  _setSceneManager(scene, options) {
    const sceneManager = get(this, 'sceneManager');
    const isLoading = get(options, 'isLoading');

    sceneManager.setScene(scene);
    sceneManager.setIsLoading(isLoading);
    sceneManager.resetSceneRecord(isLoading);
  },

  _updateAutosave: async function(scene, options) {
    if (get(options, 'autosave') === false || get(this, 'config.director.scene.autosave') === false) { return; }

    const saveStateManager = get(this, 'saveStateManager');
    const autosave = await get(saveStateManager, 'autosave');

    saveStateManager.appendActiveState({
      sceneId: get(scene, 'id'),
      sceneName: get(scene, 'name') || get(scene, 'id')
    });

    saveStateManager.updateRecord(autosave);
  }
});
