import Ember from 'ember';
import layout from './template';

const {
  Component,
  get,
  inject,
  on
} = Ember;

export default Component.extend({
  emberTheaterSceneManager: inject.service(),
  emberTheaterSaveStateManager: inject.service(),
  layout: layout,

  initializeLine: on('init', async function() {
    const points = await this.get('emberTheaterSaveStateManager.statePoints');

    new Promise((resolve) => {
      const choices = Ember.Object.create({ 
        done74923: { class: 'et-choice-close', icon: 'arrow-right', text: 'ember-theater.rewind.done' }
      });

      points.forEach((point, index) => {
        const name = get(point, 'sceneId');
        const choiceId = (points.length - index).toString(); // sort most recent statePoints first

        choices.set(choiceId, { text: name, object: Ember.A(points.slice(0, index + 1)) });
      });

      const line = {
        choices: choices,
        header: 'ember-theater.rewind.header',
        resolve: resolve
      };

      this.set('line', line);
    }).then((choice) => {
      this.get('emberTheaterSaveStateManager').loadStatePoint(choice.object);
      this.get('emberTheaterSceneManager').toScene(choice.object.get('lastObject.sceneId'), {
        autosave: false
      });
      this.attrs.closeMenu();
    });
  })
});
