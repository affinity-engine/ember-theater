import Ember from 'ember';
import layout from './template';

const {
  Component,
  K,
  computed,
  get,
  inject,
  on,
  RSVP
} = Ember;

const { alias } = computed;
const { Promise } = RSVP;

export default Component.extend({
  sceneManager: inject.service('ember-theater/scene-manager'),
  saveStateManager: inject.service('ember-theater/save-state-manager'),
  layout: layout,

  initializeLine: on('init', async function() {
    const saves = await this.get('saveStateManager.saves');

    new Promise((resolve) => {
      const choices = Ember.Object.create({ 
        done74923: { class: 'et-choice-close', icon: 'arrow-right', text: 'ember-theater.save.done' },
        newSave74923: { icon: 'save', text: 'ember-theater.save.newGame', inputable: true }
      });

      saves.forEach((save) => {
        const name = save.get('name');
        if (name !== 'autosave') { choices.set(save.id, { text: name, object: save }); }
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
        case 'done74923': return this.attrs.closeMenu();
        case 'newSave74923': saveStateManager.createRecord(choice.input); break;
        default: saveStateManager.updateRecord(choice.object);
      }

      this.attrs.closeMenu();
    });
  })
});
