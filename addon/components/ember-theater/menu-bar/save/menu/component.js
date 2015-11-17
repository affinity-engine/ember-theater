import Ember from 'ember';
import layout from './template';
import Menu from 'ember-theater/components/ember-theater/menu-bar/menu/component';

const {
  K,
  computed,
  get,
  inject,
  on,
  RSVP
} = Ember;

const { alias } = computed;
const { Promise } = RSVP;

export default Menu.extend({
  sceneManager: inject.service('ember-theater/scene-manager'),
  saveStateManager: inject.service('ember-theater/save-state-manager'),
  layout: layout,

  initializeLine: on('init', async function() {
    const saves = await this.get('saveStateManager.saves');

    new Promise((resolve) => {
      const choices = [{ 
        class: 'et-choice-close', icon: 'arrow-right', text: 'ember-theater.save.done'
      }, {
        icon: 'save', text: 'ember-theater.save.newGame', inputable: true
      }];

      saves.forEach((save) => {
        const name = save.get('name');

        if (name !== 'autosave') {
          choices.push({ key: save.id, text: name, object: save });
        }
      });

      const directable = Ember.Object.create({
        choices: choices,
        header: 'ember-theater.save.header',
        resolve: resolve
      });

      this.set('directable', directable);
    }).then((choice) => {
      const saveStateManager = this.get('saveStateManager');

      switch (choice.key) {
        case 0: return this.attrs.closeMenu();
        case 1: saveStateManager.createRecord(choice.input); break;
        default: saveStateManager.updateRecord(choice.object);
      }

      this.attrs.closeMenu();
    });
  })
});
