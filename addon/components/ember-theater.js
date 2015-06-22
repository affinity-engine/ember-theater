import Ember from 'ember';
import layout from '../templates/components/ember-theater';
import ModulePrefixMixin from '../mixins/ember-theater-module-prefix';

const { Component } = Ember;

export default Component.extend(ModulePrefixMixin, {
  layout: layout,
  classNames: ['ember-theater'],

  actions: {
    transitionToScene(sceneId) {
      const modulePrefix = this.get('_modulePrefix');
      const scene = require(`${modulePrefix}/scenes/${sceneId}`)['default'];
      scene.set('container', this.get('container'));
      this.set('scene', scene);
    },

    transitionToInitialScene() {
      const sceneId = this.get('initialScene');
      this.send('transitionToScene', sceneId);
    }
  }
});
