import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  inject,
  on,
  RSVP
} = Ember;

const { alias } = computed;
const { Promise } = RSVP;

export default Component.extend({
  emberTheaterSceneManager: inject.service(),
  emberTheaterSaveStateManager: inject.service(),
  layout: layout,

  initializeLine: on('init', async function() {
    const saves = await this.get('emberTheaterSaveStateManager.saves');

    new Promise((resolve) => {
      const choices = Ember.Object.create({ 
        done74923: { class: 'et-choice-close', icon: 'arrow-right', text: 'ember-theater.save.done' },
        newSave74923: { icon: 'save', text: 'ember-theater.save.newGame', inputable: true }
      });

      saves.forEach((save) => {
        const name = save.get('name');
        if (name !== 'autosave') { choices.set(save.id, { text: name, object: save }); }
      });

      const line = {
        choices: choices,
        header: 'Load a game',
        resolve: resolve
      };

      this.set('line', line);
    }).then((choice) => {
      const saveStateManager = this.get('emberTheaterSaveStateManager');

      switch (choice.key) {
        case 'done74923': return this.attrs.closeMenu();
        case 'newSave74923': saveStateManager.createRecord(choice.input); break;
        default: saveStateManager.updateRecord(choice.object);
      }

      this.attrs.closeMenu();
    });
  })
});
