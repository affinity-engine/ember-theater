import Ember from 'ember';
import layout from './template';
import MenuBarControl from 'ember-theater/pods/components/ember-theater/menu-bar/control/component';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const { get } = Ember;

const { computed: { reads } } = Ember;

export default MenuBarControl.extend({
  layout,
  header: 'ember-theater.menu.save.header',
  type: 'save',

  menuClassNames: reads('config.attrs.menuBar.save.classNames'),

  sceneManager: multitonService('ember-theater/director/scene-manager', 'theaterId', 'windowId'),

  populateChoices: async function() {
    const saves = await get(this, 'saveStateManager.saves');
    const choices = get(this, 'choices');

    // Position is important. New Game must be the second menu, as its position determines the way
    // this menu is resolved.
    choices.pushObject({
      icon: 'save',
      inputable: true,
      text: 'ember-theater.menu.save.new'
    });

    saves.forEach((save) => {
      if (!get(save, 'isAutosave')) {
        choices.pushObject({
          key: 'save',
          object: save,
          text: get(save, 'fullName'),
          classNames: ['et-menu-option-pair-major']
        });
        choices.pushObject({
          key: 'delete',
          object: save,
          icon: 'remove',
          classNames: ['et-menu-option-pair-minor']
        });
      }
    });
  },

  resolve({ result }) {
    const sceneRecord = get(this, 'sceneManager.sceneRecord');
    const theaterId = get(this, 'theaterId');

    this.publish(`et:${theaterId}:settingStateValue`, '_sceneRecord', sceneRecord);

    switch (get(result, 'key')) {
      case 0: return;
      case 1: this.publish(`et:${theaterId}:saveIsCreating`, get(result, 'input')); break;
      case 'save': this.publish(`et:${theaterId}:saveIsUpdating`, get(result, 'object')); break;
      case 'delete': this.publish(`et:${theaterId}:saveIsDestroying`, get(result, 'object')); break;
    }
  }
});
