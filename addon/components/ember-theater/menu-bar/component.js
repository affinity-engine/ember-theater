import Ember from 'ember';
import layout from './template';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Component,
  K,
  get,
  on,
  set
} = Ember;

const { computed: { reads } } = Ember;

const configurablePriority = ['config.attrs.menuBar', 'config.attrs.globals'];

export default Component.extend({
  layout,

  classNameBindings: ['decorativeClassNames'],

  config: multitonService('ember-theater/config', 'theaterId'),

  components: reads('config.attrs.menuBar.components'),
  decorativeClassNames: configurable(configurablePriority, 'classNames.decorative'),

  initializeFilter: on('init', function() {
    const theaterId = get(this, 'theaterId');
    const filter = get(this, 'container').lookupFactory('direction:filter').create({
      theaterId
    });

    set(this, 'filter', filter);
  }),

  actions: {
    toggleControlProperty(property) {
      this.toggleProperty(property);
    },

    openMenu(menuName) {
      set(this, 'currentMenu', `${menuName}/menu`);

      const config = get(this, 'config.attrs.menuBar');

      const resolve = () => {
        get(this, 'filter').perform(K, get(config, 'innerEffect.effect'), {
          duration: get(config, 'innerEffect.duration'),
          iterations: 'infinite'
        });
      };

      get(this, 'filter').perform(resolve, get(config, 'transitionIn.effect'), {
        duration: get(config, 'transitionIn.duration')
      });
    },

    closeMenu() {
      delete this.currentMenu;

      const config = get(this, 'config.attrs.menuBar');

      set(this, 'isOpen', false);
      get(this, 'filter').perform(K, get(config, 'transitionOut.effect'), {
        duration: get(config, 'transitionOut.duration'),
        destroy: true
      });
    }
  }
});
