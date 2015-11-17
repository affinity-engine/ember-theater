import Ember from 'ember';
import layout from './template';
import Menu from 'ember-theater/components/ember-theater/menu-bar/menu/component';

const {
  computed,
  get,
  inject,
  isPresent,
  on,
  RSVP,
  set
} = Ember;

const { alias } = computed;

export default Menu.extend({
  layout: layout,
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
