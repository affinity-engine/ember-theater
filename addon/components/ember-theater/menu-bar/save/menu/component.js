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
  layout: layout,
  saves: alias('session.saves'),
  session: inject.service(),

  initializeLine: on('init', function() {
    new Promise((resolve) => {
      const saves = this.get('saves');
      const choices = Ember.Object.create({ 
        done74923: { class: 'et-choice-close', icon: 'arrow-right', text: 'ember-theater.save.done' },
        newSave74923: { icon: 'save', text: 'ember-theater.save.newGame', inputable: true }
      });

      saves.forEach((save) => {
        if (save.name !== 'autosave') { choices.set(save.name, { text: save.name, object: save }); }
      });

      const line = {
        choices: choices,
        header: 'Load a game',
        resolve: resolve
      };

      this.set('line', line);
    }).then((choice) => {
      const session = this.get('session');

      switch (choice.key) {
        case 'done74923': return this.attrs.closeMenu();
        case 'newSave74923': session.createSave(choice.input); break;
        default: session.persistSave(choice.object);
      }

      this.attrs.closeMenu();
    });
  })
});
