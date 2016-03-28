import Ember from 'ember';
import Menu from 'ember-theater/pods/components/ember-theater/menu-bar/menu/component';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const { get } = Ember;

const { computed: { reads } } = Ember;

export default Menu.extend(BusPublisherMixin, {
  header: 'ember-theater.menu.save.header',
  windowId: 'main',

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
          text: get(save, 'name'),
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

  resolve(menu) {
    const sceneRecord = get(this, 'sceneManager.sceneRecord');

    this.publish('et:main:recordingSaveData', '_sceneRecord', sceneRecord);

    switch (get(menu, 'key')) {
      case 0: return this.attrs.closeMenu();
      case 1: this.publish('et:main:saveIsCreating', get(menu, 'input')); break;
      case 'save': this.publish('et:main:saveIsUpdating', get(menu, 'object')); break;
      case 'delete': this.publish('et:main:saveIsDestroying', get(menu, 'object')); break;
    }

    this.attrs.closeMenu();
  }
});
