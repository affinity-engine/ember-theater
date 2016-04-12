import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusPublisherMixin from 'ember-theater/mixins/bus-publisher';
import BusSubscriberMixin from 'ember-theater/mixins/bus-subscriber';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  get,
  getProperties,
  isEmpty,
  isPresent,
  on
} = Ember;

export default Ember.Object.extend(BusPublisherMixin, BusSubscriberMixin, MultitonIdsMixin, {
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId', 'windowId'),

  setupEvents: on('init', function() {
    const { theaterId, windowId } = getProperties(this, 'theaterId', 'windowId');

    this.on(`et:${theaterId}:${windowId}:gameIsResetting`, this, this.toInitialScene);
    this.on(`et:${theaterId}:${windowId}:saveIsLoading`, this, this.loadScene);
  }),

  loadLatestScene: async function() {
    const saveStateManager = get(this, 'saveStateManager');
    const options = { autosave: false };
    const save = await saveStateManager.get('mostRecentSave');

    if (isPresent(save)) {
      const sceneId = get(save, 'activeState.sceneId');

      this.loadScene(save, sceneId, options);
    } else {
      this.toInitialScene();
    }
  },

  toInitialScene() {
    const sceneId = get(this, 'sceneManager.initialScene');

    get(this, 'sceneManager').toScene(sceneId, { autosave: false });
  },

  loadScene(save, sceneId, options) {
    const {
      saveStateManager,
      sceneManager,
      theaterId
    } = getProperties(this, 'saveStateManager', 'sceneManager', 'theaterId');

    saveStateManager.loadRecord(save);

    this.publish(`et:${theaterId}:main:reseting`);

    options.sceneRecord = saveStateManager.getStateValue('_sceneRecord') || {};

    sceneManager.toScene(sceneId, options);
  }
});
