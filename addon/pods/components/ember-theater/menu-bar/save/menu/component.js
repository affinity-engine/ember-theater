import Ember from 'ember';
import Menu from 'ember-theater/pods/components/ember-theater/menu-bar/menu/component';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';

const { get } = Ember;

const { computed: { reads } } = Ember;

export default Menu.extend(BusPublisherMixin, {
  header: 'ember-theater.menu.save.header',

  menuClassNames: reads('config.attrs.menuBar.save.classNames'),

  populateChoices: async function() {
    const saves = await get(this, 'saveStateManager.saves');
    const choices = get(this, 'choices');

    // Position is important. New Game must be the second choice, as its position determines the way
    // this choice is resolved.
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
          classNames: ['et-choice-option-pair-major']
        });
        choices.pushObject({
          key: 'delete',
          object: save,
          icon: 'remove',
          classNames: ['et-choice-option-pair-minor']
        });
      }
    });
  },

  resolve(choice) {
    const sceneRecord = get(this, 'sceneManager.sceneRecord');

    this.publish('record', '_sceneRecord', sceneRecord);

    switch (get(choice, 'key')) {
      case 0: return this.attrs.closeMenu();
      case 1: this.publish('saveGame', get(choice, 'input')); break;
      case 'save': this.publish('updateSaveGame', get(choice, 'object')); break;
      case 'delete': this.publish('deleteSaveGame', get(choice, 'object')); break;
    }

    this.attrs.closeMenu();
  }
});
