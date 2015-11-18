import Ember from 'ember';
import Menu from 'ember-theater/components/ember-theater/menu-bar/menu/component';

const {
  get,
  isPresent
} = Ember;

export default Menu.extend({
  header: 'ember-theater.load.header',

  populateChoices: async function() {
    const saves = await get(this, 'saveStateManager.saves');
    const choices = get(this, 'choices');

    saves.forEach((save) => {
      choices.pushObject({
        key: get(save, 'id'),
        object: save,
        text: get(save, 'name')
      });
    });
  },

  resolve(choice) {
    const save = get(choice, 'object');

    if (isPresent(save)) {
      get(this, 'saveStateManager').loadRecord(save);
      get(this, 'sceneManager').toScene(get(save, 'activeState.sceneId'), {
        autosave: false,
        loading: true
      });
    }

    this.attrs.closeMenu();
  }
});
