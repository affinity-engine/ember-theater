import Ember from 'ember';
import Menu from 'ember-theater/components/ember-theater/menu-bar/menu/component';

const { get } = Ember;

const { computed: { reads } } = Ember;

export default Menu.extend({
  header: 'ember-theater.save.header',
  menuClassNames: reads('config.menuBar.save.classNames'),

  populateChoices: async function() {
    const saves = await get(this, 'saveStateManager.saves');
    const choices = get(this, 'choices');

    // Position is important. New Game must be the second choice, as its position determines the way
    // this choice is resolved.
    choices.pushObject({
      icon: 'save',
      inputable: true,
      text: 'ember-theater.save.newGame'
    });

    saves.forEach((save) => {
      if (!get(save, 'isAutosave')) {
        choices.pushObject({
          key: get(save, 'id'),
          object: save,
          text: get(save, 'name')
        });
      }
    });
  },

  resolve(choice) {
    const saveStateManager = get(this, 'saveStateManager');

    switch (get(choice, 'key')) {
      case 0: return this.attrs.closeMenu();
      case 1: saveStateManager.createRecord(get(choice, 'input')); break;
      default: saveStateManager.updateRecord(get(choice, 'object'));
    }

    this.attrs.closeMenu();
  }
});
