import Ember from 'ember';
import { MultitonService } from 'ember-multiton-service';
import multiton from 'ember-multiton-service';
import { BusPublisherMixin, BusSubscriberMixin } from 'ember-message-bus';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  get,
  getProperties,
  isPresent,
  on
} = Ember;

export default MultitonService.extend(BusPublisherMixin, BusSubscriberMixin, MultitonIdsMixin, {
  saveStateManager: multiton('ember-theater/save-state-manager', 'theaterId'),
  sceneManager: multiton('ember-theater/director/scene-manager', 'theaterId', 'windowId'),

  setupEvents: on('init', function() {
    const theaterId = get(this, 'theaterId');

    this.on(`et:${theaterId}:gameIsResetting`, this, this.toInitialScene);
    this.on(`et:${theaterId}:saveIsLoading`, this, this.loadScene);
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

    this.publish(`et:${theaterId}:reseting`);

    options.sceneRecord = saveStateManager.getStateValue('_sceneRecord') || {};

    sceneManager.toScene(sceneId, options);
  }
});
