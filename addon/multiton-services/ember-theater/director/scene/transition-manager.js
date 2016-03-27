import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  get,
  getOwner,
  getProperties,
  isPresent,
  typeOf
} = Ember;

const { run: { later } } = Ember;

export default Ember.Object.extend(BusPublisherMixin, MultitonIdsMixin, {
  config: multitonService('ember-theater/config', 'theaterId'),
  layerManager: multitonService('ember-theater/director/layer-manager', 'theaterId', 'windowId'),
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId', 'windowId'),
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId', 'windowId'),

  toScene(scene, options) {
    this.publish(`et:${get(this, 'windowId')}:scriptsMustAbort`);

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
    const { theaterId, windowId } = getProperties(this, 'theaterId', 'windowId');
    const instance = factory.create({ theaterId, windowId });

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
    const { theaterId, windowId } = getProperties(this, 'theaterId', 'windowId');

    return factory.create({ sceneRecord, theaterId, windowId });
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
