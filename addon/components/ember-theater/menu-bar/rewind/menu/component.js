import Ember from 'ember';
import Menu from 'ember-theater/components/ember-theater/menu-bar/menu/component';

const {
  get,
  isPresent
} = Ember;

export default Menu.extend({
  header: 'ember-theater.rewind.header',

  populateChoices: async function() {
    const points = await get(this, 'saveStateManager.statePoints');
    const choices = get(this, 'choices');

    points.reverse().forEach((point, index) => {
      choices.pushObject({
        text: get(point, 'sceneName'),
        object: Ember.A(points.slice(0, index + 1))
      });
    });
  },

  resolve(choice) {
    const point = get(choice, 'object');

    if (isPresent(point)) {
      get(this, 'saveStateManager').loadStatePoint(point);
      get(this, 'sceneManager').toScene(get(point, 'lastObject.sceneId'), {
        autosave: false
      });
    }

    this.attrs.closeMenu();
  }
});
