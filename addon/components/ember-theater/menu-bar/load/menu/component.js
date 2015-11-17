import Ember from 'ember';
import layout from './template';
import Menu from 'ember-theater/components/ember-theater/menu-bar/menu/component';

const {
  computed,
  get,
  inject,
  isPresent,
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
      const choices = Ember.Object.create({ 
        done74923: { class: 'et-choice-close', icon: 'arrow-right', text: 'ember-theater.load.done' }
      });

      saves.forEach((save) => {
        choices.set(save.id, { text: save.get('name'), object: save });
      });

      const directable = Ember.Object.create({
        options: { keyboardPriority: 10000 },
        choices: choices,
        header: 'ember-theater.load.header',
        resolve: resolve
      });

      this.set('directable', directable);
    }).then((choice) => {
      if (isPresent(get(choice, 'object'))) {
        this.get('saveStateManager').loadRecord(choice.object);
        this.get('sceneManager').toScene(choice.object.get('activeState.sceneId'), {
          autosave: false,
          loading: true
        });
      }
      this.attrs.closeMenu();
    });
  })
});
