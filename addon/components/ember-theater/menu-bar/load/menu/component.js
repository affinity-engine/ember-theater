import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  get,
  inject,
  isPresent,
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
        done74923: { class: 'et-choice-close', icon: 'arrow-right', text: 'ember-theater.load.done' }
      });

      saves.forEach((save) => {
        choices.set(save.id, { text: save.get('name'), object: save });
      });

      const directable = Ember.Object.create({
        choices: choices,
        header: 'ember-theater.load.header',
        resolve: resolve
      });

      this.set('directable', directable);
    }).then((choice) => {
      if (isPresent(get(choice, 'object'))) {
        this.get('emberTheaterSaveStateManager').loadRecord(choice.object);
        this.get('emberTheaterSceneManager').toScene(choice.object.get('activeState.sceneId'), {
          autosave: false,
          loading: true
        });
      }
      this.attrs.closeMenu();
    });
  })
});
