import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  get,
  getOwner,
  isPresent,
  typeOf
} = Ember;

const { run: { later } } = Ember;

export default Ember.Object.extend(TheaterIdMixin, {
  config: multitonService('ember-theater/config', 'theaterId'),
  layerManager: multitonService('ember-theater/director/layer-manager', 'theaterId'),
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId'),

  toScene(scene, options) {
    this._abortPreviousScene();

    const $director = Ember.$('.et-director');
    const duration = get(options, 'transitionOut.duration') || get(this, 'config.attrs.director.scene.transitionOut.duration');
    const effect = get(options, 'transitionOut.effect') || get(this, 'config.attrs.director.scene.transitionOut.effect');

    animate($director, effect, { duration }).then(() => {
      this._transitionScene(scene, options);

      later(() => $director.removeAttr('style'));
    });
  },

  _abortPreviousScene() {
    const script = get(this, 'sceneManager.script');

    if (isPresent(script)) { script.abort(); }
  },

  _transitionScene(scene, options) {
    const script = this._buildScript();
    const { start, sceneId, sceneName } = typeOf(scene) === 'function' ?
      { start: scene } :
      this._buildScene(scene);

    this._clearStage();
    this._setSceneManager(script, options);
    this._updateAutosave(sceneId, sceneName, options);

    start(script, options);
  },

  _buildScene(id) {
    const factory = getOwner(this).lookup(`scene:${id}`);
    const theaterId = get(this, 'theaterId');
    const instance = factory.create({ theaterId });

    return {
      start: instance.start,
      sceneId: id,
      sceneName: get(instance, 'name')
    }
  },

  _buildScript(options) {
    const factory = getOwner(this).lookup('script:main');
    const theaterId = get(this, 'theaterId');

    return factory.create({ theaterId });
  },

  _clearStage() {
    get(this, 'stageManager').clearDirectables();
    get(this, 'layerManager').clearFilters();
  },

  _setSceneManager(script, options) {
    const sceneManager = get(this, 'sceneManager');
    const isLoading = get(options, 'isLoading');

    sceneManager.setScript(script);
    sceneManager.setIsLoading(isLoading);
    sceneManager.resetSceneRecord(isLoading);
  },

  _updateAutosave: async function(sceneId, sceneName, options) {
    if (get(options, 'autosave') === false || get(this, 'config.attrs.director.scene.autosave') === false) { return; }

    const saveStateManager = get(this, 'saveStateManager');
    const autosave = await get(saveStateManager, 'autosave');

    saveStateManager.appendActiveState({
      sceneId,
      sceneName
    });

    saveStateManager.updateRecord(autosave);
  }
});
