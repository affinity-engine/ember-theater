import layout from './template';
import MenuBarControl from 'ember-theater/components/ember-theater/menu-bar/control/component';

export default MenuBarControl.extend({
  layout,
  keys: 'rewindMenuKeys',

  startHoverEffect() {
    this.$('i').velocity({ translateY: '-0.15vw' }, { easing: 'easeInOut', duration: 500, delay: 150, loop: true });
  },

  stopHoverEffect() {
    this.$('i').velocity('stop');
    this.$('i').velocity({ translateY: 0 }, { duration: 0 });
  }
});
