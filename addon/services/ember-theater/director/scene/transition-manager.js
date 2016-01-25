import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';
import multiService from 'ember-theater/macros/ember-theater/multi-service';
import MultiServiceMixin from 'ember-theater/mixins/ember-theater/multi-service';

const {
  Service,
  get,
  isPresent
} = Ember;

const { inject: { service } } = Ember;
const { run: { later } } = Ember;

const TransitionManager = Ember.Object.extend({
  configs: service('ember-theater/config'),
  layerManagers: service('ember-theater/director/layer-manager'),
  saveStateManagers: service('ember-theater/save-state-manager'),
  sceneManagers: service('ember-theater/director/scene-manager'),
  stageManagers: service('ember-theater/director/stage-manager'),

  config: multiService('configs', 'theaterId'),
  layerManager: multiService('layerManagers', 'theaterId'),
  saveStateManager: multiService('saveStateManagers', 'theaterId'),
  sceneManager: multiService('sceneManagers', 'theaterId'),
  stageManager: multiService('stageManagers', 'theaterId'),

  toScene(id, options) {
    this._abortPreviousScene();

    const $director = Ember.$('.et-director');
    const duration = get(options, 'transitionOut.duration') || get(this, 'config.director.scene.transitionOut.duration');
    const effect = get(options, 'transitionOut.effect') || get(this, 'config.director.scene.transitionOut.effect');

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
    const theaterId = get(this, 'theaterId');

    return factory.create({
      id,
      options,
      theaterId
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

export default Service.extend(MultiServiceMixin, {
  factory: TransitionManager
});
