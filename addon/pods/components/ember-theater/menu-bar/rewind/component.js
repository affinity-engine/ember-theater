import Ember from 'ember';
import layout from './template';
import MenuBarControl from 'ember-theater/pods/components/ember-theater/menu-bar/control/component';

const {
  get,
  isPresent
} = Ember;

const { computed: { reads } } = Ember;

export default MenuBarControl.extend({
  layout,
  header: 'ember-theater.menu.rewind.header',
  type: 'rewind',

  menuClassNames: reads('config.attrs.menuBar.rewind.classNames'),

  startHoverEffect() {
    this.$('i').velocity({ translateX: '-0.15vw' }, { easing: 'easeInOut', duration: 500, delay: 150, loop: true });
  },

  stopHoverEffect() {
    this.$('i').velocity('stop');
    this.$('i').velocity({ translateX: 0 }, { duration: 0 });
  },

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

  resolve({ result }) {
    const point = get(result, 'object');

    if (isPresent(point)) {
      this.publish('et:main:gameIsRewinding', point);
    }
  }
});
