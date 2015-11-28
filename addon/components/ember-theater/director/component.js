import Ember from 'ember';
import layout from './template';
import animate from 'ember-theater/utils/animate';
import configurable from 'ember-theater/macros/configurable';

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
  layerManager: service('ember-theater/layer-manager'),
  sceneManager: service('ember-theater/scene-manager'),
  stageManager: service('ember-theater/stage-manager'),

  directables: alias('stageManager.directables'),
  transitionDuration: configurable('director', 'transitionDuration'),

  _sceneChanged: observer('sceneManager.scene', function() {
    const scene = get(this, 'sceneManager.scene');

    if (isPresent(scene)) {
      const duration = get(this, 'transitionDuration');

      animate(this.element, { opacity: 0 }, { duration }).then(() => {
        get(this, 'stageManager').clearDirectables();
        get(this, 'layerManager').clearFilters();
        animate(this.element, { opacity: 1 }, { duration: 0 });
        scene.script();
      });
    }
  }),

  _liftCurtains: on('didInsertElement', function() {
    get(this, 'sceneManager').liftCurtains();
  })
});
