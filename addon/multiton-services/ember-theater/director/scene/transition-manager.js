import Ember from 'ember';
import animate from 'ember-theater/utils/ember-theater/animate';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusPublisherMixin from 'ember-theater/mixins/bus-publisher';
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
  autosaveManager: multitonService('ember-theater/autosave-manager', 'theaterId'),
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId', 'windowId'),

  toScene(scene, options) {
    const { theaterId, windowId } = getProperties(this, 'theaterId', 'windowId');
    const query = windowId === 'main' ? '.et-director' : `[data-scene-window-id="${windowId}"] .et-director`;
    const $director = Ember.$(query);
    const duration = get(options, 'transitionOut.duration') || get(this, 'config.attrs.director.scene.transitionOut.duration');
    const effect = get(options, 'transitionOut.effect') || get(this, 'config.attrs.director.scene.transitionOut.effect');

    this.publish(`et:${theaterId}:${windowId}:scriptsMustAbort`);

    animate($director, effect, { duration }).then(() => {
      this._transitionScene(scene, options);

      later(() => $director.removeAttr('style'));
    });
  },

  _transitionScene(scene, options) {
    this._clearStage();
    this._setSceneManager(script, options);

    const script = this._buildScript();
    const { start, sceneId, sceneName } = typeOf(scene) === 'function' ?
      { start: scene } :
      this._buildScene(scene);

    this._updateAutosave(sceneId, sceneName, options);

    start(script, get(options, 'window'));
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
    const factory = getOwner(this).lookup('script:main');
    const { theaterId, windowId } = getProperties(this, 'theaterId', 'windowId');
    const sceneRecord = get(sceneManager, 'sceneRecord');

    return factory.create({ sceneRecord, theaterId, windowId });
  },

  _clearStage() {
    const { theaterId, windowId } = getProperties(this, 'theaterId', 'windowId');

    this.publish(`et:${theaterId}:${windowId}:stageIsClearing`);
  },

  _setSceneManager(script, options) {
    const sceneManager = get(this, 'sceneManager');
    const sceneRecord = get(options, 'sceneRecord');

    sceneManager.setScript(script);
    sceneManager.setSceneRecord(sceneRecord);
  },

  _updateAutosave: async function(sceneId, sceneName, options) {
    if (get(options, 'autosave') === false || get(this, 'config.attrs.director.scene.autosave') === false) { return; }

    const theaterId = get(this, 'theaterId');

    get(this, 'autosaveManager'); // initialize the autosave-manager

    this.publish(`et:${theaterId}:deletingStateValue`, '_sceneRecord');

    this.publish(`et:${theaterId}:appendingActiveState`, {
      sceneId,
      sceneName
    });

    this.publish(`et:${theaterId}:writingAutosave`);
  }
});
