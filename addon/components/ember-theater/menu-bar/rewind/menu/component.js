import Ember from 'ember';
import layout from './template';
import Menu from 'ember-theater/components/ember-theater/menu-bar/menu/component';

const {
  get,
  inject,
  isPresent,
  on
} = Ember;

export default Menu.extend({
  sceneManager: inject.service('ember-theater/scene-manager'),
  saveStateManager: inject.service('ember-theater/save-state-manager'),
  layout: layout,

  initializeLine: on('init', async function() {
    const points = await this.get('saveStateManager.statePoints');

    new Promise((resolve) => {
      const choices = [{ 
        class: 'et-choice-close', icon: 'arrow-right', text: 'ember-theater.rewind.done'
      }];

      points.reverse().forEach((point, index) => {
        const name = get(point, 'sceneName');

        choices.push({ text: name, object: Ember.A(points.slice(0, index + 1)) });
      });

      const directable = Ember.Object.create({
        choices: choices,
        header: 'ember-theater.rewind.header',
        resolve: resolve
      });

      this.set('directable', directable);
    }).then((choice) => {
      if (isPresent(get(choice, 'object'))) {
        this.get('saveStateManager').loadStatePoint(choice.object);
        this.get('sceneManager').toScene(choice.object.get('lastObject.sceneId'), {
          autosave: false
        });
      }
      this.attrs.closeMenu();
    });
  })
});
