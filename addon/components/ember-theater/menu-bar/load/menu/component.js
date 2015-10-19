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
      const choices = Ember.Object.create();
      
      saves.forEach((save) => {
        choices.set(save.id, { text: save.get('name'), object: save });
      });

      const line = {
        choices: choices,
        header: 'Load a game',
        resolve: resolve
      };

      this.set('line', line);
    }).then((choice) => {
      this.get('emberTheaterSaveStateManager').loadRecord(choice.object);
      this.get('emberTheaterSceneManager').toScene(choice.object.get('activeState.sceneId'), {
        autosave: false,
        loading: true
      });
      this.attrs.closeMenu();
    });
  })
});
