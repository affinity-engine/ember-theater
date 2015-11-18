import Ember from 'ember';
import layout from './template';
import MenuBarControl from 'ember-theater/components/ember-theater/menu-bar/control/component';

const {
  get,
  set
} = Ember;

const { inject: { service } } = Ember;

export default MenuBarControl.extend({
  layout,
  keys: 'resetMenuKeys',

  sceneManager: service('ember-theater/scene-manager'),
  saveStateManager: service('ember-theater/save-state-manager'),

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
