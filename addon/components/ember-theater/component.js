import Ember from 'ember';
import layout from './template';
import ModulePrefixMixin from '../../mixins/ember-theater-module-prefix';

const { Component } = Ember;

export default Component.extend(ModulePrefixMixin, {
  classNames: ['ember-theater'],
  layout: layout,

  actions: {
    transitionToInitialScene() {
      const sceneId = this.get('initialScene');

      this.send('transitionToScene', sceneId);
    },

    transitionToScene(sceneId) {
      const modulePrefix = this.get('_modulePrefix');
      const scene = require(`${modulePrefix}/ember-theater-scenes/${sceneId}`)['default'];

      scene.set('container', this.get('container'));
      this.set('scene', scene);
    }
  }
});
