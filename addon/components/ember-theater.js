import Ember from 'ember';
import layout from '../templates/components/ember-theater';

const { Component, on } = Ember;

export default Component.extend({
  layout: layout,
  classNames: ['ember-theater'],

  transitionToIntialScene: on('didInsertElement', function() {
    const sceneId = this.get('initialScene');
    this.send('transitionToScene', sceneId);
  }),

  actions: {
    transitionToScene(sceneId) {
      const modulePrefix = this.container.lookupFactory('config:environment').modulePrefix;
      const scene = window.require(`${modulePrefix}/scenes/${sceneId}`);
      this.set('scene', scene);
    }
  }
});
