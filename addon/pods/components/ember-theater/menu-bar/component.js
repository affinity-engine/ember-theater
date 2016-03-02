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

  actions: {
    toggleControlProperty(property) {
      this.toggleProperty(property);
    },

    openMenu(menuName) {
      set(this, 'currentMenu', `${menuName}/menu`);
    },

    closeMenu() {
      set(this, 'currentMenu', false);
      set(this, 'isOpen', false);
    }
  }
});
