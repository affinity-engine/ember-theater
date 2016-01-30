import Ember from 'ember';
import layout from './template';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Component,
  computed,
  get,
  on
} = Ember;

const { alias } = computed;
const { inject: { service } } = Ember;

export default Component.extend({
  layout,

  classNames: ['et-director'],

  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId'),
  stageManager: multitonService('ember-theater/director/stage-manager', 'theaterId'),

  directables: alias('stageManager.directables'),

  _loadLatestScene: on('didInsertElement', function() {
    get(this, 'sceneManager').loadLatestScene();
  })
});
