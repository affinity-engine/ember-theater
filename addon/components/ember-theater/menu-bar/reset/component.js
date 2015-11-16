import Ember from 'ember';
import layout from './template';
import MenuBarControl from 'ember-theater/components/ember-theater/menu-bar/control/component';

const { inject } = Ember;

export default MenuBarControl.extend({
  sceneManager: inject.service('ember-theater/scene-manager'),
  saveStateManager: inject.service('ember-theater/save-state-manager'),
  layout: layout,

  startHoverEffect() {
    this.set('hovering', true);
  },

  stopHoverEffect() {
    this.set('hovering', false);
  },

  actions: {
    cancel() {
      this.set('isOpen', false);
    },

    confirm() {
      this.get('saveStateManager').resetAutosave();
      this.get('sceneManager').resetScene();
      this.set('isOpen', false);
    }
  }
});
