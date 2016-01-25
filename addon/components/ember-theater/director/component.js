import Ember from 'ember';
import layout from './template';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

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

  sceneManagers: service('ember-theater/director/scene-manager'),
  stageManagers: service('ember-theater/director/stage-manager'),

  sceneManager: multiService('sceneManagers', 'theaterId'),
  stageManager: multiService('stageManagers', 'theaterId'),

  directables: alias('stageManager.directables'),

  _loadLatestScene: on('didInsertElement', function() {
    get(this, 'sceneManager').loadLatestScene();
  })
});
