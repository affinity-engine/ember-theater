import Ember from 'ember';
import Menu from 'ember-theater/components/ember-theater/menu-bar/menu/component';

const { get } = Ember;

const { computed: { reads } } = Ember;

export default Menu.extend({
  header: 'ember-theater.menu.reset.header',

  menuClassNames: reads('config.attrs.menuBar.reset.classNames'),

  populateChoices() {
    const choices = get(this, 'choices');

    choices.pushObject({
      text: 'ember-theater.menu.reset.confirm'
    });
  },

  resolve(choice) {
    switch (get(choice, 'key')) {
      case 1:
        get(this, 'saveStateManager').resetAutosave();
        get(this, 'sceneManager').resetGame();
        break;
    }

    this.attrs.closeMenu();
  }
});
