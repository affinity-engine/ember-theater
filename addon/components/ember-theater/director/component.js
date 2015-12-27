import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  get,
  isPresent,
  observer,
  on
} = Ember;

const { alias } = computed;
const { inject: { service } } = Ember;

export default Component.extend({
  classNames: ['et-director'],
  layout: layout,

  config: service('ember-theater/config'),
  sceneManager: service('ember-theater/director/scene-manager'),
  stageManager: service('ember-theater/director/stage-manager'),

  directables: alias('stageManager.directables'),

  _sceneChanged: observer('sceneManager.scene', function() {
    const scene = get(this, 'sceneManager.scene');

    if (isPresent(scene)) {
      scene.script();
    }
  }),

  _loadLatestScene: on('didInsertElement', function() {
    get(this, 'sceneManager').loadLatestScene();
  })
});
