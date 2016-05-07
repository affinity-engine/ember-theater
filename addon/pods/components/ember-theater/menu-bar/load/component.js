import Ember from 'ember';
import layout from './template';
import MenuBarControl from 'ember-theater/pods/components/ember-theater/menu-bar/control/component';

const {
  get,
  isPresent
} = Ember;

const { computed: { reads } } = Ember;

export default MenuBarControl.extend({
  layout,
  header: 'ember-theater.menu.load.header',
  type: 'load',

  menuClassNames: reads('config.attrs.menuBar.load.classNames'),

  populateChoices: async function() {
    const saves = await get(this, 'saveStateManager.saves');
    const choices = get(this, 'choices');

    saves.sortBy('updated').reverseObjects().forEach((save) => {
      choices.pushObject({
        key: get(save, 'id'),
        object: save,
        text: get(save, 'fullName')
      });
    });
  },

  resolve({ result }) {
    const save = get(result, 'object');

    if (isPresent(save)) {
      const theaterId = get(this, 'theaterId');
      const sceneId = get(save, 'activeState.sceneId');
      const options = { autosave: false };

      this.publish(`et:${theaterId}:saveIsLoading`, save, sceneId, options);
    }
  }
});
