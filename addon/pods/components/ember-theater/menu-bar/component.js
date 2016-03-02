import Ember from 'ember';
import layout from './template';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import multitonService from 'ember-theater/macros/ember-theater/multiton-service';

const {
  Component,
  K,
  get,
  getOwner,
  on,
  set
} = Ember;

const {
  computed: {
    alias,
    reads
  }
} = Ember;

const configurablePriority = ['config.attrs.menuBar', 'config.attrs.globals'];

export default Component.extend({
  layout,

  classNameBindings: ['decorativeClassNames'],

  config: multitonService('ember-theater/config', 'theaterId'),

  plugins: reads('config.attrs.menuBar.plugins'),
  decorativeClassNames: configurable(configurablePriority, 'classNames.decorative'),
  keyboardActivated: alias('isFocused'),

  initializeFilter: on('init', function() {
    const theaterId = get(this, 'theaterId');
    const filter = getOwner(this).lookup('direction:filter').create({
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
        const filter = get(this, 'filter');

        set(filter, 'attrs.effect', get(config, 'innerEffect.effect'));
        set(filter, 'attrs.duration', get(config, 'innerEffect.duration'));
        set(filter, 'attrs.iterations', 'infinite');
        filter._perform({}, K);
      };

      const filter = get(this, 'filter');

      set(filter, 'attrs.layer', '');
      set(filter, 'attrs.effect', get(config, 'transitionIn.effect'));
      set(filter, 'attrs.duration', get(config, 'transitionIn.duration'));
      filter._perform({}, resolve);
    },

    closeMenu() {
      set(this, 'currentMenu', false);

      const config = get(this, 'config.attrs.menuBar');

      set(this, 'isOpen', false);

      const filter = get(this, 'filter');

      set(filter, 'attrs.effect', get(config, 'transitionOut.effect'));
      set(filter, 'attrs.duration', get(config, 'transitionOut.duration'));
      set(filter, 'attrs.destroy', true);
      filter._perform({}, K);
    }
  }
});
