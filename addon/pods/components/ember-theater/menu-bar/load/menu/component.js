import Ember from 'ember';
import Menu from 'ember-theater/pods/components/ember-theater/menu-bar/menu/component';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';

const {
  get,
  isPresent
} = Ember;

const { computed: { reads } } = Ember;

export default Menu.extend(BusPublisherMixin, {
  header: 'ember-theater.menu.load.header',

  menuClassNames: reads('config.attrs.menuBar.load.classNames'),

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

  resolve(menu) {
    const save = get(menu, 'object');

    if (isPresent(save)) {
      const sceneId = get(save, 'activeState.sceneId');
      const options = { autosave: false };

      this.publish('et:main:saveIsLoading', save, sceneId, options);
    }

    this.attrs.closeMenu();
  }
});
