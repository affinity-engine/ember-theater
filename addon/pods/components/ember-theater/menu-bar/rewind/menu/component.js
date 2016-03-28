import Ember from 'ember';
import Menu from 'ember-theater/pods/components/ember-theater/menu-bar/menu/component';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';

const {
  get,
  isPresent
} = Ember;

const { computed: { reads } } = Ember;

export default Menu.extend(BusPublisherMixin, {
  header: 'ember-theater.menu.rewind.header',

  menuClassNames: reads('config.attrs.menuBar.rewind.classNames'),

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

  resolve(menu) {
    const point = get(menu, 'object');

    if (isPresent(point)) {
      this.publish('et:main:gameIsRewinding', point);
    }

    this.attrs.closeMenu();
  }
});
