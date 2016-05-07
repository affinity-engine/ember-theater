import Ember from 'ember';
import { MultitonService } from 'ember-multiton-service';
import multiton from 'ember-multiton-service';
import { BusSubscriberMixin } from 'ember-message-bus';
import MultitonIdsMixin from 'ember-theater/mixins/ember-theater/multiton-ids';

const {
  get,
  on,
  set
} = Ember;

const { computed: { alias } } = Ember;

export default MultitonService.extend(BusSubscriberMixin, MultitonIdsMixin, {
  curtainPulley: multiton('ember-theater/director/scene/curtain-pulley', 'theaterId', 'windowId'),
  recorder: multiton('ember-theater/director/scene/recorder', 'theaterId', 'windowId'),
  transitionManager: multiton('ember-theater/director/scene/transition-manager', 'theaterId', 'windowId'),

  sceneRecord: alias('recorder.sceneRecord'),

  setupEvents: on('init', function() {
    const theaterId = get(this, 'theaterId');

    this.on(`et:${theaterId}:gameIsRewinding`, this, this.rewindToScene);
  }),

  loadLatestScene() {
    get(this, 'curtainPulley').loadLatestScene();
  },

  loadScene(save, sceneId, options) {
    get(this, 'curtainPulley').loadScene(save, sceneId, options);
  },

  resetGame() {
    get(this, 'curtainPulley').resetGame();
  },

  rewindToScene(point) {
    this.toScene(get(point, 'lastObject.sceneId'), {
      autosave: false
    });
  },

  toScene(id, options = {}) {
    get(this, 'transitionManager').toScene(id, options);
  },

  setinitialScene(initialScene) {
    set(this, 'initialScene', initialScene);
  },

  setScript(script) {
    set(this, 'script', script);
  },

  advanceSceneRecord() {
    return get(this, 'recorder').advance();
  },

  recordSceneRecordEvent(promise, script) {
    get(this, 'recorder').record(promise, script);
  },

  setSceneRecord(sceneRecord) {
    return get(this, 'recorder').setRecord(sceneRecord);
  }
});
