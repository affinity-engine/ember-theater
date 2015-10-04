import Ember from 'ember';
import layout from './template';
import MenuBarControl from 'ember-theater/components/ember-theater/menu-bar/control/component';

const { inject } = Ember;

export default MenuBarControl.extend({
  emberTheaterSceneManager: inject.service(),
  layout: layout,
  session: inject.service(),

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
      this.get('session').refreshAutosave();
      this.get('emberTheaterSceneManager').toInitialScene();
      this.set('isOpen', false);
    }
  }
});
