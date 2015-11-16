import Ember from 'ember';

import {
  keyUp,
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
    const keys = get(this, `config.${get(this, 'keys')}`);

    keys.forEach((key) => this.on(keyUp(key), () => this.toggleOpen()));
  }),

  initializeFilter: on('init', function() {
    const filter = get(this, 'container').lookupFactory('direction:filter').create();

    set(this, 'filter', filter);
  }),

  toggleOpen: on('click', 'touchEnd', function() {
    this.toggleProperty('isOpen');

    get(this, 'filter').perform(() => {
      get(this, 'filter').perform(K, ['blur(10px)', 'blur(7px)', 'blur(10px)'], { duration: 5000, iterations: 'infinite' });
    }, ['blur(0px)', 'blur(10px)'], { duration: 1000 });
  }),

  startHovering: on('focusIn', 'mouseEnter', function() {
    this.startHoverEffect();
  }),

  stopHovering: on('focusOut', 'mouseLeave', function() {
    this.stopHoverEffect();
  }),

  actions: {
    closeMenu() {
      this.set('isOpen', false);
      get(this, 'filter').perform(K, ['blur(10px)', 'blur(0px)'], { duration: 500, destroy: true });
    }
  }
});
