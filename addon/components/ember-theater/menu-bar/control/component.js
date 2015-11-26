import Ember from 'ember';

import {
  keyDown,
  EKOnInsertMixin
} from 'ember-keyboard';

const {
  Component,
  K,
  get,
  on,
  set
} = Ember;

const { inject: { service } } = Ember;

export default Component.extend(EKOnInsertMixin, {
  classNames: ['et-menu-bar-control-icon'],
  tagName: 'button',

  config: service('ember-theater/config'),

  setupFocusKeystroke: on('init', function() {
    const keysPath = get(this, 'keys');
    const keys = get(this, 'config').getProperty('menuBar', keysPath);

    keys.forEach((key) => this.on(keyDown(key), (event) => {
      this.toggleOpen();
      event.preventDefault();
    }));
  }),

  initializeFilter: on('init', function() {
    const filter = get(this, 'container').lookupFactory('direction:filter').create();

    set(this, 'filter', filter);
  }),

  toggleOpen: on('click', 'touchEnd', function() {
    const config = get(this, 'config.menu');

    this.toggleProperty('isOpen');

    const resolve = () => {
      get(this, 'filter').perform(K, get(config, 'innerEffect'), {
        duration: get(config, 'innerEffectDuration'),
        iterations: 'infinite'
      });
    };

    get(this, 'filter').perform(resolve, get(config, 'transitionIn'), {
      duration: get(config, 'transitionInDuration')
    });
  }),

  startHovering: on('focusIn', 'mouseEnter', function() {
    this.startHoverEffect();
  }),

  stopHovering: on('focusOut', 'mouseLeave', function() {
    this.stopHoverEffect();
  }),

  actions: {
    closeMenu() {
      const config = get(this, 'config.menu');

      set(this, 'isOpen', false);
      get(this, 'filter').perform(K, get(config, 'transitionOut'), {
        duration: get(config, 'transitionOutDuration'),
        destroy: true
      });
    }
  }
});
