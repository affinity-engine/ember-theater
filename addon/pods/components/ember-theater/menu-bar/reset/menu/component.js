import Ember from 'ember';
import Menu from 'ember-theater/pods/components/ember-theater/menu-bar/menu/component';
import BusPublisherMixin from 'ember-theater/mixins/ember-theater/bus-publisher';

const { get } = Ember;

const { computed: { reads } } = Ember;

export default Menu.extend(BusPublisherMixin, {
  header: 'ember-theater.menu.reset.header',

  menuClassNames: reads('config.attrs.menuBar.reset.classNames'),

  populateChoices() {
    const choices = get(this, 'choices');

    choices.pushObject({
      text: 'ember-theater.menu.reset.confirm'
    });
  },

  resolve(menu) {
    switch (get(menu, 'key')) {
      case 1:
        this.publish('et:main:gameIsResetting');
        break;
    }

    this.attrs.closeMenu();
  }
});
