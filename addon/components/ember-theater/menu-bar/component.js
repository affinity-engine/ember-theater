import Ember from 'ember';
import layout from './template';
import configurable from 'ember-theater/macros/ember-theater/configurable';

const { Component } = Ember;
const { inject: { service } } = Ember;
const { computed: { reads } } = Ember;

const configurablePriority = ['config.menuBar', 'config.globals'];

export default Component.extend({
  layout,

  classNames: ['et-menu-bar-container'],
  classNameBindings: ['decorativeClassNames'],

  config: service('ember-theater/config'),

  components: reads('config.menuBar.components'),
  decorativeClassNames: configurable(configurablePriority, 'classNames.decorative'),

  actions: {
    toggleControlProperty(property) {
      this.toggleProperty(property);
    }
  }
});
