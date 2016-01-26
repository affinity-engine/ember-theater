import Ember from 'ember';
import layout from './template';
import configurable from 'ember-theater/macros/ember-theater/configurable';
import multiService from 'ember-theater/macros/ember-theater/multi-service';

const { Component } = Ember;
const { inject: { service } } = Ember;
const { computed: { reads } } = Ember;

const configurablePriority = ['config.menuBar', 'config.globals'];

export default Component.extend({
  layout,

  classNames: ['et-menu-bar-container'],
  classNameBindings: ['decorativeClassNames'],

  configs: service('ember-theater/config'),

  config: multiService('configs'),

  components: reads('config.menuBar.components'),
  decorativeClassNames: configurable(configurablePriority, 'classNames.decorative'),

  actions: {
    toggleControlProperty(property) {
      this.toggleProperty(property);
    }
  }
});
