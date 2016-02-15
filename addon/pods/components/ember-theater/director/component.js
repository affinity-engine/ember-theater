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

  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId'),

  directables: alias('stageManager.directables'),
  keyboardActivated: alias('isFocused'),

  _loadLatestScene: on('didInsertElement', function() {
    const {
      initialSceneId,
      sceneManager
    } = getProperties(this, 'initialSceneId', 'sceneManager');

    sceneManager.setInitialSceneId(initialSceneId);
    sceneManager.loadLatestScene();
  })
});
