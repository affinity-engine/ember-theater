import Ember from 'ember';
import layout from '../templates/components/ember-theater';

const { Component, observer } = Ember;

export default Component.extend({
  layout: layout,
  classNames: ['ember-theater'],

  transitionToIntialScene: observer('mediaLoaded', function() {
    if (this.get('mediaLoaded')) {
      const sceneId = this.get('initialScene');
      this.send('transitionToScene', sceneId);
    }
  }),

  actions: {
    transitionToScene(sceneId) {
      const modulePrefix = this.container.lookupFactory('config:environment').modulePrefix;
      const scene = window.require(`${modulePrefix}/scenes/${sceneId}`).default;
      scene.set('container', this.get('container'));
      this.set('scene', scene);
    }
  }
});
