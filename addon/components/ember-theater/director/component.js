import Ember from 'ember';
import { Layer } from 'ember-theater';
import layout from './template';

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
  emberTheaterSceneManager: inject.service(),
  emberTheaterStageManager: inject.service(),
  theaterLayer: alias('emberTheaterStageManager.theaterLayer'),

  _sceneChanged: observer('emberTheaterSceneManager.scene', function() {
    const scene = this.get('emberTheaterSceneManager.scene');

    if (isPresent(scene)) {
      Ember.$.Velocity.animate(this.element, { opacity: 0 }, { duration: 1000 }).then(()=> {
        this.get('emberTheaterStageManager').resetTheaterLayer();
        Ember.$.Velocity.animate(this.element, { opacity: 1 }, { duration: 0 });
        scene.script();
      });
    }
  }),

  _liftCurtains: on('didInsertElement', function() {
    this.get('emberTheaterStageManager').resetTheaterLayer();
    this.get('emberTheaterSceneManager').liftCurtains();
  })
});
