import Ember from 'ember';

const {
  Component,
  K,
  get,
  on,
  set
} = Ember;

export default Component.extend({
  classNames: ['et-menu-bar-control-icon'],
  tagName: 'button',

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
