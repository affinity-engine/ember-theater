import Ember from 'ember';
import { Layer } from 'ember-theater';
import layout from './template';
import animate from 'ember-theater/utils/animate';

const {
  Component,
  computed,
  inject,
  isBlank,
  isPresent,
  observer,
  on
} = Ember;

const { alias } = computed;

export default Component.extend({
  classNames: ['et-director'],
  layout: layout,
  layerManager: inject.service('ember-theater/layer-manager'),
  sceneManager: inject.service('ember-theater/scene-manager'),
  stageManager: inject.service('ember-theater/stage-manager'),
  directables: alias('stageManager.directables'),

  _sceneChanged: observer('sceneManager.scene', function() {
    const scene = this.get('sceneManager.scene');

    if (isPresent(scene)) {
      animate(this.element, { opacity: 0 }, { duration: 1000 }).then(()=> {
        this.get('stageManager').clearDirectables();
        this.get('layerManager').clearFilters();
        animate(this.element, { opacity: 1 }, { duration: 0 });
        scene.script();
      });
    }
  }),

  _liftCurtains: on('didInsertElement', function() {
    this.get('sceneManager').liftCurtains();
  })
});
