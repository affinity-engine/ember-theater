import Ember from 'ember';
import layout from './template';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Component,
  computed,
  get,
  getProperties,
  on
} = Ember;

const { alias } = computed;

export default Component.extend({
  layout,

  classNames: ['et-director'],
  windowId: 'main',

  producer: multitonService('ember-theater/producer', 'theaterId'),
  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId', 'windowId'),
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId', 'windowId'),

  directables: alias('stageManager.directables'),
  keyboardActivated: alias('producer.isFocused'),

  _loadLatestScene: on('didInsertElement', function() {
    const {
      initialScene,
      sceneManager,
      windowId
    } = getProperties(this, 'initialScene', 'sceneManager', 'windowId');

    if (windowId === 'main') {
      sceneManager.setinitialScene(initialScene);
      sceneManager.loadLatestScene();
    } else {
      const sceneRecord = get(this, 'sceneRecord');

      sceneManager.toScene(initialScene, { autosave: false, sceneRecord });
    }
  })
});
