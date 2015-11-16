import layout from './template';
import MenuBarControl from 'ember-theater/components/ember-theater/menu-bar/control/component';

const {
  get,
  inject,
  set
} = Ember;

export default MenuBarControl.extend({
  layout,
  keys: 'resetMenuKeys',

  sceneManager: inject.service('ember-theater/scene-manager'),
  saveStateManager: inject.service('ember-theater/save-state-manager'),

  startHoverEffect() {
    set(this, 'hovering', true);
  },

  stopHoverEffect() {
    set(this, 'hovering', false);
  },

  actions: {
    cancel() {
      set(this, 'isOpen', false);
    },

    confirm() {
      get(this, 'saveStateManager').resetAutosave();
      get(this, 'sceneManager').resetScene();
      set(this, 'isOpen', false);
    }
  }
});
