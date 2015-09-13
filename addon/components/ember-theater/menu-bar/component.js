import Ember from 'ember';
import layout from './template';

const {
  Component,
  on
} = Ember;

export default Component.extend({
  classNames: ['et-menu-bar-container'],
  layout: layout,
  
  closeEverything: on('focusOut', 'mouseLeave', function() {
    this.setProperties({
      saveMenuOpen: false
    });
  }),

  actions: {
    openSaveMenu() {
      this.closeEverything();
      this.set('saveMenuOpen', true);
    },

    toggleControlProperty(property) {
      this.toggleProperty(property);
    },

    toInitialScene() {
      this.attrs.toInitialScene();
    },

    toScene(scene) {
      this.closeEverything();
      this.attrs.toScene(scene);
    }
  }
});
