import Ember from 'ember';
import layout from './template';

const {
  Component,
  on
} = Ember;

export default Component.extend({
  classNames: ['ember-theater__director'],
  layout: layout,
  directables: Ember.A([]),

  loadScene: on('didRender', function() {
    const directables = this.get('directables');
    const scene = this.get('scene');

    scene.set('directables', directables);
    scene.script();
  })
});
