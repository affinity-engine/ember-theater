import Ember from 'ember';
import layout from './template';
import MenuBarControl from 'ember-theater/pods/components/ember-theater/menu-bar/control/component';

const { set } = Ember;

export default MenuBarControl.extend({
  layout,
  type: 'reset',
  componentPath: 'ember-theater/menu-bar/reset/menu',

  startHoverEffect() {
    set(this, 'hovering', true);
  },

  stopHoverEffect() {
    set(this, 'hovering', false);
  }
});
