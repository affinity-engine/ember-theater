import Ember from 'ember';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';
import BusSubscriberMixin from 'ember-theater/mixins/ember-theater/bus-subscriber';
import TheaterIdMixin from 'ember-theater/mixins/ember-theater/theater-id';

const {
  get,
  getProperties,
  isEmpty,
  on
} = Ember;

export default Ember.Object.extend(BusPublisherMixin, BusSubscriberMixin, TheaterIdMixin, {
  saveStateManager: multitonService('ember-theater/save-state-manager', 'theaterId'),
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),

  resetGame: on('et:gameIsResetting', async function() {
    this.loadLatestScene();
  }),

  loadLatestScene: async function() {
    const saveStateManager = get(this, 'saveStateManager');
    const options = { autosave: false };
    const save = await saveStateManager.getMostRecentSave();

    let sceneId = get(save, 'activeState.sceneId');

    if (isEmpty(sceneId)) {
      sceneId = get(this, 'sceneManager.initialScene');
      options.autosave = true;
    }

    this.loadScene(save, sceneId, options);
  },

  loadScene: on('et:saveIsLoading', function(save, sceneId, options) {
    const {
      saveStateManager,
      sceneManager
    } = getProperties(this, 'saveStateManager', 'sceneManager');

    saveStateManager.loadRecord(save);

    this.publish('et:reseting');

    sceneManager.toScene(sceneId, options);
  })
});
