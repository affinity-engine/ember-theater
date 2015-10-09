import Ember from 'ember';
import layout from './template';
import MenuBarControl from 'ember-theater/components/ember-theater/menu-bar/control/component';

const { inject } = Ember;

export default MenuBarControl.extend({
  emberTheaterSceneManager: inject.service(),
  emberTheaterSaveStateManager: inject.service(),
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
      this.get('emberTheaterSaveStateManager').resetAutosave();
      this.get('emberTheaterSceneManager').toInitialScene();
      this.set('isOpen', false);
    }
  }
});
