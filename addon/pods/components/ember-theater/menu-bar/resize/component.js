import Ember from 'ember';
import layout from './template';
import MenuBarControl from 'ember-theater/pods/components/ember-theater/menu-bar/control/component';

const { on } = Ember;

export default MenuBarControl.extend({
  layout,
  type: 'resize',
  componentPath: 'ember-theater/menu-bar/resize/menu',

  toggleOpen: on('click', 'touchEnd', function() {
    const elem = this.$().parents('.ember-theater').get(0);

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  })
});
