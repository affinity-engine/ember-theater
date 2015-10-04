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
      const choices = Ember.Object.create();
      
      this.get('saves').forEach((save) => {
        choices.set(save.name, { text: save.name, object: save });
      });

      const line = {
        choices: choices,
        header: 'Load a game',
        resolve: resolve
      };

      this.set('line', line);
    }).then((choice) => {
      this.get('session').loadGame(choice.object);
      this.set('emberTheaterSceneManager.sceneId', choice.object.savePoints[0].sceneId);
      this.attrs.closeMenu();
    });
  })
});
