import Ember from 'ember';
import layout from './template';

const {
  Component,
  on
} = Ember;

export default Component.extend({
  classNames: ['ember-theater__director'],
  layout: layout,
  sceneObjectContainers: Ember.A([]),

  loadScene: on('didRender', function() {
    const sceneObjectContainers = this.get('sceneObjectContainers');
    const scene = this.get('scene');

    scene.set('sceneObjectContainers', sceneObjectContainers);
    scene.script();
  })
});
