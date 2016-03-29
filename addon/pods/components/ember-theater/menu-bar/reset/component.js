import Ember from 'ember';
import layout from './template';
import MenuBarControl from 'ember-theater/pods/components/ember-theater/menu-bar/control/component';

const {
  get,
  set
} = Ember;

const { computed: { reads } } = Ember;

export default MenuBarControl.extend({
  layout,
  header: 'ember-theater.menu.reset.header',
  type: 'reset',

  menuClassNames: reads('config.attrs.menuBar.reset.classNames'),

  startHoverEffect() {
    set(this, 'hovering', true);
  },

  stopHoverEffect() {
    set(this, 'hovering', false);
  },

  populateChoices() {
    const choices = get(this, 'choices');

    choices.pushObject({
      text: 'ember-theater.menu.reset.confirm'
    });
  },

  resolve({ result }) {
    switch (get(result, 'key')) {
      case 1:
        this.publish('et:main:gameIsResetting');
        break;
    }
  }
});
