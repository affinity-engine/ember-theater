import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  get,
  on
} = Ember;

const { alias } = computed;
const { inject: { service } } = Ember;

export default Component.extend({
  classNames: ['et-director'],
  layout: layout,

  sceneManager: service('ember-theater/director/scene-manager'),
  stageManager: service('ember-theater/director/stage-manager'),

  directables: alias('stageManager.directables'),

  _loadLatestScene: on('didInsertElement', function() {
    get(this, 'sceneManager').loadLatestScene();
  })
});
