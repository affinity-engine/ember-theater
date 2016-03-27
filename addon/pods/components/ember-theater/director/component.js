import Ember from 'ember';
import layout from './template';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Component,
  computed,
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

  _loadLatestScene: on('init', function() {
    const {
      initialScene,
      sceneManager
    } = getProperties(this, 'initialScene', 'sceneManager');

    sceneManager.setinitialScene(initialScene);
    sceneManager.loadLatestScene();
  })
});
