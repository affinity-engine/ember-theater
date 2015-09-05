import Ember from 'ember';
import layout from './template';
import ModulePrefixMixin from '../../mixins/module-prefix';

const {
  Component,
  inject
} = Ember;

export default Component.extend(ModulePrefixMixin, {
  'aria-live': 'polite',
  ariaRole: 'region',
  attributeBindings: ['aria-live'],
  classNames: ['ember-theater'],
  layout: layout,
  session: inject.service(),

  actions: {
    toInitialScene() {
      let sceneId;
      const savePoints = this.get('session.autosave.savePoints');

      if (savePoints.length > 0) {
        sceneId = savePoints[savePoints.length - 1].sceneId;
      } else {
        sceneId = this.get('initialScene');
      }

      this.send('toScene', sceneId);
    },

    toScene(sceneId, options) {
      const modulePrefix = this.get('modulePrefix');
      const scene = require(`${modulePrefix}/ember-theater-scenes/${sceneId}`)['default'];

      this.set('scene', scene.setProperties({
        container: this.get('container'),
        id: sceneId,
        options: options
      }));
    }
  }
});
