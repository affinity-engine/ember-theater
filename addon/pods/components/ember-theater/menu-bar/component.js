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
  set,
  setProperties
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
        const attrs = get(filter, 'attrs');

        setProperties(attrs, {
          effect: get(config, 'innerEffect.effect'),
          duration: get(config, 'innerEffect.duration'),
          iterations: 'infinite'
        });

        filter._perform({}, K);
      };

      const filter = get(this, 'filter');
      const attrs = get(filter, 'attrs');

      setProperties(attrs, {
        effect: get(config, 'transitionIn.effect'),
        duration: get(config, 'transitionIn.duration'),
        layer: ''
      });

      filter._perform({}, resolve);
    },

    closeMenu() {
      set(this, 'currentMenu', false);

      const config = get(this, 'config.attrs.menuBar');

      set(this, 'isOpen', false);

      const filter = get(this, 'filter');
      const attrs = get(filter, 'attrs');

      setProperties(attrs, {
        effect: get(config, 'transitionOut.effect'),
        duration: get(config, 'transitionOut.duration'),
        destroy: true
      });

      filter._perform({}, K);
    }
  }
});
