import layout from './template';
import MenuBarControl from 'ember-theater/pods/components/ember-theater/menu-bar/control/component';

export default MenuBarControl.extend({
  layout,
  type: 'rewind',
  componentPath: 'ember-theater/menu-bar/rewind/menu',

  startHoverEffect() {
    this.$('i').velocity({ translateX: '-0.15vw' }, { easing: 'easeInOut', duration: 500, delay: 150, loop: true });
  },

  stopHoverEffect() {
    this.$('i').velocity('stop');
    this.$('i').velocity({ translateX: 0 }, { duration: 0 });
  }
});
