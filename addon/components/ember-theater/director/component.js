import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  on
} = Ember;

export default Component.extend({
  classNames: ['et-director'],
  layout: layout,

  loadScene: on('didRender', function() {
    if (!this.get('sceneChanged')) { return; }

    const scene = this.get('scene');

    this.set('sceneId', scene.get('id'));
    scene.set('_transitionToScene', this.attrs.transitionToScene);
    scene.script();
  }),

  sceneChanged: computed('scene.id', 'sceneId', {
    get() {
      return this.get('scene.id') !== this.get('sceneId');
    }
  }).readOnly()
});
