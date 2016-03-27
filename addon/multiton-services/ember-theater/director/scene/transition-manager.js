import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  get,
  getOwner,
  isPresent,
  typeOf
} = Ember;

const { run: { later } } = Ember;

export default Ember.Object.extend(BusPublisherMixin, TheaterIdMixin, {
  config: multitonService('ember-theater/config', 'theaterId'),
  layerManager: multitonService('ember-theater/director/layer-manager', 'theaterId'),
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId'),

  toScene(scene, options) {
    this.publish('et:scriptsMustAbort');

    const $director = Ember.$('.et-director');
    const duration = get(options, 'transitionOut.duration') || get(this, 'config.attrs.director.scene.transitionOut.duration');
    const effect = get(options, 'transitionOut.effect') || get(this, 'config.attrs.director.scene.transitionOut.effect');

    animate($director, effect, { duration }).then(() => {
      this._transitionScene(scene, options);

      later(() => $director.removeAttr('style'));
    });
  },

  _transitionScene(scene, options) {
    const data = get(this, 'saveStateManager.activeState');
    const script = this._buildScript();
    const { start, sceneId, sceneName } = typeOf(scene) === 'function' ?
      { start: scene } :
      this._buildScene(scene);

    this._clearStage();
    this._setSceneManager(script, options);
    this._updateAutosave(sceneId, sceneName, options);

    start(script, data);
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
    const sceneManager = get(this, 'sceneManager');
    const sceneRecord = get(sceneManager, 'sceneRecord') || sceneManager.resetSceneRecord();
    const factory = getOwner(this).lookup('script:main');
    const theaterId = get(this, 'theaterId');

    return factory.create({ sceneRecord, theaterId });
  },

  _clearStage() {
    get(this, 'stageManager').clearDirectables();
    get(this, 'layerManager').clearFilters();
  },

  _setSceneManager(script, options) {
    const sceneManager = get(this, 'sceneManager');

    sceneManager.setScript(script);
    sceneManager.resetSceneRecord();
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
