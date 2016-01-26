import Ember from 'ember';
import Menu from 'ember-theater/components/ember-theater/menu-bar/menu/component';

const {
  get,
  isPresent
} = Ember;

const { computed: { reads } } = Ember;

export default Menu.extend({
  header: 'ember-theater.menu.load.header',
  
  menuClassNames: reads('config.menuBar.load.classNames'),

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
      const sceneManager = get(this, 'sceneManager');
      const sceneId = get(save, 'activeState.sceneId');
      const options = { autosave: false, isLoading: true };

      sceneManager.loadScene(save, sceneId, options);
    }

    this.attrs.closeMenu();
  }
});
