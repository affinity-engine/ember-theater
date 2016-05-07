import Ember from 'ember';
import layout from './template';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import multiton from 'ember-multiton-service';

const {
  Component,
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

  config: multiton('ember-theater/config', 'theaterId'),
  producer: multiton('ember-theater/producer', 'theaterId'),

  plugins: reads('config.attrs.menuBar.plugins'),
  customClassNames: configurable(configurablePriority, 'classNames'),
  keyboardActivated: alias('producer.isFocused'),

  actions: {
    toggleControlProperty(property) {
      this.toggleProperty(property);
    },

    openMenu(componentPath) {
      set(this, 'currentMenu', componentPath);
    }
  }
});
