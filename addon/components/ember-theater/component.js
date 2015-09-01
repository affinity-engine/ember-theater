import Ember from 'ember';
import layout from './template';
import ModulePrefixMixin from '../../mixins/module-prefix';

const { Component } = Ember;

export default Component.extend(ModulePrefixMixin, {
  'aria-live': 'polite',
  ariaRole: 'region',
  attributeBindings: ['aria-live'],
  classNames: ['ember-theater'],
  layout: layout,

  actions: {
    transitionToInitialScene() {
      const sceneId = this.get('initialScene');

      this.send('transitionToScene', sceneId);
    },

    transitionToScene(sceneId) {
      const modulePrefix = this.get('modulePrefix');
      const scene = require(`${modulePrefix}/ember-theater-scenes/${sceneId}`)['default'];

      Ember.$.Velocity.animate(this.element, { opacity: 0 }, { duration: 1000 }).then(() => {
        this.set('scene', scene.create({
          container: this.get('container'),
          id: sceneId
        }));

        Ember.$.Velocity.animate(this.element, { opacity: 1 }, { duration: 0 });
      });
    }
  }
});
